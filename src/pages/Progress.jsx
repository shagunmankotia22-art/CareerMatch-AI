import { SKILLS as skills, READINESS, AI_SUGGESTION } from "../data/profile";

function Progress() {

  return (
    <section className="progress-page">

      <div className="progress-heading">

        <span className="eyebrow">
          YOUR PROFILE
        </span>

        <h2>
          Your career is evolving.
        </h2>

      </div>


      <div className="profile-grid">

        {/* SCORE */}

        <div className="score-card">

          <div className="score-ring">

            <strong>
              {READINESS}
            </strong>

            <span>
              READY
            </span>

          </div>

          <p>
            Career readiness
          </p>

        </div>


        {/* SKILLS */}

        <div className="skills-card">

          <h3>
            Skills
          </h3>

          {skills.map(([name, value]) => (

            <div
              className="progress-skill"
              key={name}
            >

              <div>

                <span>
                  {name}
                </span>

                <span>
                  {value}%
                </span>

              </div>

              <div className="progress-track">

                <div
                  style={{
                    width: `${value}%`
                  }}
                />

              </div>

            </div>

          ))}

        </div>


        {/* AI RECOMMENDATION */}

        <div className="recommendation">

          <span>
            ✦ AI SUGGESTION
          </span>

          <h3>
            {AI_SUGGESTION.title}
          </h3>

          <p>
            Improving this skill could
            unlock more frontend
            opportunities.
          </p>

          <button>
            Start learning ↗
          </button>

        </div>

      </div>

    </section>
  );
}

export default Progress;