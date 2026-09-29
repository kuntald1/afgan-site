import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Loader2, Upload, Image as ImageIcon, Play } from "lucide-react";
import { api, type GalleryItem, type GalleryItemInput } from "../lib/api";

/**
 * Accepts whatever the user pastes — a full watch/share/shorts/embed URL,
 * a URL with extra params (?si=..., &t=8s, &list=...), or the bare 11-char
 * ID itself — and returns just the 11-char video ID. Falls back to
 * returning the trimmed input unchanged if nothing recognizable is found,
 * so a bad paste doesn't silently produce an empty field.
 */
function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  // Bare ID already, or something else — strip a leading "v=" if present,
  // then cut at the first "&" or "?" in case of a stray query string.
  return trimmed.replace(/^v=/, "").split(/[&?]/)[0];
}

const EMPTY_FORM: GalleryItemInput = {
  kind: "photo",
  image_url: null,
  youtube_id: null,
  caption: "",
  sort_order: 0,
};

function GalleryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: GalleryItemInput;
  onSave: (item: GalleryItemInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<GalleryItemInput>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof GalleryItemInput>(field: K, value: GalleryItemInput[K]) =>
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

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => set("kind", "photo")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
            form.kind === "photo" ? "bg-[#073B70] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <ImageIcon size={14} /> Photo
        </button>
        <button
          type="button"
          onClick={() => set("kind", "video")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
            form.kind === "video" ? "bg-[#073B70] text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <Play size={14} /> YouTube video
        </button>
      </div>

      {form.kind === "photo" ? (
        <div>
          <label className="mb-1 block text-[13px] font-medium text-gray-700">Photo</label>
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
          <div className="mt-4">
            <label className="mb-1 block text-[13px] font-medium text-gray-700">Caption</label>
            <input
              type="text"
              value={form.caption ?? ""}
              onChange={(e) => set("caption", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-[14px] outline-none focus:border-[#073B70]"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="mb-1 block text-[13px] font-medium text-gray-700">YouTube video link or ID</label>
          <input
            type="text"
            value={form.youtube_id ?? ""}
            onChange={(e) => set("youtube_id", extractYoutubeId(e.target.value))}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text");
              if (pasted) {
                e.preventDefault();
                set("youtube_id", extractYoutubeId(pasted));
              }
            }}
            placeholder="Paste any YouTube link (share, watch, or shorts) — the video ID is pulled out automatically"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-[14px] outline-none focus:border-[#073B70]"
          />
          {form.youtube_id && (
            <p className="mt-1 text-[11px] text-gray-400">Saved as ID: {form.youtube_id}</p>
          )}
        </div>
      )}

      <div className="mt-4">
        <label className="mb-1 block text-[13px] font-medium text-gray-700">Sort order</label>
        <input
          type="text"
          value={String(form.sort_order)}
          onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
          placeholder="Lower numbers show first"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-[14px] outline-none focus:border-[#073B70]"
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
          Save
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

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.listGallery());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (input: GalleryItemInput) => {
    if (editingId === "new") {
      await api.createGalleryItem(input);
    } else if (typeof editingId === "number") {
      await api.updateGalleryItem(editingId, input);
    }
    setEditingId(null);
    await load();
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Delete this gallery item?")) return;
    await api.deleteGalleryItem(item.id);
    await load();
  };

  const editingItem = typeof editingId === "number" ? items.find((i) => i.id === editingId) : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-600">{error}</p>
      )}

      {editingId !== null ? (
        <GalleryForm
          initial={
            editingItem
              ? {
                  kind: editingItem.kind,
                  image_url: editingItem.image_url,
                  youtube_id: editingItem.youtube_id,
                  caption: editingItem.caption,
                  sort_order: editingItem.sort_order,
                }
              : EMPTY_FORM
          }
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-[16px] font-semibold text-[#073B70]">Gallery</h1>
            <button
              type="button"
              onClick={() => setEditingId("new")}
              className="flex items-center gap-1.5 rounded-lg bg-[#073B70] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#052c54]"
            >
              <Plus size={14} /> New Item
            </button>
          </div>

          {loading ? (
            <p className="text-[14px] text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-[14px] text-gray-500">
              No gallery items yet — click "New Item" to add a photo or video.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
                >
                  {item.kind === "photo" && item.image_url ? (
                    <img
                      src={api.mediaUrl(item.image_url)}
                      alt=""
                      className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <Play size={16} className="text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-[#073B70]">
                      {item.kind === "photo" ? item.caption || "(no caption)" : `YouTube: ${item.youtube_id}`}
                    </p>
                    <p className="text-[12.5px] text-gray-500 capitalize">{item.kind}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingId(item.id)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12.5px] text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
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
