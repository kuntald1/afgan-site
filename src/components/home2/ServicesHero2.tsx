import { motion } from "framer-motion";
import { EASE } from "./tokens";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * ServicesHero2 — same banner treatment as Contact/Career/BlogHero2.
 *
 * REQUIRED in src/assets.ts:
 *   servicesHero: "/assets/images/home2/services-hero.jpg",
 * Then drop the photo at: public/assets/images/home2/services-hero.jpg
 * Landscape, 1920x600+. Licensed images only.
 */
export default function ServicesHero2() {
  const title = useDynamicContent("services.hero_title", "Services");
  const crumb = useDynamicContent("services.hero_crumb", "Home / Services");
  const heroImage = resolveMediaUrl(useDynamicContent("services.hero_image", assets.servicesHero));

  return (
    <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
      <FallbackImage
        src={heroImage}
        alt="ACE consulting services"
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
