import Navbar2 from "../components/home2/Navbar2";
import BlogHero2 from "../components/home2/BlogHero2";
import BlogList2 from "../components/home2/BlogList2";
import Footer2 from "../components/home2/Footer2";

/**
 * Register OUTSIDE <Layout> in App.tsx, next to the other home-02 routes:
 *   <Route path="/home-02/blog" element={<BlogPageV2 />} />
 */
export default function BlogPageV2() {
  return (
    <>
      <Navbar2 />
      <BlogHero2 />
      <BlogList2 />
      <Footer2 />
    </>
  );
}
