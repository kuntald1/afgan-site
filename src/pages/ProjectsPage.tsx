import { useSeo } from "../hooks/useSeo";
import PageVideoHero from "../components/PageVideoHero";
import CaseStudies from "../components/CaseStudies";

/**
 * Reuses the exact same <CaseStudies /> component that renders "Our
 * projects" on the Home page — this is not a copy or a re-implementation.
 * Home still renders it too; nothing was removed from Home.
 */
export default function ProjectsPage() {
  useSeo({
    title: "Projects",
    description:
      "15 projects delivered by ACE since 2012 for Afghan government agencies, private-sector partners, and international organizations.",
    path: "/projects",
  });

  return (
    <>
      <PageVideoHero eyebrow="Projects" title="Fifteen projects, one method." />
      <CaseStudies />
    </>
  );
}
