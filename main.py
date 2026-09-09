"""
main.py — FastAPI entry point for the CareerMatch AI Study Assistant.

Responsibility: RAG / Study Assistant backend only. Job-search / career-agent
routes belong to a teammate and are NOT registered here.

Run with:
    uvicorn main:app --reload
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.study import router as study_router

app = FastAPI(
    title="CareerMatch AI — Study Assistant API",
    description="RAG-backed study assistant endpoints (course material Q&A + PDF ingestion).",
    version="1.0.0",
)

# --- CORS ---
# Local React/Vite dev server origins. Configurable via STUDY_CORS_ORIGINS
# (comma-separated) without falling back to an insecure wildcard.
_default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
_env_origins = os.environ.get("STUDY_CORS_ORIGINS")
allowed_origins = [o.strip() for o in _env_origins.split(",")] if _env_origins else _default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(study_router)
