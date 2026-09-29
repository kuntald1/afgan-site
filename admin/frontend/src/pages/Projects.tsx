import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Loader2, Upload, GripVertical } from "lucide-react";
import { api, type Project, type ProjectInput } from "../lib/api";

const EMPTY_FORM: ProjectInput = {
  title: "",
  org: "",
  type: "",
  year: new Date().getFullYear().toString(),
  location: "",
  services: [],
  practice_areas: [],
  summary: "",
  body: [],
  key_highlights: [],
  image_url: null,
  sort_order: 0,
};

// Multi-line textareas are used for the list-shaped fields (services,
// practice areas, body paragraphs, key highlights) — one entry per line —
// rather than a dynamic add/remove-row UI. Simpler to use and to build;
// blank lines are dropped on save.
function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
function listToLines(list: string[]): string {
  return list.join("\n");
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-[14px] outline-none focus:border-[#073B70]"
      />
    </div>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-[14px] outline-none focus:border-[#073B70]"
      />
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ProjectInput;
  onSave: (project: ProjectInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProjectInput>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ProjectInput>(field: K, value: ProjectInput[K]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const asset = await api.uploadMedia(file);
      set("image_url", asset.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LabeledInput label="Project title" value={form.title} onChange={(v) => set("title", v)} />
        <LabeledInput label="Client / Organization" value={form.org} onChange={(v) => set("org", v)} />
        <LabeledInput label="Type" value={form.type} onChange={(v) => set("type", v)} placeholder="e.g. Regulatory Reform" />
        <LabeledInput label="Year" value={form.year} onChange={(v) => set("year", v)} placeholder="e.g. 2023" />
        <LabeledInput label="Location" value={form.location} onChange={(v) => set("location", v)} />
        <LabeledInput
          label="URL slug (optional)"
          value={form.slug ?? ""}
          onChange={(v) => set("slug", v)}
          placeholder="auto-generated from title if left blank"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-[13px] font-medium text-gray-700">Card photo</label>
        <div className="flex items-center gap-3">
          {form.image_url && (
            <img
              src={api.mediaUrl(form.image_url)}
              alt=""
              className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-[13px] text-gray-600 hover:border-gray-400">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {form.image_url ? "Replace image" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
          </label>
        </div>
      </div>

      <div className="mt-4">
        <LabeledTextarea
          label="Summary (shown on the card + as the pull-quote on the detail page)"
          value={form.summary}
          onChange={(v) => set("summary", v)}
          rows={2}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LabeledTextarea
          label="Services"
          value={listToLines(form.services)}
          onChange={(v) => set("services", linesToList(v))}
          rows={3}
          hint="One per line."
        />
        <LabeledTextarea
          label="Practice Areas"
          value={listToLines(form.practice_areas)}
          onChange={(v) => set("practice_areas", linesToList(v))}
          rows={3}
          hint="One per line."
        />
      </div>

      <div className="mt-4">
        <LabeledTextarea
          label="Body (detail page paragraphs)"
          value={listToLines(form.body)}
          onChange={(v) => set("body", linesToList(v))}
          rows={6}
          hint="One paragraph per line."
        />
      </div>

      <div className="mt-4">
        <LabeledTextarea
          label="Key Highlights"
          value={listToLines(form.key_highlights)}
          onChange={(v) => set("key_highlights", linesToList(v))}
          rows={4}
          hint="One bullet per line. Leave empty to hide this section on the detail page."
        />
      </div>

      <div className="mt-4">
        <LabeledInput
          label="Sort order"
          value={String(form.sort_order)}
          onChange={(v) => set("sort_order", Number(v) || 0)}
          placeholder="Lower numbers show first"
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || uploading}
          className="flex items-center gap-1.5 rounded-lg bg-[#073B70] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#052c54] disabled:opacity-40"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save Project
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-[13px] font-medium text-gray-500 hover:text-[#073B70]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setProjects(await api.listProjectsAdmin());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (input: ProjectInput) => {
    if (editingId === "new") {
      await api.createProject(input);
    } else if (typeof editingId === "number") {
      await api.updateProject(editingId, input);
    }
    setEditingId(null);
    await load();
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    await api.deleteProject(project.id);
    await load();
  };

  const editingProject = typeof editingId === "number" ? projects.find((p) => p.id === editingId) : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-600">{error}</p>
      )}

      {editingId !== null ? (
        <ProjectForm
          initial={
            editingProject
              ? {
                  title: editingProject.title,
                  org: editingProject.org,
                  type: editingProject.type,
                  year: editingProject.year,
                  location: editingProject.location,
                  services: editingProject.services,
                  practice_areas: editingProject.practice_areas,
                  summary: editingProject.summary,
                  body: editingProject.body,
                  key_highlights: editingProject.key_highlights,
                  image_url: editingProject.image_url,
                  sort_order: editingProject.sort_order,
                  slug: editingProject.slug,
                }
              : EMPTY_FORM
          }
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-[16px] font-semibold text-[#073B70]">Projects</h1>
            <button
              type="button"
              onClick={() => setEditingId("new")}
              className="flex items-center gap-1.5 rounded-lg bg-[#073B70] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#052c54]"
            >
              <Plus size={14} /> New Project
            </button>
          </div>

          {loading ? (
            <p className="text-[14px] text-gray-500">Loading…</p>
          ) : projects.length === 0 ? (
            <p className="text-[14px] text-gray-500">
              No projects yet — click "New Project" to add the first one.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
                >
                  <GripVertical size={16} className="flex-shrink-0 text-gray-300" />
                  {p.image_url ? (
                    <img
                      src={api.mediaUrl(p.image_url)}
                      alt=""
                      className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-[#073B70]">{p.title}</p>
                    <p className="truncate text-[12.5px] text-gray-500">
                      {p.org} · {p.type} · {p.year}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingId(p.id)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12.5px] text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12.5px] text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
