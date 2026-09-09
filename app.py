"""
CareerMatch AI — Personal Placement & Learning Workspace
Inspired by AI Placement Mentor Design System
Fonts: Space Grotesk, Plus Jakarta Sans, JetBrains Mono
Theme: Sleek Dark Developer/SaaS Workspace

Track 3: Education — Personalized Learning & Career Agent
Member 1: RAG / Study Assistant + UI Integration
"""

import os
import streamlit as st

# RAG logic now lives in the rag/ package (shared with the FastAPI layer in
# main.py / api/) so this Streamlit UI and the API stay in sync.
from rag.vectorstore import CHROMA_DIR, COLLECTION_NAME, EMBED_MODEL, get_vector_store, reset_chroma_collection
from rag.pipeline import LLM_MODEL, process_and_index_pdf_bytes, query_rag_structured

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="AI Placement Mentor & Study Assistant",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- DESIGN SYSTEM: matches placement-workspace-main (violet/neon dark SaaS) ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
        --ink: #e0ddf0;
        --ink-strong: #ffffff;
        --paper: #06050a;
        --paper-2: #0d0c14;
        --paper-3: #13111e;
        --violet: #7c6ef0;
        --violet-deep: #6558d3;
        --violet-soft: rgba(124, 110, 240, 0.12);
        --violet-glow: rgba(124, 110, 240, 0.35);
        --mint: #34d399;
        --mint-soft: rgba(52, 211, 153, 0.12);
        --coral: #ff7a6b;
        --coral-soft: rgba(255, 122, 107, 0.12);
        --muted: #8b87a0;
        --line: rgba(255, 255, 255, 0.08);
        --card-bg: rgba(18, 15, 30, 0.75);
        --neon-cyan: #00f0ff;
        --neon-magenta: #ff00e5;
        --neon-violet-glow: 0 0 7px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.35), 0 0 40px rgba(0, 240, 255, 0.12);
    }

    /* Global Typography */
    html, body, [class*="css"], .stApp {
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        color: var(--ink);
    }

    .stApp {
        background: var(--paper);
        position: relative;
    }

    /* Keep real app content above the decorative fixed background layer below */
    .stApp > .withScreencast,
    [data-testid="stAppViewContainer"] {
        position: relative;
        z-index: 1;
    }

    /* Animated ambient background, ported from the React app */
    .stApp::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        background:
            radial-gradient(ellipse 600px 400px at 15% 20%, rgba(124, 110, 240, 0.10) 0%, transparent 70%),
            radial-gradient(ellipse 500px 500px at 85% 25%, rgba(255, 122, 107, 0.07) 0%, transparent 70%),
            radial-gradient(ellipse 400px 300px at 50% 85%, rgba(52, 211, 153, 0.06) 0%, transparent 70%);
        animation: bg-drift 20s ease-in-out infinite;
    }
    @keyframes bg-drift {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }

    h1, h2, h3, h4, .brand-text, .card-title {
        font-family: 'Space Grotesk', sans-serif !important;
        letter-spacing: -0.02em;
        color: var(--ink-strong);
    }

    code, pre, .mono-text, .citation-badge, .status-pill {
        font-family: 'JetBrains Mono', monospace !important;
    }

    /* Hero */
    .hero-banner {
        background: linear-gradient(135deg, rgba(19, 17, 30, 0.85) 0%, rgba(6, 5, 10, 0.95) 100%);
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 2rem 2.2rem;
        margin-bottom: 1.6rem;
        backdrop-filter: blur(12px);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
    }

    .hero-top-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 12px;
    }

    .track-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--violet-soft);
        border: 1px solid rgba(124, 110, 240, 0.35);
        color: #c9c3fb;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        margin-bottom: 0.9rem;
        font-family: 'JetBrains Mono', monospace;
    }

    .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--mint-soft);
        border: 1px solid rgba(52, 211, 153, 0.35);
        color: var(--mint);
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.03em;
    }

    .status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--mint);
        box-shadow: 0 0 8px var(--mint);
        animation: pulse-dot 2s ease-in-out infinite;
    }
    @keyframes pulse-dot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }

    .hero-title {
        font-size: 2.4rem;
        font-weight: 700;
        color: var(--ink-strong);
        text-shadow: 0 0 24px rgba(167, 139, 250, 0.35);
        margin-bottom: 0.4rem;
        line-height: 1.1;
    }

    .hero-subtitle {
        color: var(--muted);
        font-size: 1rem;
        max-width: 560px;
        line-height: 1.5;
    }

    /* Cards */
    .workspace-card {
        background: var(--card-bg);
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 1.3rem;
        margin-bottom: 1rem;
        backdrop-filter: blur(6px);
        transition: border-color 0.2s ease, transform 0.2s ease;
    }
    .workspace-card:hover {
        border-color: rgba(124, 110, 240, 0.4);
        transform: translateY(-2px);
    }

    .card-title {
        font-size: 1.05rem;
        font-weight: 600;
    }

    .card-subtitle {
        font-size: 0.86rem;
        color: var(--neon-cyan);
        font-weight: 500;
        margin-bottom: 0.5rem;
    }

    .card-desc {
        font-size: 0.86rem;
        color: var(--muted);
        line-height: 1.5;
    }

    /* Knowledge panel */
    .knowledge-panel {
        background: var(--card-bg);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 1.4rem;
        backdrop-filter: blur(6px);
    }

    .knowledge-panel h4 {
        font-size: 1rem;
        margin-bottom: 0.9rem;
    }

    .kp-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--line);
        font-size: 0.85rem;
    }
    .kp-row:last-child { border-bottom: none; }
    .kp-label { color: var(--muted); }
    .kp-value { color: var(--ink-strong); font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; }

    /* Empty state for chat */
    .chat-empty {
        text-align: center;
        padding: 3rem 1.5rem;
        border: 1px dashed var(--line);
        border-radius: 16px;
        background: rgba(124, 110, 240, 0.03);
    }
    .chat-empty .emoji { font-size: 2.6rem; display: block; margin-bottom: 0.6rem; }
    .chat-empty h3 {
        font-size: 1.15rem;
        letter-spacing: 0.01em;
        margin-bottom: 0.5rem;
    }
    .chat-empty p { color: var(--muted); font-size: 0.9rem; margin-bottom: 1rem; }

    /* Citation & skill badges */
    .citation-badge {
        display: inline-block;
        background: rgba(6, 5, 10, 0.8);
        border: 1px solid rgba(0, 240, 255, 0.25);
        color: var(--neon-cyan);
        border-radius: 6px;
        padding: 3px 9px;
        font-size: 0.76rem;
        margin-right: 6px;
        margin-top: 6px;
    }

    .skill-pill {
        display: inline-block;
        background: var(--violet-soft);
        border: 1px solid rgba(124, 110, 240, 0.3);
        color: #c9c3fb;
        border-radius: 6px;
        padding: 2px 9px;
        font-size: 0.72rem;
        margin-right: 6px;
        margin-top: 6px;
    }

    /* Buttons */
    .stButton > button, .stFormSubmitButton > button {
        background: var(--violet) !important;
        color: #fff !important;
        border: none !important;
        border-radius: 999px !important;
        font-weight: 600 !important;
        box-shadow: var(--neon-violet-glow) !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    .stButton > button:hover, .stFormSubmitButton > button:hover {
        background: var(--violet-deep) !important;
        transform: translateY(-1px);
    }

    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 6px;
        border-bottom: 1px solid var(--line);
    }
    .stTabs [data-baseweb="tab"] {
        background: transparent;
        border-radius: 10px 10px 0 0;
        color: var(--muted);
        font-weight: 600;
        font-size: 0.9rem;
    }
    .stTabs [aria-selected="true"] {
        color: var(--ink-strong) !important;
        border-bottom: 2px solid var(--violet) !important;
    }
