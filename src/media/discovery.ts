/**
 * Shared by every src/media auto-discovery module (heroVideos.ts,
 * galleryVideos.ts, galleryPhotos.ts). Each of those has its own literal
 * `import.meta.glob(...)` call — Vite requires the glob pattern to be a
 * string literal it can statically analyze, so the glob itself can't be
 * parameterized into a shared function. Only the sort-by-leading-number
 * logic is shared here.
 */
export function leadingNumber(path: string): number {
  const filename = path.split("/").pop() ?? "";
  const match = filename.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

export function sortByLeadingNumber(
  modules: Record<string, string>
): string[] {
  return Object.entries(modules)
    .sort(([pathA], [pathB]) => leadingNumber(pathA) - leadingNumber(pathB))
    .map(([, url]) => url);
}
