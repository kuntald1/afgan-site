import { useEffect, useRef, useState } from "react";

export default function HeroVideoPlaylist({
  sources,
  className,
}: {
  sources: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Whenever the active clip changes, load and play the new source.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {
      // Autoplay can be blocked before the first user interaction on some
      // browsers — the video will start on the next interaction instead.
    });
  }, [index]);

  const handleEnded = () => {
    setIndex((i) => (i + 1) % sources.length);
  };

  if (sources.length === 0) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      onEnded={handleEnded}
      className={className}
    >
      <source src={sources[index]} type="video/mp4" />
    </video>
  );
}
