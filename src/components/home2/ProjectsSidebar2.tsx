import { Link } from "react-router-dom";
import { projectsList } from "../../content";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";

export default function ProjectsSidebar2({ excludeKey }: { excludeKey?: string }) {
  const latest = projectsList.filter((p) => p.key !== excludeKey).slice(0, 3);

  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-2xl bg-[#F7F7F5] p-6">
        <h3
          className="mb-4 text-[#073B70]"
          style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "18px" }}
        >
          Latest Projects
        </h3>
        <div className="flex flex-col gap-4">
          {latest.map((p) => (
            <Link key={p.key} to={`/home-02/projects/${p.key}`} className="group flex items-center gap-3">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                <FallbackImage
                  src={assets.projectImages[p.key as keyof typeof assets.projectImages]}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="text-[11.5px] font-medium text-[#073B70]/45">
                  {p.type} · {p.year}
                </p>
                <p
                  className="mt-0.5 line-clamp-2 text-[13.5px] leading-snug text-[#073B70] transition-colors group-hover:text-[#F5C518]"
                  style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}
                >
                  {p.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
