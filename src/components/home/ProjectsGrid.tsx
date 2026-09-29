import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projectsList } from "../../content";
import { assets } from "../../assets";
import { Reveal } from "../motion/Reveal";
import FallbackImage from "./FallbackImage";

const featured = projectsList.slice(0, 8);

export default function ProjectsGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = (i: number) => {
    const clamped = Math.min(Math.max(i, 0), featured.length - 1);
    const track = trackRef.current;
    const card = track?.children[clamped] as HTMLElement | undefined;
    if (track && card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
    setActive(clamped);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => {
        const next = (i + 1) % featured.length;
        const track = trackRef.current;
        const card = track?.children[next] as HTMLElement | undefined;
        if (track && card) {
          track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#16212b]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <Reveal className="mb-4">
              <span className="rounded-full border border-white/15 px-4 py-1.5 text-[12px] sm:text-[13px] font-medium text-white/70">
                // Featured field work
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="font-medium leading-[1.1] tracking-[-0.02em] text-white"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                Our recent projects
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="flex items-center gap-3">
            <Link
              to="/projects"
              className="hidden sm:inline-flex items-center gap-2 text-[14px] font-medium text-white hover:text-[#F26522] transition-colors mr-2"
            >
              View all {projectsList.length} projects <ArrowUpRight size={16} />
            </Link>
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => scrollToIndex(active - 1)}
              disabled={active === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#F26522] hover:text-[#F26522] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => scrollToIndex(active + 1)}
              disabled={active === featured.length - 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#F26522] hover:text-[#F26522] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white"
            >
              <ArrowRight size={16} />
            </button>
          </Reveal>
        </div>

        {/* Card track — scroll-snap slider, small cards, several visible at once */}
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          {featured.map((p, i) => (
            <Reveal
              key={p.key}
              delay={i * 0.04}
              className="snap-start flex-shrink-0 basis-[72%] sm:basis-[36%] lg:basis-[23%]"
            >
              <Link
                to="/projects"
                className="group block overflow-hidden rounded-xl border border-white/25 transition-colors duration-300 hover:border-[#F26522]/50"
              >
                <div className="h-[190px] w-full overflow-hidden bg-[#0d151c]">
                  <FallbackImage
                    src={assets.projectImages[p.key as keyof typeof assets.projectImages]}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex h-[104px] flex-col justify-between gap-3 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white transition-colors group-hover:text-[#F26522]">
                      {p.title}
                    </h3>
                    <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-[#F26522] group-hover:bg-[#F26522]">
                      <ArrowUpRight size={12} className="text-white" />
                    </span>
                  </div>
                  <span className="inline-block w-fit max-w-full truncate rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/60">
                    {p.org}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2.5">
          {featured.map((p, i) => (
            <button
              key={p.key}
              type="button"
              aria-label={`Show ${p.title}`}
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
