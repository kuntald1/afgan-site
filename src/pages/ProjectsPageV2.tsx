import Navbar2 from "../components/home2/Navbar2";
import ProjectsHero2 from "../components/home2/ProjectsHero2";
import ProjectsList2 from "../components/home2/ProjectsList2";
import Footer2 from "../components/home2/Footer2";

/**
 * <Route path="/home-02/projects" element={<ProjectsPageV2 />} />
 */
export default function ProjectsPageV2() {
  return (
    <>
      <Navbar2 />
      <ProjectsHero2 />
      <ProjectsList2 />
      <Footer2 />
    </>
  );
}
