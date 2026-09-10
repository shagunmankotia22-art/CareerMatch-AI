# CareerMatch AI — Progress So Far (Handoff Notes)

## Project
Hackathon project: **CareerMatch AI** — Track 3: Education, Personalized Learning & Career Agent.
2-person team. I (Member 1) own: RAG/Study Assistant backend + frontend integration.
Teammate owns: Jobs/internship API, job search tool, agent routing (career side).

## Decided architecture
- Frontend UI: reuse the existing React/Vite app **`placement-workspace-main`** AS-IS (do not modify its
  existing pages: LandingPage, ResumePage, WorkspacePage, PlanningPage, ExecutePage, AuthPage).
  A NEW page will be added later — `StudyAssistant.jsx` at route `/study` — styled to match existing
  components, once the backend is ready.
- Backend: separate Python service in a new top-level folder `careermatch/backend/`, using
  LangChain + Ollama + FastAPI (FastAPI added later to expose endpoints to the React frontend, since
  Streamlit was replaced by the existing React UI per user's decision).
- `placement-workspace-main` must stay untouched until integration step.

## Required tech (per original spec)
Python, LangChain, ChatOllama, Ollama, PyPDFLoader, RecursiveCharacterTextSplitter, Chroma,
Ollama-compatible embeddings, `@tool`, `create_agent`.

## Folder structure so far
```
careermatch/
├── README.md              (status checklist, structure notes)
└── backend/
    ├── chatollama_test.py  (Step 1 smoke test)
    └── requirements.txt    (currently: langchain-ollama)
```

## Model decision
User's machine already has these Ollama models installed locally (no re-download needed):
- `qwen3:latest` (5.2GB) — CHOSEN for the assistant (best quality available locally, no network pull needed)
- `qwen2.5-coder:3b` (1.9GB) — code-specialized, not used
- `qwen3:0.6b` (522MB) — fallback if `qwen3:latest` is too slow during demo

`chatollama_test.py` is currently set to `MODEL_NAME = "qwen3:latest"`.

Note: `ollama pull llama3.2` originally failed with a DNS/network error
(`no such host: ...r2.cloudflarestorage.com`), then succeeded on retry, but never appeared in
`ollama list` — so we abandoned llama3.2 in favor of the already-installed qwen3:latest.

## Status checklist
- [x] Project scaffolded (`careermatch/backend/`)
- [x] Ollama installed and verified (v0.33.3)
- [x] Model chosen: qwen3:latest
- [ ] Step 1: ChatOllama smoke test — **run `python chatollama_test.py` and confirm output** (last thing
      in progress — user was about to run this)
- [ ] Step 2: PDF loading (PyPDFLoader, keep source/page metadata)
- [ ] Step 3: Text splitting (RecursiveCharacterTextSplitter — tune chunk_size/overlap)
- [ ] Step 4: Embeddings (Ollama-compatible, local)
- [ ] Step 5: Chroma vector store (persistent)
- [ ] Step 6: Retriever + testing (factual: "What is a text splitter?"; conceptual: "Explain how RAG works")
- [ ] Step 7: Course material `@tool` (`retrieve_course_material`)
- [ ] Step 8: FastAPI layer to expose the tool/pipeline to the frontend
- [ ] Step 9: New `StudyAssistant.jsx` page in `placement-workspace-main`, wired to FastAPI via fetch
- [ ] Step 10: Agent (`create_agent`) combining `retrieve_course_material` + teammate's
      `search_jobs_or_internships`, with a system prompt to route course vs. opportunity vs. combined queries

## How to resume in a new session/app
Paste this file's content (or upload it) as your first message, along with:
- The `careermatch/` folder (backend files created so far)
- The `placement-workspace-main/` folder (untouched React UI)
Then say: "Continue from Step 1 — I need to confirm the ChatOllama test output, then move to Step 2 (PDF loading)."

## Rules to keep enforcing (from original spec)
- Work in small, testable, incremental steps — explain, show files, give code, run command, expected
  output, troubleshooting, then WAIT for confirmation before the next step.
- Do not skip ahead. Do not build everything in one file. Do not fabricate data/API responses.
- Do not touch teammate's job-search implementation unless needed for integration.
- Windows/PowerShell environment, `.venv` virtual environment.
