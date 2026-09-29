import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { assets } from "../../assets";
import { offices, teamStats } from "../../content";
import { RevealGroup, RevealItem } from "../motion/Reveal";
import Counter from "../motion/Counter";
import FallbackImage from "../home/FallbackImage";

const points = [
  `${teamStats[0].value} experienced Afghan consultants`,
  `Offices across ${offices.join(", ")}`,
  "Majority-local, on-the-ground team since 2012",
];

const yearsActive = new Date().getFullYear() - 2012;

export default function About2() {
  return (
    <section className="pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 lg:pb-10 bg-white overflow-hidden">
      {/* One coordinated stagger group (photo, then text block) instead of
          five separately-triggered Reveals — that's what was causing the
          "stuck, then plays" feel on scroll. */}
      <RevealGroup className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Photo — tilted, larger yellow backdrop shape peeking out behind
            a bigger photo, with a spinning "Business Consulting" badge
            overlapping the top-left corner. */}
        <RevealItem className="relative max-w-[520px] mx-auto lg:mx-0 lg:ml-8">
          <div
            aria-hidden
            className="absolute -inset-5 rounded-2xl bg-[#F5C518]"
            style={{ transform: "rotate(-4deg)" }}
          />
          <div className="relative aspect-[4/4.3] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(15,61,46,0.2)]">
            <FallbackImage
              src={assets.home2AboutLarge}
              alt="ACE consulting session"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Spinning circular text badge, top-left */}
          <div className="hidden sm:flex absolute -left-10 -top-10 h-32 w-32 items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite]">
              <defs>
                <path id="badgeCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text fill="#073B70" fontSize="9" fontWeight={600} letterSpacing="1.5">
                <textPath href="#badgeCircle">
                  Business Consulting • Business Consulting •
                </textPath>
              </text>
            </svg>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#073B70] shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
              <img src={assets.logoWhite} alt="ACE" className="h-6 w-6 object-contain" />
            </span>
          </div>
        </RevealItem>

        <RevealItem>
          <span className="inline-block mb-5 rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
            About Our Consulting
          </span>
          <h2
            className="leading-[1.12] tracking-[-0.02em] text-[#073B70]"
            style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Driving Institutional Change Through Strategy
          </h2>
          <p
            className="mt-5 max-w-md leading-relaxed text-[#073B70]/60"
            style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 500, fontSize: "18px" }}
          >
            ACE is a results-driven, Afghan-owned consulting company helping
            government, private-sector and NGO partners improve performance,
            strengthen institutions, and deliver measurable outcomes.
          </p>

          <div className="flex flex-wrap items-end justify-between gap-8">
            <ul className="mt-7 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[14.5px] text-[#073B70]/80">
                  <CheckCircle2 size={18} className="flex-shrink-0 text-[#F5C518]" fill="#073B70" />
                  {point}
                </li>
              ))}
            </ul>

            {/* Years-active badge — animates 1 → 14 via the same Counter
                component used in the hero. Circle now uses the site's dark
                green, with the number in the site's yellow, per request. */}
            <div className="relative hidden md:flex h-36 w-36 flex-shrink-0 items-center justify-center rounded-full bg-[#073B70]">
              <div className="text-center">
                <span
                  className="block text-[46px] font-extrabold leading-none text-[#F5C518]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  <Counter value={`${yearsActive}+`} durationMs={2500} startDelayMs={200} startValue={1} />
                </span>
                <span className="mt-1 block text-[11px] font-medium text-white/70">
                  Years Experience
                </span>
              </div>
            </div>
          </div>

          <div className="mt-9">
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 rounded-md bg-[#F5C518] hover:bg-[#e6b800] pl-6 pr-2 py-2.5 text-[14px] font-semibold text-[#073B70] transition-colors duration-300"
            >
              More Details
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#073B70] transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={15} className="text-[#F5C518]" />
              </span>
            </Link>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
