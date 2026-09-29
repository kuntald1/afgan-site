import { useEffect, useState } from "react";

/**
 * useProjects — fetches real project/case-study entries from the admin
 * backend's Projects CRUD (GET /api/projects), same relative same-origin
 * fetch pattern as useDynamicContent and useCareerJobs.
 *
 * Replaces the old static `projectsList` import from content.ts —
 * projects are now added/edited/deleted from the admin panel's Projects
 * tab instead of by editing this codebase.
 */
export type Project = {
  id: number;
  slug: string;
  title: string;
  org: string;
  type: string;
  year: string;
  location: string;
  services: string[];
  practice_areas: string[];
  summary: string;
  body: string[];
  key_highlights: string[];
  image_url: string | null;
  sort_order: number;
  updated_at: string;
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data: Project[]) => {
        if (!cancelled) setProjects(data);
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, loading };
}
