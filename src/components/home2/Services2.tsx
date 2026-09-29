import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ClipboardCheck, RefreshCw, Users, ShieldCheck } from "lucide-react";
import FallbackImage from "../home/FallbackImage";
import { useDynamicContent } from "../../hooks/useDynamicContent";
import { useServicePillars } from "./useServicePillars";

const ICONS: Record<string, typeof ClipboardCheck> = {
  assess: ClipboardCheck,
  transform: RefreshCw,
  empower: Users,
  comply: ShieldCheck,
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Services2() {
  const cards = useServicePillars().slice(0, 3);

  const eyebrow = useDynamicContent("home2.services.eyebrow", "What We Offer");
  const heading = useDynamicContent(
    "home2.services.heading",
    "Our Comprehensive Service Offerings"
  );
  const intro = useDynamicContent(
    "home2.services.intro",
    "ACE supports government, private-sector and NGO partners across four connected pillars — from independent assessment through to institutional reform, workforce empowerment, and compliance."
  );

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F7F7F5]">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        {/* Header — one orchestrated entrance for the whole block. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 mb-14 items-start"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
            }}
          >
            <span className="inline-block mb-5 rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
              {eyebrow}
            </span>
            <h2
              className="leading-[1.08] tracking-[-0.025em] text-[#073B70]"
              style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem, 4.2vw, 3rem)" }}
            >
              {heading}
            </h2>
          </motion.div>
          <motion.p
            variants={{
              hidden: { opacity: 0, x: -32 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
            }}
            className="leading-relaxed text-[#073B70]/80 lg:pt-3"
            style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "19px" }}
          >
            {intro}
          </motion.p>
        </motion.div>

        {/* Cards — the middle card is inverted (photo on top, text below)
            so the arc curves the opposite way, matching the reference's
            alternating rhythm. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-7 items-start"
        >
          {cards.map((pillar, i) => {
            const Icon = ICONS[pillar.key];
            const inverted = i === 1;

            const textBlock = (
              <div className={`px-7 ${inverted ? "pb-8 pt-14" : "pt-8 pb-4"} text-center`}>
                <h3
                  className="text-[22px] leading-snug text-[#073B70]"
                  style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800 }}
                >
                  {pillar.title}
                </h3>
                <p className="mt-3 text-[16px] font-semibold leading-relaxed text-[#073B70]/85">
                  {pillar.intro[0]}
                </p>
                <Link
                  to="/home-02/services"
                  className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-bold text-[#073B70] transition-colors hover:text-[#F5C518]"
                >
                  Read more
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            );

            const photoBlock = (
              <div className="relative h-72 w-full overflow-hidden">
                <FallbackImage
                  src={pillar.image}
                  alt={pillar.title}
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                {/* Dashed arc mask — curves down for normal cards, up for
                    the inverted middle card. */}
                <svg
                  viewBox="0 0 300 70"
                  preserveAspectRatio="none"
                  className={`pointer-events-none absolute inset-x-0 w-full text-white ${
                    inverted ? "bottom-0 rotate-180" : "top-0"
                  }`}
                  style={{ height: 70 }}
                >
                  <path d="M0,70 Q150,-12 300,70 L300,0 L0,0 Z" fill="currentColor" />
                  <path
                    d="M0,70 Q150,-12 300,70"
                    fill="none"
                    stroke="#073B70"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                  />
                </svg>
              </div>
            );

            return (
              <motion.div
                key={pillar.key}
                variants={{
                  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.8, ease: EASE },
                  },
                }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(15,61,46,0.08)] transition-shadow duration-500 hover:shadow-[0_26px_60px_rgba(15,61,46,0.16)]"
              >
                {inverted ? (
                  <>
                    {photoBlock}
                    {textBlock}
                  </>
                ) : (
                  <>
                    {textBlock}
                    {photoBlock}
                  </>
                )}

                {/* Icon badge, top-right corner; spins on hover */}
                <span className="absolute right-5 top-5 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5C518] shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition-transform duration-700 ease-out group-hover:rotate-[360deg]">
                  <Icon size={22} className="text-[#073B70]" />
                </span>

                {/* Large ghosted index — these four pillars are a sequence
                    (assess → transform → empower → comply), so numbering
                    them carries real meaning here. */}
                <span
                  className={`pointer-events-none absolute left-6 text-[34px] font-bold text-[#073B70]/[0.07] ${
                    inverted ? "bottom-4" : "top-4"
                  }`}
                  style={{ fontFamily: "Urbanist, sans-serif" }}
                >
                  {String(i + 1).padStart(2, "0")}.
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-40px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="mt-12 flex justify-center"
        >
          <Link
            to="/home-02/services"
            className="group inline-flex items-center gap-3 rounded-md border-2 border-[#073B70] pl-6 pr-2 py-2 text-[14px] font-semibold text-[#073B70] transition-colors duration-300 hover:bg-[#073B70] hover:text-white"
          >
            View all services
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5C518] transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={14} className="text-[#073B70]" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
