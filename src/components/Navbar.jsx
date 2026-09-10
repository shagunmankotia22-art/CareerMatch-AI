import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchPalette from "./SearchPalette";

function Navbar() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="brand" onClick={() => navigate("/")}>
        <div className="brand-mark">✦</div>
        <div className="brand-name">
          CareerMatch
          <span>AI</span>
        </div>
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Product
        </NavLink>
        <NavLink to="/learn" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Learn
        </NavLink>
        <NavLink to="/career" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Career
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          Progress
        </NavLink>
      </div>

      <div className="nav-right">
        <button className="search-button" onClick={() => setSearchOpen(true)} aria-label="Search">
          ⌕
        </button>

        <button className="profile" onClick={() => navigate("/profile")}>
          <div className="avatar">T</div>
          <span>Tanvee</span>
          <span>⌄</span>
        </button>
      </div>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}

export default Navbar;