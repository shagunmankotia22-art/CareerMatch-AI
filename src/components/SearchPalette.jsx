import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchSite } from "../lib/searchIndex";
import "./SearchPalette.css";

const SUGGESTIONS = ["React jobs", "SQL", "DSA", "Progress", "Remote"];

export default function SearchPalette({ open, onClose }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => searchSite(query), [query]);

  const flat = useMemo(() => {
    const items = [];
    results.pages.forEach((p) => items.push({ kind: "page", ...p }));
    results.jobs.forEach((j) => items.push({ kind: "job", ...j }));
    results.skills.forEach(([name, value]) => items.push({ kind: "skill", name, value }));
    return items;
  }, [results]);

  useEffect(() => setActiveIndex(0), [query]);

  const select = (item) => {
    if (!item) return;
    onClose();

    if (item.kind === "page") navigate(item.to);
    if (item.kind === "job") navigate("/career", { state: { query: item.role } });
    if (item.kind === "skill") navigate("/progress");
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      select(flat[activeIndex]);
    }
  };

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-top">
          <span>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search jobs, skills, pages..."
          />
          <button onClick={onClose}>ESC</button>
        </div>

        {!query && (
          <div className="palette-suggestions">
            <span>Try</span>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => setQuery(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="palette-results">
          {results.pages.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-title">Pages</span>
              {results.pages.map((p) => {
                runningIndex++;
                const idx = runningIndex;
                return (
                  <button
                    key={p.to}
                    className={idx === activeIndex ? "palette-item active" : "palette-item"}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => select({ kind: "page", ...p })}
                  >
                    <span className="palette-item-icon">{p.icon}</span>
                    <span className="palette-item-body">
                      <strong>{p.title}</strong>
                      <small>{p.subtitle}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {results.jobs.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-title">Jobs</span>
              {results.jobs.map((j) => {
                runningIndex++;
                const idx = runningIndex;
                return (
                  <button
                    key={j.id}
                    className={idx === activeIndex ? "palette-item active" : "palette-item"}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => select({ kind: "job", ...j })}
                  >
                    <span className="palette-item-icon palette-icon-dark">{j.initial}</span>
                    <span className="palette-item-body">
                      <strong>{j.role}</strong>
                      <small>{j.company} · {j.location}</small>
                    </span>
                    <span className="palette-item-match">{j.baseMatch}%</span>
                  </button>
                );
              })}
            </div>
          )}

          {results.skills.length > 0 && (
            <div className="palette-group">
              <span className="palette-group-title">Skills</span>
              {results.skills.map(([name, value]) => {
                runningIndex++;
                const idx = runningIndex;
                return (
                  <button
                    key={name}
                    className={idx === activeIndex ? "palette-item active" : "palette-item"}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => select({ kind: "skill", name, value })}
                  >
                    <span className="palette-item-icon">◌</span>
                    <span className="palette-item-body">
                      <strong>{name}</strong>
                      <small>{value}% mastery</small>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {query && flat.length === 0 && (
            <p className="palette-empty">
              No matches for "{query}". Try a job title, skill, or page name.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}