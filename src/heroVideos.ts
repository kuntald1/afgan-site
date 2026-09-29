import { sortByLeadingNumber } from "./media/discovery";

/**
 * Hero background videos, discovered automatically at build time.
 *
 * Drop any number of .mp4 files into src/media/hero-videos/, named with a
 * leading number to control play order — e.g. "1-field.mp4",
 * "2-training.mp4", "12-closing-shot.mp4". The count is NOT fixed: add,
 * remove, or renumber files and the playlist picks it up automatically the
 * next time the app builds (or on hot-reload in dev). No code edits needed.
 *
 * Why this lives under src/ and not public/: Vite's `import.meta.glob` can
 * only enumerate files that are part of the app's module graph. Files in
 * public/ are copied verbatim with no build-time listing available, so
 * there's no way to ask "what files exist in public/assets/videos" from
 * code. Moving the videos under src/ makes that enumeration possible.
 */
const modules = import.meta.glob<string>("./media/hero-videos/*.mp4", {
  eager: true,
  query: "?url",
  import: "default",
});

export const heroVideos: string[] = sortByLeadingNumber(modules);
