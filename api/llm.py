from langchain_groq import ChatGroq
from dotenv import load_dotenv

# define LLM in seperate file to ensure consistency accross all files
load_dotenv()

#  LLM
GROQ_LLM = ChatGroq(model="llama3-70b-8192")
