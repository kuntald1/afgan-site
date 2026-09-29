import { useEffect } from "react";

const SITE_NAME = "Afghanistan Center for Excellence";
const SITE_URL = "https://ace-preview.duckdns.org";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(path: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", `${SITE_URL}${path}`);
}

/**
 * Sets document title, meta description, canonical URL, and Open Graph /
 * Twitter tags for the current page. Call once per page component.
 *
 * This is a client-side-only implementation — since this is a plain Vite
 * SPA with no server-side rendering, tags are set after the JS runs. Modern
 * Googlebot renders JS and picks this up fine, but crawlers that don't
 * execute JavaScript (some social-media link unfurlers, older bots) will
 * only see whatever is in index.html's static <head> — see index.html for
 * the site-wide fallback tags. True per-page tags in the raw HTML would
 * require server-side rendering or static prerendering, which is a bigger
 * architectural change than "basic SEO."
 */
export function useSeo({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta("name", "description", description);
    setCanonical(path);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", `${SITE_URL}${path}`);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
  }, [title, description, path]);
}
