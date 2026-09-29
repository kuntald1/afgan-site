import { useState } from "react";

/**
 * Several homepage sections reference photo placeholders (see the comments
 * in src/assets.ts) that don't exist yet. Rather than show a broken-image
 * icon until real photography is dropped in, this swaps to a simple
 * branded gradient panel on load failure — same box, same rounded corners,
 * just no photo. Once you add the real file at the path in assets.ts, it
 * appears automatically and this fallback never triggers.
 */
export default function FallbackImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-[linear-gradient(135deg,#16212b_0%,#2a3c4c_45%,#F26522_150%)] ${className}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
