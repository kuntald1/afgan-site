/**
 * Plain-language descriptions of every editable page & section, so the
 * admin panel can explain WHERE each piece of text/photo appears on the
 * live website. This is display-only metadata — it never touches the
 * database. Unknown pages/sections (e.g. ones added later) still work;
 * they just fall back to a prettified name with no description.
 */

export type PageKey =
  | "home"
  | "about"
  | "services"
  | "projects"
  | "gallery"
  | "blog"
  | "career"
  | "contact";

// The order the client asked for: Home, About, Services, Projects, Gallery,
// Blog, Career, Contact.
export const PAGE_ORDER: PageKey[] = [
  "home",
  "about",
  "services",
  "projects",
  "gallery",
  "blog",
  "career",
  "contact",
];

export type PageMeta = {
  label: string;
  url: string; // path on the public website
  description: string;
};

export const PAGE_META: Record<PageKey, PageMeta> = {
  home: {
    label: "Home",
    url: "/home-02",
    description:
      "The first page visitors see. The sections below are listed from top to bottom, in the same order they appear on the website.",
  },
  about: {
    label: "About",
    url: "/home-02/about",
    description: "Who ACE is: introduction, company overview, impact numbers and the three pillars.",
  },
  services: {
    label: "Services",
    url: "/home-02/services",
    description:
      "The four service pillars (Assess, Transform, Empower, Comply) and the skills section.",
  },
  projects: {
    label: "Projects",
    url: "/home-02/projects",
    description:
      "Only the page banner is edited here. The individual projects are managed in the Projects menu.",
  },
  gallery: {
    label: "Gallery",
    url: "/home-02/gallery",
    description:
      "Only the page banner and tab names are edited here. Photos and videos are managed in the Gallery menu.",
  },
  blog: {
    label: "Blog",
    url: "/home-02/blog",
    description: "Only the page banner is edited here. Articles are managed in the Blog menu.",
  },
  career: {
    label: "Career",
    url: "/home-02/career",
    description: "Text on the Career page. The actual job openings are managed in the Careers menu.",
  },
  contact: {
    label: "Contact",
    url: "/home-02/contact",
    description:
      "The page banner, the enquiry-form area, and the phone / email / address shown to visitors.",
  },
};

export type SectionMeta = { title: string; description: string };

export const SECTION_META: Record<string, Record<string, SectionMeta>> = {
  home: {
    hero: {
      title: "Top banner",
      description:
        "The large photo banner at the very top: the welcome headline, the four sliding background photos and the “UN & Government Partner” badge.",
    },
    about: {
      title: "About ACE",
      description:
        "The introduction block under the banner: heading, short paragraph, three checklist points, the “years of experience” badge and a photo.",
    },
    services: {
      title: "Services introduction",
      description:
        "Heading and short text above the three service cards. The cards themselves come from the Services page (Assess / Transform / Empower).",
    },
    whychoose: {
      title: "Why choose ACE",
      description: "Four key strengths shown around a portrait photo.",
    },
    projects: {
      title: "Projects showcase",
      description:
        "Heading above the auto-scrolling project cards. The projects themselves are managed in the Projects menu.",
    },
    wherewework: {
      title: "Where we work",
      description: "Heading and text beside the map of Afghanistan and our five offices.",
    },
    team: {
      title: "Meet the team",
      description: "Heading above the scrolling row of team members.",
    },
    testimonials: {
      title: "Client feedback",
      description: "Heading and circular photo next to the rotating client quotes.",
    },
    blog: {
      title: "Latest from the blog",
      description:
        "Heading and button above the three newest blog posts. The posts themselves are managed in the Blog menu.",
    },
  },
  about: {
    hero: {
      title: "Main introduction",
      description:
        "The first block of the About page: heading, paragraph, two badges, checklist, button and two photos.",
    },
    overview: {
      title: "Company overview",
      description: "The overview paragraph, and the line listing our office cities under the numbers.",
    },
    stats: {
      title: "Impact numbers",
      description:
        "The four big figures (people supported, people employed, and so on). They appear on BOTH the Home page and the About page — change them once and both update.",
    },
    pillars: {
      title: "Our three pillars",
      description: "Three highlighted pillars, each with a title and a short description.",
    },
  },
  services: {
    hero: {
      title: "Page banner",
      description:
        "The banner at the top of the Services page: title, breadcrumb path and background photo.",
    },
    intro: {
      title: "Services heading",
      description: "The small label and heading above the Assess / Transform / Empower / Comply tabs.",
    },
    assess: {
      title: "Assess",
      description:
        "Everything shown when a visitor opens the “Assess” tab: two paragraphs, a photo and four detail cards. The title, first paragraph and photo also appear on the Home page service card.",
    },
    transform: {
      title: "Transform",
      description:
        "Everything shown in the “Transform” tab: two paragraphs, a photo and three detail cards. The title, first paragraph and photo also appear on the Home page service card.",
    },
    empower: {
      title: "Empower",
      description:
        "Everything shown in the “Empower” tab: two paragraphs, a photo and four detail cards. The title, first paragraph and photo also appear on the Home page service card.",
    },
    comply: {
      title: "Comply",
      description: "Everything shown in the “Comply” tab: two paragraphs, a photo and four detail cards.",
    },
    skills: {
      title: "Skills & expertise",
      description: "Heading, paragraph, two skill bars (label + percentage) and a photo.",
    },
  },
  projects: {
    hero: {
      title: "Page banner",
      description:
        "Title, breadcrumb path and background photo at the top of the Projects page. The projects themselves are managed in the Projects menu.",
    },
  },
  gallery: {
    hero: {
      title: "Page banner & tab names",
      description:
        "Title, breadcrumb path and background photo, plus the names of the “Video” and “Photos” labels. Photos and videos are managed in the Gallery menu.",
    },
  },
  blog: {
    hero: {
      title: "Page banner",
      description:
        "Title, breadcrumb path and background photo at the top of the Blog page. The articles themselves are managed in the Blog menu.",
    },
  },
  career: {
    hero: {
      title: "Page banner",
      description: "Title and breadcrumb path at the top of the Career page.",
    },
    intro: {
      title: "Introduction",
      description: "Small label, heading, paragraph and photo introducing careers at ACE.",
    },
    values: {
      title: "Why work with us",
      description: "Three highlight cards (title + short text) under the introduction.",
    },
    openings: {
      title: "Job openings heading",
      description:
        "Heading above the open positions and the “Don't see a fit?” box. The job postings themselves are managed in the Careers menu.",
    },
  },
  contact: {
    hero: {
      title: "Page banner",
      description: "Title, breadcrumb path and background photo at the top of the Contact page.",
    },
    form: {
      title: "Enquiry form area",
      description:
        "Small label, heading and photo beside the enquiry form. Messages sent through the form arrive in the Messages menu.",
    },
    info: {
      title: "Contact details",
      description:
        "The three cards shown to visitors: phone number, email address and office location.",
    },
  },
};

