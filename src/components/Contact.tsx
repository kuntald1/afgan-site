import { ArrowRight } from "lucide-react";
import { contact, demographics, offices, tags } from "../content";

const EASE = "cubic-bezier(0.25,0.1,0.25,1)";

function RollCTA({ label }: { label: string }) {
  return (
    <a
      href={`mailto:${contact.email}`}
      className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-[#F26522] hover:bg-[#e05a1a] pl-5 sm:pl-6 pr-2 py-2 text-white text-[13px] sm:text-[14px] font-medium transition-colors duration-300"
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

export default function Contact() {
  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-12">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <h2
          className="font-medium leading-[1.05] tracking-[-0.03em] mb-8 sm:mb-10"
          style={{ fontSize: "clamp(1.75rem, 5vw, 3.4rem)" }}
        >
          Let's talk about your
          <br />
          next project.
        </h2>

        <RollCTA label="Email us" />

        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 border-t border-white/15 pt-10">
          <div>
            <p className="text-[12px] tracking-widest text-white/45 mb-3">CONTACT</p>
            <a href={`mailto:${contact.email}`} className="block text-[14px] text-white/85 hover:text-white">
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="mt-1 block text-[14px] text-white/85 hover:text-white"
            >
              {contact.phone}
            </a>
          </div>

          <div>
            <p className="text-[12px] tracking-widest text-white/45 mb-3">OFFICES</p>
            <p className="text-[14px] leading-relaxed text-white/85">
              {offices.join(" · ")}
            </p>
          </div>

          <div>
            <p className="text-[12px] tracking-widest text-white/45 mb-3">WHO WE SERVE</p>
            <p className="text-[14px] leading-relaxed text-white/85">
              {demographics.join(" · ")}
            </p>
          </div>

          <div>
            <p className="text-[12px] tracking-widest text-white/45 mb-3">ELSEWHERE</p>
            <div className="flex flex-col gap-1">
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/85 hover:text-white">
                Facebook
              </a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/85 hover:text-white">
                LinkedIn
              </a>
              <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/85 hover:text-white">
                Twitter
              </a>
              <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/85 hover:text-white">
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-8 border-t border-white/15">
          <p className="text-[12px] tracking-widest text-white/45 mb-3">TAGS</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 px-3 py-1 text-[12px] text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 sm:mt-14 pt-6 border-t border-white/15 text-[12px] text-white/40">
          © Afghanistan Center for Excellence — {offices.join(" · ")}
        </div>
      </div>
    </footer>
  );
}
