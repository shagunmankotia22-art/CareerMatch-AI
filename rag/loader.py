"""
rag/loader.py — PDF ingestion: save raw upload bytes, load with PyPDFLoader,
split with RecursiveCharacterTextSplitter.

Same chunk_size/chunk_overlap as the original app.py implementation.
"""

import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

DATA_DIR = "data"
CHUNK_SIZE = 300
CHUNK_OVERLAP = 50


def save_uploaded_pdf(original_filename: str, file_bytes: bytes) -> str:
    """Writes uploaded PDF bytes to disk and returns the saved path."""
    os.makedirs(DATA_DIR, exist_ok=True)
    safe_name = os.path.basename(original_filename)
    path = os.path.join(DATA_DIR, f"uploaded_{safe_name}")
    with open(path, "wb") as f:
        f.write(file_bytes)
    return path


def load_and_split_pdf(pdf_path: str, chunk_size: int = CHUNK_SIZE, chunk_overlap: int = CHUNK_OVERLAP):
    """
    Loads a PDF with PyPDFLoader (preserving source/page metadata) and splits it
    into chunks with RecursiveCharacterTextSplitter.

    Returns (docs, chunks) where docs are the raw per-page Documents and chunks
    are the split Documents ready for embedding.
    """
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    if not docs:
        raise ValueError("No extractable text found in the uploaded PDF.")

    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = splitter.split_documents(docs)
    return docs, chunks
