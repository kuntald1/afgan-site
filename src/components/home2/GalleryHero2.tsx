import { motion } from "framer-motion";
import { EASE } from "./tokens";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * REQUIRED in src/assets.ts:
 *   galleryHero: "/assets/images/home2/gallery-hero.jpg",
 * public/assets/images/home2/gallery-hero.jpg — landscape, 1920x600+.
 */
export default function GalleryHero2() {
  const title = useDynamicContent("gallery.hero_title", "Media Gallery");
  const crumb = useDynamicContent("gallery.hero_crumb", "Home / Gallery");
  const heroImage = resolveMediaUrl(useDynamicContent("gallery.hero_image", assets.galleryHero));

  return (
    <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
      <FallbackImage
        src={heroImage}
        alt="ACE media gallery"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#073B70]/80" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-urbanist font-extrabold text-white text-4xl md:text-6xl"
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="mt-6 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm md:text-base"
        >
          {crumb}
        </motion.div>
      </div>
    </section>
  );
}
