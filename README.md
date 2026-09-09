# CareerMatch AI

Hackathon project — Track 3: Education, Personalized Learning & Career Agent.

## Structure

```
careermatch/
├── backend/          ← Python/LangChain/Ollama RAG + agent (built here)
│   ├── chatollama_test.py
│   ├── requirements.txt
│   ├── rag/          ← (coming later: loader, splitter, embeddings, vectorstore, retriever, tools)
│   ├── agent/         ← (coming later)
│   ├── data/course_material/
│   └── chroma_db/
└── frontend/          ← the placement-workspace-main React UI, wired to the backend API
                          (untouched for now — integration happens after the RAG pipeline works)
```

`placement-workspace-main` stays as-is. Once the backend RAG pipeline + FastAPI layer are working,
we'll bring its UI into `careermatch/frontend/` and connect it to the backend with fetch calls —
no backend logic lives in the React app itself.

## Status

- [x] Project scaffolded
- [ ] Step 1: ChatOllama smoke test
- [ ] Step 2: PDF loading
- [ ] Step 3: Text splitting
- [ ] Step 4: Embeddings
- [ ] Step 5: Chroma vector store
- [ ] Step 6: Retriever + testing
- [ ] Step 7: Course material `@tool`
- [ ] Step 8: FastAPI layer
- [ ] Step 9: Frontend integration
- [ ] Step 10: Agent (course + job tools)
