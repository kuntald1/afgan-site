import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { assets } from "../../assets";
import { globalCompact } from "../../content";
import { useDynamicContent } from "../../hooks/useDynamicContent";
import FallbackImage from "./FallbackImage";

const SLIDE_DURATION = 6000;

export default function HeroSlider() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const slides = assets.heroSlides;

  const headline = useDynamicContent(
    "hero.headline",
    "Welcome To Afghanistan Center for Excellence"
  );
  const badgeLabel = useDynamicContent("hero.badge_label", "UN & Government Partner");
  const badgeYear = useDynamicContent("hero.badge_year", "Since 2012");

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [reduced, slides.length]);

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] w-full">
        {/* Rotating background slides */}
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <FallbackImage
                src={slides[active]}
                alt="ACE — field work across Afghanistan"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scrim for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16212b]/90 via-[#16212b]/55 to-[#16212b]/30" />

        {/* Decorative dot grid, Solvior-style corner flourish */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-24 hidden sm:block opacity-30"
          style={{
            width: 140,
            height: 140,
            backgroundImage:
              "radial-gradient(#F26522 1.5px, transparent 1.5px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* Slide indicators */}
        <div className="absolute left-5 sm:left-8 lg:left-12 bottom-8 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-7 bg-[#F26522]" : "w-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* UN Global Compact — "we support" badge, floating bottom-right */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex absolute right-8 xl:right-12 bottom-8 z-20 w-[320px] items-start gap-3.5 rounded-2xl glass-panel-soft p-5"
        >
          <img
            src={assets.unGlobalCompact}
            alt="UN Global Compact — We Support"
            className="h-14 w-14 flex-shrink-0 object-contain"
          />
          <p className="text-[12.5px] leading-relaxed text-white/85">{globalCompact}</p>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] w-full max-w-[1200px] flex-col justify-end px-5 sm:px-8 lg:px-12 pb-28 sm:pb-32 lg:pb-36 pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl font-medium leading-[1.1] tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2rem, 5.5vw, 3.75rem)" }}
          >
            {headline}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <Link
              to="/contact"
              className="group flex items-center gap-3 rounded-full bg-[#F26522] hover:bg-[#e05a1a] pl-6 pr-2 py-2 text-[14px] font-medium text-white transition-colors duration-300"
            >
              Free consultation
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
                <ArrowRight size={14} className="text-[#F26522]" />
              </span>
            </Link>

            <div className="flex items-center gap-2.5 rounded-full border border-white/25 px-4 py-2">
              <span className="text-[13px] font-medium text-white/90">{badgeLabel}</span>
              <span className="rounded-full bg-[#F26522] px-2 py-0.5 text-[11px] text-white">
                {badgeYear}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
