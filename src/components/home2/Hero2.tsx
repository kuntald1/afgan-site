import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../../assets";
import { globalCompact } from "../../content";
import FallbackImage from "../home/FallbackImage";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * Hero2 — full-bleed photo hero.
 *
 * The old split layout (green copy column + photo column) is gone. The photo
 * now fills the entire section and cross-fades between the slides listed in
 * assets.home2HeroSlides every 6 seconds.
 *
 * REQUIRED in src/assets.ts — add this array next to the other home2 entries:
 *
 *   home2HeroSlides: [
 *     "/assets/images/home2/hero-1.jpg",
 *     "/assets/images/home2/hero-2.jpg",
 *     "/assets/images/home2/hero-3.jpg",
 *     "/assets/images/home2/hero-4.jpg",
 *   ],
 *
 * Image guidance: landscape, at least 1920x1080, sharp/high-contrast subjects.
 * Because the photo now carries the whole hero, keep the important subject
 * roughly centre-right — the left and bottom edges sit under the text scrim.
 * Use licensed photos only (the previous hero image was a watermarked stock
 * preview and must not ship).
 */

const SLIDE_MS = 6000;

/**
 * Local stand-in for the shared <Reveal>, with `once: false` so the entrance
 * replays every time the element scrolls back into view. Deliberately defined
 * here rather than changing components/motion/Reveal.tsx, which the original
 * site's pages also use.
 */
function RevealRepeat({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Hero2() {
  const staticSlides: string[] = assets.home2HeroSlides ?? [assets.home2Hero];

  // Each slide is independently CMS-managed — falls back to its current
  // static asset if the admin hasn't uploaded a replacement yet.
  const slide1 = useDynamicContent("home2.hero.slide_1", staticSlides[0] ?? "");
  const slide2 = useDynamicContent("home2.hero.slide_2", staticSlides[1] ?? staticSlides[0] ?? "");
  const slide3 = useDynamicContent("home2.hero.slide_3", staticSlides[2] ?? staticSlides[0] ?? "");
  const slide4 = useDynamicContent("home2.hero.slide_4", staticSlides[3] ?? staticSlides[0] ?? "");
  const slides = [slide1, slide2, slide3, slide4]
    .filter(Boolean)
    .map((s) => resolveMediaUrl(s));

  const eyebrow = useDynamicContent("home2.hero.eyebrow", "Business Consulting");
  const headlineLine1 = useDynamicContent("home2.hero.headline_line1", "Welcome To");
  const headlineLine2 = useDynamicContent(
    "home2.hero.headline_line2",
    "Afghanistan Center for Excellence"
  );
  const badgeLabel = useDynamicContent("home2.hero.badge_label", "UN & Government Partner");
  const badgeYear = useDynamicContent("home2.hero.badge_year", "Since 2012");

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative min-h-[560px] lg:min-h-[720px] overflow-hidden bg-[#073B70]">
      {/* Slideshow layer — cross-fade only, no blur, no heavy tint, so the
          photograph stays crisp and prominent. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <FallbackImage
            src={slides[index]}
            alt="ACE — consulting in Afghanistan"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility scrim: strong at the left/bottom where the text sits,
          clearing to almost nothing over the right of the frame. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(100deg,rgba(7,59,112,0.92)_0%,rgba(7,59,112,0.72)_34%,rgba(7,59,112,0.22)_62%,rgba(7,59,112,0.05)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(to_top,rgba(7,59,112,0.75),transparent)]"
      />

      {/* Faint decorative dot grid, far left — kept from the old hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-6 top-1/4 hidden lg:block opacity-25 z-10"
        style={{
          width: 140,
          height: 140,
          backgroundImage: "radial-gradient(#F5C518 1.5px, transparent 1.5px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 flex min-h-[560px] lg:min-h-[720px] flex-col justify-between px-5 sm:px-8 lg:px-12 xl:px-16 pt-16 lg:pt-24 pb-20 lg:pb-24">
        {/* Top — eyebrow + headline */}
        <div>
          <RevealRepeat className="mb-5">
            <span className="inline-block rounded-md border border-[#F5C518]/40 bg-[#073B70]/30 px-4 py-2 text-[13px] font-medium text-white/90 backdrop-blur-sm">
              {eyebrow}
            </span>
          </RevealRepeat>

          <RevealRepeat delay={0.08}>
            <h1
              className="max-w-5xl leading-[1.14] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]"
              style={{
                fontFamily: "Urbanist, sans-serif",
                fontWeight: 600,
                fontSize: "clamp(1.75rem, 3.5vw, 3.15rem)",
              }}
            >
              {headlineLine1}
              <br />
              {headlineLine2}
            </h1>
          </RevealRepeat>
        </div>

        {/* Bottom row — buttons bottom-left, UN Global Compact card bottom-right */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <RevealRepeat delay={0.16} className="flex flex-wrap items-center gap-4">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px rgba(245,197,24,0)",
                  "0 0 14px rgba(245,197,24,0.5)",
                  "0 0 0px rgba(245,197,24,0)",
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2.5 rounded-full border border-white/30 bg-[#073B70]/35 px-4 py-2.5 backdrop-blur-sm"
            >
              <span className="text-[13px] font-medium text-white/90">{badgeLabel}</span>
              <span className="rounded-full bg-[#F5C518] px-2 py-0.5 text-[11px] font-semibold text-[#073B70]">
                {badgeYear}
              </span>
            </motion.div>
          </RevealRepeat>

          {/* Unchanged card, same bottom-right placement and float */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[280px] sm:w-[300px] shrink-0 rounded-2xl border border-[#F5C518]/30 bg-[#073B70] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#F5C518]">
                <img
                  src={assets.unGlobalCompact}
                  alt="UN Global Compact"
                  className="h-9 w-9 object-contain"
                />
              </div>
              <p className="text-[12.5px] leading-relaxed text-white/80">{globalCompact}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-7 bg-[#F5C518]" : "w-3 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
