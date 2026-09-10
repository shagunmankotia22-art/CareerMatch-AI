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
              const q = "Explain DBMS normalization";
              setQuery(q);
              navigate("/learn", { state: { query: q } });
            }}
          >
            Explain DBMS
            <span>↗</span>
          </button>


          <button
            onClick={() => {
              const q = "Find internships for React";
              setQuery(q);
              navigate("/career", { state: { query: q } });
            }}
          >
            Find internships
            <span>↗</span>
          </button>


          <button
            onClick={() => navigate("/progress")}
          >
            My career progress
            <span>↗</span>
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