from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser


load_dotenv()

GROQ_LLM = ChatGroq(model="llama3-70b-8192")


def email_category_generator(email: str):
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an Email Categorization Agent, highly skilled at analyzing customer emails and understanding their intent. Your role is to accurately and effectively categorize emails into meaningful and useful categories based on their content and context."
            ),
            (
                "human",
                """
                Analyze the provided email and categorize it into one of the following categories:
                price_enquiry: For inquiries about pricing.
                customer_complaint: For complaints regarding products, services, or related terms.
                product_enquiry: For questions about product features, benefits, or services (excluding pricing).
                customer_feedback: For feedback on a product or service.
                chat_related: For emails related to casual greetings and other straightforward questions/messages not related to products or services.
                off_topic: For emails unrelated to any of the listed categories.
                Output a single category from the options (price_enquiry, customer_complaint, product_enquiry, customer_feedback, off_topic, chat_related). Your response should follow this format: 'category_name'.
                User's Email:
                {initial_email}
                """
            )
        ]
    )

    email_category_generator = prompt | GROQ_LLM | StrOutputParser()

    return email_category_generator.invoke({"initial_email": email})


def research_router_generator(email: str, email_category: str):
    research_router_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert at analyzing emails to determine the appropriate next step. Depending on the content and context, you will either provide a direct response by recommending draft_email or recommend conducting additional research."
            ),
            (
                "human",
                """
                Analyze the provided email using the following criteria to decide the routing:

                1. If the email requires only a simple response (e.g., straightforward questions, gratitude messages, or other easily answerable topics that you can answer correctly and their information is available), choose `draft_email`.
                2. If the email discusses topics that require further information, context, current topics (recent information related to the present time and date), informations that are not available, choose `research_info`.
                3. Your response to the email should be with the key 'response' 

                **Key Considerations: **
                - You do not need to rely strictly on keywords; focus on the intent and content.
                - Make your decision using both the `EMAIL` and `EMAIL_CATEGORY`.

                **Output Format: **
                Return a JSON object with a two key `router_decision` and 'response', and provide no preamble or explanation.

                **Input Details: **
                EMAIL: `{email}`
                EMAIL_CATEGORY: `{email_category}`
                """

            )
        ]
    )

    research_router = research_router_prompt | GROQ_LLM | JsonOutputParser()

    return research_router.invoke(
        {"email": email, "email_category": email_category})


def search_keyword_generator(email: str, email_category: str):
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert at identifying the most effective keywords for web searches to find accurate and helpful information for customer responses."
            ),
            (
                "human",
                """
                Using the provided `INITIAL_EMAIL` and `EMAIL_CATEGORY`, identify the best keywords to retrieve the most relevant information for drafting the final email.

                **Output Format: **
                Return a JSON object with a single key `keywords`, whose value is an array containing no more than three keywords. Provide no preamble or explanation.

                **Input Details: **
                INITIAL_EMAIL: "{initial_email}"
                EMAIL_CATEGORY: "{email_category}"
                """
            )
        ]
    )

    search_keyword_chain = prompt | GROQ_LLM | JsonOutputParser()

    return search_keyword_chain.invoke(
        {"initial_email": email, "email_category": email_category})


def draft_writer_generator(initial_email: str, email_category: str, research_info: dict):
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert Email Writer for a company. Your role is to draft thoughtful, friendly, and professional emails in response to customer inquiries. You will use the provided `INITIAL_EMAIL`, the `EMAIL_CATEGORY` labeled by the categorizer agent, and any additional `RESEARCH_INFO` from the research agent to craft the email."

            ), (
                "human",
                """
                "Based on the given `INITIAL_EMAIL`, `EMAIL_CATEGORY`, and `RESEARCH_INFO`, draft a helpful and professional response email using the following guidelines:  

                1. **off_topic:**  
                - Ask the customer questions to gather more information.  

                2. **customer_complaint:**  
                - Reassure the customer that their concerns are valued and that their issues are being addressed.  

                3. **customer_feedback:**  
                - Acknowledge their feedback, assure them it is valued, and address any relevant points.  

                4. **product_enquiry:**  
                - Provide the requested product information from `RESEARCH_INFO` in a clear, friendly, and concise manner.  

                5. **price_enquiry:**  
                - Share the requested pricing details based on the information provided.  

                6. **chat_related:**  
                - Respond professionally and address their query.  

                **Key Rules:**  
                - Do not fabricate information. Use only the details provided in `RESEARCH_INFO` and `INITIAL_EMAIL`.  
                - Always sign off professionally as `From Sarah, the Resident Manager.`  

                **Output Format:**  
                Return a JSON object with a single key `email_draft`, and its value should be the complete email you have composed. Provide no preamble or explanation.  

                **Input Details:**  
                INITIAL_EMAIL: `{initial_email}`  
                EMAIL_CATEGORY: `{email_category}`  
                RESEARCH_INFO: `{research_info}`  
                """
            )
        ]
    )

    draft_writer_chain = prompt | GROQ_LLM | JsonOutputParser()

    return draft_writer_chain.invoke({"initial_email": initial_email,
                                      "email_category": email_category, "research_info": research_info})