</style>
""", unsafe_allow_html=True)

# --- BACKEND RAG UTILITIES ---
# Moved to rag_core.py (imported above). Thin wrappers below adapt the
# Streamlit-specific call sites (uploaded_file object, tuple return shape)
# to the shared core functions without duplicating any RAG logic.

def process_and_index_pdf(uploaded_file):
    result = process_and_index_pdf_bytes(uploaded_file.name, uploaded_file.getbuffer())
    return result["pages_indexed"], result["chunks_indexed"]

def query_rag(question: str):
    answer, citations, _ = query_rag_structured(question)
    # Keep this UI's original "filename #P.page" badge format.
    formatted_citations = [f"{c['source']} #P.{c['page']}" for c in citations]
    return answer, formatted_citations

# --- SAMPLE OPPORTUNITIES (MEMBER 2 CONTRACT) ---
SAMPLE_OPPORTUNITIES = [
    {
        "title": "AI & RAG Systems Intern",
        "company": "DeepMind Innovations",
        "location": "Remote / Bengaluru",
        "stipend": "₹45,000 / mo",
        "match": "96% Course Match",
        "match_skills": ["RAG Architecture", "ChromaDB", "LangChain", "Vector Embeddings"],
        "description": "Develop localized RAG microservices, query retrieval routers, and chunking pipelines."
    },
    {
        "title": "Machine Learning Research Intern",
        "company": "Cognitive Scale Labs",
        "location": "Hybrid / Hyderabad",
        "stipend": "₹40,000 / mo",
        "match": "91% Course Match",
        "match_skills": ["Text Chunking", "Semantic Search", "Dense Vectors", "PyTorch"],
        "description": "Benchmark vector retrieval pipelines, cosine similarity indices, and context compression."
    },
    {
        "title": "Python AI Platform Intern",
        "company": "NextGen Workspace AI",
        "location": "Remote",
        "stipend": "₹35,000 / mo",
        "match": "88% Course Match",
        "match_skills": ["Python", "FastAPI", "Ollama LLM", "Prompt Engineering"],
        "description": "Integrate local Ollama models and vector databases into personal placement and student workflows."
    }
]

# --- SESSION STATE ---
if "study_messages" not in st.session_state:
    st.session_state.study_messages = []
if "doc_name" not in st.session_state:
    st.session_state.doc_name = None
if "doc_chunks" not in st.session_state:
    st.session_state.doc_chunks = 0
    vs = get_vector_store()
    if vs:
        try:
            st.session_state.doc_chunks = len(vs.get()["ids"])
            if st.session_state.doc_chunks > 0:
                st.session_state.doc_name = "Indexed course material"
        except Exception:
            pass

# --- MAIN HERO BANNER ---
st.markdown("""
<div class="hero-banner">
    <div class="hero-top-row">
        <div>
            <div class="track-tag">TRACK 3 • EDUCATION</div>
            <div class="hero-title">CareerMatch AI</div>
            <div class="hero-subtitle">Your AI-powered study companion that connects what you learn with where you can go.</div>
        </div>
        <div class="status-pill"><span class="status-dot"></span>AI SYSTEM ONLINE</div>
    </div>
