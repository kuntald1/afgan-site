import Navbar2 from "../components/home2/Navbar2";
import AboutHero2 from "../components/home2/AboutHero2";
import AboutDetail2 from "../components/home2/AboutDetail2";
import OverviewStats2 from "../components/home2/OverviewStats2";
import Footer2 from "../components/home2/Footer2";

/**
 * Register OUTSIDE <Layout> in App.tsx:
 *   <Route path="/home-02/about" element={<AboutPageV2 />} />
 */
export default function AboutPageV2() {
  return (
    <>
      <Navbar2 />
      <AboutHero2 />
      <AboutDetail2 />
      <OverviewStats2 />
      <Footer2 />
    </>
  );
}
