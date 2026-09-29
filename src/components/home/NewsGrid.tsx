import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "../../content";
import { assets } from "../../assets";
import { Reveal, RevealGroup, RevealItem } from "../motion/Reveal";
import FallbackImage from "./FallbackImage";

export default function NewsGrid() {
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <Reveal className="mb-4">
              <span className="rounded-full border border-[#0B4F92]/25 bg-[#0B4F92]/[0.04] px-4 py-1.5 text-[12px] sm:text-[13px] font-medium text-[#0B4F92]">
                // Latest news
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="font-medium leading-[1.1] tracking-[-0.02em] text-[#16212b]"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
              >
                Tips and stories from the field
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-[14px] font-medium text-[#16212b] hover:text-[#F26522] transition-colors"
            >
              Visit the blog <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <RevealItem key={post.key} className="group">
              <Link to="/blog" className="block">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                  <FallbackImage
                    src={assets.blogImages[post.key as keyof typeof assets.blogImages]}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#16212b] shadow-sm">
                    {post.date}
                  </span>
                </div>

                <p className="mt-4 text-[12px] font-medium tracking-wide text-[#F26522]">
                  {post.category.toUpperCase()}
                </p>
                <h3 className="mt-1.5 text-[16px] sm:text-[17px] font-medium leading-snug text-[#16212b] group-hover:text-[#F26522] transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#16212b]/60">
                  {post.excerpt}
                </p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
