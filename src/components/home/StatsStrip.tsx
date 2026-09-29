import { stats, impactIntro } from "../../content";
import { assets } from "../../assets";
import { Reveal, RevealGroup, RevealItem } from "../motion/Reveal";
import Counter from "../motion/Counter";
import FallbackImage from "./FallbackImage";

export default function StatsStrip() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F4F2ED]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
        <Reveal className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(22,33,43,0.15)]">
          <FallbackImage
            src={assets.homeStats}
            alt="ACE — trusted by government, private sector and NGO partners"
            className="h-full w-full object-cover"
          />
        </Reveal>

        <div>
          <Reveal className="mb-4">
            <span className="rounded-full border border-[#0B4F92]/25 bg-[#0B4F92]/[0.04] px-4 py-1.5 text-[12px] sm:text-[13px] font-medium text-[#0B4F92]">
              // Real impact, not projections
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className="font-medium leading-[1.12] tracking-[-0.02em] text-[#16212b]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.6rem)" }}
            >
              Trusted by government, industry and NGO partners
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 text-[15px] leading-relaxed text-[#16212b]/70 max-w-lg">
              {impactIntro}
            </p>
          </Reveal>

          <RevealGroup className="mt-9 grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map((s) => (
              <RevealItem
                key={s.label}
                className="rounded-xl border border-black/8 bg-white p-5"
              >
                <p
                  className="font-medium text-[#F26522] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(1.65rem, 3.2vw, 2.25rem)" }}
                >
                  <Counter value={s.value} />
                </p>
                <p className="mt-1.5 text-[13px] leading-snug text-[#16212b]/60">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
