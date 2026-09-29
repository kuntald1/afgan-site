import { useSeo } from "../hooks/useSeo";
import PageVideoHero from "../components/PageVideoHero";
import ContactHero from "../components/ContactHero";
import ContactFormSection from "../components/ContactFormSection";

export default function ContactPage() {
  useSeo({
    title: "Contact",
    description:
      "Get in touch with the Afghanistan Center for Excellence — email, phone, office locations, and a contact form.",
    path: "/contact",
  });

  return (
    <>
      <PageVideoHero eyebrow="Contact" title="Let's talk about your next project." />
      <ContactHero />
      <ContactFormSection />
    </>
  );
}
