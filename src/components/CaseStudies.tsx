import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { assets } from "../assets";
import { projectsList } from "../content";
import { Reveal } from "./motion/Reveal";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * A coverflow-style card: it measures its own position each frame and tilts
 * in 3D based on how far it is from the centre of the viewport, so cards
 * rotate to face you as they slide through the middle and angle away at the
 * edges.
 */
function ProjectCard3D({
  title,
  org,
  image,
  reduced,
}: {
  title: string;
  org: string;
  image: string;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateYRaw = useMotionValue(0);
  const zRaw = useMotionValue(0);
  const scaleRaw = useMotionValue(1);
  const opacityRaw = useMotionValue(1);

  const spring = { stiffness: 260, damping: 34, mass: 0.6 };
  const rotateY = useSpring(rotateYRaw, spring);
  const z = useSpring(zRaw, spring);
  const scale = useSpring(scaleRaw, spring);

  useAnimationFrame(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const rect = el.getBoundingClientRect();
    // Skip work when the card is nowhere near the viewport.
    if (rect.right < -400 || rect.left > window.innerWidth + 400) return;

    const cardCenter = rect.left + rect.width / 2;
    const viewportCenter = window.innerWidth / 2;
    // -1 = far left, 0 = dead centre, 1 = far right
    const delta = clamp((cardCenter - viewportCenter) / viewportCenter, -1.4, 1.4);

    rotateYRaw.set(-delta * 34);
    zRaw.set(-Math.abs(delta) * 200);
    scaleRaw.set(1 - Math.abs(delta) * 0.12);
    opacityRaw.set(1 - Math.abs(delta) * 0.25);
  });

  return (
    <div
      ref={ref}
      className="w-[300px] sm:w-[440px] lg:w-[560px] flex-shrink-0"
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="group relative overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(22,33,43,0.18)]"
        style={
          reduced
            ? undefined
            : {
                rotateY,
                z,
                scale,
                opacity: opacityRaw,
                transformStyle: "preserve-3d",
              }
        }
      >
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={image}
            alt={`ACE project — ${title}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

        <span className="absolute left-4 top-4 rounded-full border border-white/50 px-3 py-1 text-[10px] font-medium tracking-wide text-white">
          PROJECTS
        </span>

        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#16212b] opacity-0 transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight size={15} />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-[16px] sm:text-[19px] font-semibold leading-snug text-white">
            {title}
          </p>
          <p className="mt-1 text-[12px] sm:text-[13px] text-white/75">{org}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Vertical scroll through this tall section drives the track sideways.
  const x = useTransform(scrollYProgress, [0, 1], ["3%", "-82%"]);

  const cards = projectsList.map((p) => (
    <ProjectCard3D
      key={p.key}
      title={p.title}
      org={p.org}
      image={assets.projectImages[p.key as keyof typeof assets.projectImages]}
      reduced={reduced}
    />
  ));

  return (
    <section id="projects" className="pt-10 sm:pt-12 lg:pt-14">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="flex items-center gap-3 px-5 sm:px-8 lg:px-12 mb-6 sm:mb-8">
          <span className="glass-panel-soft rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[12px] sm:text-[13px] font-medium">
            Featured field work
          </span>
        </Reveal>

        <Reveal
          delay={0.08}
          className="px-5 sm:px-8 lg:px-12 font-medium leading-[1.08] tracking-[-0.03em] text-[#16212b] mb-4"
        >
          <h2 style={{ fontSize: "clamp(1.75rem, 6vw, 3.6rem)" }}>Our projects</h2>
        </Reveal>

        <p className="px-5 sm:px-8 lg:px-12 text-[13px] text-[#16212b]/55 mb-2">
          {projectsList.length} projects delivered since 2012
        </p>
      </div>

      {reduced ? (
        /* Reduced motion: plain grid, no pinning or 3D tilt. */
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 pb-16">
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6">{cards}</div>
        </div>
      ) : (
        /* Tall spacer: while it passes the viewport the row is pinned, the
           track slides sideways, and each card tilts in 3D as it crosses
           the centre of the screen. */
        <div ref={ref} className="relative h-[220vh]">
          <div
            className="sticky top-0 flex h-[74vh] items-center overflow-hidden"
            style={{ perspective: 1600 }}
          >
            <motion.div
              className="flex gap-6 sm:gap-10 px-5 sm:px-8 lg:px-12"
              style={{ x, transformStyle: "preserve-3d" }}
            >
              {cards}
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
}
