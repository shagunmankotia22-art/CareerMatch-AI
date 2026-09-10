import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {

  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
const [search, setSearch] = useState("");

  return (
    <nav className="navbar">

      {/* LOGO */}

      <div
        className="brand"
        onClick={() => navigate("/")}
      >

        <div className="brand-mark">
          ✦
        </div>

        <div className="brand-name">
          CareerMatch
          <span>AI</span>
        </div>

      </div>


      {/* NAVIGATION */}

      <div className="nav-links">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Product
        </NavLink>

        <NavLink
          to="/learn"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Learn
        </NavLink>

        <NavLink
          to="/career"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Career
        </NavLink>

        <NavLink
          to="/progress"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Progress
        </NavLink>

      </div>


      {/* RIGHT */}

      <div className="nav-right">

        <button
  className="search-button"
  onClick={() => setSearchOpen(true)}
  aria-label="Search"
>
  ⌕
</button>

        <button
          // className="profile"
          // onClick={() => navigate("/profile")}
        >

          <div className="avatar">
            T
          </div>

          <span>Tanvee</span>

          <span>⌄</span>

        </button>

      </div>
{searchOpen && (
  <div
    className="search-overlay"
    onClick={() => setSearchOpen(false)}
  >
    <div
      className="search-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="search-modal-top">
        <span>⌕</span>

        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search CareerMatch..."
        />

        <button onClick={() => setSearchOpen(false)}>
          ESC
        </button>
      </div>

      <div className="search-results">

        {search.toLowerCase().includes("learn") && (
          <button
            onClick={() => {
              setSearchOpen(false);
              navigate("/learn");
            }}
          >
            📚 Go to Learn
          </button>
        )}

        {search.toLowerCase().includes("job") && (
          <button
            onClick={() => {
              setSearchOpen(false);
              navigate("/career");
            }}
          >
            💼 Find Jobs
          </button>
        )}

        {search.toLowerCase().includes("career") && (
          <button
            onClick={() => {
              setSearchOpen(false);
              navigate("/career");
            }}
          >
            ✦ Career opportunities
          </button>
        )}

        {search.toLowerCase().includes("progress") && (
          <button
            onClick={() => {
              setSearchOpen(false);
              navigate("/progress");
            }}
          >
            📈 View Progress
          </button>
        )}

        {!search && (
          <p>Search Learn, Jobs, Career or Progress</p>
        )}

      </div>

    </div>
  </div>
)}
    </nav>
  );
}

export default Navbar;