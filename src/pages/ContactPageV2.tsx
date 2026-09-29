import Navbar2 from "../components/home2/Navbar2";
import ContactHero2 from "../components/home2/ContactHero2";
import ContactForm2 from "../components/home2/ContactForm2";
import Footer2 from "../components/home2/Footer2";

/**
 * ContactPageV2
 * Uses the exact same Navbar2 and Footer2 as HomePageV2 — no new nav built.
 * Register the route OUTSIDE <Layout> in App.tsx, same as /home-02, e.g.:
 *
 *   <Route path="/home-02/contact" element={<ContactPageV2 />} />
 */
export default function ContactPageV2() {
  return (
    <>
      <Navbar2 />
      <ContactHero2 />
      <ContactForm2 />
      <Footer2 />
    </>
  );
}
