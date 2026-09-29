import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { assets } from "../../assets";
import { offices, teamStats } from "../../content";
import { Reveal } from "../motion/Reveal";
import Counter from "../motion/Counter";
import FallbackImage from "./FallbackImage";

const points = [
  `${teamStats[0].value} core Afghan consultants, ${teamStats[1].value} project specialists`,
  `Offices across ${offices.join(", ")}`,
  `${teamStats[2].value} of our core team are women`,
];

const yearsActive = new Date().getFullYear() - 2012;

export default function AboutSplit() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Overlapping image pair */}
        <Reveal className="relative">
          <div className="relative aspect-[3/4] sm:aspect-[2/3] max-w-[460px] mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(22,33,43,0.15)]">
            <FallbackImage
              src={assets.homeAboutSmall}
              alt="ACE team at work"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden sm:block absolute -bottom-8 -right-4 lg:-right-10 w-[55%] aspect-[4/3] rounded-2xl overflow-hidden border-4 border-[#F4F2ED] shadow-[0_24px_60px_rgba(22,33,43,0.2)]">
            <FallbackImage
              src={assets.homeAboutLarge}
              alt="ACE field assessment"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden sm:flex absolute -top-6 -left-6 h-20 w-20 items-center justify-center rounded-full bg-[#16212b] shadow-[0_10px_30px_rgba(22,33,43,0.25)]">
            <img src={assets.logoWhite} alt="ACE" className="h-9 w-auto object-contain" />
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal className="flex items-center gap-3 mb-5">
            <span className="rounded-full border border-[#0B4F92]/25 bg-[#0B4F92]/[0.04] px-4 py-1.5 text-[12px] sm:text-[13px] font-medium text-[#0B4F92]">
              // Afghan-owned since 2012
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className="font-medium leading-[1.12] tracking-[-0.02em] text-[#16212b]"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
            >
              Empowering Afghanistan's business vision
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 text-[15px] leading-relaxed text-[#16212b]/70">
              ACE supports national and international stakeholders in tackling
              Afghanistan's most pressing social and economic challenges — through
              independent assessment, hands-on institutional reform, and workforce
              programs delivered by a majority-local team.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <ul className="mt-7 space-y-3">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-[14.5px] text-[#16212b]/80"
                >
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-[#F26522]" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.22} className="mt-9 flex flex-wrap items-center gap-8">
            <Link
              to="/about"
              className="group flex items-center gap-3 rounded-full bg-[#16212b] hover:bg-[#243542] pl-6 pr-2 py-2 text-[14px] font-medium text-white transition-colors duration-300"
            >
              Free consultation
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
                <ArrowRight size={14} className="text-[#16212b]" />
              </span>
            </Link>

            <div className="flex items-baseline gap-2">
              <span
                className="font-medium text-[#F26522] tracking-[-0.02em]"
                style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}
              >
                <Counter value={String(yearsActive)} />+
              </span>
              <span className="text-[13px] leading-snug text-[#16212b]/60 max-w-[9rem]">
                years of local, on-the-ground consulting experience
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
