import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { serviceDetails } from "../content";
import { assets } from "../assets";
import { Reveal } from "./motion/Reveal";

const IMAGES: Record<string, string> = {
  assess: assets.serviceAssess,
  transform: assets.serviceTransform,
  empower: assets.serviceEmpower,
  comply: assets.serviceComply,
};

function PillarCard({
  index,
  total,
  pillar,
}: {
  index: number;
  total: number;
  pillar: (typeof serviceDetails)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // As this card is covered by the next one, it shrinks slightly and dims —
  // giving the stack a sense of depth rather than a flat pile.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `calc(6rem + ${index * 1.25}rem)` }}
    >
      <motion.div
        style={reduced ? undefined : { scale, opacity }}
        className="glass-panel overflow-hidden rounded-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <span className="text-[12px] font-semibold tracking-[0.16em] text-[#F26522]">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <h3
              className="mt-3 font-medium tracking-[-0.02em] text-[#16212b]"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}
            >
              {pillar.title}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[#16212b]/70">
              {pillar.intro[0]}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {pillar.items.slice(0, 4).map((item) => (
                <li
                  key={item.title}
                  className="rounded-full border border-black/10 px-3 py-1 text-[12px] text-[#16212b]/70"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-[220px] md:min-h-[340px]">
            <img
              src={IMAGES[pillar.key]}
              alt={`ACE — ${pillar.title}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PillarStack() {
  return (
    <section className="pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <Reveal className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="glass-panel-soft rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[12px] sm:text-[13px] font-medium">
            How we work
          </span>
        </Reveal>

        <Reveal delay={0.08} className="mb-10 sm:mb-14">
          <h2
            className="font-medium leading-[1.08] tracking-[-0.03em] text-[#16212b]"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3.2rem)" }}
          >
            One method, four stages.
          </h2>
        </Reveal>

        {/* Sticky stack — each card pins, then the next slides over it. */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {serviceDetails.map((pillar, i) => (
            <PillarCard
              key={pillar.key}
              index={i}
              total={serviceDetails.length}
              pillar={pillar}
            />
          ))}
        </div>

        <div className="mt-14 sm:mt-16 flex justify-center">
          <Link
            to="/services"
            className="group inline-flex items-center gap-3 rounded-full bg-[#16212b] pl-6 pr-2 py-2 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-[#243542]"
          >
            Explore all services
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
              <ArrowRight size={14} className="text-[#16212b]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
