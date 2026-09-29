import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Quote } from "lucide-react";
import FallbackImage from "../home/FallbackImage";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { resolveMediaUrl } from "../../hooks/useDynamicContent";
import { EASE } from "./tokens";

/**
 * BlogPost2 — "Latest Post" sidebar removed, content runs full width in a
 * centered reading column (max-w-[900px]) so there's no leftover empty
 * space on the right. Bolder text throughout.
 */
export default function BlogPost2() {
  const { slug } = useParams<{ slug: string }>();
  const { posts, loading } = useBlogPosts();

  if (loading) return null;

  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) {
    return <Navigate to="/home-02/blog" replace />;
  }

  const post = posts[index];
  const prev = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;
  const image = resolveMediaUrl(post.image_url ?? "");

  return (
    <section className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-[900px] px-5 sm:px-8 lg:px-12">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link
            to="/home-02/blog"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#073B70]/60 transition-colors hover:text-[#073B70]"
          >
            <ArrowLeft size={15} />
            Back to Blog
          </Link>

          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(15,61,46,0.14)]">
            <FallbackImage src={image} alt={post.title} className="h-full w-full object-cover" />
          </div>

          <div className="mt-4 flex items-center gap-4 text-[13.5px] font-bold text-[#073B70]/55">
            <span className="inline-block rounded-md bg-[#F5C518]/20 px-3 py-1 uppercase tracking-wide text-[#073B70]">
              {post.category}
            </span>
            <span>{post.date_label}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">ACE Consulting Team</span>
          </div>

          <h1
            className="mt-4 leading-[1.15] text-[#073B70]"
            style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 3.6vw, 2.5rem)" }}
          >
            {post.title}
          </h1>

          <p className="mt-6 font-bold leading-relaxed text-[#073B70]/80" style={{ fontSize: "17px" }}>
            {post.excerpt}
          </p>

          <div className="mt-8 flex items-start gap-4 rounded-2xl bg-[#F7F7F5] p-7">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-[#F5C518]">
              <Quote size={20} className="text-[#073B70]" />
            </span>
            <p
              className="leading-relaxed text-[#073B70]/85"
              style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "18px" }}
            >
              {post.excerpt}
            </p>
          </div>

          {post.key_features.length > 0 && (
            <div className="mt-10">
              <h2
                className="mb-5 text-[#073B70]"
                style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "21px" }}
              >
                Key Takeaways
              </h2>
              <ul className="flex flex-col gap-3.5">
                {post.key_features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 font-semibold text-[#073B70]/80"
                    style={{ fontSize: "16px" }}
                  >
                    <CheckCircle2 size={19} className="mt-0.5 flex-shrink-0 text-[#F5C518]" fill="#073B70" />
                    <span className="leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {post.conclusion && (
            <div className="mt-10">
              <h2
                className="mb-3 text-[#073B70]"
                style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "21px" }}
              >
                Conclusion
              </h2>
              <p className="font-semibold leading-relaxed text-[#073B70]/75" style={{ fontSize: "16px" }}>
                {post.conclusion}
              </p>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#073B70]/10 pt-8">
            {prev ? (
              <Link
                to={`/home-02/blog/${prev.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-[#073B70]/10 p-4 transition-colors hover:border-[#F5C518]"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#073B70]/6 transition-colors group-hover:bg-[#F5C518]">
                  <ArrowLeft size={15} className="text-[#073B70]" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#073B70]/40">Previous</p>
                  <p className="truncate text-[14.5px] font-bold text-[#073B70]">{prev.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {next && (
              <Link
                to={`/home-02/blog/${next.slug}`}
                className="group flex items-center justify-end gap-3 rounded-xl border border-[#073B70]/10 p-4 text-right transition-colors hover:border-[#F5C518]"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#073B70]/40">Next</p>
                  <p className="truncate text-[14.5px] font-bold text-[#073B70]">{next.title}</p>
                </div>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#073B70]/6 transition-colors group-hover:bg-[#F5C518]">
                  <ArrowRight size={15} className="text-[#073B70]" />
                </span>
              </Link>
            )}
          </div>

          <Link
            to="/home-02/contact"
            className="group mt-10 inline-flex items-center gap-3 rounded-md bg-[#F5C518] hover:bg-[#e6b800] pl-6 pr-2 py-2.5 text-[14px] font-bold text-[#073B70] transition-colors duration-300"
          >
            Talk to ACE About This
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#073B70] transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={15} className="text-[#F5C518]" />
            </span>
          </Link>
        </motion.article>
      </div>
    </section>
  );
}
