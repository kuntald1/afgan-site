import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceItemCard2 from "./ServiceItemCard2";
import SkillsExpertise2 from "./SkillsExpertise2";
import FallbackImage from "../home/FallbackImage";
import { EASE } from "./tokens";
import { useDynamicContent } from "../../hooks/useDynamicContent";
import { useServicePillars } from "./useServicePillars";

export default function ServicesDetail2() {
  const [active, setActive] = useState(0);
  const serviceDetails = useServicePillars();
  const service = serviceDetails[active];
  const eyebrow = useDynamicContent("services.intro_eyebrow", "One Method, Four Stages");
  const heading = useDynamicContent("services.intro_heading", "Assess, Transform, Empower, Comply");

  return (
    <section className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        {/* Section heading — gives the page a proper opening beat instead of
            jumping straight into the tab switcher. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-10 sm:mb-12 text-center"
        >
          <span className="inline-block mb-5 rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
            {eyebrow}
          </span>
          <h2
            className="mx-auto max-w-2xl leading-[1.1] tracking-[-0.025em] text-[#073B70]"
            style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem, 4.2vw, 3rem)" }}
          >
            {heading}
          </h2>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mb-10 sm:mb-14 flex flex-wrap justify-center gap-2.5 sm:gap-3 rounded-2xl bg-[#F7F7F5] p-2 w-fit mx-auto"
        >
          {serviceDetails.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(i)}
              className="relative rounded-xl px-5 sm:px-7 py-3 text-[13.5px] sm:text-[14.5px] font-semibold transition-colors duration-300"
            >
              {i === active && (
                <motion.span
                  layoutId="service2-tab-pill"
                  className="absolute inset-0 rounded-xl bg-[#073B70] shadow-[0_10px_24px_rgba(15,61,46,0.25)]"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className={`relative ${i === active ? "text-white" : "text-[#073B70]/55 hover:text-[#073B70]"}`}>
                {s.title}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Active pillar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={service.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center mb-12 sm:mb-16">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(15,61,46,0.12)]">
                <FallbackImage
                  src={service.image}
                  alt={`ACE — ${service.title}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-5">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F5C518]/15 px-4 py-2.5 text-[14.5px] font-extrabold tracking-[0.1em] text-[#073B70]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5C518] text-[11px] text-[#073B70]">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  {service.title.toUpperCase()}
                </span>
                {service.intro.map((p, idx) => (
                  <p key={idx} className="text-[17.5px] font-bold leading-relaxed text-[#073B70]/80">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-10 pt-2">
              {service.items.map((item, idx) => (
                <ServiceItemCard2 key={item.title} index={idx + 1} title={item.title} body={item.body} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <SkillsExpertise2 />
      </div>
    </section>
  );
}
