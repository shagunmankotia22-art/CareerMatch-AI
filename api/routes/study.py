"""
api/routes/study.py — Study Assistant routes.

Thin routing layer only: all RAG logic lives in the rag/ package.
Do NOT add job-search / career-agent routes here — that is a teammate's
separate responsibility.
"""

import logging

from fastapi import APIRouter, UploadFile, File, HTTPException

from api.schemas import StudyQuestionRequest, StudyAnswerResponse, UploadResponse
from rag.pipeline import process_and_index_pdf_bytes, query_rag_structured
from rag.vectorstore import EMBED_MODEL, COLLECTION_NAME, get_indexed_chunk_count
from rag.pipeline import LLM_MODEL

logger = logging.getLogger("study-assistant")

router = APIRouter(prefix="/api/study", tags=["study-assistant"])


@router.get("/health")
def health():
    """Confirms the Study Assistant backend is running and reports current index status."""
    try:
        chunk_count = get_indexed_chunk_count()
    except Exception as e:
        logger.warning("Could not read chunk count during health check: %s", e)
        chunk_count = None

    return {
        "status": "ok",
        "service": "study-assistant",
        "llm_model": LLM_MODEL,
        "embedding_model": EMBED_MODEL,
        "collection": COLLECTION_NAME,
        "indexed_chunks": chunk_count,
    }


@router.post("/ask", response_model=StudyAnswerResponse)
def ask(request: StudyQuestionRequest):
    """Answers a student question using RAG over the indexed course material."""
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question must not be empty.")

    try:
        answer, citations, has_kb = query_rag_structured(question)
    except Exception as e:
        logger.exception("RAG query failed")
        raise HTTPException(status_code=500, detail=f"Failed to generate an answer: {e}")

    return StudyAnswerResponse(answer=answer, citations=citations, has_knowledge_base=has_kb)


@router.post("/upload", response_model=UploadResponse)
async def upload(file: UploadFile = File(...)):
    """Accepts a course-material PDF, indexes it into the persistent Chroma store."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        result = process_and_index_pdf_bytes(file.filename, file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("PDF indexing failed")
        raise HTTPException(status_code=500, detail=f"Failed to index PDF: {e}")

    return UploadResponse(
        success=True,
        filename=result["filename"],
        pages=result["pages_indexed"],
        chunks=result["chunks_indexed"],
    )
