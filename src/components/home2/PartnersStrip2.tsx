import { projectsList, testimonials } from "../../content";
import { Reveal } from "../motion/Reveal";

const shortNames: Record<string, string> = {
  "Executive Committee on Private Sector Development": "PriSEC",
  "Independent Strengthen Local Administrations": "ISLA",
  "Australia Afghanistan Community Resilience Scheme": "AACRS",
  "ERRIN-SRA — Sustainable Reintegration in Afghanistan": "ERRIN-SRA",
  "Summative evaluation & M&E of the Global Mine Action Programme 2 (GMAP2), DFID-funded": "GMAP2 / DFID",
  "Training of trainers, Afghanistan International Bank": "AIB",
  "International Trade Centre (ITC)": "ITC",
  "New export procedures, for ITC": "ITC",
  DAI: "DAI",
  "Mercy Corps, TAALIM program": "Mercy Corps",
  Etisalat: "Etisalat",
  "International Returns and Reintegration Assistance": "IRARA",
  "Get in the Ring": "Get In The Ring",
  GIZ: "GIZ",
};

// Use the full set (not a slice of 5) so the marquee has enough names to
// scroll through without obviously repeating.
const partnerNames = Array.from(
  new Set([...projectsList.map((p) => shortNames[p.org] ?? p.org), ...testimonials.map((t) => t.org)])
);

export default function PartnersStrip2() {
  // Two copies back to back — .marquee-track translates by exactly -50%,
  // so the second copy lands where the first began and the loop is seamless.
  const track = [...partnerNames, ...partnerNames];

  return (
    <section className="py-14 sm:py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <Reveal className="flex items-center gap-4 mb-10">
          <span className="h-px flex-1 bg-[#073B70]/15" />
          <p className="text-[15px] font-semibold text-[#073B70] whitespace-nowrap">
            Trusted by {projectsList.length}+ Partners &amp; Institutions
          </p>
          <span className="h-px flex-1 bg-[#073B70]/15" />
        </Reveal>
      </div>

      {/* Full-bleed scrolling track (outside the max-width container so the
          names run edge to edge). Pauses on hover via the shared CSS. */}
      <div className="relative overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-12 sm:gap-16">
          {track.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap text-[18px] sm:text-[20px] font-semibold text-[#073B70]/35 transition-colors duration-300 hover:text-[#073B70]/70"
            >
              {name}
            </span>
          ))}
        </div>

        {/* Soft fade at both edges so names enter and leave gracefully */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
