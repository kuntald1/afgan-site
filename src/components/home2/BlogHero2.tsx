import { motion } from "framer-motion";
import { EASE } from "./tokens";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * BlogHero2 — same banner treatment as ContactHero2 / CareerHero2.
 *
 * REQUIRED in src/assets.ts, next to `contactHero` / `careerHero`:
 *   blogHero: "/assets/images/home2/blog-hero.jpg",
 *
 * Then drop the photo at: public/assets/images/home2/blog-hero.jpg
 * Landscape, 1920x600+. Licensed images only.
 */
export default function BlogHero2({
  title,
  crumb,
}: {
  title?: string;
  crumb?: string;
}) {
  const defaultTitle = useDynamicContent("blog.hero_title", "Blog");
  const defaultCrumb = useDynamicContent("blog.hero_crumb", "Home / Blog");
  const heroImage = resolveMediaUrl(useDynamicContent("blog.hero_image", assets.blogHero));
  const displayTitle = title ?? defaultTitle;
  const displayCrumb = crumb ?? defaultCrumb;
  return (
    <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
      <FallbackImage
        src={heroImage}
        alt="ACE blog"
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
