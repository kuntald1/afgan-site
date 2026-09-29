import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Renders a stat string like "2,973", "17,533", "~50", "200+", "30%" and
 * animates the numeric part counting up when it scrolls into view — a plain
 * requestAnimationFrame tick (not a physics spring), so it reads
 * unmistakably as a digital counter/odometer rather than a smooth fade.
 * Any non-numeric prefix/suffix (~, +, %, commas) is preserved as-is.
 *
 * NOTE ON THE DEPENDENCY LIST BELOW: everything the effect depends on is
 * either a primitive or memoized. An earlier version listed the raw
 * `value.match(...)` result, which is a NEW array object on every render —
 * so the first setDisplay() re-render invalidated the effect, its cleanup
 * cancelled the in-flight animation frame, and the re-run bailed out on the
 * `started` guard. The counter ticked exactly once and froze. Keep only
 * primitives here.
 */
export default function Counter({
  value,
  durationMs = 2500,
  startDelayMs = 0,
  startValue: startValueOverride,
}: {
  value: string;
  durationMs?: number;
  startDelayMs?: number;
  /** Overrides the automatic "nearest 10/100" starting point — e.g. a
   * years-of-experience badge reads better counting 1 → 14 than 10 → 14. */
  startValue?: number;
}) {
  const parsed = useMemo(() => {
    const m = value.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
    if (!m) return null;
    const numStr = m[2];
    const target = parseInt(numStr.replace(/,/g, ""), 10) || 0;
    // Start near the final value and tick the last bit up — e.g. 2973
    // starts at 2900, 74 starts at 70 — rather than climbing from 0.
    let startValue = 0;
    if (target >= 100) startValue = Math.floor(target / 100) * 100;
    else if (target >= 10) startValue = Math.floor(target / 10) * 10;
    if (startValueOverride !== undefined) startValue = startValueOverride;
    return {
      prefix: m[1],
      suffix: m[3],
      hasCommas: numStr.includes(","),
      target,
      startValue,
    };
  }, [value, startValueOverride]);

  const target = parsed?.target ?? 0;
  const startValue = parsed?.startValue ?? 0;

  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [display, setDisplay] = useState(startValue);

  useEffect(() => {
    if (!isInView || !parsed) return;

    let frame = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const runTick = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        // Ease-out so it ticks fast at first and settles precisely on
        // target — no overshoot, no bounce, just counts up and stops.
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(startValue + eased * (target - startValue)));
        if (progress < 1) frame = requestAnimationFrame(tick);
        else setDisplay(target);
      };
      frame = requestAnimationFrame(tick);
    };

    if (startDelayMs > 0) timeout = setTimeout(runTick, startDelayMs);
    else runTick();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (timeout) clearTimeout(timeout);
    };
    // Primitives only — see the note above.
  }, [isInView, target, startValue, durationMs, startDelayMs, parsed]);

  if (!parsed) {
    // Doesn't look like "prefix + number + suffix" — render statically.
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {parsed.prefix}
      {parsed.hasCommas ? display.toLocaleString("en-US") : display}
      {parsed.suffix}
    </span>
  );
}
