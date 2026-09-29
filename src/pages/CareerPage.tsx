import { useSeo } from "../hooks/useSeo";
import PageVideoHero from "../components/PageVideoHero";
import Career from "../components/Career";

export default function CareerPage() {
  useSeo({
    title: "Career",
    description:
      "Current openings at ACE — build a career where the work lands, across Kabul and ACE's regional offices.",
    path: "/career",
  });

  return (
    <>
      <PageVideoHero eyebrow="Career" title="Build a career where the work lands." />
      <Career />
    </>
  );
}
