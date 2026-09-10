import { computeMatches } from "../data/jobs";
import { SKILLS, READINESS, AI_SUGGESTION } from "../data/profile";

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function cleanTopic(query) {
  return (query || "").trim().replace(/[?.!]+$/, "");
}

/* ---------- small talk ---------- */

function isGreeting(t) {
  return /\b(hi|hello|hey|yo|hola|sup)\b/.test(t);
}
function isThanks(t) {
  return /\b(thanks|thank you|thx|appreciate it)\b/.test(t);
}
function isAbout(t) {
  return /\b(what can you do|who are you|help me|what is this)\b/.test(t);
}

function greetingReply() {
  return {
    role: "assistant",
    intent: "greeting",
    text: pick([
      "Hey! I can help you study your course material, find matching jobs, or check your skill gaps. What do you want to tackle first?",
      "Hi there 👋 Ask me something like \"explain normalization\" or \"find me React jobs\".",
      "Hello! I'm ready when you are — course questions, job matches, or skill gaps.",
    ]),
  };
}

function thanksReply() {
  return {
    role: "assistant",
    intent: "thanks",
    text: pick([
      "Anytime! Let me know if you want to dig into anything else.",
      "You're welcome — happy to keep helping.",
      "Glad that helped 🙂",
    ]),
  };
}

function aboutReply() {
  return {
    role: "assistant",
    intent: "about",
    text: "I can answer questions from your uploaded course material, match you to relevant jobs based on your skills, and tell you exactly where your skill gaps are. Try asking about a topic, a job, or your readiness score.",
  };
}

/* ---------- study / course knowledge base ---------- */

const STUDY_KB = [
  {
    keywords: ["normalization", "normal form", "1nf", "2nf", "3nf"],
    text: "Normalization is the process of organizing database tables to reduce redundancy and improve data integrity, carried out in stages called normal forms (1NF, 2NF, 3NF).",
    page: 24,
  },
  {
    keywords: ["primary key", "foreign key", "candidate key"],
    text: "A primary key uniquely identifies each row in a table. A foreign key references a primary key in another table to enforce relationships between them.",
    page: 31,
  },
  {
    keywords: ["join", "inner join", "outer join", "left join", "right join"],
    text: "SQL joins combine rows from two or more tables based on a related column. INNER JOIN returns only matching rows, while LEFT/RIGHT/FULL OUTER JOIN also include unmatched rows from one or both sides.",
    page: 40,
  },
  {
    keywords: ["index", "indexing"],
    text: "An index is a data structure (often a B-tree) that speeds up lookups on a column, at the cost of extra storage and slightly slower writes.",
    page: 55,
  },
  {
    keywords: ["transaction", "acid"],
    text: "A transaction is a sequence of operations treated as a single unit of work. ACID (Atomicity, Consistency, Isolation, Durability) describes the properties that keep transactions reliable.",
    page: 62,
  },
  {
    keywords: ["er diagram", "entity relationship", "er model"],
    text: "An ER diagram models entities and the relationships between them before they're translated into actual database tables.",
    page: 12,
  },
];

function findKnowledge(t) {
  return STUDY_KB.find((entry) => entry.keywords.some((k) => t.includes(k)));
}

const STUDY_FALLBACKS = [
  (topic) => `I don't see "${topic}" directly in your indexed material yet — try rephrasing it, or upload the relevant PDF and I'll cite the exact page.`,
  (topic) => `That one's not in your current notes. Upload the chapter covering "${topic}" and I'll be able to answer precisely.`,
  (topic) => `I couldn't find "${topic}" in what's indexed so far. Want to add more course material so I can pull the exact source next time?`,
];

function studyReply(query) {
  const t = query.toLowerCase();
  const topic = cleanTopic(query) || "that";
  const hit = findKnowledge(t);

  if (hit) {
    return {
      role: "assistant",
      intent: "study",
      text: hit.text,
      source: { file: "DBMS_Syllabus.pdf", page: hit.page },
      cta: { label: "Open full Study workspace", to: "/learn" },
    };
  }

  return {
    role: "assistant",
    intent: "study",
    text: pick(STUDY_FALLBACKS)(topic),
    cta: { label: "Open full Study workspace", to: "/learn" },
  };
}

/* ---------- jobs ---------- */

function jobReply(query) {
  const matches = computeMatches(query).slice(0, 3);

  const intros = [
    `Based on your profile${query.trim() ? ` and "${cleanTopic(query)}"` : ""}, here are your strongest matches:`,
    "Scanning your skills against open roles — these came out on top:",
    "Here's what's currently matching you best:",
  ];

  return {
    role: "assistant",
    intent: "job",
    text: pick(intros),
    jobs: matches,
    cta: { label: "See all matching jobs", to: "/career" },
  };
}

/* ---------- skills ---------- */

function specificSkillReply(t, query) {
  const found = SKILLS.find(([name]) => t.includes(name.toLowerCase()));
  if (!found) return null;

  const [name, value] = found;
  let comment;
  if (value >= 80) comment = `You're strong here — ${name} is one of your best skills.`;
  else if (value >= 65) comment = `You're solid on ${name}, but there's room to sharpen it further.`;
  else comment = `${name} is currently your weakest area — worth prioritizing.`;

  return {
    role: "assistant",
    intent: "skill",
    text: `Your ${name} mastery is at ${value}%. ${comment}`,
    skills: [found],
    cta: { label: "Open full Progress page", to: "/progress" },
  };
}

function skillGapReply() {
  const intros = [
    `Your career readiness is at ${READINESS}%. Here's where you stand, and what closing the gap could unlock:`,
    `Sitting at ${READINESS}% readiness right now — here's the breakdown:`,
    `Here's your current skill snapshot at ${READINESS}% readiness:`,
  ];

  return {
    role: "assistant",
    intent: "skill",
    text: pick(intros),
    skills: SKILLS,
    suggestion: AI_SUGGESTION,
    cta: { label: "Open full Progress page", to: "/progress" },
  };
}

/* ---------- router ---------- */

export function generateAssistantReply(query) {
  const t = (query || "").toLowerCase();

  if (isGreeting(t)) return greetingReply();
  if (isThanks(t)) return thanksReply();
  if (isAbout(t)) return aboutReply();

  const skillHit = specificSkillReply(t, query);
  if (skillHit) return skillHit;

  if (/\b(skill|gap|weak|improve|readiness|what should i learn)\b/.test(t)) {
    return skillGapReply();
  }

  if (/\b(job|intern|career|opportunity|hire|hiring|role|company|apply)\b/.test(t)) {
    return jobReply(query);
  }

  return studyReply(query);
}