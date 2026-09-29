import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import FallbackImage from "../home/FallbackImage";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { resolveMediaUrl } from "../../hooks/useDynamicContent";
import { EASE } from "./tokens";

function formatDay(dateStr: string) {
  const [day, ...rest] = dateStr.split(" ");
  return { day, monthYear: rest.join(" ") };
}

/**
 * BlogList2 — 2-up grid, no sidebar (Search + Latest Post removed).
 * The search box lives inline above the grid instead of in a sidebar.
 * Bolder text throughout.
 */
export default function BlogList2() {
  const [query, setQuery] = useState("");
  const { posts: allPosts, loading } = useBlogPosts();

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPosts;
    return allPosts.filter((p) => p.title.toLowerCase().includes(q));
  }, [query, allPosts]);

  if (loading) return null;

  return (
    <section className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 mx-auto max-w-md"
        >
          <div className="flex overflow-hidden rounded-full border-2 border-[#073B70]/10 bg-white">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full px-5 py-3 text-[14.5px] font-semibold outline-none placeholder:text-[#073B70]/35"
            />
            <span className="flex w-12 flex-shrink-0 items-center justify-center bg-[#F5C518] text-[#073B70]">
              <Search size={16} />
            </span>
          </div>
        </motion.div>

        {posts.length === 0 ? (
          <div className="rounded-2xl bg-[#F7F7F5] p-10 text-center">
            <p className="text-[15px] font-semibold text-[#073B70]/65">
              No posts match "{query}".{" "}
              <button
                type="button"
                onClick={() => setQuery("")}
                className="font-bold text-[#073B70] underline decoration-[#F5C518] decoration-2 underline-offset-4"
              >
                Clear search
              </button>
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-60px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-14"
          >
            {posts.map((post) => {
              const { day, monthYear } = formatDay(post.date_label);
              return (
                <motion.article
                  key={post.slug}
                  variants={{
                    hidden: { opacity: 0, y: 32 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                  }}
                  className="group"
                >
                  <Link
                    to={`/home-02/blog/${post.slug}`}
                    className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl"
                  >
                    <FallbackImage
                      src={resolveMediaUrl(post.image_url ?? "")}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 right-4 rounded-xl bg-white px-4 py-2 text-center shadow-lg">
                      <p
                        className="leading-none text-[#073B70]"
                        style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "22px" }}
                      >
                        {day}
                      </p>
                      <p className="mt-1 rounded bg-[#F5C518] px-2 py-0.5 text-[10.5px] font-bold text-[#073B70]">
                        {monthYear}
                      </p>
                    </div>
                  </Link>

                  <div className="mt-5">
                    <span className="inline-block rounded-md bg-[#F5C518]/20 px-3 py-1 text-[13px] font-bold uppercase tracking-wide text-[#073B70]">
                      {post.category}
                    </span>

                    <h3 className="mt-3">
                      <Link
                        to={`/home-02/blog/${post.slug}`}
                        className="text-[#073B70] transition-colors hover:text-[#073B70]/65"
                        style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "22px" }}
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="mt-3 font-semibold leading-relaxed text-[#073B70]/75" style={{ fontSize: "15.5px" }}>
                      {post.excerpt}
                    </p>

                    <Link
                      to={`/home-02/blog/${post.slug}`}
                      className="group/link mt-4 inline-flex items-center gap-2 text-[14.5px] font-bold text-[#073B70] transition-colors hover:text-[#F5C518]"
                    >
                      Read More
                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
