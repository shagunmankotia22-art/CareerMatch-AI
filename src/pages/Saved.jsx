import { useNavigate } from "react-router-dom";

import { useSavedJobs } from "../hooks/useSavedJobs";

function Saved() {
  const navigate = useNavigate();
  const { savedJobs, unsaveJob } = useSavedJobs();

  return (
    <section className="saved-page">
      <div className="career-heading">
        <div>
          <span className="eyebrow">YOUR SHORTLIST</span>
          <h2>Saved opportunities.</h2>
          <p className="query-result">
            <strong>{savedJobs.length}</strong> saved
          </p>
        </div>

        <button onClick={() => navigate("/")} className="back">
          ←
        </button>
      </div>

      {savedJobs.length === 0 ? (
        <div className="empty-chat">
          <div className="big-ai">♡</div>
          <h3>Nothing saved yet</h3>
          <p>Save jobs from your Career matches and they'll show up here.</p>
          <button className="upload" onClick={() => navigate("/career")}>
            Browse opportunities
          </button>
        </div>
      ) : (
        <div className="more-jobs-grid">
          {savedJobs.map((job) => (
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
                className="save-btn saved"
                onClick={() => unsaveJob(job.id)}
              >
                ♥ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Saved;
