import { useParams } from "react-router-dom";
import Navbar2 from "../components/home2/Navbar2";
import BlogHero2 from "../components/home2/BlogHero2";
import BlogPost2 from "../components/home2/BlogPost2";
import Footer2 from "../components/home2/Footer2";
import { useBlogPosts } from "../hooks/useBlogPosts";

/**
 * <Route path="/home-02/blog/:slug" element={<BlogPostPageV2 />} />
 * Hero shows the individual post's own title — now looked up from the
 * Blog CRUD API (useBlogPosts) instead of the old static blogPosts import
 * from content.ts.
 */
export default function BlogPostPageV2() {
  const { slug } = useParams<{ slug: string }>();
  const { posts } = useBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  return (
    <>
      <Navbar2 />
      <BlogHero2 title={post?.title ?? "Blog"} crumb={`Home / Blog / ${post?.title ?? ""}`} />
      <BlogPost2 />
      <Footer2 />
    </>
  );
}
