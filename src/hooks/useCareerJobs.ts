import { useEffect, useState } from "react";

export type JobPosting = {
  id: number;
  title: string;
  company: string;
  location: string;
  employment_type: string | null;
  posted_date: string;
  deadline: string | null;
  summary: string;
  responsibilities: string | null;
  qualifications: string | null;
};

/**
 * Fetches the public, deadline-filtered list of open postings from the
 * admin API (same-origin /api/careers — see src/hooks/useDynamicContent.ts
 * for why this is a relative path). Postings past their deadline are
 * already excluded server-side, so nothing here needs to check dates
 * itself.
 *
 * Returns an empty array (not an error) if the admin API isn't reachable —
 * the Career page just shows no listings rather than breaking.
 */
export function useCareerJobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/careers")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: JobPosting[]) => {
        if (mounted) setJobs(data);
      })
      .catch(() => {
        if (mounted) setJobs([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { jobs, loading };
}
