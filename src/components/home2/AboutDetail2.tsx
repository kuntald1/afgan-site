import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { assets } from "../../assets";
import { offices, teamStats } from "../../content";
import FallbackImage from "../home/FallbackImage";
import AboutPillars2 from "./AboutPillars2";
import { EASE } from "./tokens";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * AboutDetail2 — redesigned to match the reference layout (pillar cards,
 * then a composed-photo block with badges, a checklist and a CTA).
 *
 * Two things from the reference were deliberately NOT carried over:
 * - The "Award Wining Time" badges — no verified ACE award exists, so this
 *   would have been a fabricated claim. Replaced with two real facts
 *   (founding year, UN/Government partnership).
 * - The hand-signature + "CEO Co-Founder" byline — attributing a quote to a
 *   named individual who doesn't have a real, disclosed identity here would
 *   be misleading on a real company site. Dropped rather than invented.
 *
 * Checklist points reuse the same three facts already used in the homepage
 * About2.tsx ("~50 experienced Afghan consultants" etc.) for consistency
 * across the site rather than inventing new marketing copy.
 */
export default function AboutDetail2() {
  const eyebrow = useDynamicContent("about.hero_eyebrow", "About Our Consulting");
  const heading = useDynamicContent(
    "about.hero_heading",
    "Field-Tested Expertise, Delivering Results Across Afghanistan"
  );
  const intro = useDynamicContent(
    "about.hero_intro",
    "An Afghan-owned professional services company helping government, private-sector and NGO partners improve performance, strengthen institutions, and deliver measurable outcomes since 2012."
  );
  const badge1Text = useDynamicContent("about.badge_1_text", "Founded");
  const badge1Year = useDynamicContent("about.badge_1_year", "2012");
  const badge2Text = useDynamicContent("about.badge_2_text", "UN & Government Partner");
  const point1 = useDynamicContent(
    "about.point_1",
    `${teamStats[0].value} experienced Afghan consultants`
  );
  const point2 = useDynamicContent("about.point_2", `Offices across ${offices.join(", ")}`);
  const point3 = useDynamicContent("about.point_3", "Majority-local, on-the-ground team since 2012");
  const points = [point1, point2, point3];
  const ctaLabel = useDynamicContent("about.cta_label", "See How We Work");
  const imageLarge = resolveMediaUrl(useDynamicContent("about.image_large", assets.aboutLarge));
  const imageSmall = resolveMediaUrl(useDynamicContent("about.image_small", assets.aboutSmall));

  return (
    <section className="relative py-16 sm:py-20 bg-white overflow-hidden">
      {/* Decorative dotted arc + dashed curve, top-left — same family of
          ornament used elsewhere on Home-02 (Hero2's dot grid,
          Testimonials2's curves), so this page reads as part of the set. */}
      <svg
        aria-hidden
        viewBox="0 0 400 500"
        fill="none"
        className="pointer-events-none absolute -left-20 top-10 hidden h-[420px] w-[360px] lg:block"
      >
        <path d="M 60 0 C -20 140, -10 280, 90 460" stroke="#073B70" strokeOpacity="0.14" strokeWidth="1.5" />
        <path
          d="M 110 20 C 30 150, 40 270, 130 430"
          stroke="#073B70"
          strokeOpacity="0.3"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
      </svg>

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <AboutPillars2 />

        <div className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Composed photo: big frame + a circular inset photo overlapping
              its bottom-left edge, echoing the reference without inventing
              a second unrelated image — both come from the existing
              aboutSmall/aboutLarge pair. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <div
              aria-hidden
              className="absolute -inset-3 rounded-2xl border-[3px] border-[#F5C518]"
            />
            <div className="relative aspect-[4/3.2] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(15,61,46,0.16)]">
              <FallbackImage
                src={imageLarge}
                alt="ACE-led vocational training session"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-full border-[5px] border-white shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
              <FallbackImage
                src={imageSmall}
                alt="ACE team conducting a field visit"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Copy column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="inline-block mb-5 rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]"
            >
              {eyebrow}
            </motion.span>

            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="leading-[1.12] tracking-[-0.02em] text-[#073B70]"
              style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "clamp(1.75rem, 3.6vw, 2.6rem)" }}
            >
              {heading}
            </motion.h2>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="mt-4 leading-relaxed text-[#073B70]/60"
              style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 500, fontSize: "16.5px" }}
            >
              {intro}
            </motion.p>

            {/* Real badges — founding year and UN/Government partnership,
                in place of the fabricated award claims. */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="mt-7 flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-3 rounded-xl bg-[#F7F7F5] px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#073B70] text-[12px] font-bold text-[#F5C518]">
                  12
                </span>
                <span className="text-[13.5px] font-semibold leading-tight text-[#073B70]">
                  {badge1Text}<br />{badge1Year}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#F7F7F5] px-4 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#073B70] text-[12px] font-bold text-[#F5C518]">
                  UN
                </span>
                <span className="text-[13.5px] font-semibold leading-tight text-[#073B70]">
                  {badge2Text}
                </span>
              </div>
            </motion.div>

            <motion.ul
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              className="mt-7 space-y-2.5"
            >
              {points.map((point) => (
                <motion.li
                  key={point}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
                  }}
                  className="flex items-center gap-3 text-[14.5px] text-[#073B70]/80"
                >
                  <CheckCircle2 size={18} className="flex-shrink-0 text-[#F5C518]" fill="#073B70" />
                  {point}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="mt-8"
            >
              <Link
                to="/home-02/services"
                className="group inline-flex items-center gap-3 rounded-md bg-[#F5C518] hover:bg-[#e6b800] pl-6 pr-2 py-2.5 text-[14px] font-semibold text-[#073B70] transition-colors duration-300"
              >
                {ctaLabel}
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#073B70] transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={15} className="text-[#F5C518]" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
