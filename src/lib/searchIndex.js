import { JOBS } from "../data/jobs";
import { SKILLS } from "../data/profile";

export const PAGES = [
  { title: "Home", subtitle: "Product overview", to: "/", icon: "⌂" },
  { title: "Learn", subtitle: "Study from your course material", to: "/learn", icon: "📚" },
  { title: "Career", subtitle: "Explore matching jobs", to: "/career", icon: "💼" },
  { title: "Progress", subtitle: "Track your readiness & skills", to: "/progress", icon: "📈" },
  { title: "Saved", subtitle: "Your saved jobs", to: "/saved", icon: "🔖" },
  { title: "Profile", subtitle: "Account settings", to: "/profile", icon: "👤" },
];

export function searchSite(query) {
  const q = query.trim().toLowerCase();

  if (!q) {
    return { pages: [], jobs: [], skills: [] };
  }

  const pages = PAGES.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q)
  );

  const jobs = JOBS.filter(
    (j) =>
      j.role.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.tags.some((t) => t.toLowerCase().includes(q))
  ).slice(0, 5);

  const skills = SKILLS.filter(([name]) => name.toLowerCase().includes(q));

  return { pages, jobs, skills };
}