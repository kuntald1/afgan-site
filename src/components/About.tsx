import { ArrowRight } from "lucide-react";
import { assets } from "../assets";
import { Reveal } from "./motion/Reveal";
import Parallax from "./motion/Parallax";
import { ScrollZoom } from "./motion/ScrollEffects";
import { useDynamicContent } from "../hooks/useDynamicContent";

const EASE = "cubic-bezier(0.25,0.1,0.25,1)";

function AboutButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="group flex items-center gap-2 sm:gap-3 rounded-full bg-[#F26522] hover:bg-[#e05a1a] pl-5 sm:pl-6 pr-2 py-2 text-[#16212b] text-[13px] sm:text-[14px] font-medium transition-colors duration-300"
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
    </button>
  );
}

export default function About() {
  // Live content from the admin CMS, falling back to the current static
  // copy/images if the admin API isn't configured or unreachable.
  const heading = useDynamicContent(
    "about.hero_heading",
    "Field-tested expertise, delivering results across Afghanistan."
  );
  const intro = useDynamicContent(
    "about.hero_intro",
    "Since 2012, we've assessed development projects, rebuilt institutional systems, and connected people with lasting work — for Afghan government agencies, local and international NGOs, and UN agencies alike."
  );
  const ctaLabel = useDynamicContent("about.hero_cta_label", "See how we work");
  const imageSmall = useDynamicContent("about.hero_image_small", assets.aboutSmall);
  const imageLarge = useDynamicContent("about.hero_image_large", assets.aboutLarge);

  return (
    <section className="pt-6 sm:pt-8 pb-10 sm:pb-12 lg:pb-16 overflow-hidden">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="flex items-center gap-3 px-5 sm:px-8 lg:px-12 mb-6 sm:mb-8">
          <span className="rounded-full border border-black/8 px-3 sm:px-4 py-1 sm:py-1.5 text-[12px] sm:text-[13px] font-medium">
            Introducing ACE
          </span>
        </Reveal>

        <Reveal
          delay={0.08}
          className="px-5 sm:px-8 lg:px-12 font-medium leading-[1.12] tracking-[-0.02em] text-[#16212b] mb-8 sm:mb-10 lg:mb-16"
        >
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 3.2rem)" }}>{heading}</h2>
        </Reveal>

        {/* Mobile / tablet stacked layout */}
        <div className="lg:hidden px-5 sm:px-8">
          <Reveal>
            <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-[#16212b]">
              {intro}
            </p>
            <div className="mt-6">
              <AboutButton label={ctaLabel} />
            </div>
          </Reveal>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5">
            <Reveal delay={0.1} className="w-full sm:w-[45%] aspect-[438/346] overflow-hidden rounded-xl sm:rounded-2xl">
              <img
                src={imageSmall}
                alt="ACE team conducting a field visit"
                className="h-full w-full object-cover"
              />
            </Reveal>
            <Reveal delay={0.18} className="w-full sm:w-[55%] aspect-[900/600] overflow-hidden rounded-xl sm:rounded-2xl">
              <img
                src={imageLarge}
                alt="ACE-led vocational training session"
                className="h-full w-full object-cover"
              />
            </Reveal>
          </div>
        </div>

        {/* Desktop grid layout */}
        <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8 px-12">
          <Parallax strength={38}>
            <Reveal className="self-end aspect-[438/346] w-full overflow-hidden rounded-2xl">
              <ScrollZoom className="h-full w-full">
                <img
                  src={imageSmall}
                  alt="ACE team conducting a field visit"
                  className="h-full w-full object-cover"
                />
              </ScrollZoom>
            </Reveal>
          </Parallax>

          <Reveal delay={0.1} className="self-start flex flex-col items-end">
            <p className="max-w-md text-right font-medium text-[#16212b] text-[16px] xl:text-[18px] leading-[1.65]">
              {intro}
            </p>
            <div className="mt-6">
              <AboutButton label={ctaLabel} />
            </div>
          </Reveal>

          <Parallax strength={-30}>
            <Reveal delay={0.18} className="self-end aspect-[3/2] w-full overflow-hidden rounded-2xl">
              <ScrollZoom className="h-full w-full">
                <img
                  src={imageLarge}
                  alt="ACE-led vocational training session"
                  className="h-full w-full object-cover"
                />
              </ScrollZoom>
            </Reveal>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
