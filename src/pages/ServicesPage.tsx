import { useSeo } from "../hooks/useSeo";
import PageVideoHero from "../components/PageVideoHero";
import ServicesDetail from "../components/ServicesDetail";

export default function ServicesPage() {
  useSeo({
    title: "Services",
    description:
      "ACE's four-stage methodology — Assess, Transform, Empower, Comply — helping government, private-sector, and NGO partners tackle Afghanistan's development challenges.",
    path: "/services",
  });

  return (
    <>
      <PageVideoHero eyebrow="Services" title="One method, four stages." />
      <ServicesDetail />
    </>
  );
}
