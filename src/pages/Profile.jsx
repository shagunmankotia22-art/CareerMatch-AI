import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const storedUser =
    JSON.parse(
      localStorage.getItem("careermatch-user")
    ) || {
      name: "Tanvee",
      email: "student@careermatch.ai",
    };

  const handleLogout = () => {
    localStorage.removeItem("careermatch-auth");
    localStorage.removeItem("careermatch-user");

    navigate("/auth");
  };

  return (
    <div className="profile-page">

      <button
        className="profile-back"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>


      <div className="profile-card">

        <div className="profile-avatar-large">
          {storedUser.name
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div className="profile-info">

          <span className="profile-label">
            CAREERMATCH AI
          </span>

          <h1>{storedUser.name}</h1>

          <p>{storedUser.email}</p>

        </div>


        <div className="profile-divider"></div>


        <div className="profile-stats">

          <div>
            <strong>74%</strong>
            <span>Career readiness</span>
          </div>

          <div>
            <strong>12</strong>
            <span>Skills tracked</span>
          </div>

          <div>
            <strong>8</strong>
            <span>Opportunities</span>
          </div>

        </div>


        <div className="profile-actions">

          <button
            onClick={() =>
              navigate("/progress")
            }
          >
            <span>View progress</span>
            <span>↗</span>
          </button>

          <button
            onClick={() =>
              navigate("/saved")
            }
          >
            <span>Saved opportunities</span>
            <span>↗</span>
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>Log out</span>
            <span>↗</span>
          </button>

        </div>

      </div>

    </div>
  );
}