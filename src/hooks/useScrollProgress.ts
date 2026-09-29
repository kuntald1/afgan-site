import { useEffect, useRef, useState } from "react";

/**
 * Tracks page scroll as a 0..1 progress value.
 *
 * Returns both a React state value (for things that should re-render, used
 * sparingly) and a ref (for the 3D loop, which reads it every frame without
 * triggering React renders — important for performance).
 */
export function useScrollProgress() {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressRef.current = Math.min(1, Math.max(0, next));
      frame = 0;
    };

    const onScroll = () => {
      // Throttle state updates to one per animation frame.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        update();
        setProgress(progressRef.current);
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { progress, progressRef };
}
