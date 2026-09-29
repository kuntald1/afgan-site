/**
 * Site-wide background. Previously rendered an animated Three.js "network"
 * of connected dots (see NetworkScene.tsx) behind every page. That pattern
 * kept showing through sections that didn't have their own opaque
 * background — repeatedly asked to be removed — so it's been dropped in
 * favor of a plain, static gradient. NetworkScene.tsx is left on disk
 * unused in case a future design wants it back.
 */
export default function SceneBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 bg-gradient-to-b from-[#F4F2ED] via-[#EDEAE2] to-[#F4F2ED]"
    />
  );
}
