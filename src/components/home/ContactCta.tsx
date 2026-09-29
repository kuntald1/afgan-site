import { contact, offices } from "../../content";
import { Reveal } from "../motion/Reveal";
import ContactForm from "../ContactForm";

export default function ContactCta() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#16212b]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          <Reveal className="mb-4">
            <span className="rounded-full border border-white/15 px-4 py-1.5 text-[12px] sm:text-[13px] font-medium text-white/70">
              // Let's talk
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className="font-medium leading-[1.12] tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.6rem)" }}
            >
              Let's discuss further to get better results
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
              Tell us about the challenge you're facing — assessment,
              institutional reform, workforce training, or compliance — and a
              member of the ACE team will get back to you directly.
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-9 space-y-4">
            <a
              href={`mailto:${contact.email}`}
              className="block text-[15px] sm:text-[16px] font-medium text-white hover:text-[#F26522] transition-colors"
            >
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="block text-[15px] sm:text-[16px] font-medium text-white hover:text-[#F26522] transition-colors"
            >
              {contact.phone}
            </a>
            <p className="text-[13px] text-white/50">{offices.join(" · ")}</p>
          </Reveal>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
