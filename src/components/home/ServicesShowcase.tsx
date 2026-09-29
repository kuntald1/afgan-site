import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ClipboardCheck,
  RefreshCw,
  Users,
  ShieldCheck,
} from "lucide-react";
import { serviceDetails } from "../../content";
import { assets } from "../../assets";
import { Reveal } from "../motion/Reveal";
import FallbackImage from "./FallbackImage";

const IMAGES: Record<string, string> = {
  assess: assets.serviceAssess,
  transform: assets.serviceTransform,
  empower: assets.serviceEmpower,
  comply: assets.serviceComply,
};

const ICONS: Record<string, typeof ClipboardCheck> = {
  assess: ClipboardCheck,
  transform: RefreshCw,
  empower: Users,
  comply: ShieldCheck,
};

export default function ServicesShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = (i: number) => {
    const clamped = Math.min(Math.max(i, 0), serviceDetails.length - 1);
    const track = trackRef.current;
    const card = track?.children[clamped] as HTMLElement | undefined;
    if (track && card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
    setActive(clamped);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#16212b]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <Reveal className="mb-4">
              <span className="rounded-full border border-white/15 px-4 py-1.5 text-[12px] sm:text-[13px] font-medium text-white/70">
                // Our method
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="font-medium leading-[1.1] tracking-[-0.02em] text-white"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                Get our comprehensive service offerings
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="flex items-center gap-3">
            <Link
              to="/services"
              className="hidden sm:inline-flex items-center gap-2 text-[14px] font-medium text-white hover:text-[#F26522] transition-colors mr-2"
            >
              View all services <ArrowUpRight size={16} />
            </Link>
            <button
              type="button"
              aria-label="Previous service"
              onClick={() => scrollToIndex(active - 1)}
              disabled={active === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#F26522] hover:text-[#F26522] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next service"
              onClick={() => scrollToIndex(active + 1)}
              disabled={active === serviceDetails.length - 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#F26522] hover:text-[#F26522] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white"
            >
              <ArrowRight size={16} />
            </button>
          </Reveal>
        </div>

        {/* Card track — scroll-snap so the arrow/dot controls and a plain
            swipe both work; scrollbar hidden via .no-scrollbar. */}
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          {serviceDetails.map((pillar, i) => {
            const Icon = ICONS[pillar.key];
            return (
              <Reveal key={pillar.key} delay={i * 0.05} className="snap-start flex-shrink-0 basis-[85%] sm:basis-[47%] lg:basis-[31.5%]">
                <Link
                  to="/services"
                  className="group relative flex h-full min-h-[400px] flex-col justify-between overflow-hidden rounded-2xl border-t-[3px] border-t-[#F26522] bg-white p-8 shadow-[0_18px_44px_rgba(0,0,0,0.25)] transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
                >
                  {/* Photo layer — always visible, brightens on hover */}
                  <div className="absolute inset-0">
                    <FallbackImage
                      src={IMAGES[pillar.key]}
                      alt={pillar.title}
                      className="h-full w-full object-cover transition-[filter] duration-500 brightness-[0.55] group-hover:brightness-[0.8]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16212b]/95 via-[#16212b]/70 to-[#16212b]/40 transition-opacity duration-500 group-hover:opacity-70" />
                  </div>

                  <div className="relative z-10">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-500 group-hover:bg-white/25">
                      <Icon size={26} />
                    </span>
                  </div>

                  <div className="relative z-10">
                    <span className="text-[13px] font-semibold tracking-[0.1em] text-white/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-[21px] sm:text-[22px] font-medium tracking-[-0.01em] text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-white/75">
                      {pillar.intro[0]}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-white">
                      Get optimization
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2.5">
          {serviceDetails.map((pillar, i) => (
            <button
              key={pillar.key}
              type="button"
              aria-label={`Show ${pillar.title}`}
              onClick={() => scrollToIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "h-2.5 w-6 bg-[#F26522]" : "h-2.5 w-2.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
