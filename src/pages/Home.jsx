import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const handleAI = () => {

    if (!query.trim()) return;

    const text = query.toLowerCase();

    if (
      text.includes("job") ||
      text.includes("intern") ||
      text.includes("career") ||
      text.includes("opportunity")
    ) {

      navigate("/career", {
        state: {
          query: query
        }
      });

    } else {

      navigate("/learn", {
        state: {
          query: query
        }
      });

    }

  };


  return (
    <section className="home">

      <div className="hero">

        <div className="hero-pill">
          <span />
          Your AI career companion
        </div>


        <h1>
          Learn.
          <span> Match.</span>
          <br />
          Grow.
        </h1>


        <p>
          One intelligent workspace for your
          learning and career journey.
        </p>


        {/* AI INPUT */}

        <div className="ai-box">

          <div className="ai-icon">
            ✦
          </div>

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                handleAI();
              }

            }}
            placeholder="What are we solving today?"
          />

          <button
            onClick={handleAI}
            className="send-button"
          >
            ↗
          </button>

        </div>


        {/* QUICK ACTIONS */}

        <div className="quick-actions">

  <button
    onClick={() => {
      setQuery("Explain this from my course material");
      navigate("/learn");
    }}
  >
    <span className="quick-icon">✦</span>

    <span>
      <strong>Study from my course</strong>
      <small>Ask questions from your PDFs</small>
    </span>

    <span className="quick-arrow">↗</span>
  </button>


  <button
    onClick={() => {
      setQuery("Find jobs matching my skills");
      navigate("/progress");
    }}
  >
    <span className="quick-icon">⌁</span>

    <span>
      <strong>Find matching jobs</strong>
      <small>Discover opportunities for you</small>
    </span>

    <span className="quick-arrow">↗</span>
  </button>


  <button
    onClick={() => navigate("/progress")}
  >
    <span className="quick-icon">◌</span>

    <span>
      <strong>See my skill gap</strong>
      <small>Know what to learn next</small>
    </span>

    <span className="quick-arrow">↗</span>
  </button>

</div>

      </div>


      {/* AI STATUS */}

<div className="ai-status">

  <div className="status-left">
    <span className="status-dot"></span>

    <span className="status-text">
      AI ready
    </span>
  </div>

  <span className="status-divider">·</span>

  <span className="status-info">
    Career readiness <strong>74%</strong>
  </span>

</div>

    </section>
  );
}

export default Home;