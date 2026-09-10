"""
rag/pipeline.py — Orchestrates the full RAG flow:

    PDF -> loader -> vectorstore (ingestion)
    question -> vectorstore -> retrieved chunks -> ChatOllama (retrieval + generation)

This is the only module that knows about both ingestion and generation; it
composes rag/loader.py and rag/vectorstore.py rather than duplicating their logic.
"""

import os
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate

from rag.loader import save_uploaded_pdf, load_and_split_pdf
from rag.vectorstore import get_vector_store, add_chunks

LLM_MODEL = os.environ.get("STUDY_LLM_MODEL", "qwen3:latest")

RAG_PROMPT = ChatPromptTemplate.from_template("""You are CareerMatch AI, an expert academic tutor in a personal placement workspace.
Answer the student's question based strictly on the retrieved course context below.
Do not make up facts. If the information is not in the context, state that clearly.

--- Retrieved Course Context ---
{context}
--------------------------------

Question: {question}

Grounded Answer:""")


def process_and_index_pdf_bytes(original_filename: str, file_bytes: bytes) -> dict:
    """
    Full ingestion pipeline for an uploaded PDF: save -> load -> split -> embed -> store.
    Returns metadata about what was indexed.
    """
    pdf_path = save_uploaded_pdf(original_filename, file_bytes)
    docs, chunks = load_and_split_pdf(pdf_path)
    add_chunks(chunks)

    return {
        "filename": os.path.basename(pdf_path),
        "pages_indexed": len(docs),
        "chunks_indexed": len(chunks),
        "chunk_size": 300,
        "chunk_overlap": 50,
    }


def query_rag_structured(question: str, k: int = 3):
    """
    Runs retrieve -> ground -> generate and returns citations as structured
    data (source filename + page number) for JSON serialization.

    Returns: (answer: str, citations: list[dict], has_knowledge_base: bool)
    """
    vector_store = get_vector_store()
    if not vector_store:
        return (
            "Please upload a course material PDF first to initialize your study knowledge base.",
            [],
            False,
        )

    retriever = vector_store.as_retriever(search_kwargs={"k": k})
    docs = retriever.invoke(question)

    if not docs:
        return ("Based on your uploaded course material, this concept is not covered.", [], True)

    formatted_chunks = []
    citations = []
    seen = set()
    for doc in docs:
        page = doc.metadata.get("page", 0) + 1
        source = os.path.basename(doc.metadata.get("source", "course_material.pdf"))
        formatted_chunks.append(f"[Page {page}]: {doc.page_content.strip()}")

        key = (source, page)
        if key not in seen:
            seen.add(key)
            citations.append({"source": source, "page": page})

    context_text = "\n\n".join(formatted_chunks)

    llm = ChatOllama(model=LLM_MODEL, temperature=0.1)
    chain = RAG_PROMPT | llm
    response = chain.invoke({"context": context_text, "question": question})

    return response.content, citations, True
