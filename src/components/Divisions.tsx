import { divisions } from "../content";
import { assets } from "../assets";
import { Reveal } from "./motion/Reveal";
import { ScrollZoom } from "./motion/ScrollEffects";
import Parallax from "./motion/Parallax";

export default function Divisions() {
  return (
    <section id="divisions" className="pt-6 sm:pt-8 pb-10 sm:pb-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        {divisions.map((d, i) => {
          const flip = i % 2 === 1;
          return (
            <div
              key={d.key}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center py-9 sm:py-12 border-t border-black/8 first:border-t-0"
            >
              <Parallax strength={flip ? -26 : 26} className={flip ? "lg:order-2" : ""}>
                <ScrollZoom className="w-full aspect-[3/2] rounded-2xl">
                  <img
                    src={assets.divisionImages[d.key as keyof typeof assets.divisionImages]}
                    alt={`ACE division — ${d.name}`}
                    className="h-full w-full object-cover"
                  />
                </ScrollZoom>
              </Parallax>

              <Reveal delay={0.08} className={flip ? "lg:order-1" : ""}>
                <h3
                  className="font-medium tracking-[0.02em] text-[#16212b]"
                  style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)" }}
                >
                  {d.name}
                </h3>
                <span className="mt-3 mb-6 block h-[2px] w-10 bg-[#F26522]" />

                <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-[#16212b]/70">
                  {d.body}
                </p>

                {d.links.length > 0 && (
                  <div className="mt-7 flex flex-wrap gap-3">
                    {d.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        className="rounded-full border border-[#16212b]/15 px-5 py-2 text-[12px] font-semibold tracking-wide uppercase text-[#16212b]/80 transition-colors duration-300 hover:border-[#F26522] hover:text-[#F26522]"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
