import { useParams } from "react-router-dom";
import Navbar2 from "../components/home2/Navbar2";
import ProjectsHero2 from "../components/home2/ProjectsHero2";
import ProjectDetail2 from "../components/home2/ProjectDetail2";
import Footer2 from "../components/home2/Footer2";
import { useProjects } from "../hooks/useProjects";

/**
 * <Route path="/home-02/projects/:slug" element={<ProjectDetailPageV2 />} />
 * Hero shows the individual project's own title — now looked up from the
 * Projects CRUD API (useProjects) instead of the old static projectsList
 * import from content.ts.
 */
export default function ProjectDetailPageV2() {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = useProjects();
  const project = projects.find((p) => p.slug === slug);

  return (
    <>
      <Navbar2 />
      <ProjectsHero2
        title={project?.title ?? "Projects"}
        crumb={`Home / Projects / ${project?.title ?? ""}`}
      />
      <ProjectDetail2 />
      <Footer2 />
    </>
  );
}
