import { useLocation, useNavigate } from "react-router-dom";

const jobs = [
  {
    company: "Microsoft",
    role: "Frontend Developer Intern",
    match: 92,
    skills: ["React", "JavaScript"]
  },
  {
    company: "TCS",
    role: "Software Developer Intern",
    match: 87,
    skills: ["Java", "DSA"]
  },
  {
    company: "Google",
    role: "Software Engineering Intern",
    match: 79,
    skills: ["Python", "DSA"]
  }
];

function Career() {

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section className="career-page">

      <div className="career-heading">

        <div>

          <span className="eyebrow">
            CAREER UNIVERSE
          </span>

          <h2>
            Opportunities connected to you.
          </h2>

          {location.state?.query && (
            <p className="query-result">
              Searching for:
              <strong>
                "{location.state.query}"
              </strong>
            </p>
          )}

        </div>

        <button>
          Filters ↗
        </button>

      </div>


      {/* UNIVERSE */}

      <div className="career-universe">

        <div className="orbit orbit-one">

          <span className="career-node react">
            React
          </span>

          <span className="career-node java">
            Java
          </span>

        </div>


        <div className="orbit orbit-two">

          <span className="career-node sql">
            SQL
          </span>

          <span className="career-node dsa">
            DSA
          </span>

        </div>


        <div className="you">

          <small>
            YOU
          </small>

          <strong>
            74%
          </strong>

        </div>


        {/* JOB CARDS */}

        <div className="career-results">

          {jobs.map((job) => (

            <div
              className="job-card"
              key={job.company}
            >

              <div className="job-company">
                <div className="company-icon">
                  {job.company[0]}
                </div>

                <div>
                  <strong>
                    {job.company}
                  </strong>

                  <span>
                    {job.role}
                  </span>
                </div>
              </div>


              <div className="job-match">
                {job.match}%
              </div>


              <div className="job-skills">

                {job.skills.map((skill) => (
                  <span key={skill}>
                    {skill}
                  </span>
                ))}

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Career;