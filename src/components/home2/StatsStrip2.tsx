import { useState } from "react";
import { motion } from "framer-motion";
import { stats } from "../../content";
import Counter from "../motion/Counter";
import { useDynamicContent } from "../../hooks/useDynamicContent";

/**
 * StatsStrip2
 * Takes over the slot where PartnersStrip2 ("Trusted by 15+ Partners &
 * Institutions") used to sit. Same four real figures that were in the hero
 * (2,973 / 17,533 / 47 / 74) and the same Counter animation — just much
 * larger, on white, with thin vertical dividers and a soft arc overhead.
 *
 * In HomePageV2.tsx, swap the import and the tag:
 *   - import PartnersStrip2 from "../components/home2/PartnersStrip2";
 *   + import StatsStrip2 from "../components/home2/StatsStrip2";
 *   - <PartnersStrip2 />
 *   + <StatsStrip2 />
 */
export default function StatsStrip2() {
  // Bumped every time the strip scrolls back into view. It's used as the
  // Counter's key, so React remounts each Counter and the count-up replays
  // from zero — without touching the shared Counter component itself.
  const [run, setRun] = useState(0);

  // These reuse the EXISTING seeded impact.* keys (already in admin/backend/
  // app/seed.py) rather than new home2-specific ones — content.ts's `stats`
  // array already holds the exact same four figures (2,973 / 17,533 / 47 /
  // 74), so this is the same data, just fetched instead of hardcoded.
  // React's rules of hooks mean these can't be called inside stats.map()
  // below, so they're called here at fixed positions and zipped in by index.
  const overrides = [
    {
      value: useDynamicContent("impact.stat_1_value", stats[0]?.value ?? ""),
      label: useDynamicContent("impact.stat_1_label", stats[0]?.label ?? ""),
    },
    {
      value: useDynamicContent("impact.stat_2_value", stats[1]?.value ?? ""),
      label: useDynamicContent("impact.stat_2_label", stats[1]?.label ?? ""),
    },
    {
      value: useDynamicContent("impact.stat_3_value", stats[2]?.value ?? ""),
      label: useDynamicContent("impact.stat_3_label", stats[2]?.label ?? ""),
    },
    {
      value: useDynamicContent("impact.stat_4_value", stats[3]?.value ?? ""),
      label: useDynamicContent("impact.stat_4_label", stats[3]?.label ?? ""),
    },
  ];
  const liveStats = stats.map((s, i) => overrides[i] ?? s);

  return (
    <section
      className="relative overflow-hidden bg-white py-16 sm:py-20"
    >
      {/* Soft arc above the row, as in the reference */}
      <svg
        aria-hidden
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full"
      >
        <path
          d="M -40 118 C 360 6, 1080 6, 1480 118"
          fill="none"
          stroke="#073B70"
          strokeOpacity="0.12"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4"
          viewport={{ once: false, margin: "-60px" }}
          onViewportEnter={() => setRun((n) => n + 1)}
        >
          {liveStats.map((s, i) => {
            const entranceDelay = i * 0.14;
            const entranceDuration = 0.55;
            const settleMs = (entranceDelay + entranceDuration) * 1000;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-60px" }}
                transition={{ duration: entranceDuration, delay: entranceDelay, ease: [0.22, 1, 0.36, 1] }}
                className={`px-4 py-8 sm:px-8 ${
                  i > 0 ? "lg:border-l lg:border-[#073B70]/10" : ""
                } ${i % 2 === 1 ? "border-l border-[#073B70]/10 lg:border-l" : ""}`}
              >
                <span
                  className="block font-extrabold leading-none text-[#073B70]"
                  style={{
                    fontFamily: "Urbanist, sans-serif",
                    fontSize: "clamp(2.6rem, 5.2vw, 4.4rem)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <Counter
                    key={`${s.label}-${run}`}
                    value={s.value}
                    durationMs={2500}
                    startDelayMs={settleMs}
                  />
                </span>
                <p className="mt-4 max-w-[17rem] text-[16.5px] font-semibold leading-relaxed text-[#073B70]/70">
                  {s.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
