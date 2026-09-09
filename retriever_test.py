"""
Step 9: Create LangChain Retriever from Persistent Chroma Vector Store.

LangChain / RAG Concept:
------------------------
What is a Retriever?
While a VectorStore is a storage mechanism for documents and embeddings,
a Retriever is a lightweight search interface that accepts an unstructured query string
and returns a list of matching `Document` objects.

Why convert VectorStore -> Retriever?
1. Standard Interface: All LangChain chains and agents expect a Retriever with an `.invoke(query)` method.
2. Search Customization: You can configure search strategies like:
   - `search_type="similarity"`: Standard top-k nearest neighbors.
   - `search_type="mmr"` (Maximal Marginal Relevance): Optimizes for both relevance AND diversity
     (prevents duplicate/redundant chunks for broad questions).
   - `search_kwargs={"k": 2}`: Controls how many top relevant chunks to fetch.
3. Decoupling: Your agent and UI do not need to know about SQLite or Chroma internals;
   they just call `retriever.invoke("Explain RAG")`.
"""

import os
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

CHROMA_DIR = os.path.join("data", "chroma_db")
COLLECTION_NAME = "course_material"
EMBED_MODEL = "nomic-embed-text"

def get_retriever(persist_dir: str = CHROMA_DIR, k: int = 2):
    """
    Loads the persistent Chroma vector store from disk and exposes it as a LangChain retriever.
    """
    if not os.path.exists(persist_dir):
        raise FileNotFoundError(
            f"Chroma directory '{persist_dir}' not found. Please run chroma_store_test.py first."
        )
        
    print(f"1. Connecting to persistent Chroma DB at: {persist_dir}")
    embeddings = OllamaEmbeddings(model=EMBED_MODEL)
    
    vector_store = Chroma(
        persist_directory=persist_dir,
        embedding_function=embeddings,
        collection_name=COLLECTION_NAME
    )
    
    print(f"2. Building retriever (k={k}, search_type='similarity')...")
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k}
    )
    
    return retriever

def test_retriever(retriever, query: str):
    print(f"\n========================================================")
    print(f"Query: \"{query}\"")
    print(f"========================================================")
    
    # In modern LangChain, retrievers use .invoke()
    retrieved_docs = retriever.invoke(query)
    
    print(f"Retrieved {len(retrieved_docs)} relevant chunk(s):\n")
    for i, doc in enumerate(retrieved_docs):
        page = doc.metadata.get("page", 0) + 1
        source = doc.metadata.get("source", "unknown")
        print(f"[{i + 1}] Source: {source} (Page {page})")
        print(f"    Content: {doc.page_content.strip()}")
        print("-" * 55)
        
    return retrieved_docs

def main():
    # If the database doesn't exist yet, populate it from Step 8
    if not os.path.exists(CHROMA_DIR):
        print(f"Persistent database '{CHROMA_DIR}' not found. Creating it now...")
        from chroma_store_test import build_vector_store
        pdf_path = os.path.join("data", "sample_course.pdf")
        build_vector_store(pdf_path)
        
    retriever = get_retriever(k=2)
    
    # Test a basic lookup query
    test_retriever(retriever, "What is a text splitter?")
    
    print("\nStep 9 is COMPLETE: Retriever successfully created and operational!")

if __name__ == "__main__":
    main()