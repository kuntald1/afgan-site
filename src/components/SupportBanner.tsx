import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { assets } from "../assets";
import { globalCompact } from "../content";

/**
 * A single word of the statement, fading and lifting in over its own slice
 * of the section's scroll progress — so the sentence writes itself in as
 * you scroll rather than appearing all at once.
 */
function Word({
  word,
  progress,
  index,
  total,
  reduced,
}: {
  word: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
  reduced: boolean;
}) {
  // Words resolve across the back half of the scroll range, each slightly
  // after the last, with overlap so it flows instead of ticking.
  const start = 0.45 + (index / total) * 0.4;
  const end = start + 0.14;

  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);
  const blur = useTransform(progress, [start, end], [4, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  if (reduced) return <span>{word} </span>;

  return (
    <motion.span
      style={{ opacity, y, filter }}
      className="inline-block will-change-transform"
    >
      {word}&nbsp;
    </motion.span>
  );
}

export default function SupportBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    // Runs from the section entering the viewport until it's centred.
    offset: ["start 0.95", "center 0.4"],
  });

  // Smooth the raw scroll value so nothing snaps on fast scrolls.
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  // Card: tilts up out of 3D space and settles flat.
  const cardRotateX = useTransform(p, [0, 0.55], [26, 0]);
  const cardScale = useTransform(p, [0, 0.55], [0.86, 1]);
  const cardY = useTransform(p, [0, 0.55], [90, 0]);
  const cardOpacity = useTransform(p, [0, 0.3], [0, 1]);

  // ACE mark: drops from above, out of focus, into place.
  const markY = useTransform(p, [0.1, 0.5], [-70, 0]);
  const markScale = useTransform(p, [0.1, 0.5], [0.55, 1]);
  const markOpacity = useTransform(p, [0.1, 0.4], [0, 1]);
  const markBlurRaw = useTransform(p, [0.1, 0.5], [10, 0]);
  const markFilter = useTransform(markBlurRaw, (b) => `blur(${b}px)`);

  // Divider: wipes open from the centre.
  const ruleScaleX = useTransform(p, [0.3, 0.6], [0, 1]);

  // UN emblem: swings in from the left.
  const emblemX = useTransform(p, [0.35, 0.75], [-120, 0]);
  const emblemRotate = useTransform(p, [0.35, 0.75], [-35, 0]);
  const emblemOpacity = useTransform(p, [0.35, 0.6], [0, 1]);
  const emblemScale = useTransform(p, [0.35, 0.75], [0.6, 1]);

  // Sheen sweeping across the card as it settles.
  const sheenX = useTransform(p, [0.2, 0.9], ["-120%", "220%"]);
  const sheenOpacity = useTransform(p, [0.2, 0.45, 0.9], [0, 0.55, 0]);

  // Label fade — hoisted out of JSX so hooks stay at the top level.
  const labelOpacity = useTransform(p, [0, 0.2], [0, 1]);

  const words = globalCompact.split(" ");

  return (
    <section ref={ref} className="py-10 sm:py-14">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <motion.p
          style={reduced ? undefined : { opacity: labelOpacity }}
          className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#16212b]/55 mb-7"
        >
          Supported by
        </motion.p>

        {/* Perspective wrapper — gives the card real depth to rotate within */}
        <div style={{ perspective: 1400 }}>
          <motion.div
            style={
              reduced
                ? undefined
                : {
                    rotateX: cardRotateX,
                    scale: cardScale,
                    y: cardY,
                    opacity: cardOpacity,
                    transformStyle: "preserve-3d",
                    transformOrigin: "center bottom",
                  }
            }
            className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white px-8 sm:px-14 py-12 sm:py-16 shadow-[0_30px_80px_rgba(22,33,43,0.14)]"
          >
            {/* Light sheen sweep */}
            {!reduced && (
              <motion.div
                aria-hidden
                style={{ x: sheenX, opacity: sheenOpacity }}
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[#F26522]/10 to-transparent"
              />
            )}

            <motion.img
              style={
                reduced
                  ? undefined
                  : {
                      y: markY,
                      scale: markScale,
                      opacity: markOpacity,
                      filter: markFilter,
                    }
              }
              src={assets.logoColor}
              alt="Afghanistan Center for Excellence"
              className="mx-auto h-28 sm:h-36 w-auto object-contain will-change-transform"
            />

            <motion.div
              style={reduced ? undefined : { scaleX: ruleScaleX }}
              className="mx-auto my-10 h-px w-full max-w-md origin-center bg-[#16212b]/12"
            />

            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
              <motion.img
                style={
                  reduced
                    ? undefined
                    : {
                        x: emblemX,
                        rotate: emblemRotate,
                        opacity: emblemOpacity,
                        scale: emblemScale,
                      }
                }
                src={assets.unGlobalCompact}
                alt="UN Global Compact — We Support"
                className="h-28 sm:h-32 w-auto flex-shrink-0 object-contain will-change-transform"
              />

              <p className="text-center sm:text-left text-[15px] sm:text-[17px] leading-relaxed text-[#16212b]/80">
                {words.map((word, i) => (
                  <Word
                    key={`${word}-${i}`}
                    word={word}
                    index={i}
                    total={words.length}
                    progress={p}
                    reduced={reduced}
                  />
                ))}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
