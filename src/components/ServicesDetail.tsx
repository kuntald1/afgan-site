import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { serviceDetails } from "../content";
import { assets } from "../assets";
import ServiceItemCard from "./ServiceItemCard";
import { Reveal } from "./motion/Reveal";
import { ScrollZoom } from "./motion/ScrollEffects";

const IMAGES: Record<string, string> = {
  assess: assets.serviceAssess,
  transform: assets.serviceTransform,
  empower: assets.serviceEmpower,
  comply: assets.serviceComply,
};

export default function ServicesDetail() {
  const [active, setActive] = useState(0);
  const service = serviceDetails[active];

  return (
    <section id="services" className="pt-6 sm:pt-8 pb-10 sm:pb-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        {/* Tab switcher */}
        <Reveal className="flex flex-wrap gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          {serviceDetails.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(i)}
              className="glass-panel-soft relative rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-[13px] sm:text-[14px] font-medium transition-colors duration-300"
            >
              {i === active && (
                <motion.span
                  layoutId="service-tab-pill"
                  className="absolute inset-0 rounded-full bg-[#F26522]"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span
                className={`relative ${
                  i === active ? "text-white" : "text-[#16212b]/70 hover:text-[#16212b]"
                }`}
              >
                {s.title}
              </span>
            </button>
          ))}
        </Reveal>

        {/* Active pillar content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={service.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-8 sm:mb-12">
              <ScrollZoom className="w-full aspect-[3/2] rounded-xl">
                <img
                  src={IMAGES[service.key]}
                  alt={`ACE — ${service.title}`}
                  className="h-full w-full object-cover"
                />
              </ScrollZoom>
              <div className="flex flex-col gap-4">
                <span className="text-[12px] font-semibold tracking-[0.14em] text-[#F26522]">
                  {String(active + 1).padStart(2, "0")} — {service.title.toUpperCase()}
                </span>
                {service.intro.map((p, idx) => (
                  <p key={idx} className="text-[15px] leading-relaxed text-[#16212b]/70">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 pt-2">
              {service.items.map((item, idx) => (
                <ServiceItemCard
                  key={item.title}
                  index={idx + 1}
                  title={item.title}
                  body={item.body}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
