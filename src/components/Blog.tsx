import { blogPosts } from "../content";
import { assets } from "../assets";
import { RevealGroup, RevealItem } from "./motion/Reveal";
import { ScrollZoom } from "./motion/ScrollEffects";

export default function Blog() {
  return (
    <section id="blog" className="pt-6 sm:pt-8 pb-10 sm:pb-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {blogPosts.map((post) => (
            <RevealItem key={post.key}>
              <article className="group glass-panel h-full overflow-hidden rounded-2xl">
                <ScrollZoom className="aspect-[16/10] w-full" from={1.12}>
                  <img
                    src={assets.blogImages[post.key as keyof typeof assets.blogImages]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </ScrollZoom>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-3 text-[11px] tracking-widest text-[#16212b]/50">
                    <span className="text-[#F26522]">{post.category.toUpperCase()}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="mt-3 text-[17px] sm:text-[19px] font-semibold leading-snug text-[#16212b] transition-colors duration-300 group-hover:text-[#F26522]">
                    {post.title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-relaxed text-[#16212b]/65">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
