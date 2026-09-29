import { testimonials } from "../content";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";

export default function Testimonials() {
  return (
    <section id="testimonials" className="pt-10 sm:pt-12 lg:pt-14 pb-10 sm:pb-14">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <Reveal className="flex items-center gap-3 mb-8 sm:mb-10">
          <span className="rounded-full border border-black/8 px-3 sm:px-4 py-1 sm:py-1.5 text-[12px] sm:text-[13px] font-medium">
            Testimonials
          </span>
        </Reveal>

        <Reveal
          as="div"
          className="font-medium leading-[1.08] tracking-[-0.03em] text-[#16212b] mb-8 sm:mb-10"
        >
          <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 3.2rem)" }}>What our partners say</h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <RevealItem
              key={t.name}
              className="relative rounded-2xl border border-black/8 glass-panel p-6 sm:p-8"
            >
              <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#F26522] text-[18px] font-serif leading-none text-[#16212b]">
                &rdquo;
              </span>
              <p className="mt-2 text-[14.5px] sm:text-[15px] leading-relaxed text-[#16212b]/75">
                {t.quote}
              </p>
              <div className="mt-5 pt-4 border-t border-black/8">
                <p className="text-[13px] font-semibold tracking-wide text-[#16212b]">
                  {t.name.toUpperCase()}
                </p>
                <p className="text-[12px] text-[#16212b]/55">{t.org}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
