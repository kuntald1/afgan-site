import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import HeroVideoPlaylist from "./HeroVideoPlaylist";
import { heroVideos } from "../heroVideos";
import { useDynamicContent } from "../hooks/useDynamicContent";

const EASE = "cubic-bezier(0.25,0.1,0.25,1)";

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function RollCTA({ label, to }: { label: string; to: string }) {
  return (
    <motion.div whileTap={{ scale: 0.96 }} className="inline-block">
      <Link
        to={to}
        className="group flex items-center gap-2 sm:gap-3 rounded-full bg-[#F26522] hover:bg-[#e05a1a] pl-5 sm:pl-6 pr-2 py-2 text-white text-[13px] sm:text-[14px] font-medium transition-colors duration-300"
      >
        <span className="h-[20px] overflow-hidden">
          <span
            className="flex flex-col group-hover:-translate-y-1/2"
            style={{ transition: "transform 500ms", transitionTimingFunction: EASE }}
          >
            <span className="h-[20px] leading-[20px]">{label}</span>
            <span className="h-[20px] leading-[20px]">{label}</span>
          </span>
        </span>
        <span
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45"
          style={{ transitionTimingFunction: EASE }}
        >
          <ArrowRight size={14} className="text-[#F26522]" />
        </span>
      </Link>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Live content from the admin CMS, falling back to the current static
  // copy if the admin API isn't configured or unreachable. See
  // src/hooks/useDynamicContent.ts and admin/README.md.
  const eyebrow = useDynamicContent("hero.eyebrow", "Afghanistan Center for Excellence");
  const headline = useDynamicContent(
    "hero.headline",
    "A local partner turning local challenges into lasting local solutions."
  );
  const badgeLabel = useDynamicContent("hero.badge_label", "UN & Government Partner");
  const badgeYear = useDynamicContent("hero.badge_year", "Since 2012");

  // As you scroll out of the hero, the video fades and the content lifts —
  // handing off visually to the 3D network scene behind it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const videoOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Background video, blended over the 3D scene rather than hiding it */}
      <motion.div
        className="absolute inset-0 z-0"
        style={reduced ? { opacity: 1 } : { opacity: videoOpacity }}
      >
        <HeroVideoPlaylist
          sources={heroVideos}
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Scrims — a light full-frame haze for atmosphere, plus tighter
          darkening at the top (nav) and bottom (headline) where more
          contrast is actually needed. The full-frame haze is intentionally
          much lighter than the original version. */}
      <div className="absolute inset-0 z-[4] bg-black/12" />
      <div className="absolute inset-x-0 top-0 z-[5] h-40 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-[5] h-[55%] bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Hero content */}
      <motion.div
        className="relative z-20 flex h-full flex-col"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="flex-1" />
        <motion.div
          className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20"
          initial="hidden"
          animate="visible"
          variants={heroStagger}
        >
          <motion.p
            variants={heroItem}
            className="mb-5 sm:mb-8 text-[13px] sm:text-[14px] tracking-wide text-white/80"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            variants={heroItem}
            className="font-medium text-white leading-[1.08] tracking-[-0.03em] max-w-4xl"
            style={{
              fontSize: "clamp(1.75rem, 6vw, 4rem)",
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            {headline}
          </motion.h1>

          <motion.div
            variants={heroItem}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5"
          >
            <RollCTA label="Start a conversation" to="/contact" />

            <div className="glass-panel-soft flex items-center gap-2.5 rounded-full px-4 py-2">
              <span className="text-[13px] sm:text-[14px] font-medium text-white/90">
                {badgeLabel}
              </span>
              <span className="rounded-full bg-[#F26522] px-2 py-0.5 text-[10px] sm:text-[11px] text-white">
                {badgeYear}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50"
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </motion.div>
    </section>
  );
}
