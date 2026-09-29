import { motion } from "framer-motion";
import { EASE } from "./tokens";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * REQUIRED in src/assets.ts:
 *   projectsHero: "/assets/images/home2/projects-hero.jpg",
 * public/assets/images/home2/projects-hero.jpg — landscape, 1920x600+.
 */
export default function ProjectsHero2({
  title,
  crumb,
}: {
  title?: string;
  crumb?: string;
}) {
  const defaultTitle = useDynamicContent("projects.hero_title", "Projects");
  const defaultCrumb = useDynamicContent("projects.hero_crumb", "Home / Projects");
  const heroImage = resolveMediaUrl(useDynamicContent("projects.hero_image", assets.projectsHero));
  const displayTitle = title ?? defaultTitle;
  const displayCrumb = crumb ?? defaultCrumb;
  return (
    <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
      <FallbackImage
        src={heroImage}
        alt="ACE projects"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#073B70]/80" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-urbanist font-extrabold text-white text-4xl md:text-6xl max-w-3xl leading-tight"
        >
          {displayTitle}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="mt-6 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm md:text-base"
        >
          {displayCrumb}
        </motion.div>
      </div>
    </section>
  );
}
