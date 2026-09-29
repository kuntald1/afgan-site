import { projectsList, testimonials } from "../../content";
import { Reveal } from "../motion/Reveal";

// Real partner/client organizations, pulled from ACE's project list and
// testimonials rather than invented — deduplicated and capped to a set
// that reads well as short wordmarks (long descriptive org strings are
// trimmed to their common short form where one exists in the data).
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

const partnerNames = Array.from(
  new Set([
    ...projectsList.map((p) => shortNames[p.org] ?? p.org),
    ...testimonials.map((t) => t.org),
  ])
).slice(0, 14);

export default function PartnersMarquee() {
  const track = [...partnerNames, ...partnerNames];

  return (
    <section className="py-14 sm:py-16 border-y border-black/8">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 mb-8 sm:mb-10 text-center">
        <Reveal>
          <p className="text-[12px] sm:text-[13px] font-medium tracking-[0.15em] text-[#16212b]/50">
            TRUSTED BY GOVERNMENT, INDUSTRY AND NGO PARTNERS SINCE 2012
          </p>
        </Reveal>
      </div>

      <div className="overflow-hidden">
        <div className="marquee-track flex w-max gap-10 sm:gap-14">
          {track.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap text-[18px] sm:text-[22px] font-medium tracking-[-0.01em] text-[#16212b]/35"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
