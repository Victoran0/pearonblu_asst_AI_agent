from langchain_groq import ChatGroq

# define LLM in seperate file to ensure consistency accross all files
#  LLM
GROQ_LLM = ChatGroq(model="llama3-70b-8192")
