import { motion } from "framer-motion";
import { overview, offices } from "../../content";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import StatsStrip2 from "./StatsStrip2";
import { EASE } from "./tokens";
import { useDynamicContent } from "../../hooks/useDynamicContent";

/**
 * OverviewStats2
 *
 * - Overview is now a two-column block: the Overview copy on the left,
 *   an animated photo on the right (tilted yellow plate + wipe-open
 *   reveal, same treatment as the homepage's "About Our Consulting"
 *   photo in About2.tsx). The "Overview" badge is centered above the
 *   paragraph; the paragraph itself stays left-aligned for readability.
 * - The old ~50 / 200+ / 30% team-stats row is gone — replaced by
 *   <StatsStrip2/> itself, rendered as its own top-level section (not
 *   nested inside this one) so it keeps the exact same full-width layout,
 *   spacing and background it has on the homepage rather than getting
 *   double-padded inside this section's container.
 * - "Our Aspirations" (intro + three cards) has been removed entirely.
 */
export default function OverviewStats2() {
  const eyebrow = useDynamicContent("about.overview_eyebrow", "Overview");
  const overviewText = useDynamicContent("about.overview_text", overview);
  const officesLine = useDynamicContent("about.overview_offices", offices.join(" · "));

  return (
    <>
      <section className="py-16 sm:py-20 bg-[#F7F7F5] overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Animated photo — same tilt + wipe-open treatment as About2.tsx.
                Now on the right at desktop widths. */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.18 } } }}
              className="relative max-w-[480px] mx-auto lg:mx-0 lg:order-2"
            >
              <motion.div
                aria-hidden
                variants={{
                  hidden: { opacity: 0, rotate: 0, scale: 0.94 },
                  visible: {
                    opacity: 1,
                    rotate: -4,
                    scale: 1,
                    transition: { duration: 0.9, ease: EASE },
                  },
                }}
                className="absolute -inset-5 rounded-2xl bg-[#F5C518]"
              />
              <motion.div
                variants={{
                  hidden: { clipPath: "inset(0 100% 0 0)" },
                  visible: {
                    clipPath: "inset(0 0% 0 0)",
                    transition: { duration: 1.05, ease: EASE },
                  },
                }}
                className="relative aspect-[4/4.3] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(15,61,46,0.2)]"
              >
                <FallbackImage
                  src={assets.home2AboutLarge}
                  alt="ACE team at work"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </motion.div>

            {/* Overview copy — now on the left at desktop widths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="lg:order-1"
            >
              <div className="text-center lg:text-left">
                <span className="inline-block mb-5 rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
                  {eyebrow}
                </span>
              </div>
              <p
                className="max-w-xl leading-relaxed text-[#073B70]/75 font-semibold"
                style={{ fontSize: "17px" }}
              >
                {overviewText}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Real impact numbers — the exact same component and figures shown
          on the homepage, as its own top-level section. */}
      <StatsStrip2 />

      <div className="bg-white pb-14 sm:pb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center text-[12.5px] tracking-wide text-[#073B70]/45"
        >
          {officesLine}
        </motion.p>
      </div>
    </>
  );
}
