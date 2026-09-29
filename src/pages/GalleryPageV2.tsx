import Navbar2 from "../components/home2/Navbar2";
import GalleryHero2 from "../components/home2/GalleryHero2";
import Gallery2 from "../components/home2/Gallery2";
import Footer2 from "../components/home2/Footer2";

/**
 * <Route path="/home-02/gallery" element={<GalleryPageV2 />} />
 */
export default function GalleryPageV2() {
  return (
    <>
      <Navbar2 />
      <GalleryHero2 />
      <Gallery2 />
      <Footer2 />
    </>
  );
}
