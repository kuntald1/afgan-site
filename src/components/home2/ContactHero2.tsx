import { motion } from "framer-motion";
import { EASE } from "./tokens";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * ContactHero2
 * Full-width banner (not the split hero used on the home page).
 * Background image: public/assets/images/home2/contact-hero.jpg
 * Add the path to assets.ts as `contactHero`, e.g.:
 *   contactHero: "/assets/images/home2/contact-hero.jpg", // recommended: 1920x500+, landscape, people/office shot
 */
export default function ContactHero2() {
  const title = useDynamicContent("contact.hero_title", "Contact Us");
  const crumb = useDynamicContent("contact.hero_crumb", "Home / Contact Us");
  const heroImage = resolveMediaUrl(useDynamicContent("contact.hero_image", assets.contactHero));

  return (
    <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
      <FallbackImage
        src={heroImage}
        alt="Contact ACE"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Deep green tint over the photo, consistent with Home-02 palette */}
      <div className="absolute inset-0 bg-[#073B70]/80" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-urbanist font-extrabold text-white text-4xl md:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="mt-6 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm md:text-base"
        >
          {crumb}
        </motion.div>
      </div>
    </section>
  );
}
