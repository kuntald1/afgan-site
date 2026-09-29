import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { ReactNode } from "react";

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** Fades, lifts and scales in — a slightly richer reveal than plain fade-up. */
export function ScaleReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      variants={scaleUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slowly zooms its children as they travel through the viewport — the
 * "Ken Burns on scroll" effect. Expects a single <img> (or similar) child.
 */
export function ScrollZoom({
  children,
  className,
  from = 1.18,
  to = 1,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="h-full w-full"
        style={reduced ? undefined : { scale }}
      >
        {children}
      </motion.div>
    </div>
  );
}
