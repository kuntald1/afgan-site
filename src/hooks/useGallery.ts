import { useEffect, useState } from "react";

export type GalleryItem = {
  id: number;
  kind: "photo" | "video";
  image_url: string | null;
  youtube_id: string | null;
  caption: string | null;
  sort_order: number;
};

/**
 * useGallery — fetches gallery photos + YouTube videos from the admin
 * panel's Gallery CRUD (GET /api/gallery), replacing the old static
 * `galleryPhotos` / `galleryPhotoCaptions` (content.ts) and the
 * hardcoded `YOUTUBE_VIDEOS` array that used to live in Gallery2.tsx.
 */
export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/gallery")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data: GalleryItem[]) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const photos = items.filter((i) => i.kind === "photo");
  const videos = items.filter((i) => i.kind === "video");

  return { photos, videos, loading };
}
