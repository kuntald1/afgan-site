import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { testimonials } from "../../content";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import SectionHeading from "./SectionHeading";
import { EASE } from "./tokens";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

const INTERVAL = 6000;

export default function Testimonials2() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  const eyebrow = useDynamicContent("home2.testimonials.eyebrow", "Clients Feedback");
  const heading = useDynamicContent(
    "home2.testimonials.heading",
    "Client Experiences That Speak for Themselves"
  );
  const image = resolveMediaUrl(useDynamicContent("home2.testimonials.image", assets.home2Testimonial));

  const shift = (dir: 1 | -1) =>
    setActive((i) => (i + dir + testimonials.length) % testimonials.length);

  // Auto-advance; resets whenever the user steps through manually.
  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [active]);

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
      {/* Decorative sweep down the left side — one dashed green curve with a
          faint solid curve running just outside it. Stretches to the full
          section height so both lines run edge to edge. */}
      <svg
        aria-hidden
        viewBox="0 0 400 1000"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 top-0 hidden h-full w-[38%] max-w-[460px] lg:block"
      >
        <path
          d="M 150 0 C 40 260, 30 520, 120 1000"
          stroke="#073B70"
          strokeOpacity="0.32"
          strokeWidth="2"
          strokeDasharray="10 12"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 95 0 C -15 260, -25 520, 65 1000"
          stroke="#073B70"
          strokeOpacity="0.14"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow={eyebrow}
          title={heading}
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-center">
          {/* Fixed photo — stays put while the quotes rotate beside it */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.85, ease: EASE }}
            className="relative mx-auto w-full max-w-[380px]"
          >
            <div aria-hidden className="absolute -inset-4 rounded-full border-2 border-dashed border-[#073B70]/20" />
            <div aria-hidden className="absolute inset-0 translate-x-3 -translate-y-3 rounded-full bg-[#F5C518]" />
            <div className="relative aspect-square w-full overflow-hidden rounded-full">
              <FallbackImage
                src={image}
                alt="ACE partner"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Rotating quote card */}
          <div>
            <div className="relative min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={t.name}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="rounded-2xl border border-[#073B70]/10 bg-[#F7F7F5] p-7 sm:p-9"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#F5C518]">
                    <Quote size={22} className="text-[#073B70]" />
                  </span>
                  <blockquote
                    className="mt-6 leading-relaxed text-[#073B70]/75"
                    style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 500, fontSize: "18px" }}
                  >
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-7 rounded-xl bg-[#073B70] px-5 py-4">
                    <p className="text-[12px] text-white/60">{t.org}</p>
                    <p
                      className="mt-0.5 text-white"
                      style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "17px" }}
                    >
                      {t.name}
                    </p>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-7 flex items-center gap-4">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => shift(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#073B70]/15 text-[#073B70] transition-colors hover:border-[#F5C518] hover:bg-[#F5C518]"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => shift(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#073B70]/15 text-[#073B70] transition-colors hover:border-[#F5C518] hover:bg-[#F5C518]"
              >
                <ArrowRight size={17} />
              </button>

              <div className="ml-2 flex gap-2.5">
                {testimonials.map((item, i) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-label={`Show testimonial ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === active ? "h-2.5 w-6 bg-[#F5C518]" : "h-2.5 w-2.5 bg-[#073B70]/20 hover:bg-[#073B70]/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
