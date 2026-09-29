import { useEffect, useState } from "react";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date_label: string;
  category: string;
  key_features: string[];
  conclusion: string | null;
  image_url: string | null;
  sort_order: number;
  updated_at: string;
};

/**
 * useBlogPosts — fetches blog posts from the admin panel's Blog CRUD
 * (GET /api/blog), replacing the old static `blogPosts` array in
 * content.ts.
 */
export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blog")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data: BlogPost[]) => {
        if (!cancelled) setPosts(data);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading };
}
