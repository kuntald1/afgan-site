import { useState } from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import { EASE } from "./tokens";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * SkillsExpertise2 — redesigned.
 *
 * Previous version had a solid yellow circle positioned with negative
 * offsets that spilled past the card's rounded corners in an unintentional-
 * looking way. This version replaces that with a contained diagonal accent
 * (a clipped yellow wedge in the corner, like the plate treatment used
 * elsewhere on Home-02 — About2's photo plate, WhyChoose2's offset plate)
 * so it reads as a deliberate design element rather than a stray shape.
 *
 * Percentages are still placeholders — see the note further down.
 *
 * REQUIRED in src/assets.ts:
 *   servicesSkillsImage: "/assets/images/home2/skills-expertise.jpg",
 */
// Admin stores percentages as text — clamp to 0–100, fall back if not a number.
function toPercent(raw: string, fallback: number) {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : fallback;
}

export default function SkillsExpertise2() {
  const [run, setRun] = useState(0);

  const eyebrow = useDynamicContent("services.skills_eyebrow", "Skills & Expertise");
  const heading = useDynamicContent("services.skills_heading", "Built on Years of Hands-On Consulting");
  const body = useDynamicContent(
    "services.skills_body",
    "Our skills and experience are built on years of hands-on consulting across diverse industries."
  );
  const skill1Label = useDynamicContent("services.skill_1_label", "Business Consultants");
  const skill1Value = useDynamicContent("services.skill_1_value", "65");
  const skill2Label = useDynamicContent("services.skill_2_label", "Client Communication");
  const skill2Value = useDynamicContent("services.skill_2_value", "83");
  const image = resolveMediaUrl(useDynamicContent("services.skills_image", assets.servicesSkillsImage));

  const SKILLS = [
    { label: skill1Label, value: toPercent(skill1Value, 65) },
    { label: skill2Label, value: toPercent(skill2Value, 83) },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      onViewportEnter={() => setRun((n) => n + 1)}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative mt-16 sm:mt-20 overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(15,61,46,0.14)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] min-h-[400px]">
        {/* Left — dark green panel */}
        <div className="relative order-1 flex items-center overflow-hidden bg-[#073B70] px-8 py-12 sm:px-12 sm:py-14">
          {/* Contained diagonal accent, clipped to this panel only — no
              overflow past the card edge. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rotate-12 rounded-[2.5rem] bg-[#F5C518]/90"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#073B70]/55"
          />

          <div className="relative z-10 max-w-md">
            <span className="inline-block mb-5 rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
              {eyebrow}
            </span>
            <h3
              className="text-white leading-[1.15]"
              style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "clamp(1.6rem, 3.2vw, 2.25rem)" }}
            >
              {heading}
            </h3>
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/65">
              {body}
            </p>

            <div className="mt-9 flex flex-col gap-7">
              {SKILLS.map((s, i) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="text-white"
                      style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 600, fontSize: "14.5px" }}
                    >
                      {s.label}
                    </span>
                    <span
                      className="text-[#F5C518]"
                      style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "18px" }}
                    >
                      {s.value}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/12">
                    <motion.div
                      key={`${s.label}-${run}`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${s.value}%` }}
                      transition={{ duration: 1.3, delay: 0.2 + i * 0.18, ease: EASE }}
                      className="h-full rounded-full bg-[#F5C518]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — full-bleed photo */}
        <div className="relative order-2 min-h-[260px] lg:min-h-0">
          <FallbackImage
            src={image}
            alt="ACE team at work"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </motion.section>
  );
}