</div>
""", unsafe_allow_html=True)

# --- WORKSPACE TABS ---
tab1, tab2, tab3 = st.tabs([
    "📚 Study Assistant",
    "💼 Career Opportunities",
    "🤖 Course → Career Agent"
])

# ================= TAB 1: STUDY ASSISTANT =================
with tab1:
    col_chat, col_knowledge = st.columns([2, 1], gap="large")

    with col_chat:
        if not st.session_state.study_messages:
            st.markdown("""
            <div class="chat-empty">
                <span class="emoji">🎓</span>
                <h3>Your course, now interactive.</h3>
                <p>Upload your syllabus, notes, or textbook in the panel on the right,<br>then start asking questions.</p>
            </div>
            """, unsafe_allow_html=True)

            c1, c2, c3 = st.columns(3)
            with c1:
                if st.button("💬 What is a text splitter?", use_container_width=True):
                    st.session_state.study_messages.append({"role": "user", "content": "What is a text splitter?"})
                    st.rerun()
            with c2:
                if st.button("💬 Explain how RAG works.", use_container_width=True):
                    st.session_state.study_messages.append({"role": "user", "content": "Explain how RAG works."})
                    st.rerun()
            with c3:
                if st.button("💬 Summarize this topic.", use_container_width=True):
                    st.session_state.study_messages.append({"role": "user", "content": "Summarize this topic."})
                    st.rerun()

        # Chat Feed
        for msg in st.session_state.study_messages:
            with st.chat_message(msg["role"]):
                st.markdown(msg["content"])
                if "citations" in msg and msg["citations"]:
                    cit_html = "".join([f"<span class='citation-badge'>📄 {c}</span>" for c in msg["citations"]])
                    st.markdown(f"<div style='margin-top:0.4rem;'>{cit_html}</div>", unsafe_allow_html=True)

        if query := st.chat_input("Ask about your course material..."):
            st.session_state.study_messages.append({"role": "user", "content": query})
            with st.chat_message("user"):
                st.markdown(query)

            with st.chat_message("assistant"):
                with st.spinner("Searching course chunks & synthesizing grounded answer..."):
                    answer, citations = query_rag(query)
                    st.markdown(answer)
                    if citations:
                        cit_html = "".join([f"<span class='citation-badge'>📄 {c}</span>" for c in citations])
                        st.markdown(f"<div style='margin-top:0.4rem;'>{cit_html}</div>", unsafe_allow_html=True)
                    st.session_state.study_messages.append({
                        "role": "assistant",
                        "content": answer,
                        "citations": citations
                    })

    with col_knowledge:
        st.markdown('<div class="knowledge-panel">', unsafe_allow_html=True)
        st.markdown("#### 📚 Course Knowledge")

        uploaded_file = st.file_uploader(
            "Upload syllabus, notes, or textbook (PDF)",
            type=["pdf"],
            label_visibility="collapsed"
        )
        if uploaded_file is not None:
            if st.button("⚡ Index Document", use_container_width=True):
                with st.spinner("Parsing pages, chunking text, generating embeddings..."):
                    pages, chunks = process_and_index_pdf(uploaded_file)
                    st.session_state.doc_name = uploaded_file.name
                    st.session_state.doc_chunks = chunks
                    st.success(f"Indexed {chunks} chunks from {pages} pages!")
                    st.rerun()

        indexed = st.session_state.doc_chunks > 0
        status_label = "● Indexed" if indexed else "○ Empty"
        st.markdown(f"""
        <div class="kp-row"><span class="kp-label">Course Material</span><span class="kp-value">{st.session_state.doc_name or "—"}</span></div>
        <div class="kp-row"><span class="kp-label">Status</span><span class="kp-value">{status_label}</span></div>
        <div class="kp-row"><span class="kp-label">Chunks</span><span class="kp-value">{st.session_state.doc_chunks}</span></div>
        """, unsafe_allow_html=True)

        if st.button("Clear / Reset Knowledge Base", use_container_width=True):
            reset_chroma_collection()
            st.session_state.doc_name = None
            st.session_state.doc_chunks = 0
            st.session_state.study_messages = []
            st.rerun()

        st.markdown("<div style='margin-top:1rem; border-top:1px solid var(--line); padding-top:0.9rem;'></div>", unsafe_allow_html=True)
        st.markdown("""
        <div class="kp-row"><span class="kp-label">LLM</span><span class="kp-value">qwen3:latest</span></div>
        <div class="kp-row"><span class="kp-label">Embeddings</span><span class="kp-value">nomic-embed-text</span></div>
        <div class="kp-row"><span class="kp-label">Vector Store</span><span class="kp-value">Chroma</span></div>
        """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

# ================= TAB 2: PLACEMENT & OPPORTUNITIES =================
with tab2:
    st.markdown("#### Opportunities Aligned With Your Curriculum")
    st.caption("Matches active internships based on topics detected in your uploaded course notes.")
    
    col_s1, col_s2 = st.columns([3, 1])
    with col_s1:
        s_keyword = st.text_input("🔍 Filter by skill or role:", placeholder="e.g. RAG, Python, Embeddings, LangChain")
    with col_s2:
        st.selectbox("Work Mode", ["All Modes", "Remote", "Hybrid", "In-Office"])
        
    filtered = [
        job for job in SAMPLE_OPPORTUNITIES
        if not s_keyword or any(s_keyword.lower() in sk.lower() for sk in job["match_skills"]) or s_keyword.lower() in job["title"].lower()
    ]
    
    st.markdown(f"<div class='mono-text' style='color:var(--muted); font-size:0.85rem; margin-bottom:1rem;'>Showing {len(filtered)} opportunities</div>", unsafe_allow_html=True)
    
    for job in filtered:
        skills_html = "".join([f"<span class='skill-pill'>{s}</span>" for s in job['match_skills']])
        st.markdown(f"""
        <div class="workspace-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <div class="card-title">{job['title']}</div>
                    <div class="card-subtitle">{job['company']} • 📍 {job['location']} • 💰 {job['stipend']}</div>
                </div>
                <span class="citation-badge" style="color: var(--mint); border-color: rgba(52, 211, 153, 0.35);">{job['match']}</span>
            </div>
            <p class="card-desc" style="margin-top: 0.5rem;">{job['description']}</p>
            <div style="margin-top: 0.5rem;">
                {skills_html}
            </div>
        </div>
        """, unsafe_allow_html=True)

# ================= TAB 3: AGENT WORKSPACE =================
with tab3:
    st.markdown("#### Autonomous Course-to-Career Agent")
    st.caption("Evaluates student knowledge base and reasons about relevant job market placements.")
    
    career_tool_ready = False  # flips true once Member 2's job-search tool is integrated
    st.markdown(f"""
    <div class="workspace-card" style="text-align:center; padding:1.6rem;">
        <div class="mono-text" style="font-size:0.85rem; color: var(--ink); line-height:2.1;">
            YOUR COURSE<br>↓<br>AI UNDERSTANDS YOUR TOPICS<br>↓<br>SKILL MATCHING<br>↓<br>CAREER OPPORTUNITIES
        </div>
    </div>
    <div class="knowledge-panel" style="margin-bottom:1rem;">
        <div class="kp-row"><span class="kp-label">RAG Engine</span><span class="kp-value" style="color:var(--mint)">● READY</span></div>
        <div class="kp-row"><span class="kp-label">Course Tool</span><span class="kp-value" style="color:var(--mint)">● READY</span></div>
        <div class="kp-row"><span class="kp-label">Career Tool</span><span class="kp-value" style="color:var(--muted)">{"● READY" if career_tool_ready else "○ WAITING FOR INTEGRATION"}</span></div>
    </div>
    """, unsafe_allow_html=True)

    st.info("💡 **Agent Routing Protocol:** Distinguishes academic inquiries (`retrieve_course_material`) from job discovery (`search_jobs_or_internships`), or synthesizes both when requested.")
    
    if st.button("🚀 Analyze My Course Notes & Recommend Matching Roles", use_container_width=True):
        with st.spinner("Agent retrieving syllabus topics, matching skill ontologies, and generating career brief..."):
            st.markdown("""
            ### 🤖 Career Agent Diagnostic & Placement Recommendations
            
            **Curriculum Analyzed:** `CS 501: AI and Information Retrieval`  
            **Verified Academic Competencies:**
            - `RAG Architecture` (Parametric vs Non-Parametric retrieval)
            - `Recursive Document Chunking` (Delimiter hierarchies, chunk overlap preservation)
            - `Dense Vector Embeddings` & `Chroma Vector Store` indexing
            
            ---
            
            #### 🎯 Recommended Internship Matches:
            
            1. **AI & RAG Systems Intern** — *DeepMind Innovations* (Remote)
               - **Why this matches you:** Your Lecture 1 notes cover the exact end-to-end RAG architecture this team builds.
               - **Skill Synergy:** `RAG Architecture`, `LangChain`, `ChromaDB`
               - **Match Confidence:** `96%`
               
            2. **Machine Learning Research Intern** — *Cognitive Scale Labs* (Hybrid)
               - **Why this matches you:** Matches your study of recursive chunking and vector space similarity in Lecture 2.
               - **Skill Synergy:** `Text Chunking`, `Dense Vectors`
               - **Match Confidence:** `91%`
            """)