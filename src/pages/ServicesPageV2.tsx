import Navbar2 from "../components/home2/Navbar2";
import ServicesHero2 from "../components/home2/ServicesHero2";
import ServicesDetail2 from "../components/home2/ServicesDetail2";
import Footer2 from "../components/home2/Footer2";

/**
 * Register OUTSIDE <Layout> in App.tsx:
 *   <Route path="/home-02/services" element={<ServicesPageV2 />} />
 */
export default function ServicesPageV2() {
  return (
    <>
      <Navbar2 />
      <ServicesHero2 />
      <ServicesDetail2 />
      <Footer2 />
    </>
  );
}
