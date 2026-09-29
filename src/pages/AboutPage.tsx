import { useSeo } from "../hooks/useSeo";
import PageVideoHero from "../components/PageVideoHero";
import About from "../components/About";
import Overview from "../components/Overview";

export default function AboutPage() {
  useSeo({
    title: "About Us",
    description:
      "Learn about ACE's mission, team, and history as an Afghan-owned professional services company headquartered in Kabul since 2012.",
    path: "/about",
  });

  return (
    <>
      <PageVideoHero eyebrow="About ACE" title="A local partner, since 2012." />
      <About />
      <Overview />
    </>
  );
}
