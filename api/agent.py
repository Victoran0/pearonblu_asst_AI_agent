from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import AIMessage
from langchain.schema import Document
from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from typing_extensions import TypedDict
from typing import List, Annotated
from dotenv import load_dotenv
from uuid import uuid4
from .generators import rewrite_email_generator, draft_analysis_generator, draft_writer_generator, email_category_generator, search_keyword_generator, rewrite_router_generator, research_router_generator
from .agentic_rag import query_p_and_s_chroma_db


load_dotenv()

# Tool Setup
web_search_tool = TavilySearchResults(k=1)


# State
class GraphState(TypedDict):
    """
    Represents the state of our graph.

    Attributes:
        messages: Thread of the ongoing conversation between the Customer and Pearon Blu Assistant
        email_category: email category
        draft_email: LLM generation
        research_info: list of documents
        info_needed: whether to add search info
        num_steps: number of steps
        draft_email_feedback: feedback on the draft email if it does not fully answer the customer query
    """
    email_thread: Annotated[list, add_messages]
    email_category: str
    draft_email: str
    research_info: List[str]
    info_needed: bool
    num_steps: int
    draft_email_feedback: dict


# Nodes

def categorize_email(state):
    """take the initial email and categorize it"""
    # print("---CATEGORIZING INITIAL EMAIL---")
    email_thread = state['email_thread']
    num_steps = int(state['num_steps'])
    num_steps += 1

    email_category = email_category_generator(email_thread)
    print(f"-----------The email's category-----------{email_category}")

    return {"email_category": email_category, "num_steps": num_steps}


def research_info_search(state):

    # print("---RESEARCH INFO SEARCHING---")
    email_thread = state["email_thread"]
    email_category = state["email_category"]
    num_steps = state['num_steps']
    num_steps += 1

    # Web search
    keywords = search_keyword_generator(email_thread, email_category)
    keywords = keywords['keywords']
    # print(keywords)
    full_searches = []
    for keyword in keywords[:1]:
        # print(keyword)
        temp_docs = web_search_tool.invoke({"query": keyword})
        web_results = "\n".join([d["content"] for d in temp_docs])
        web_results = Document(page_content=web_results)
        if full_searches is not None:
            full_searches.append(web_results)
        else:
            full_searches = [web_results]
    # print(full_searches)
    # print(type(full_searches))

    return {"research_info": full_searches, "num_steps": num_steps}


def draft_email_writer(state):
    # print("---DRAFT EMAIL WRITER---")
    # Get the state
    email_thread = state["email_thread"]
    email_category = state["email_category"]
    research_info = state["research_info"]
    num_steps = state['num_steps']
    num_steps += 1

    if email_category in ['price_enquiry', 'product_enquiry']:
        print("Price or product enquiry detected")
        document = query_p_and_s_chroma_db(email_thread[-1].content)
        draft_email = draft_writer_generator(
            email_thread, email_category, research_info, document)
    else:
        # Generate draft email
        draft_email = draft_writer_generator(
            email_thread, email_category, research_info)
    # print(draft_email)
    # print(type(draft_email))

    email_draft = draft_email['email_draft']

    return {"draft_email": email_draft, "num_steps": num_steps}


def analyze_draft_email(state):
    # print("---DRAFT EMAIL ANALYZER---")
    # Get the state
    email_thread = state["email_thread"]
    email_category = state["email_category"]
    draft_email = state["draft_email"]
    research_info = state["research_info"]
    num_steps = state['num_steps']
    num_steps += 1

    # Generate draft email
    draft_email_feedback = draft_analysis_generator(
        email_thread, email_category, research_info, draft_email)
    # print(draft_email)
    # print(type(draft_email))

    return {"draft_email_feedback": draft_email_feedback, "num_steps": num_steps}


def rewrite_email(state):
    # print("---ReWRITE EMAIL ---")
    # Get the state
    email_thread = state["email_thread"]
    email_category = state["email_category"]
    draft_email = state["draft_email"]
    research_info = state["research_info"]
    draft_email_feedback = state["draft_email_feedback"]
    num_steps = state['num_steps']
    num_steps += 1

    # Generate draft email
    reply = rewrite_email_generator(
        email_thread, email_category, research_info, draft_email, draft_email_feedback)

    return {"email_thread": [AIMessage(content=reply['reply_email'])], "num_steps": num_steps}


def no_rewrite(state):
    # print("---NO REWRITE EMAIL ---")
    # Get the state
    draft_email = state["draft_email"]
    num_steps = state['num_steps']
    num_steps += 1

    return {"email_thread": [AIMessage(content=draft_email)], "num_steps": num_steps}


