import { ArrowRight } from "lucide-react";
import { contact, offices } from "../content";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";

const EASE = "cubic-bezier(0.25,0.1,0.25,1)";

function RollCTA({ label }: { label: string }) {
  return (
    <a
      href={`mailto:${contact.email}`}
      className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-[#F26522] hover:bg-[#e05a1a] pl-5 sm:pl-6 pr-2 py-2 text-[#16212b] text-[13px] sm:text-[14px] font-medium transition-colors duration-300"
    >
      <span className="h-[20px] overflow-hidden">
        <span
          className="flex flex-col group-hover:-translate-y-1/2"
          style={{ transition: "transform 500ms", transitionTimingFunction: EASE }}
        >
          <span className="h-[20px] leading-[20px]">{label}</span>
          <span className="h-[20px] leading-[20px]">{label}</span>
        </span>
      </span>
      <span
        className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45"
        style={{ transitionTimingFunction: EASE }}
      >
        <ArrowRight size={14} className="text-[#F26522]" />
      </span>
    </a>
  );
}

export default function ContactHero() {
  return (
    <section className="pt-16 sm:pt-20 pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <RollCTA label="Email us" />
        </Reveal>

        <RevealGroup className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 border-t border-black/10 pt-10">
          <RevealItem>
            <p className="text-[12px] tracking-widest text-[#16212b]/45 mb-3">EMAIL</p>
            <a href={`mailto:${contact.email}`} className="text-[18px] font-medium text-[#16212b] hover:text-[#16212b]/75">
              {contact.email}
            </a>
          </RevealItem>
          <RevealItem>
            <p className="text-[12px] tracking-widest text-[#16212b]/45 mb-3">PHONE</p>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="text-[18px] font-medium text-[#16212b] hover:text-[#16212b]/75"
            >
              {contact.phone}
            </a>
          </RevealItem>
          <RevealItem>
            <p className="text-[12px] tracking-widest text-[#16212b]/45 mb-3">OFFICES</p>
            <p className="text-[15px] text-[#16212b]/85 leading-relaxed">{offices.join(" · ")}</p>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
