import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

// Backend base URL. Override with VITE_API_URL in a .env file if the
// FastAPI server isn't running on the default localhost:8000.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Learn() {

  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [question, setQuestion] = useState(
    location.state?.query || ""
  );

  const [turns, setTurns] = useState([]); // [{ question, answer, citations }]
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState("");

  const [material, setMaterial] = useState(null); // { filename, pages }
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const answered = turns.length > 0;

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Only PDF files are supported.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/api/study/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Upload failed (${res.status})`);
      }

      const data = await res.json();
      setMaterial({ filename: data.filename, pages: data.pages });
    } catch (err) {
      setUploadError(
        err.message === "Failed to fetch"
          ? "Can't reach the backend. Is the FastAPI server running?"
          : err.message
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleAsk() {
    const q = question.trim();
    if (!q || asking) return;

    setAsking(true);
    setAskError("");

    try {
      const res = await fetch(`${API_BASE}/api/study/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setTurns((prev) => [
        ...prev,
        {
          question: q,
          answer: data.answer,
          citations: data.citations,
          hasKnowledgeBase: data.has_knowledge_base,
        },
      ]);
      setQuestion("");
    } catch (err) {
      setAskError(
        err.message === "Failed to fetch"
          ? "Can't reach the backend. Is the FastAPI server running?"
          : err.message
      );
    } finally {
      setAsking(false);
    }
  }

  return (
    <section className="workspace">

      <div className="workspace-top">

        <button
          onClick={() => navigate("/")}
          className="back"
        >
          ←
        </button>

        <div>

          <span className="eyebrow">
            COURSE INTELLIGENCE
          </span>

          <h2>
            Ask your material anything.
          </h2>

        </div>

      </div>


      <div className="learning-layout">

        {/* MATERIAL */}

        <aside className="material-panel">

          <span>
            YOUR MATERIAL
          </span>

          {material ? (
            <div className="pdf-card">

              <div className="pdf-icon">
                PDF
              </div>

              <div>
                <strong>
                  {material.filename}
                </strong>

                <small>
                  {material.pages} page{material.pages === 1 ? "" : "s"}
                </small>
              </div>

            </div>
          ) : (
            <div className="pdf-card pdf-card-empty">
              <small>No material uploaded yet.</small>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <button
            className="upload"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "+ Upload PDF"}
          </button>

          {uploadError && (
            <div className="learn-error">{uploadError}</div>
          )}

        </aside>


        {/* CHAT */}

        <div className="chat-panel">

          {!answered ? (

            <div className="empty-chat">

              <div className="big-ai">
                ✦
              </div>

              <h3>
                What do you want to understand?
              </h3>

              <p>
                Ask a question from your
                uploaded course material.
              </p>

            </div>

          ) : (

            <div className="answer">

              {turns.map((turn, i) => (
                <div key={i}>
                  <div className="user-question">
                    {turn.question}
                  </div>

                  <div className="ai-answer">

                    <div className="answer-ai">
                      ✦
                    </div>

                    <div>

                      <p>
                        {turn.answer}
                      </p>

                      {turn.citations?.map((c, j) => (
                        <div className="source" key={j}>
                          📄 {c.source}
                          <span>Page {c.page}</span>
                        </div>
                      ))}

                      {!turn.hasKnowledgeBase && (
                        <div className="learn-error">
                          No course material is indexed yet — upload a PDF for grounded answers.
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              ))}

            </div>

          )}

          {askError && (
            <div className="learn-error">{askError}</div>
          )}

          <div className="chat-input">

            <input
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  handleAsk();
                }

              }}
              placeholder="Ask about your course..."
              disabled={asking}
            />

            <button
              onClick={handleAsk}
              disabled={asking || !question.trim()}
            >
              {asking ? "…" : "↗"}
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Learn;