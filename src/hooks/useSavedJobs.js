import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "careermatch_saved_jobs";

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Small shared-state hook backed by localStorage so the Career page
// and the Saved page always agree on what's been saved, even across
// browser tabs (via the native "storage" event).
export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState(readSaved);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setSavedJobs(readSaved());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((jobs) => {
    setSavedJobs(jobs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, []);

  const isSaved = useCallback(
    (id) => savedJobs.some((j) => j.id === id),
    [savedJobs]
  );

  const saveJob = useCallback(
    (job) => {
      if (savedJobs.some((j) => j.id === job.id)) return;
      persist([{ ...job, savedAt: Date.now() }, ...savedJobs]);
    },
    [savedJobs, persist]
  );

  const unsaveJob = useCallback(
    (id) => persist(savedJobs.filter((j) => j.id !== id)),
    [savedJobs, persist]
  );

  const toggleJob = useCallback(
    (job) => {
      if (isSaved(job.id)) unsaveJob(job.id);
      else saveJob(job);
    },
    [isSaved, saveJob, unsaveJob]
  );

  return { savedJobs, isSaved, saveJob, unsaveJob, toggleJob };
}
