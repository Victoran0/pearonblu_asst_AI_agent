from dotenv import load_dotenv
from .llm import GROQ_LLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


def rephrase_writer(rephrase_req: str) -> str:
    rephrase_writer_prompt = ChatPromptTemplate.from_messages(
        [
            (
                'system',
                "You are an expert Email Rephraser for Pearon Blu Hotel, highly skilled at understanding emails and rephrasing them. Your role is to accurately and effectively rephrase emails into meaningful thoughtful, friendly, and professional emails based on their content and context."
            ),
            (
                "human",
                """
                Analyze the provided REPHRASE_REQ and rephrase it into a meaningful thoughtful, friendly, and professional email.

                **Key Rules:**  
                - Do not fabricate information. Use only the details provided in REPHRASE_REQ.  
                - Always sign off professionally as `From Sarah, the Resident Manager.`  

                **Output Format:**  
                Return a String which is the complete email you have composed. Provide no preamble or explanation.  

                REPHRASE_REQ: `{rephrase_req}`  
                """
            )
        ]
    )

    rephrase_writer_chain = rephrase_writer_prompt | GROQ_LLM | StrOutputParser()

    return rephrase_writer_chain.invoke({"rephrase_req": rephrase_req})
