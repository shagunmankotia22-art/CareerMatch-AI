export const JOBS = [
  {
    id: "j1",
    company: "Vertex Labs",
    role: "Frontend Engineer Intern",
    initial: "V",
    location: "Remote",
    tags: ["React", "SQL"],
    baseMatch: 92,
  },
  {
    id: "j2",
    company: "Northbridge",
    role: "Full-Stack Developer",
    initial: "N",
    location: "Bengaluru",
    tags: ["React", "Java"],
    baseMatch: 87,
  },
  {
    id: "j3",
    company: "Datastream",
    role: "Data Analyst Intern",
    initial: "D",
    location: "Remote",
    tags: ["SQL", "DSA"],
    baseMatch: 81,
  },
  {
    id: "j4",
    company: "Coreloop",
    role: "Backend Engineer",
    initial: "C",
    location: "Hyderabad",
    tags: ["Java", "DSA"],
    baseMatch: 78,
  },
  {
    id: "j5",
    company: "Lumen AI",
    role: "ML Engineer Intern",
    initial: "L",
    location: "Remote",
    tags: ["AI", "DSA"],
    baseMatch: 84,
  },
  {
    id: "j6",
    company: "Pixelforge",
    role: "React Developer",
    initial: "P",
    location: "Pune",
    tags: ["React", "AI"],
    baseMatch: 89,
  },
  {
    id: "j7",
    company: "Gridworks",
    role: "Software Engineer Intern",
    initial: "G",
    location: "Remote",
    tags: ["Java", "SQL"],
    baseMatch: 75,
  },
];

// Very small client-side "matching" model.
// Nudges scores up when the user's query mentions a job's tags,
// and down slightly when it clearly doesn't — enough to feel alive
// without pretending to be a real ML model.
export function computeMatches(query, skillFilter) {
  const q = (query || "").toLowerCase().trim();

  return JOBS.filter((job) => !skillFilter || job.tags.includes(skillFilter))
    .map((job) => {
      let score = job.baseMatch;
      const hit = job.tags.some((t) => q.includes(t.toLowerCase()));

      if (q.length > 2 && hit) score = Math.min(99, score + 6);
      else if (q.length > 2 && !hit) score = Math.max(52, score - 9);

      return { ...job, match: score };
    })
    .sort((a, b) => b.match - a.match);
}
