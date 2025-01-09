from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

from datetime import datetime, timedelta
import pytz
from uuid import uuid4
import os.path as path
from dotenv import load_dotenv

from .models import PandSDocument


load_dotenv()


def get_doc_from_db():
    doc = PandSDocument.objects.first()
    return doc.document, doc


def update_upsert_date(db_doc):
    db_doc.last_upserted = str(
        datetime.now(pytz.utc) + timedelta(seconds=2))
    db_doc.save()
    # print("last upserted: ", db_doc.last_upserted,
    #   'last updated: ', db_doc.last_updated)


def load_and_preprocess_doc(doc: str):
    # Load and Preprocess the document into chunks
    document = [
        Document(
            page_content=doc,
            metadata={"source": "database"},
            id=1,
        )
    ]
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=150, chunk_overlap=60)
    doc_splits = text_splitter.split_documents(document)

    # print(doc_splits)
    return doc_splits


def p_and_s_chrome_db():
    doc, db_doc = get_doc_from_db()
    doc_splits = load_and_preprocess_doc(doc)

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
    # print("p and s vector store initialized successfully")

    if vector_store.get()['ids'] == []:
        # Add doc
        vector_store.add_documents(documents=doc_splits, ids=uuids)
        # update the last upserted date of the doc
        update_upsert_date(db_doc)
        # print("documents added to the vector store")
        # print(vector_store.get()['ids'])
    else:
        if datetime.fromisoformat(str(db_doc.last_updated)) < datetime.fromisoformat(db_doc.last_upserted):
            # print("doc was upserted recently")
            pass
        else:
            print("doc was updated, lets Reset Chroma DB and upsert latest doc_splits")
            # Reset the previous collection
            vector_store.reset_collection()
            # print("the collection is now Reset")
            # Add the new doc data
            vector_store.add_documents(documents=doc_splits, ids=uuids)
            # update the last upserted date of the doc
            update_upsert_date(db_doc)
            # print("documents added to the vector store")

    return vector_store


def query_p_and_s_chroma_db(query: str):
    vector_store = p_and_s_chrome_db()

    # print('\n\n-----similarity search-----\n\n')
    joined_retrieved_docs = "\n\n".join(
        [i.page_content for i in vector_store.similarity_search(query, k=3)])

    # print(joined_retrieved_docs)
    return joined_retrieved_docs
