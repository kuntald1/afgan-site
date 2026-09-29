import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { assets } from "../../assets";
import { offices, teamStats } from "../../content";
import Counter from "../motion/Counter";
import FallbackImage from "../home/FallbackImage";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

const yearsActive = new Date().getFullYear() - 2012;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function About2() {
  // Remount key for the years counter, so it replays on every re-entry.
  const [run, setRun] = useState(0);

  const eyebrow = useDynamicContent("home2.about.eyebrow", "About Our Consulting");
  const heading = useDynamicContent(
    "home2.about.heading",
    "Driving Institutional Change Through Strategy"
  );
  const body = useDynamicContent(
    "home2.about.body",
    "ACE is a results-driven, Afghan-owned consulting company helping government, private-sector and NGO partners improve performance, strengthen institutions, and deliver measurable outcomes."
  );
  // The three checklist lines were previously computed from teamStats/
  // offices — now independently editable text, seeded with those exact
  // computed strings as the starting/fallback value. Editing teamStats or
  // offices elsewhere will no longer change these unless re-typed here too.
  const point1 = useDynamicContent(
    "home2.about.point_1",
    `${teamStats[0].value} experienced Afghan consultants`
  );
  const point2 = useDynamicContent("home2.about.point_2", `Offices across ${offices.join(", ")}`);
  const point3 = useDynamicContent(
    "home2.about.point_3",
    "Majority-local, on-the-ground team since 2012"
  );
  const points = [point1, point2, point3];
  const badgeText = useDynamicContent("home2.about.badge_text", "Business Consulting");
  const yearsLabel = useDynamicContent("home2.about.years_label", "Years Experience");
  const ctaLabel = useDynamicContent("home2.about.cta_label", "More Details");
  const image = resolveMediaUrl(useDynamicContent("home2.about.image", assets.home2AboutLarge));

  return (
    <section className="pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 lg:pb-10 bg-white overflow-hidden">
      {/* One orchestrated sequence for the whole section: the yellow plate
          settles into its tilt, the photo wipes open over it, then the copy
          arrives line by line. Deliberately a single moment rather than
          five separate fade-ups firing at different scroll positions. */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        onViewportEnter={() => setRun((n) => n + 1)}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.16 } } }}
        className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
      >
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.18 } } }}
          className="relative max-w-[520px] mx-auto lg:mx-0 lg:ml-8"
        >
          {/* Yellow plate rotates into place */}
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

          {/* Photo wipes open from the left */}
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
              src={image}
              alt="ACE consulting session"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Spinning circular text badge, top-left */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.6 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
            }}
            className="hidden sm:flex absolute -left-12 -top-12 h-40 w-40 items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite]">
              <defs>
                <path id="badgeCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text fill="#073B70" fontSize="9" fontWeight={600} letterSpacing="1.5">
                <textPath href="#badgeCircle">
                  {badgeText} • {badgeText} •
                </textPath>
              </text>
            </svg>
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5C518] shadow-[0_8px_20px_rgba(0,0,0,0.18)]">
              <img src={assets.logoColor} alt="ACE" className="h-12 w-12 object-contain" />
            </span>
          </motion.div>
        </motion.div>

        {/* Copy column — children arrive in sequence */}
        <motion.div
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {[
            <span
              key="eyebrow"
              className="inline-block mb-5 rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]"
            >
              {eyebrow}
            </span>,
            <h2
              key="heading"
              className="leading-[1.12] tracking-[-0.025em] text-[#073B70]"
              style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              {heading}
            </h2>,
            <p
              key="body"
              className="mt-5 max-w-md leading-relaxed text-[#073B70]/75"
              style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "19px" }}
            >
              {body}
            </p>,
          ].map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
            >
              {child}
            </motion.div>
          ))}

          <div className="flex flex-wrap items-end justify-between gap-8">
            <ul className="mt-7 space-y-3">
              {points.map((point, i) => (
                <motion.li
                  key={point}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.55, ease: EASE, delay: i * 0.08 },
                    },
                  }}
                  className="flex items-center gap-3 text-[15.5px] font-bold text-[#073B70]/90"
                >
                  <CheckCircle2 size={18} className="flex-shrink-0 text-[#F5C518]" fill="#073B70" />
                  {point}
                </motion.li>
              ))}
            </ul>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
              }}
              className="relative hidden md:flex h-36 w-36 flex-shrink-0 items-center justify-center rounded-full bg-[#073B70]"
            >
              <div className="text-center">
                <span
                  className="block text-[46px] font-extrabold leading-none text-[#F5C518]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  <Counter
                    key={run}
                    value={`${yearsActive}+`}
                    durationMs={2500}
                    startDelayMs={200}
                    startValue={1}
                  />
                </span>
                <span className="mt-1 block text-[11px] font-medium text-white/70">
                  {yearsLabel}
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
            className="mt-9"
          >
            <Link
              to="/home-02/about"
              className="group inline-flex items-center gap-3 rounded-md bg-[#F5C518] hover:bg-[#e6b800] pl-6 pr-2 py-2.5 text-[14px] font-semibold text-[#073B70] transition-colors duration-300"
            >
              {ctaLabel}
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#073B70] transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={15} className="text-[#F5C518]" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