def rewrite_router_generator(initial_email: str, email_category: str, draft_email: str):
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert at evaluating draft emails and determining whether they need to be rewritten to better address the customer's needs."
            ),
            (
                "human",
                """
                Evaluate the provided `DRAFT_EMAIL` based on the following criteria:

                1. If the `INITIAL_EMAIL` requires only a simple response and the `DRAFT_EMAIL` fulfills this, then it does not need to be rewritten.
                2. If the `DRAFT_EMAIL` addresses all concerns or requirements of the `INITIAL_EMAIL`, it does not need to be rewritten.
                3. If the `DRAFT_EMAIL` is missing information necessary to address the `INITIAL_EMAIL`, it needs to be rewritten.

                **Output Format: **
                Return a JSON object with a single key `router_decision`, whose value is either:
                - `rewrite` (if the draft needs rewriting)
                - `no_rewrite` (if the draft does not need rewriting).

                Provide no preamble or explanation.

                **Input Details: **
                INITIAL_EMAIL: `{initial_email}`
                EMAIL_CATEGORY: `{email_category}`
                DRAFT_EMAIL: `{draft_email}`
                """
            )
        ]
    )

    rewrite_writer_chain = prompt | GROQ_LLM | JsonOutputParser()

    return rewrite_writer_chain.invoke(
        {"initial_email": initial_email, "email_category": email_category, "draft_email": draft_email})


def draft_analysis_generator(initial_email: str, email_category: str, research_info: dict, draft_email: str):
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are the Quality Control Agent of our company. Your role is to evaluate the `INITIAL_EMAIL` from the customer, the `EMAIL_CATEGORY` assigned by the categorizer agent, the `RESEARCH_INFO` from the research agent, and the `DRAFT_EMAIL`. Provide a clear analysis of whether the draft email effectively addresses the customer's issues."
            ), (
                "human",
                """ 
                Evaluate the provided information and determine how the `DRAFT_EMAIL` can be improved. Use the following guidelines:  

                1. Identify any missing elements or unclear points in the `DRAFT_EMAIL` that prevent it from fully addressing the customer's issues.  
                2. Suggest specific changes or additions to make the email more effective and professional.  
                3. Base your analysis strictly on the information provided in the `INITIAL_EMAIL`, `EMAIL_CATEGORY`, `RESEARCH_INFO`, and `DRAFT_EMAIL`. Do not add or fabricate details.  

                **Output Format:**  
                Return the analysis as a JSON object with a single key `draft_analysis`. Provide no preamble or explanation.  

                **Input Details:**  
                INITIAL_EMAIL: `{initial_email}`  
                EMAIL_CATEGORY: `{email_category}`  
                RESEARCH_INFO: `{research_info}`  
                DRAFT_EMAIL: `{draft_email}`  

                """
            )
        ]
    )
    draft_analysis_chain = prompt | GROQ_LLM | JsonOutputParser()

    return draft_analysis_chain.invoke({"initial_email": initial_email, "email_category": email_category, "research_info": research_info, "draft_email": draft_email})


def rewrite_email_generator(initial_email: str, email_category: str, research_info: dict, draft_email: str, email_analysis: dict):
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are the Final Email Agent. Your task is to rewrite and improve the `DRAFT_EMAIL` based on the `email_analysis` provided by the QC Agent, creating a polished and effective final email."
            ), (
                "human",
                """ 
                Follow these guidelines to rewrite the email:  

                1. Use the feedback in `DRAFT_EMAIL_FEEDBACK` to improve the structure, tone, and clarity of the `DRAFT_EMAIL`.  
                2. Incorporate relevant details from the `RESEARCH_INFO` and `INITIAL_EMAIL` to address the customer's concerns effectively.  
                3. Ensure the final email is professional, friendly, and concise.  

                **Key Rules:**  
                - Do not invent or include information not provided in the `RESEARCH_INFO`, `INITIAL_EMAIL`, or `DRAFT_EMAIL_FEEDBACK`.  

                **Output Format:**  
                Return a JSON object with a single key `final_email`, and its value should be the final email you have composed. Provide no preamble or explanation.  

                **Input Details:**  
                INITIAL_EMAIL: `{initial_email}`
                EMAIL_CATEGORY: `{email_category}`  
                RESEARCH_INFO: `{research_info}`  
                DRAFT_EMAIL: `{draft_email}`  
                DRAFT_EMAIL_FEEDBACK: `{email_analysis}`  
                """
            )
        ]
    )

    rewrite_email_chain = prompt | GROQ_LLM | JsonOutputParser()

    return rewrite_email_chain.invoke({"initial_email": initial_email, "email_category": email_category, "research_info": research_info, "draft_email": draft_email, "email_analysis": email_analysis})
