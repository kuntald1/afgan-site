import { overview, offices, teamStats, aspirationsIntro, aspirations } from "../content";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import Counter from "./motion/Counter";

export default function Overview() {
  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <div className="glass-panel mx-auto max-w-[1000px] rounded-2xl px-6 sm:px-10 lg:px-14 py-10 sm:py-12">
        <Reveal className="text-center mb-10 sm:mb-12">
          <h2 className="font-medium tracking-[0.06em] text-[#16212b] text-[22px] sm:text-[26px]">
            OVERVIEW
          </h2>
          <span className="mt-3 inline-block h-[2px] w-8 bg-[#F26522]" />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-center text-[15px] sm:text-[16px] leading-relaxed text-[#16212b]/70 max-w-3xl mx-auto">
            {overview}
          </p>
        </Reveal>

        <RevealGroup className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto text-center">
          {teamStats.map((s) => (
            <RevealItem key={s.label}>
              <p className="font-mono text-[26px] sm:text-[30px] font-medium text-[#F26522]">
                <Counter value={s.value} />
              </p>
              <p className="mt-1 text-[13px] text-[#16212b]/55 leading-snug">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-[12px] tracking-wide text-[#16212b]/45">
            {offices.join(" · ")}
          </p>
        </Reveal>

        <Reveal className="mt-14 sm:mt-16 text-center mb-8 sm:mb-10">
          <h2 className="font-medium tracking-[0.06em] text-[#16212b] text-[22px] sm:text-[26px]">
            OUR ASPIRATIONS
          </h2>
          <span className="mt-3 inline-block h-[2px] w-8 bg-[#F26522]" />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-center text-[15px] sm:text-[16px] leading-relaxed text-[#16212b]/70 max-w-2xl mx-auto mb-10 sm:mb-12">
            {aspirationsIntro}
          </p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10">
          {aspirations.map((a) => (
            <RevealItem key={a.title}>
              <h4 className="text-[13px] font-semibold tracking-wide text-[#16212b] pb-2 border-b-2 border-[#F26522] inline-block">
                {a.title.toUpperCase()}
              </h4>
              <p className="mt-3 text-[14px] leading-relaxed text-[#16212b]/70">{a.detail}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
