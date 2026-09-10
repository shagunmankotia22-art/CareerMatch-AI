import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSavedJobs } from "../hooks/useSavedJobs";

const SKILLS = [
  { name: "React", value: 82 },
  { name: "SQL", value: 68 },
  { name: "DSA", value: 55 },
  { name: "Java", value: 74 },
];

const READINESS_SCORE = 74;

// Counts up from 0 to `target` on mount, so the ring and number
// both animate into place instead of just appearing.
function useCountUp(target, duration = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = null;
    let raf;

    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function Progress() {
  const navigate = useNavigate();
  const { savedJobs } = useSavedJobs();

  const displayScore = useCountUp(READINESS_SCORE);
  const nextSkill = [...SKILLS].sort((a, b) => a.value - b.value)[0];

  return (
    <section className="progress-page">
      <div className="career-heading progress-heading">
        <div>
          <span className="eyebrow">CAREER READINESS</span>
          <h2>Your progress.</h2>
        </div>

        <button onClick={() => navigate("/")} className="back">
          ←
        </button>
      </div>

      <div className="profile-grid">
        <div className="score-card">
          <div
            className="score-ring"
            style={{
              background: `conic-gradient(#7567ed ${
                displayScore * 3.6
              }deg, #ece9ff 0deg)`,
            }}
          >
            <div className="score-ring-inner">
              <strong>{displayScore}%</strong>
              <span>READY</span>
            </div>
          </div>

          <p>You're ahead of 68% of applicants at your stage.</p>
        </div>

        <div className="skills-card">
          <h3>Skill breakdown</h3>

          {SKILLS.map((s) => (
            <div key={s.name} className="progress-skill">
              <div>
                <span>{s.name}</span>
                <span>{s.value}%</span>
              </div>

              <div className="progress-track">
                <div style={{ width: `${s.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="recommendation">
          <span>RECOMMENDED NEXT</span>
          <h3>{nextSkill.name}</h3>
          <p>
            Your {nextSkill.name} score is your biggest gap right now —
            closing it moves your overall readiness the fastest.
          </p>
          <button onClick={() => navigate("/learn")}>
            Start learning →
          </button>
        </div>
      </div>

      <div className="saved-summary">
        <span>
          <span className="eyebrow">SAVED OPPORTUNITIES</span>
          <p>
            You have <strong>{savedJobs.length}</strong>{" "}
            {savedJobs.length === 1 ? "job" : "jobs"} saved.
          </p>
        </span>

        <button className="link-btn" onClick={() => navigate("/saved")}>
          View saved →
        </button>
      </div>
    </section>
  );
}

export default Progress;