/**
 * Top-to-bottom order of sections as they appear on each public page.
 * A plain string is an editable section key. An object is a "ghost" slot:
 * something that appears on the page but is edited elsewhere in the admin
 * (shown greyed-out in the page layout strip, with a link to where to edit it).
 */
export type GhostSlot = { ghost: string; note: string; to: string };
export type LayoutSlot = string | GhostSlot;

export const PAGE_LAYOUT: Record<string, LayoutSlot[]> = {
  home: [
    "hero",
    "about",
    "services",
    { ghost: "Impact numbers", note: "Edit under About → Impact numbers", to: "/content?page=about" },
    "whychoose",
    "projects",
    "wherewework",
    "team",
    "testimonials",
    "blog",
  ],
  about: ["hero", "overview", "stats", "pillars"],
  services: ["hero", "intro", "assess", "transform", "empower", "comply", "skills"],
  projects: ["hero", { ghost: "Project cards", note: "Managed in the Projects menu", to: "/projects" }],
  gallery: ["hero", { ghost: "Photos & videos", note: "Managed in the Gallery menu", to: "/gallery" }],
  blog: ["hero", { ghost: "Blog posts", note: "Managed in the Blog menu", to: "/blog" }],
  career: [
    "hero",
    "intro",
    "values",
    "openings",
    { ghost: "Job listings", note: "Managed in the Careers menu", to: "/careers" },
  ],
  contact: ["hero", "form", "info"],
};

export function pageKeyOf(page: string): string {
  return page.trim().toLowerCase();
}

function titleCase(s: string): string {
  return s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function pageLabel(page: string): string {
  const k = pageKeyOf(page) as PageKey;
  return PAGE_META[k]?.label ?? titleCase(page);
}

export function sectionTitle(page: string, section: string): string {
  return SECTION_META[pageKeyOf(page)]?.[section]?.title ?? titleCase(section);
}

export function sectionDescription(page: string, section: string): string | null {
  return SECTION_META[pageKeyOf(page)]?.[section]?.description ?? null;
}

/**
 * Turns the raw database label into something a non-technical person can
 * read. The section card already says which page/section this is, so the
 * repeated "Home2 about — " prefix is dropped and jargon is translated.
 *
 *   "Home2 about — eyebrow label"   -> "Small label above the heading"
 *   "Services hero — breadcrumb"    -> "Breadcrumb (path shown under the title)"
 *   "Impact stat 2 — number (...)"  -> kept in full (the "2" matters)
 *   "Home2 about — body paragraph"  -> "Body paragraph"
 */
export function cleanLabel(raw: string): string {
  const label = raw.replace(/\bHome2\b/gi, "Home");
  const parts = label.split(" — ");
  if (parts.length < 2) return label;
  const prefix = parts[0];
  const rest = parts.slice(1).join(" — ").replace(/\s*\(placeholder[^)]*\)/i, "");
  if (/\d/.test(prefix)) return label; // e.g. "Impact stat 2 — number"
  const lower = rest.trim().toLowerCase();
  if (lower === "eyebrow label") return "Small label above the heading";
  if (lower === "breadcrumb") return "Breadcrumb (path shown under the title)";
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}
