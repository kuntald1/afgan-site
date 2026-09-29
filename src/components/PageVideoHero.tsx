import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import HeroVideoPlaylist from "./HeroVideoPlaylist";
import { heroVideos } from "../heroVideos";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function PageVideoHero({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const videoOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative h-[68vh] sm:h-[72vh] min-h-[460px] w-full overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={reduced ? { opacity: 1 } : { opacity: videoOpacity }}
      >
        <HeroVideoPlaylist
          sources={heroVideos}
          className="h-full w-full object-cover object-[center_28%]"
        />
      </motion.div>

      <div className="absolute inset-0 z-[4] bg-black/12" />
      <div className="absolute inset-x-0 top-0 z-[5] h-32 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-[5] h-[60%] bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      <motion.div
        className="relative z-20 flex h-full flex-col"
        style={reduced ? undefined : { y: contentY }}
      >
        <div className="flex-1" />
        <motion.div
          className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 pb-10 sm:pb-14"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={item}
            className="glass-panel-soft inline-block rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[12px] sm:text-[13px] font-medium text-white/90"
          >
            {eyebrow}
          </motion.span>
          <motion.h1
            variants={item}
            className="mt-4 font-medium leading-[1.05] tracking-[-0.03em] text-white"
            style={{
              fontSize: "clamp(1.9rem, 5vw, 3.4rem)",
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </motion.h1>
        </motion.div>
      </motion.div>
    </section>
  );
}
