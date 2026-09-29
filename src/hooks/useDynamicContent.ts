import { useEffect, useState } from "react";

/**
 * Fetches content from the admin API at `/api/content` — a relative,
 * same-origin path by default. This assumes the deployment pattern
 * documented in admin/README.md: the admin backend is reverse-proxied
 * under /api/ on the SAME domain as this site (e.g.
 * https://ace-preview.duckdns.org/api/...).
 *
 * Earlier this was gated behind a VITE_ADMIN_API_URL environment variable
 * with an undefined-vs-empty-string distinction to mean "not configured"
 * vs "same origin." That turned out to be fragile in practice — Windows
 * tooling (PowerShell's default UTF-8 BOM, inconsistent env-var handling
 * across shells) made it unreliable to get an intentionally-empty env var
 * to survive the pipeline into the build correctly. Simpler and more
 * robust: just always attempt the relative fetch. If the admin API isn't
 * deployed, the request 404s or fails to connect, gets caught below, and
 * every component silently falls back to its static default — exactly
 * the same safe behavior as before, with one less moving part.
 *
 * To point at a genuinely different origin (admin deployed on a separate
 * domain instead of reverse-proxied under this one), set
 * VITE_ADMIN_API_URL to a full URL, e.g. https://admin-api.example.com —
 * that still works as an override.
 */
const ADMIN_API_URL = (import.meta.env.VITE_ADMIN_API_URL as string | undefined) || "";

let cache: Record<string, string> | null = null;
let inFlight: Promise<Record<string, string>> | null = null;

function fetchContentMap(): Promise<Record<string, string>> {
  if (cache) return Promise.resolve(cache);
  if (inFlight) return inFlight;

  inFlight = fetch(`${ADMIN_API_URL}/api/content`)
    .then((res) => (res.ok ? res.json() : {}))
    .then((data: Record<string, string>) => {
      cache = data;
      return data;
    })
    .catch(() => ({}));

  return inFlight;
}

/**
 * Resolves a value that may be an image path returned by the admin CMS
 * (e.g. "/uploads/abc123.jpg") into a fetchable URL, the same way the admin
 * frontend's own `api.mediaUrl()` does. Absolute URLs (http/https) pass
 * through unchanged; relative paths get ADMIN_API_URL prefixed (empty by
 * default, i.e. same-origin).
 *
 * IMPORTANT DEPLOYMENT NOTE: this assumes the main site's own domain also
 * reverse-proxies /uploads/ to the admin backend container — not just
 * /api/. If images uploaded through the admin don't show up here, that's
 * the first thing to check in your Nginx config.
 */
export function resolveMediaUrl(path: string): string {
  if (!path) return path;
  return path.startsWith("http") ? path : `${ADMIN_API_URL}${path}`;
}

/**
 * Returns the live value for `key` from the admin CMS once it's loaded,
 * or `fallback` immediately (and forever, if the admin API isn't
 * reachable). `key` must match a content_blocks.key seeded or created in
 * admin/backend/app/seed.py.
 */
export function useDynamicContent(key: string, fallback: string): string {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    let mounted = true;
    fetchContentMap().then((map) => {
      if (mounted && map[key]) setValue(map[key]);
    });
    return () => {
      mounted = false;
    };
  }, [key]);

  return value;
}
