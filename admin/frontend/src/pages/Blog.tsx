import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Loader2, Upload } from "lucide-react";
import { api, type BlogPost, type BlogPostInput } from "../lib/api";

const EMPTY_FORM: BlogPostInput = {
  title: "",
  excerpt: "",
  date_label: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  category: "",
  key_features: [],
  conclusion: "",
  image_url: null,
  sort_order: 0,
};

function linesToList(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
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

function BlogForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: BlogPostInput;
  onSave: (post: BlogPostInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<BlogPostInput>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof BlogPostInput>(field: K, value: BlogPostInput[K]) =>
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
        <LabeledInput label="Title" value={form.title} onChange={(v) => set("title", v)} />
        <LabeledInput label="Category" value={form.category} onChange={(v) => set("category", v)} placeholder="e.g. Assessment" />
        <LabeledInput label="Date (as displayed)" value={form.date_label} onChange={(v) => set("date_label", v)} placeholder="e.g. 12 Aug 2026" />
        <LabeledInput
          label="URL slug (optional)"
          value={form.slug ?? ""}
          onChange={(v) => set("slug", v)}
          placeholder="auto-generated from title if left blank"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-[13px] font-medium text-gray-700">Cover photo</label>
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
          label="Excerpt (shown on the card + as the pull-quote on the post page)"
          value={form.excerpt}
          onChange={(v) => set("excerpt", v)}
          rows={2}
        />
      </div>

      <div className="mt-4">
        <LabeledTextarea
          label="Key Takeaways"
          value={listToLines(form.key_features)}
          onChange={(v) => set("key_features", linesToList(v))}
          rows={4}
          hint="One bullet per line. Leave empty to hide this section on the post page."
        />
      </div>

      <div className="mt-4">
        <LabeledTextarea
          label="Conclusion"
          value={form.conclusion ?? ""}
          onChange={(v) => set("conclusion", v)}
          rows={3}
          hint="Leave empty to hide this section."
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
          Save Post
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

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setPosts(await api.listPostsAdmin());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (input: BlogPostInput) => {
    if (editingId === "new") {
      await api.createPost(input);
    } else if (typeof editingId === "number") {
      await api.updatePost(editingId, input);
    }
    setEditingId(null);
    await load();
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    await api.deletePost(post.id);
    await load();
  };

  const editingPost = typeof editingId === "number" ? posts.find((p) => p.id === editingId) : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-600">{error}</p>
      )}

      {editingId !== null ? (
        <BlogForm
          initial={
            editingPost
              ? {
                  title: editingPost.title,
                  excerpt: editingPost.excerpt,
                  date_label: editingPost.date_label,
                  category: editingPost.category,
                  key_features: editingPost.key_features,
                  conclusion: editingPost.conclusion,
                  image_url: editingPost.image_url,
                  sort_order: editingPost.sort_order,
                  slug: editingPost.slug,
                }
              : EMPTY_FORM
          }
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-[16px] font-semibold text-[#073B70]">Blog</h1>
            <button
              type="button"
              onClick={() => setEditingId("new")}
              className="flex items-center gap-1.5 rounded-lg bg-[#073B70] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#052c54]"
            >
              <Plus size={14} /> New Post
            </button>
          </div>

          {loading ? (
            <p className="text-[14px] text-gray-500">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-[14px] text-gray-500">
              No posts yet — click "New Post" to publish the first one.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
                >
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
                      {p.category} · {p.date_label}
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
