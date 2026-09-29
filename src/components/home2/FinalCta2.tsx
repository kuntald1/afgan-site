import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../motion/Reveal";

export default function FinalCta2() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <Reveal className="relative overflow-hidden rounded-3xl bg-[#073B70] px-8 sm:px-14 py-16 sm:py-20 text-center">
          <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#F5C518]/15 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[#F5C518]/10 blur-3xl" />

          <h2
            className="relative font-bold leading-[1.1] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}
          >
            Let's Build Something That Lasts
          </h2>
          <p className="relative mt-4 text-[15px] text-white/65 max-w-md mx-auto">
            Talk to ACE's team about assessment, institutional reform, workforce
            training, or compliance support.
          </p>

          <Link
            to="/contact"
            className="group relative mt-8 inline-flex items-center gap-3 rounded-md bg-[#F5C518] hover:bg-[#e6b800] pl-6 pr-2 py-2.5 text-[14px] font-semibold text-[#073B70] transition-colors duration-300"
          >
            Get a Quote
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#073B70] transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={15} className="text-[#F5C518]" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
