import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Learn() {

  const location = useLocation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(
    location.state?.query || ""
  );

  const [answered, setAnswered] =
    useState(false);


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

          <div className="pdf-card">

            <div className="pdf-icon">
              PDF
            </div>

            <div>
              <strong>
                DBMS_Syllabus.pdf
              </strong>

              <small>
                12 pages
              </small>
            </div>

          </div>


          <button className="upload">
            + Upload PDF
          </button>

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

              <div className="user-question">
                {question}
              </div>

              <div className="ai-answer">

                <div className="answer-ai">
                  ✦
                </div>

                <div>

                  <p>
                    Normalization is a process
                    of organizing database tables
                    to reduce redundancy and
                    improve data integrity.
                  </p>

                  <div className="source">
                    📄 DBMS_Syllabus.pdf
                    <span>Page 24</span>
                  </div>

                </div>

              </div>

            </div>

          )}


          <div className="chat-input">

            <input
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  setAnswered(true);
                }

              }}
              placeholder="Ask about your course..."
            />

            <button
              onClick={() =>
                setAnswered(true)
              }
            >
              ↗
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Learn;