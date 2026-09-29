import { useSeo } from "../hooks/useSeo";
import Navbar2 from "../components/home2/Navbar2";
import Hero2 from "../components/home2/Hero2";
import Services2 from "../components/home2/Services2";
import About2 from "../components/home2/About2";
import StatsStrip2 from "../components/home2/StatsStrip2";
import WhyChoose2 from "../components/home2/WhyChoose2";
import Projects2 from "../components/home2/Projects2";
import WhereWeWork2 from "../components/home2/WhereWeWork2";
import Team2 from "../components/home2/Team2";
import Testimonials2 from "../components/home2/Testimonials2";
import Blog2 from "../components/home2/Blog2";
import Footer2 from "../components/home2/Footer2";

/**
 * Home-02 — a second homepage layout (green/gold, Rovix-style) that exists
 * alongside the original homepage (HomePage.tsx) without replacing it.
 * The original stays live at "/"; this one lives at "/home-02" so both can
 * be compared before deciding which one to keep. Rendered OUTSIDE the
 * shared <Layout> (see App.tsx) so it can use its own Rovix-style
 * Navbar2 instead of the site-wide dark navbar — the rest of the site is
 * untouched. Footer is still the shared one, just included directly here.
 */
export default function HomePageV2() {
useSeo({
  title: "Home",
  description:
    "ACE is an Afghan-owned professional services company turning local challenges into lasting local solutions across assessment, transformation, empowerment, and compliance since 2012.",
  path: "/",
});

  return (
    <>
      <Navbar2 />
      <Hero2 />
      <About2 />
      <Services2 />
      <StatsStrip2 />
      <WhyChoose2 />
      <Projects2 />
      <WhereWeWork2 />
      <Team2 />
      <Testimonials2 />
      <Blog2 />
      <Footer2 />
    </>
  );
}
