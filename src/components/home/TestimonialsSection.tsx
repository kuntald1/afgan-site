import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials, projectsList } from "../../content";
import { assets } from "../../assets";
import { Reveal } from "../motion/Reveal";
import Counter from "../motion/Counter";
import FallbackImage from "./FallbackImage";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Two angled comma/flag shapes, matching the reference's flat
 * "quote-right" mark — deliberately not a circle-badged serif glyph. */
function QuoteMark() {
  const comma =
    "h-8 w-6 bg-[#0B4F92] [clip-path:polygon(0_0,100%_0,100%_100%,38%_100%,0_58%)]";
  return (
    <div className="flex items-center gap-2">
      <span className={comma} />
      <span className={comma} />
    </div>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  const shift = (dir: 1 | -1) => {
    setActive((i) => (i + dir + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const id = setInterval(() => shift(1), 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F4F2ED]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <Reveal className="mb-4">
          <span className="rounded-full border border-[#0B4F92]/25 bg-[#0B4F92]/[0.04] px-4 py-1.5 text-[12px] sm:text-[13px] font-medium text-[#0B4F92]">
            // Clients feedback
          </span>
        </Reveal>
        <Reveal delay={0.06} className="mb-10 sm:mb-14">
          <h2
            className="font-medium leading-[1.1] tracking-[-0.02em] text-[#16212b]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Our partners' testimonials
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-stretch">
          {/* Photo + stat overlay — solid card, no decorative background
              behind it (opaque, so the site's network-dot backdrop never
              shows through here). */}
          <Reveal className="relative aspect-[3/4] max-w-[440px] mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(22,33,43,0.15)]">
            <FallbackImage
              src={assets.homeTestimonial}
              alt="ACE — partner meeting"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-5 bottom-5 right-5 sm:right-auto sm:w-[200px] rounded-xl bg-[#16212b] p-5">
              <p className="text-[26px] sm:text-[28px] font-medium text-white tracking-[-0.02em]">
                <Counter value={String(projectsList.length)} />+
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-white/70">
                Projects delivered for partners since 2012.
              </p>
            </div>
          </Reveal>

          {/* Quote panel */}
          <Reveal delay={0.1} className="relative flex flex-col justify-center overflow-hidden bg-white rounded-2xl border border-black/8 p-7 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <QuoteMark />

                <p className="mt-6 text-[18px] sm:text-[19px] leading-relaxed text-[#16212b]/80">
                  {t.quote}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-black/8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#16212b] text-[13px] font-semibold text-white">
                      {initials(t.name)}
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold tracking-wide text-[#16212b]">
                        {t.name.toUpperCase()}
                      </p>
                      <p className="text-[12px] text-[#16212b]/55">{t.org}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      aria-label="Previous testimonial"
                      onClick={() => shift(-1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#16212b] transition-colors hover:border-[#F26522] hover:text-[#F26522]"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next testimonial"
                      onClick={() => shift(1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-[#16212b] transition-colors hover:border-[#F26522] hover:text-[#F26522]"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
