from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser


load_dotenv()

GROQ_LLM = ChatGroq(model="llama3-70b-8192")


def format_chat_history(history: list) -> str:
    format_history_to_str = ""
    for i in range(len(history)):
        tag = "Customer" if history[i].type == 'human' else 'Pearon Blu Assistant'
        format_history_to_str += f"{tag}: {history[i].content} \n"
    return format_history_to_str


def email_category_generator(email_thread: list):
    email_thread = format_chat_history(email_thread)
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert Email Categorization Agent for Pearon Blu Hotel, highly skilled at analyzing customer emails and understanding their intent. Your role is to accurately and effectively categorize emails into meaningful and useful categories based on their content and context."
            ),
            (
                "human",
                """
                Analyze the provided EMAIL_THREAD between a customer and Pearon Blu Assistant. Focusing on the latest email from the customer, categorize it into one of the following categories:
                chat_history: For emails related to a previous interaction with the Assistant or a reply to a question the Assistant previously asked the customer. Latest customer email Example, "can you remember my name", "but did i not tell you I left early", "it was around 6pm on friday".. anything that has to do with an ongoing/past conversation history.
                price_enquiry: For inquiries about pricing.
                customer_complaint: For complaints (negative feedback) regarding how the customer was treated, our services, or related terms.
                product_enquiry: For questions about our hotel features, benefits, or services (excluding pricing).
                customer_feedback: For positive feedback on our hotel's service. For example: I really enjoyed my stay at the hotel!
                chat_related: For emails related to casual greetings and other straightforward questions/messages, not related to customer_feedback, pricing and other options.
                off_topic: For emails unrelated to any of the listed categories.
                Output a single category from the options (chat_history, price_enquiry, customer_complaint, product_enquiry, customer_feedback, off_topic, chat_related). Your response should follow this format: category_name
                EMAIL_THREAD:
                {email_thread}
                """
            )
        ]
    )

    email_category_generator = prompt | GROQ_LLM | StrOutputParser()
    return email_category_generator.invoke({"email_thread": email_thread})


def research_router_generator(email_thread: list, email_category: str):
    email_thread = format_chat_history(email_thread)
    research_router_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert at analyzing emails to determine the appropriate next step. Depending on the content and context, you will either provide a direct response by recommending draft_email or recommend conducting additional research."
            ),
            (
                "human",
                """
                Analyze the provided EMAIL_THREAD between a customer and pearon Blu Assistant. Focusing on the latest email from the customer, use the following criteria to decide the routing:

                1. If the email requires only a simple response (e.g., straightforward questions, gratitude messages, or other easily answerable topics that you can answer correctly and their information is available), choose `draft_email`.
                2. If the email discusses topics that require further information, context, current topics (recent information related to the present time and date), informations that are not available, choose `research_info`.
                3. Your response to the email should be with the key 'response' 

                **Key Considerations: **
                - You do not need to rely strictly on keywords; focus on the intent and content.
                - Make your decision using both the latest customer email in `EMAIL_THREAD` and `EMAIL_CATEGORY`.

                **Output Format: **
                Return a JSON object with two keys `router_decision` and 'response', and provide no preamble or explanation.

                **Input Details: **
                EMAIL_THREAD: `{email_thread}`
                EMAIL_CATEGORY: `{email_category}`
                """

            )
        ]
    )

    research_router = research_router_prompt | GROQ_LLM | JsonOutputParser()

    return research_router.invoke(
        {"email_thread": email_thread, "email_category": email_category})


def search_keyword_generator(email_thread: list, email_category: str):
    email_thread = format_chat_history(email_thread)
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert at identifying the most effective keywords for web searches to find accurate and helpful information for customer responses."
            ),
            (
                "human",
                """
                Using the provided `EMAIL` and `EMAIL_CATEGORY`, identify the best keywords to retrieve the most relevant information for drafting the reply.

                **Output Format: **
                Return a JSON object with a single key `keywords`, whose value is an array containing no more than three keywords. Provide no preamble or explanation.

                **Input Details: **
                EMAIL: "{email}"
                EMAIL_CATEGORY: "{email_category}"
                """
            )
        ]
    )

    search_keyword_chain = prompt | GROQ_LLM | JsonOutputParser()

    return search_keyword_chain.invoke(
        {"email": email_thread.split("human")[-1], "email_category": email_category})


def draft_writer_generator(email_thread: list, email_category: str, research_info: dict):
    email_thread = format_chat_history(email_thread)
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are an expert Email Writer for Pearon Blu Hotel. Your role is to draft thoughtful, friendly, and professional emails in response to customer emails. You will use the provided `EMAIL_THREAD`, the `EMAIL_CATEGORY` labeled by the categorizer agent, and any additional `RESEARCH_INFO` from the research agent to craft the email."

            ), (
                "human",
                """
                "Based on the given `EMAIL_CATEGORY`, `RESEARCH_INFO` and 'EMAIL_THREAD'. Focusing on the latest email from the customer in EMAIL_THREAD, draft a helpful and professional response using the following guidelines:  

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

                7. **chat_history:**
                - Continue the conversation based on the previous interaction. Look for information in the EMAIL_THREAD, if you need to.

                **Key Rules:**  
                - Do not fabricate information. Use only the details provided in `RESEARCH_INFO` and `EMAIL_THREAD`.  
                - Always sign off professionally as `From Sarah, the Resident Manager.`  

                **Output Format:**  
                Return a JSON object with a single key `email_draft`, and its value should be the complete email you have composed. Provide no preamble or explanation.  

                **Input Details:**  
                EMAIL_THREAD: `{email_thread}`  
                EMAIL_CATEGORY: `{email_category}`  
                RESEARCH_INFO: `{research_info}`  
                """
            )
        ]
    )

    draft_writer_chain = prompt | GROQ_LLM | JsonOutputParser()

    return draft_writer_chain.invoke({"email_thread": email_thread,
                                      "email_category": email_category, "research_info": research_info})


