from langchain_community.tools.tavily_search import TavilySearchResults
from langchain.schema import Document
from langgraph.graph import END, StateGraph
from langgraph.checkpoint.memory import MemorySaver
from typing_extensions import TypedDict
from typing import List
from dotenv import load_dotenv
from .generators import rewrite_email_generator, draft_analysis_generator, draft_writer_generator, email_category_generator, search_keyword_generator, rewrite_router_generator, research_router_generator


load_dotenv()

# Tool Setup
web_search_tool = TavilySearchResults(k=1)


# State
class GraphState(TypedDict):
    """
    Represents the state of our graph.

    Attributes:
        initial_email: email
        email_category: email category
        draft_email: LLM generation
        final_email: LLM generation
        research_info: list of documents
        info_needed: whether to add search info
        num_steps: number of steps
    """
    initial_email: str
    email_category: str
    draft_email: str
    final_email: str
    research_info: List[str]
    info_needed: bool
    num_steps: int
    draft_email_feedback: dict


# Nodes

def categorize_email(state):
    """take the initial email and categorize it"""
    # print("---CATEGORIZING INITIAL EMAIL---")
    initial_email = state['initial_email']
    num_steps = int(state['num_steps'])
    num_steps += 1

    email_category = email_category_generator(initial_email)
    # print(email_category)

    return {"email_category": email_category, "num_steps": num_steps}


def research_info_search(state):

    # print("---RESEARCH INFO SEARCHING---")
    initial_email = state["initial_email"]
    email_category = state["email_category"]
    num_steps = state['num_steps']
    num_steps += 1

    # Web search
    keywords = search_keyword_generator(initial_email, email_category)
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
    initial_email = state["initial_email"]
    email_category = state["email_category"]
    research_info = state["research_info"]
    num_steps = state['num_steps']
    num_steps += 1

    # Generate draft email
    draft_email = draft_writer_generator(
        initial_email, email_category, research_info)
    # print(draft_email)
    # print(type(draft_email))

    email_draft = draft_email['email_draft']

    return {"draft_email": email_draft, "num_steps": num_steps}


def analyze_draft_email(state):
    # print("---DRAFT EMAIL ANALYZER---")
    # Get the state
    initial_email = state["initial_email"]
    email_category = state["email_category"]
    draft_email = state["draft_email"]
    research_info = state["research_info"]
    num_steps = state['num_steps']
    num_steps += 1

    # Generate draft email
    draft_email_feedback = draft_analysis_generator({"initial_email": initial_email,
                                                     "email_category": email_category,
                                                     "research_info": research_info,
                                                     "draft_email": draft_email}
                                                    )
    # print(draft_email)
    # print(type(draft_email))

    return {"draft_email_feedback": draft_email_feedback, "num_steps": num_steps}


def rewrite_email(state):
    # print("---ReWRITE EMAIL ---")
    # Get the state
    initial_email = state["initial_email"]
    email_category = state["email_category"]
    draft_email = state["draft_email"]
    research_info = state["research_info"]
    draft_email_feedback = state["draft_email_feedback"]
    num_steps = state['num_steps']
    num_steps += 1

    # Generate draft email
    final_email = rewrite_email_generator({"initial_email": initial_email,
                                           "email_category": email_category,
                                           "research_info": research_info,
                                           "draft_email": draft_email,
                                           "email_analysis": draft_email_feedback}
                                          )

    return {"final_email": final_email['final_email'], "num_steps": num_steps}


def no_rewrite(state):
    # print("---NO REWRITE EMAIL ---")
    # Get the state
    draft_email = state["draft_email"]
    num_steps = state['num_steps']
    num_steps += 1

    return {"final_email": draft_email, "num_steps": num_steps}


def state_printer(state):
    """print the state"""
    # print("---STATE PRINTER---")
    # print(f"Initial Email: {state['initial_email']} \n")
    # print(f"Email Category: {state['email_category']} \n")
    # print(f"Draft Email: {state['draft_email']} \n")
    # print(f"Final Email: {state['final_email']} \n")
    # print(f"Research Info: {state['research_info']} \n")

    # print(f"Num Steps: {state['num_steps']} \n")
    return

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
    initial_email = state["initial_email"]
    email_category = state["email_category"]

    router = research_router_generator(initial_email, email_category)

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
    initial_email = state["initial_email"]
    email_category = state["email_category"]
    draft_email = state["draft_email"]

    # draft_email = "Yo we can't help you, best regards Sarah"

    router = rewrite_router_generator(
        initial_email, email_category, draft_email)

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

# Add the edges
workflow.set_entry_point("categorize_email")

workflow.add_conditional_edges(
    "categorize_email",
    route_to_research,
    {
        "research_info": "research_info_search",
        "draft_email": "draft_email_writer",
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

# Memory saver for checkpointing and saving previous messages for consistent accross the chat
memory = MemorySaver()  # memory not required for this project

# Compile
graph = workflow.compile()


def get_agent_response(email: str):
    config = {"configurable": {"thread_id": "1"}}

    events = graph.stream(
        {"initial_email": email, "research_info": None, "num_steps": 0},
        config,
        stream_mode="values",
    )

    for event in events:
        # print(f"---------{event}")
        if "final_email" in event:
            response = event["final_email"]
            # pass
            # event[value][-1].pretty_print()
            # print(f"Finished running: {key}:")

    # snapshot = graph.get_state()
    # print(snapshot)
    # print(f"The final response to the email: {snapshot.values['final_email']}")
    # return snapshot.values['final_email']
    try:
        return response
    except:
        return "error while generating llm response"

# ADD BACK THE MEMORY FUNCTION AND SEE