# def state_printer(state):
    # """print the state"""
    # print("---STATE PRINTER---")
    # print(f"Initial Email: {state['initial_email']} \n")
    # print(f"Email Category: {state['email_category']} \n")
    # print(f"Draft Email: {state['draft_email']} \n")
    # print(f"Final Email: {state['final_email']} \n")
    # print(f"Research Info: {state['research_info']} \n")

    # print(f"Num Steps: {state['num_steps']} \n")
    # return

# CONDITIONAL EDGES


def route_to_research(state):
    """
    Route email to web search or not.
    Args:
        state (dict): The current graph state
    Returns:
        str: Next node to call
    """

    # print("---ROUTE TO RESEARCH---")
    email_category = state["email_category"]
    print("--------------The email category----: ", email_category)
    # Reply directly to trigger the agent memory
    # if email_category in ['chat_history', 'chat_related']:
    #     print("chat history detected")
    #     return "direct_reply"

    email_thread = state["email_thread"]

    router = research_router_generator(email_thread, email_category)

    # print(router)
    # print(type(router))
    # print(router['router_decision'])

    if router['router_decision'] == 'research_info':
        # print("---ROUTE EMAIL TO RESEARCH INFO---")
        return "research_info"
    elif router['router_decision'] == 'draft_email':
        # print("---ROUTE EMAIL TO DRAFT EMAIL---")
        return "draft_email"


def route_to_rewrite(state):

    # print("---ROUTE TO REWRITE---")
    email_thread = state["email_thread"]
    email_category = state["email_category"]
    draft_email = state["draft_email"]

    # draft_email = "Yo we can't help you, best regards Sarah"

    router = rewrite_router_generator(
        email_thread, email_category, draft_email)

    # print(router)
    # print(router['router_decision'])

    if router['router_decision'] == 'rewrite':
        # print("---ROUTE TO ANALYSIS - REWRITE---")
        return "rewrite"
    elif router['router_decision'] == 'no_rewrite':
        # print("---ROUTE EMAIL TO FINAL EMAIL---")
        return "no_rewrite"


# BUILDING THE GRAPH
workflow = StateGraph(GraphState)

#  Adding the Nodes

# Define the nodes
workflow.add_node("categorize_email", categorize_email)  # categorize email
workflow.add_node("research_info_search", research_info_search)  # web search
# workflow.add_node("state_printer", state_printer)
workflow.add_node("draft_email_writer", draft_email_writer)
workflow.add_node("analyze_draft_email", analyze_draft_email)
workflow.add_node("rewrite_email", rewrite_email)
workflow.add_node("no_rewrite", no_rewrite)
# workflow.add_node("direct_response", direct_response)

# Add the edges
workflow.set_entry_point("categorize_email")

workflow.add_conditional_edges(
    "categorize_email",
    route_to_research,
    {
        "research_info": "research_info_search",
        "draft_email": "draft_email_writer"
    },
)
workflow.add_edge("research_info_search", "draft_email_writer")

workflow.add_conditional_edges(
    "draft_email_writer",
    route_to_rewrite,
    {
        "rewrite": "analyze_draft_email",
        "no_rewrite": "no_rewrite",
    },
)

workflow.add_edge("analyze_draft_email", "rewrite_email")
workflow.add_edge("no_rewrite", END)
workflow.add_edge("rewrite_email", END)
# workflow.add_edge("state_printer", END)

# Memory saver for checkpointing and saving previous messages, ensuring consistent accross the chat
memory = MemorySaver()

# Compile
graph = workflow.compile(checkpointer=memory)


def get_agent_response(email: str, customer_name: str):
    """The default chat will have no saved state as it will be initialized with random thread ids"""
    thread_id = str(
        uuid4()) if customer_name == "General" else customer_name
    # print("The thread id: ", thread_id)

    config = {"configurable": {"thread_id": thread_id}}

    events = graph.stream(
        {"email_thread": [("user", email)],
         "research_info": None, "num_steps": 0},
        config,
        stream_mode="values",
    )

    for event in events:
        # print(f"---------{event}")
        if "email_thread" in event:
            response = event["email_thread"][-1]

    snapshot = graph.get_state(config)
    # print(f"The snapshot:----------------------{snapshot}")
    # print(f"The response:-----------------------{response}")
    try:
        return response.content
    except Exception as e:
        # Print the error type and message
        print(f"An error occurred: {type(e).__name__}")
        print(f"Error message: {e}")
        raise e


# {"body": "how much does the executive room cost"}
