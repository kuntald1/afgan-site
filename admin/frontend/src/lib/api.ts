// The backend API's base URL.
//
// Default is "" (empty string), meaning "same origin, relative path" —
// this matches serving the admin frontend and backend from the same
// domain via Nginx reverse proxy (e.g. https://ace-preview.duckdns.org/
// with /admin/ -> this app and /api/ -> the backend). In that setup, fetch
// calls to `${API_URL}/api/...` resolve to `/api/...` on the same origin,
// which also means the browser never needs CORS headers for these
// requests at all.
//
// For local development against a backend running on a different port,
// set VITE_API_URL=http://localhost:8030 in a .env file.
const API_URL = import.meta.env.VITE_API_URL || "";

export type ContentBlock = {
  id: number;
  key: string;
  page: string;
  section: string;
  label: string;
  type: "text" | "richtext" | "image" | "number";
  value: string | null;
  updated_at: string;
};

export type MediaAsset = {
  id: number;
  filename: string;
  url: string;
  uploaded_at: string;
};

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
  updated_at: string;
  application_count: number;
};

export type JobPostingInput = Omit<JobPosting, "id" | "updated_at" | "application_count">;

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

export type ProjectInput = Omit<Project, "id" | "slug" | "updated_at"> & { slug?: string };

export type GalleryItem = {
  id: number;
  kind: "photo" | "video";
  image_url: string | null;
  youtube_id: string | null;
  caption: string | null;
  sort_order: number;
};
export type GalleryItemInput = Omit<GalleryItem, "id">;

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
export type BlogPostInput = Omit<BlogPost, "id" | "slug" | "updated_at"> & { slug?: string };

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  submitted_at: string;
};

export type JobApplication = {
  id: number;
  job_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  mobile_phone: string;
  gender: string | null;
  experience_years: number | null;
  experience_months: number | null;
  current_salary: string | null;
  expected_salary: string | null;
  available_to_join_days: number | null;
  preferred_location: string | null;
  current_location: string | null;
  current_organization: string | null;
  know_someone_at_ace: string | null;
  date_of_birth: string | null;
  legally_eligible: string | null;
  skills: string | null;
  resume_filename: string;
  resume_url: string;
  submitted_at: string;

  // AI-extracted fields — present only if AI matching is configured and
  // extraction succeeded for this application. See admin/README.md
  // "AI-powered CV matching".
  ai_extraction_status: "done" | "failed" | null;
  extracted_skills: string[] | null;
  extracted_years_experience: number | null;
  extracted_education: string | null;
  extracted_summary: string | null;

  // Only present in smart-search results (0-100 relevance score for the
  // current search) — always null in the plain applications list or
  // keyword search results.
  match_score: number | null;
};

function getToken(): string | null {
  return localStorage.getItem("ace_admin_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json();
}

export const api = {
  async login(username: string, password: string): Promise<string> {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await handle<{ access_token: string }>(res);
    localStorage.setItem("ace_admin_token", data.access_token);
    return data.access_token;
  },

  logout() {
    localStorage.removeItem("ace_admin_token");
  },

  isAuthenticated(): boolean {
    return !!getToken();
  },

  async listContent(): Promise<ContentBlock[]> {
    const res = await fetch(`${API_URL}/api/content/admin`, {
      headers: authHeaders(),
    });
    return handle(res);
  },

  async updateContent(key: string, value: string): Promise<ContentBlock> {
    const res = await fetch(`${API_URL}/api/content/${encodeURIComponent(key)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ value }),
    });
    return handle(res);
  },

  async uploadMedia(file: File): Promise<MediaAsset> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/api/media/upload`, {
      method: "POST",
      headers: authHeaders(),
      body: form,
    });
    return handle(res);
  },

  mediaUrl(path: string): string {
    return path.startsWith("http") ? path : `${API_URL}${path}`;
  },

  async listJobsAdmin(): Promise<JobPosting[]> {
    const res = await fetch(`${API_URL}/api/careers/admin`, { headers: authHeaders() });
    return handle(res);
  },

  async createJob(job: JobPostingInput): Promise<JobPosting> {
    const res = await fetch(`${API_URL}/api/careers/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(job),
    });
    return handle(res);
  },

  async updateJob(id: number, job: JobPostingInput): Promise<JobPosting> {
    const res = await fetch(`${API_URL}/api/careers/admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(job),
    });
    return handle(res);
  },

  async deleteJob(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/api/careers/admin/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await handle(res);
  },

  async listApplications(jobId: number, search?: string): Promise<JobApplication[]> {
    const query = search && search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    const res = await fetch(`${API_URL}/api/careers/${jobId}/applications${query}`, {
      headers: authHeaders(),
    });
    return handle(res);
  },

  async smartSearchApplications(jobId: number, q: string): Promise<JobApplication[]> {
    const res = await fetch(
      `${API_URL}/api/careers/${jobId}/applications/smart-search?q=${encodeURIComponent(q)}`,
      { headers: authHeaders() }
    );
    return handle(res);
  },

  async deleteApplication(jobId: number, applicationId: number): Promise<void> {
    const res = await fetch(
      `${API_URL}/api/careers/${jobId}/applications/${applicationId}`,
      { method: "DELETE", headers: authHeaders() }
    );
    await handle(res);
  },

  async listProjectsAdmin(): Promise<Project[]> {
    const res = await fetch(`${API_URL}/api/projects/admin/all`, { headers: authHeaders() });
    return handle(res);
  },

  async createProject(project: ProjectInput): Promise<Project> {
    const res = await fetch(`${API_URL}/api/projects/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(project),
    });
    return handle(res);
  },

  async updateProject(id: number, project: ProjectInput): Promise<Project> {
    const res = await fetch(`${API_URL}/api/projects/admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(project),
    });
    return handle(res);
  },

  async deleteProject(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/api/projects/admin/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await handle(res);
  },

  async listGallery(): Promise<GalleryItem[]> {
    const res = await fetch(`${API_URL}/api/gallery`, { headers: authHeaders() });
    return handle(res);
  },

  async createGalleryItem(item: GalleryItemInput): Promise<GalleryItem> {
    const res = await fetch(`${API_URL}/api/gallery/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(item),
    });
    return handle(res);
  },

  async updateGalleryItem(id: number, item: GalleryItemInput): Promise<GalleryItem> {
    const res = await fetch(`${API_URL}/api/gallery/admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(item),
    });
    return handle(res);
  },

  async deleteGalleryItem(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/api/gallery/admin/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await handle(res);
  },

  async listPostsAdmin(): Promise<BlogPost[]> {
    const res = await fetch(`${API_URL}/api/blog/admin/all`, { headers: authHeaders() });
    return handle(res);
  },

  async createPost(post: BlogPostInput): Promise<BlogPost> {
    const res = await fetch(`${API_URL}/api/blog/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(post),
    });
    return handle(res);
  },

  async updatePost(id: number, post: BlogPostInput): Promise<BlogPost> {
    const res = await fetch(`${API_URL}/api/blog/admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(post),
    });
    return handle(res);
  },

  async deletePost(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/api/blog/admin/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await handle(res);
  },

  async listMessages(): Promise<ContactMessage[]> {
    const res = await fetch(`${API_URL}/api/contact/admin`, { headers: authHeaders() });
    return handle(res);
  },

  async deleteMessage(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/api/contact/admin/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    await handle(res);
  },
};
