import { stats as staticStats, impactHeading as staticHeading, impactIntro as staticIntro } from "../content";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import Counter from "./motion/Counter";
import { useDynamicContent } from "../hooks/useDynamicContent";

export default function Impact() {
  // Live content from the admin CMS, falling back to the static defaults
  // from src/content.ts if the admin API isn't configured/reachable.
  //
  // Each stat's value/label is its own explicit hook call (not a loop over
  // staticStats) so the number of hooks called is unambiguously fixed,
  // rather than relying on staticStats always having exactly 4 entries.
  const heading = useDynamicContent("impact.heading", staticHeading);
  const intro = useDynamicContent("impact.intro", staticIntro);

  const stat1Value = useDynamicContent("impact.stat_1_value", staticStats[0].value);
  const stat1Label = useDynamicContent("impact.stat_1_label", staticStats[0].label);
  const stat2Value = useDynamicContent("impact.stat_2_value", staticStats[1].value);
  const stat2Label = useDynamicContent("impact.stat_2_label", staticStats[1].label);
  const stat3Value = useDynamicContent("impact.stat_3_value", staticStats[2].value);
  const stat3Label = useDynamicContent("impact.stat_3_label", staticStats[2].label);
  const stat4Value = useDynamicContent("impact.stat_4_value", staticStats[3].value);
  const stat4Label = useDynamicContent("impact.stat_4_label", staticStats[3].label);

  const dynamicStats = [
    { value: stat1Value, label: stat1Label },
    { value: stat2Value, label: stat2Label },
    { value: stat3Value, label: stat3Label },
    { value: stat4Value, label: stat4Label },
  ];

  return (
    <section id="impact" className="pt-10 sm:pt-12 lg:pt-14 pb-10 sm:pb-12 lg:pb-16">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal className="max-w-3xl mb-8 sm:mb-10">
          <h2
            className="font-medium tracking-[0.03em] text-[#16212b] uppercase"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)" }}
          >
            {heading}
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-[#16212b]/70">
            {intro}
          </p>
        </Reveal>

        <RevealGroup className="glass-panel grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 rounded-2xl p-8 sm:p-10">
          {dynamicStats.map((s, i) => (
            <RevealItem key={i}>
              <p
                className="font-medium text-[#16212b] tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
              >
                <Counter value={s.value} />
              </p>
              <p className="mt-2 text-[13px] sm:text-[14px] leading-snug text-[#16212b]/70">
                {s.label}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
