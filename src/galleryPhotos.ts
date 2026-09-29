import { sortByLeadingNumber } from "./media/discovery";

/**
 * Media Gallery photos, discovered automatically at build time.
 *
 * Drop any number of images (.jpg/.jpeg/.png/.webp) into
 * src/media/gallery-photos/, named with a leading number to control
 * display order — e.g. "1-field-visit.jpg", "2-training-day.jpg". The
 * count is NOT fixed to 8 — add, remove, or renumber files and the grid
 * picks it up on the next build. No code edits needed.
 */
const modules = import.meta.glob<string>(
  "./media/gallery-photos/*.{jpg,jpeg,png,webp}",
  { eager: true, query: "?url", import: "default" }
);

export const galleryPhotos: string[] = sortByLeadingNumber(modules);
