from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
import os
from os import path
from dotenv import load_dotenv

load_dotenv()

text_loader_kwargs = {"autodetect_encoding": True}

loader = TextLoader(r'pricing_and_services.txt', **text_loader_kwargs)

document = loader.load()

text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=100, chunk_overlap=30)

doc_splits = text_splitter.split_documents(document)

# Define the root directory path
root_directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

vector_store = Chroma.from_documents(
    documents=doc_splits,
    collection_name='pricing_and_services',
    embedding=GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
    persist_directory=root_directory
)

retriever = vector_store.as_retriever(search_kwargs={"k": 3})

print(retriever.invoke("Single room"))
