import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { computeMatches } from "../data/jobs";
import { useSavedJobs } from "../hooks/useSavedJobs";
import Toast from "../components/Toast";

const SKILLS = [
  { key: "React", className: "react" },
  { key: "Java", className: "java" },
  { key: "SQL", className: "sql" },
  { key: "DSA", className: "dsa" },
];

function Career() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSaved, toggleJob } = useSavedJobs();

  const [query] = useState(location.state?.query || "");
  const [skillFilter, setSkillFilter] = useState(null);
  const [toast, setToast] = useState(null);

  const jobs = useMemo(
    () => computeMatches(query, skillFilter),
    [query, skillFilter]
  );

  const topThree = jobs.slice(0, 3);
  const rest = jobs.slice(3);

  const handleSave = (job) => {
    const wasSaved = isSaved(job.id);
    toggleJob(job);
    setToast(
      wasSaved
        ? `Removed ${job.role} from Saved`
        : `Saved ${job.role} at ${job.company}`
    );
  };

  return (
    <section className="career-page">
      <div className="career-heading">
        <div>
          <span className="eyebrow">CAREER INTELLIGENCE</span>
          <h2>Your matched opportunities.</h2>

          {query ? (
            <p className="query-result">
              Matching against <strong>"{query}"</strong>
            </p>
          ) : (
            <p className="query-result">
              Showing <strong>{jobs.length}</strong> opportunities based on
              your profile
            </p>
          )}
        </div>

        <button onClick={() => navigate("/")} className="back">
          ←
        </button>
      </div>

      <div className="career-universe">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />

        {SKILLS.map((s) => (
          <button
            key={s.key}
            onClick={() =>
              setSkillFilter(skillFilter === s.key ? null : s.key)
            }
            className={
              "career-node " +
              s.className +
              (skillFilter === s.key ? " node-selected" : "")
            }
          >
            {s.key}
          </button>
        ))}

        <div className="you">
          <small>YOU</small>
          <strong>{jobs.length}</strong>
          <small>matches</small>
        </div>

        <div className="career-results">
          {topThree.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-company">
                <div className="company-icon">{job.initial}</div>
                <div>
                  <strong>{job.role}</strong>
                  <span>
                    {job.company} · {job.location}
                  </span>
                </div>
              </div>

              <div className="job-match">{job.match}% match</div>

              <div className="job-skills">
                {job.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <button
                className={"save-btn" + (isSaved(job.id) ? " saved" : "")}
                onClick={() => handleSave(job)}
              >
                {isSaved(job.id) ? "♥ Saved" : "♡ Save"}
              </button>
            </div>
          ))}

          {topThree.length === 0 && (
            <div className="job-card">
              <strong>No matches for this filter</strong>
              <p className="query-result">Try clearing the skill filter.</p>
            </div>
          )}
        </div>
      </div>

      {rest.length > 0 && (
        <div className="more-jobs-grid">
          {rest.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-company">
                <div className="company-icon">{job.initial}</div>
                <div>
                  <strong>{job.role}</strong>
                  <span>
                    {job.company} · {job.location}
                  </span>
                </div>
              </div>

              <div className="job-match">{job.match}% match</div>

              <div className="job-skills">
                {job.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <button
                className={"save-btn" + (isSaved(job.id) ? " saved" : "")}
                onClick={() => handleSave(job)}
              >
                {isSaved(job.id) ? "♥ Saved" : "♡ Save"}
              </button>
            </div>
          ))}
        </div>
      )}

      <Toast message={toast} onDone={() => setToast(null)} />
    </section>
  );
}

export default Career;
