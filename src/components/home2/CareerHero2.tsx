import { motion } from "framer-motion";
import { EASE } from "./tokens";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import { useDynamicContent } from "../../hooks/useDynamicContent";

/**
 * CareerHero2
 * Same banner treatment as ContactHero2, so the two inner pages match.
 *
 * REQUIRED in src/assets.ts, next to `contactHero`:
 *   careerHero: "/assets/images/home2/career-hero.jpg",
 *
 * Then drop the photo at: public/assets/images/home2/career-hero.jpg
 * Guidance: landscape, 1920x600 or larger. An ACE team shot — training room,
 * field work, or staff in discussion — reads better here than generic stock,
 * since this page is about joining the team. Licensed images only.
 */
export default function CareerHero2() {
  const title = useDynamicContent("career.hero_title", "Career");
  const crumb = useDynamicContent("career.hero_crumb", "Home / Career");

  return (
    <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
      <FallbackImage
        src={assets.careerHero}
        alt="Careers at ACE"
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
