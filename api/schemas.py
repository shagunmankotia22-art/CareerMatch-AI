"""
api/schemas.py — Pydantic request/response models for the Study Assistant API.
"""

from typing import List
from pydantic import BaseModel, Field


class StudyQuestionRequest(BaseModel):
    question: str = Field(..., min_length=1, description="The student's question about the course material.")


class Citation(BaseModel):
    source: str
    page: int


class StudyAnswerResponse(BaseModel):
    answer: str
    citations: List[Citation]
    has_knowledge_base: bool


class UploadResponse(BaseModel):
    success: bool
    filename: str
    pages: int
    chunks: int
