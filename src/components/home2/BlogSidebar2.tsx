import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { blogPosts } from "../../content";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";

/**
 * BlogSidebar2 — deliberately just Search + Latest Post.
 * No Categories / Tags panel, per request.
 *
 * The search box is static UI only for now (no filtering wired up) — matches
 * "do static now, dynamic later." Wire it to real filtering once the blog
 * has a search-capable data source.
 */
export default function BlogSidebar2({
  excludeKey,
  searchValue,
  onSearchChange,
}: {
  excludeKey?: string;
  /** Pass these two together to make the box functional (used on the list
   * page). Omit both and it stays static UI, as on the detail page. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}) {
  const latest = blogPosts.filter((p) => p.key !== excludeKey).slice(0, 3);

  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-2xl bg-[#F7F7F5] p-6">
        <h3
          className="mb-4 text-[#073B70]"
          style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "18px" }}
        >
          Search
        </h3>
        <div className="flex overflow-hidden rounded-lg border border-[#073B70]/10 bg-white">
          <input
            type="text"
            placeholder="Search here..."
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full px-4 py-3 text-[14px] outline-none placeholder:text-[#073B70]/35"
          />
          <button
            type="button"
            aria-label="Search"
            className="flex w-12 flex-shrink-0 items-center justify-center bg-[#F5C518] text-[#073B70] transition-colors hover:bg-[#e6b800]"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-[#F7F7F5] p-6">
        <h3
          className="mb-4 text-[#073B70]"
          style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "18px" }}
        >
          Latest Post
        </h3>
        <div className="flex flex-col gap-4">
          {latest.map((post) => (
            <Link
              key={post.key}
              to={`/home-02/blog/${post.key}`}
              className="group flex items-center gap-3"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                <FallbackImage
                  src={assets.blogImages[post.key as keyof typeof assets.blogImages]}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="text-[11.5px] font-medium text-[#073B70]/45">{post.date}</p>
                <p
                  className="mt-0.5 line-clamp-2 text-[13.5px] leading-snug text-[#073B70] transition-colors group-hover:text-[#F5C518]"
                  style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}
                >
                  {post.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
