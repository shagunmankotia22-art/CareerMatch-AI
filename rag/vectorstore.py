"""
rag/vectorstore.py — Chroma vector store + Ollama embeddings management.

Extracted directly from app.py's working "WINDOWS SAFE" Chroma pattern.
No behavior changes: same collection name, same persist directory, same
client-based reset pattern (avoids Windows file-lock issues on delete).
"""

import os
import chromadb
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

DATA_DIR = "data"
CHROMA_DIR = os.path.join(DATA_DIR, "chroma_db")
COLLECTION_NAME = "course_material"
EMBED_MODEL = os.environ.get("STUDY_EMBED_MODEL", "nomic-embed-text")


def get_embeddings():
    return OllamaEmbeddings(model=EMBED_MODEL)


def get_chroma_client():
    os.makedirs(CHROMA_DIR, exist_ok=True)
    return chromadb.PersistentClient(path=CHROMA_DIR)


def reset_chroma_collection():
    """Safely resets the collection via the Chroma API (no raw file deletion -> Windows safe)."""
    try:
        client = get_chroma_client()
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass


def get_vector_store():
    """Returns the persistent Chroma vector store, or None if it doesn't exist yet."""
    if not os.path.exists(CHROMA_DIR):
        return None
    try:
        client = get_chroma_client()
        return Chroma(
            client=client,
            collection_name=COLLECTION_NAME,
            embedding_function=get_embeddings(),
        )
    except Exception as e:
        raise RuntimeError(f"Vector store connection error: {e}") from e


def get_indexed_chunk_count() -> int:
    """Returns how many chunks are currently indexed (0 if none / store doesn't exist)."""
    vs = get_vector_store()
    if not vs:
        return 0
    try:
        return len(vs.get()["ids"])
    except Exception:
        return 0


def add_chunks(chunks):
    """Replaces the existing knowledge base with the given chunks (same behavior as app.py:
    each upload replaces the previously indexed document)."""
    reset_chroma_collection()
    client = get_chroma_client()
    vector_store = Chroma(
        client=client,
        collection_name=COLLECTION_NAME,
        embedding_function=get_embeddings(),
    )
    vector_store.add_documents(chunks)
    return vector_store
