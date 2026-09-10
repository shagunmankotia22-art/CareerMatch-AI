import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatCard } from "../context/ChatCardContext";
import { generateAssistantReply } from "../lib/aiAssistant";
import "./AIChatCard.css";

const THINK_DELAY = 650;

function JobMini({ job }) {
  return (
    <div className="chat-job-mini">
      <div className="chat-job-mini-icon">{job.initial}</div>

      <div className="chat-job-mini-info">
        <strong>{job.role}</strong>
        <span>{job.company} · {job.location}</span>
      </div>

      <div className="chat-job-mini-match">{job.match}%</div>
    </div>
  );
}

function SkillBars({ skills }) {
  return (
    <div className="chat-skill-bars">
      {skills.map(([name, value]) => (
        <div className="chat-skill-row" key={name}>
          <div className="chat-skill-label">
            <span>{name}</span>
            <span>{value}%</span>
          </div>

          <div className="chat-skill-track">
            <div style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AssistantBubble({ message, onNavigateCta }) {
  return (
    <div className="chat-bubble chat-bubble-ai">
      <div className="chat-ai-avatar">✦</div>

      <div className="chat-bubble-body">
        <p>{message.text}</p>

        {message.jobs && message.jobs.length > 0 && (
          <div className="chat-jobs-list">
            {message.jobs.map((job) => (
              <JobMini job={job} key={job.id} />
            ))}
          </div>
        )}

        {message.skills && <SkillBars skills={message.skills} />}

        {message.suggestion && (
          <div className="chat-suggestion">
            <span>✦ AI SUGGESTION</span>
            <strong>{message.suggestion.title}</strong>
            <p>{message.suggestion.text}</p>
          </div>
        )}

        {message.source && (
          <div className="chat-source">
            📄 {message.source.file}
            <span>Page {message.source.page}</span>
          </div>
        )}

        {message.cta && (
          <button
            className="chat-cta"
            onClick={() => onNavigateCta(message.cta.to)}
          >
            {message.cta.label} ↗
          </button>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="chat-bubble chat-bubble-ai">
      <div className="chat-ai-avatar">✦</div>
      <div className="chat-bubble-body chat-typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default function AIChatCard() {
  const { isOpen, initialQuery, sessionKey, closeChat } = useChatCard();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState("");

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    setMessages(initialQuery ? [{ role: "user", text: initialQuery }] : []);
    setDraft("");

    if (!initialQuery) return;

    setThinking(true);
    const timer = setTimeout(() => {
      setMessages((prev) => [...prev, generateAssistantReply(initialQuery)]);
      setThinking(false);
    }, THINK_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, sessionKey]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  if (!isOpen) return null;

  const send = () => {
    const text = draft.trim();
    if (!text || thinking) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setDraft("");
    setThinking(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, generateAssistantReply(text)]);
      setThinking(false);
    }, THINK_DELAY);
  };

  const goTo = (to) => {
    closeChat();
    navigate(to);
  };

  return (
    <div className="chat-card-overlay" onClick={closeChat}>
      <div
        className="chat-card"
        role="dialog"
        aria-modal="true"
        aria-label="CareerMatch AI chat"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chat-card-header">
          <div className="chat-card-title">
            <span className="chat-card-icon">✦</span>
            <div>
              <strong>CareerMatch AI</strong>
              <small>
                <span className="chat-card-dot" />
                AI ready
              </small>
            </div>
          </div>

          <button
            className="chat-card-close"
            onClick={closeChat}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        <div className="chat-messages" ref={scrollRef}>
          {messages.length === 0 && !thinking && (
            <div className="chat-empty">
              <div className="chat-empty-icon">✦</div>
              <h3>What are we solving today?</h3>
              <p>Ask about your courses, matching jobs, or your skill gaps.</p>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "user" ? (
              <div className="chat-bubble chat-bubble-user" key={i}>
                {m.text}
              </div>
            ) : (
              <AssistantBubble message={m} onNavigateCta={goTo} key={i} />
            )
          )}

          {thinking && <TypingBubble />}
        </div>

        <div className="chat-card-input">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Ask a follow-up..."
          />

          <button onClick={send} className="chat-send" aria-label="Send">
            ↗
          </button>
        </div>
      </div>
    </div>
  );
}