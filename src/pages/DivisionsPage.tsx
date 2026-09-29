import { useSeo } from "../hooks/useSeo";
import PageVideoHero from "../components/PageVideoHero";
import Divisions from "../components/Divisions";

export default function DivisionsPage() {
  useSeo({
    title: "Divisions",
    description:
      "KHANAGi, DAFTAR, and WeBrand — ACE's own ventures supporting Afghan entrepreneurs, SMEs, and small businesses.",
    path: "/divisions",
  });

  return (
    <>
      <PageVideoHero eyebrow="Divisions" title="Ventures we built and run ourselves." />
      <Divisions />
    </>
  );
}
