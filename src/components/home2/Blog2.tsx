import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { blogPosts } from "../../content";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import SectionHeading from "./SectionHeading";
import { EASE } from "./tokens";
import { useDynamicContent } from "../../hooks/useDynamicContent";

export default function Blog2() {
  const posts = blogPosts.slice(0, 3);

  const eyebrow = useDynamicContent("home2.blog.eyebrow", "Latest Blog Post");
  const heading = useDynamicContent(
    "home2.blog.heading",
    "Latest Insights from Our Consultants"
  );
  const ctaLabel = useDynamicContent("home2.blog.cta_label", "View All Blog");

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F7F7F5] overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow={eyebrow}
          title={heading}
          right={
            <Link
              to="/home-02/blog"
              className="group inline-flex items-center gap-3 rounded-md bg-[#F5C518] hover:bg-[#e6b800] pl-5 pr-2 py-2.5 text-[14px] font-semibold text-[#073B70] transition-colors duration-300"
            >
              {ctaLabel}
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#073B70] transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={15} className="text-[#F5C518]" />
              </span>
            </Link>
          }
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-7"
        >
          {posts.map((post) => (
            <motion.article
              key={post.key}
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
              }}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(15,61,46,0.08)] transition-shadow duration-500 hover:shadow-[0_26px_60px_rgba(15,61,46,0.16)]"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <FallbackImage
                  src={assets.blogImages[post.key as keyof typeof assets.blogImages]}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                {/* Date chip */}
                <span className="absolute bottom-4 right-4 rounded-md bg-[#073B70] px-3 py-2 text-[12px] font-semibold leading-tight text-white shadow-lg">
                  {post.date}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <span className="flex items-center gap-2 text-[13.5px] font-bold uppercase tracking-wide text-[#073B70]/60">
                  {post.category}
                  <span className="h-px w-6 bg-[#073B70]/25" />
                </span>
                <h3
                  className="mt-2.5 leading-snug text-[#073B70] transition-colors duration-300 group-hover:text-[#F5C518]"
                  style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "21px" }}
                >
                  <Link to={`/home-02/blog/${post.key}`}>{post.title}</Link>
                </h3>
                <p className="mt-3 flex-1 text-[15.5px] font-medium leading-relaxed text-[#073B70]/85">
                  {post.excerpt}
                </p>
                <Link
                  to={`/home-02/blog/${post.key}`}
                  className="mt-5 inline-flex w-fit items-center gap-2 text-[15px] font-bold text-[#073B70] transition-colors hover:text-[#F5C518]"
                >
                  Read More
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
