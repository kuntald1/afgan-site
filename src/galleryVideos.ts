import { sortByLeadingNumber } from "./media/discovery";

/**
 * Media Gallery videos, discovered automatically at build time — same
 * pattern as src/heroVideos.ts, but a completely separate folder, so the
 * gallery no longer borrows hero footage.
 *
 * Drop any number of .mp4 files into src/media/gallery-videos/, named with
 * a leading number to control display order — e.g. "1-site-visit.mp4",
 * "2-training-day.mp4". The count is NOT fixed: add, remove, or renumber
 * files and the gallery picks it up on the next build. No code edits
 * needed.
 */
const modules = import.meta.glob<string>("./media/gallery-videos/*.mp4", {
  eager: true,
  query: "?url",
  import: "default",
});

export const galleryVideos: string[] = sortByLeadingNumber(modules);
