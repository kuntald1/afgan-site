import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../motion/Reveal";

export default function FinalCta() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <Reveal className="relative overflow-hidden rounded-3xl bg-[#16212b] px-8 sm:px-14 py-16 sm:py-20 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#F26522]/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[#F26522]/15 blur-3xl"
          />

          <h2
            className="relative font-medium leading-[1.1] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}
          >
            Get a consultant now!
          </h2>
          <p className="relative mt-4 text-[15px] text-white/65 max-w-md mx-auto">
            Start a conversation with ACE's team and see how we can help move
            your project forward.
          </p>

          <Link
            to="/contact"
            className="group relative mt-8 inline-flex items-center gap-3 rounded-full bg-[#F26522] hover:bg-[#e05a1a] pl-6 pr-2 py-2.5 text-[14px] font-medium text-white transition-colors duration-300"
          >
            Let's talk now
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45">
              <ArrowRight size={15} className="text-[#F26522]" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