def rewrite_router_generator(email_thread: list, email_category: str, draft_email: str):
    email_thread = format_chat_history(email_thread)
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

                1. If the latest customer mail in the `EMAIL_THREAD` requires only a simple response and the `DRAFT_EMAIL` fulfills this, then it does not need to be rewritten.
                2. If the `DRAFT_EMAIL` addresses all concerns or requirements of the latest customer mail in the `EMAIL_THREAD`, it does not need to be rewritten.
                3. If the `DRAFT_EMAIL` is missing information necessary to address the latest customer mail in the `EMAIL_THREAD`, it needs to be rewritten.

                **Output Format: **
                Return a JSON object with a single key `router_decision`, whose value is either:
                - `rewrite` (if the draft needs rewriting)
                - `no_rewrite` (if the draft does not need rewriting).

                Provide no preamble or explanation.

                **Input Details: **
                EMAIL_THREAD: `{email_thread}`
                EMAIL_CATEGORY: `{email_category}`
                DRAFT_EMAIL: `{draft_email}`
                """
            )
        ]
    )

    rewrite_writer_chain = prompt | GROQ_LLM | JsonOutputParser()

    return rewrite_writer_chain.invoke(
        {"email_thread": email_thread, "email_category": email_category, "draft_email": draft_email})


def draft_analysis_generator(email_thread: list, email_category: str, research_info: dict, draft_email: str):
    email_thread = format_chat_history(email_thread)
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are the Quality Control Agent of Pearon Blu Hotel. Your role is to evaluate the `EMAIL_THREAD` (focusing on the latest email from the customer), the `EMAIL_CATEGORY` assigned by the categorizer agent, the `RESEARCH_INFO` from the research agent, and the `DRAFT_EMAIL`. Provide a clear analysis of whether the draft email effectively addresses the customer's issues."
            ), (
                "human",
                """ 
                Evaluate the provided information and determine how the `DRAFT_EMAIL` can be improved. Use the following guidelines:  

                1. Identify any missing elements or unclear points in the `DRAFT_EMAIL` that prevent it from fully addressing the customer's issues.  
                2. Suggest specific changes or additions to make the email more effective and professional.  
                3. Base your analysis strictly on the information provided in the `EMAIL_THREAD`, `EMAIL_CATEGORY`, `RESEARCH_INFO`, and `DRAFT_EMAIL`. Do not add or fabricate details.  

                **Output Format:**  
                Return the analysis as a JSON object with a single key `draft_analysis`. Provide no preamble or explanation.  

                **Input Details:**  
                EMAIL_THREAD: `{email_thread}`  
                EMAIL_CATEGORY: `{email_category}`  
                RESEARCH_INFO: `{research_info}`  
                DRAFT_EMAIL: `{draft_email}`  

                """
            )
        ]
    )
    draft_analysis_chain = prompt | GROQ_LLM | JsonOutputParser()

    return draft_analysis_chain.invoke({"email_thread": email_thread, "email_category": email_category, "research_info": research_info, "draft_email": draft_email})


def rewrite_email_generator(email_thread: list, email_category: str, research_info: dict, draft_email: str, email_analysis: dict):
    email_thread = format_chat_history(email_thread)
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a customer assistant for Pearon Blu Hotel. Your task is to rewrite and improve the `DRAFT_EMAIL` based on the `email_analysis` provided by the QC Agent, creating a polished and effective reply."
            ), (
                "human",
                """ 
                Follow these guidelines to rewrite the email:  

                1. Use the feedback in `DRAFT_EMAIL_FEEDBACK` to improve the structure, tone, and clarity of the `DRAFT_EMAIL`.  
                2. Incorporate relevant details focusing on the latest customer mail in the `EMAIL_THREAD` and the `RESEARCH_INFO`, address the customer's concerns effectively.  
                3. Ensure the reply email is professional, friendly, and concise.  
                4. Always sign off professionally as `From Sarah, the Resident Manager.` 

                **Key Rules:**  
                - Do not invent or include information not provided in the `RESEARCH_INFO`, `EMAIL_THREAD`, or `DRAFT_EMAIL_FEEDBACK`.  

                **Output Format:**  
                Return a JSON object with a single key `reply_email`, and its value should be the reply email you have composed. Provide no preamble or explanation.  

                **Input Details:**  
                EMAIL_THREAD: `{email_thread}`
                EMAIL_CATEGORY: `{email_category}`  
                RESEARCH_INFO: `{research_info}`  
                DRAFT_EMAIL: `{draft_email}`  
                DRAFT_EMAIL_FEEDBACK: `{email_analysis}`  
                """
            )
        ]
    )

    rewrite_email_chain = prompt | GROQ_LLM | JsonOutputParser()

    return rewrite_email_chain.invoke({"email_thread": email_thread, "email_category": email_category, "research_info": research_info, "draft_email": draft_email, "email_analysis": email_analysis})
