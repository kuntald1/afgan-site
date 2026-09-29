import Navbar2 from "../components/home2/Navbar2";
import CareerHero2 from "../components/home2/CareerHero2";
import Career2 from "../components/home2/Career2";
import Footer2 from "../components/home2/Footer2";

/**
 * CareerPageV2
 * Same Navbar2 / Footer2 as the rest of Home-02.
 * Register OUTSIDE <Layout> in App.tsx, next to the other home-02 routes:
 *
 *   <Route path="/home-02/career" element={<CareerPageV2 />} />
 *
 * If you want the SEO title/description here as the old CareerPage had, add
 * your useSeo call at the top of this component — I left it out rather than
 * guess its argument shape.
 */
export default function CareerPageV2() {
  return (
    <>
      <Navbar2 />
      <CareerHero2 />
      <Career2 />
      <Footer2 />
    </>
  );
}
