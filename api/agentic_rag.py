from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from uuid import uuid4
import os.path as path
from dotenv import load_dotenv

load_dotenv()


def load_and_preprocess_doc():
    # Load and Preprocess the document into chunks
    text_loader_kwargs = {"autodetect_encoding": True}
    loader = TextLoader(r'pricing_and_services.txt', **text_loader_kwargs)
    document = loader.load()
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=150, chunk_overlap=60)
    doc_splits = text_splitter.split_documents(document)

    # print(doc_splits)
    return doc_splits


def p_and_s_chrome_db():
    doc_splits = load_and_preprocess_doc()

    # Define the root directory path and unique ids for each doc
    root_directory = path.dirname(
        path.dirname(path.abspath(__file__)))
    uuids = [str(uuid4()) for _ in range(len(doc_splits))]

    # Create a Chrome vector store
    vector_store = Chroma(
        collection_name='pricing_and_services',
        embedding_function=GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004"),
        persist_directory=root_directory
    )
    print("p and s vector store loaded successfully")

    if vector_store.get()['ids'] == []:
        vector_store.add_documents(documents=doc_splits, ids=uuids)
        print("documents added to the vector store")
        print(vector_store.get()['ids'])
    else:
        print("vector store have been initialized previously")
        pass

    return vector_store


def query_p_and_s_chroma_db(query: str):
    vector_store = p_and_s_chrome_db()

    print('\n\n-----similarity search-----\n\n')
    joined_retrieved_docs = "\n\n".join(
        [i.page_content for i in vector_store.similarity_search(query, k=3)])

    print(joined_retrieved_docs)
    return joined_retrieved_docs
