import { useSeo } from "../hooks/useSeo";
import HeroSlider from "../components/home/HeroSlider";
import AboutSplit from "../components/home/AboutSplit";
import ServicesShowcase from "../components/home/ServicesShowcase";
import StatsStrip from "../components/home/StatsStrip";
import PartnersMarquee from "../components/home/PartnersMarquee";
import ProjectsGrid from "../components/home/ProjectsGrid";
import TestimonialsSection from "../components/home/TestimonialsSection";
import NewsGrid from "../components/home/NewsGrid";
import FinalCta from "../components/home/FinalCta";

export default function HomePage() {
  useSeo({
    title: "Home",
    description:
      "ACE is an Afghan-owned professional services company turning local challenges into lasting local solutions across assessment, transformation, empowerment, and compliance since 2012.",
    path: "/",
  });

  return (
    <>
      <HeroSlider />
      <AboutSplit />
      <ServicesShowcase />
      <StatsStrip />
      <PartnersMarquee />
      <ProjectsGrid />
      <TestimonialsSection />
      <NewsGrid />
      <FinalCta />
    </>
  );
}
