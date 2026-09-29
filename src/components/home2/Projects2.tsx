import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import FallbackImage from "../home/FallbackImage";
import ProjectsFilterBar2, { useProjectFilters } from "./ProjectsFilterBar2";
import { EASE } from "./tokens";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";
import { useProjects } from "../../hooks/useProjects";

// Local fade-up with once:false, matching the rest of Home-02.
function RevealRepeat({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Projects2() {
  const eyebrow = useDynamicContent("home2.projects.eyebrow", "Latest Project");
  const heading = useDynamicContent("home2.projects.heading", "Field Work That Delivers Results");

  const { projects } = useProjects();
  const { types, years, clients, ALL } = useProjectFilters(projects);
  const [type, setType] = useState(ALL);
  const [year, setYear] = useState(ALL);
  const [client, setClient] = useState(ALL);

  const filtered = projects.filter(
    (p) =>
      (type === ALL || p.type === type) &&
      (year === ALL || p.year === year) &&
      (client === ALL || p.org === client)
  );

  // Duplicated for a seamless marquee loop — but only when there's enough
  // to loop meaningfully; a heavily filtered result (1-2 cards) just shows
  // as a static row instead of an awkward short loop.
  const track = filtered.length >= 3 ? [...filtered, ...filtered] : filtered;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F7F7F5] overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-10">
          <RevealRepeat className="inline-block mb-5">
            <span className="inline-block rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
              {eyebrow}
            </span>
          </RevealRepeat>
          <RevealRepeat delay={0.06}>
            <h2
              className="leading-[1.08] tracking-[-0.025em] text-[#073B70]"
              style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem, 4.2vw, 3rem)" }}
            >
              {heading}
            </h2>
          </RevealRepeat>
        </div>

        <RevealRepeat delay={0.1} className="mb-12">
          <ProjectsFilterBar2
            types={types}
            years={years}
            clients={clients}
            type={type}
            year={year}
            client={client}
            onType={setType}
            onYear={setYear}
            onClient={setClient}
          />
        </RevealRepeat>
      </div>

      {filtered.length === 0 ? (
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <p className="text-center text-[15px] text-[#073B70]/55">No projects match those filters.</p>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <div
            key={`${type}-${year}-${client}`}
            className={`flex gap-8 ${track.length > filtered.length ? "marquee-track w-max" : "justify-center flex-wrap mx-auto max-w-[1240px] px-5"}`}
          >
            {track.map((p, i) => (
              <Link
                key={`${p.slug}-${i}`}
                to={`/home-02/projects/${p.slug}`}
                className="group relative w-[300px] sm:w-[400px] flex-shrink-0 overflow-hidden rounded-2xl"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <FallbackImage
                    src={resolveMediaUrl(p.image_url ?? "")}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white p-5">
                  <p className="text-[12px] font-medium text-[#073B70]/50">{p.org}</p>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <span className="line-clamp-2 text-[16px] font-bold text-[#073B70]">{p.title}</span>
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F5C518]">
                      <ArrowUpRight size={15} className="text-[#073B70]" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {track.length > filtered.length && (
            <>
              <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F7F7F5] to-transparent" />
              <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F7F7F5] to-transparent" />
            </>
          )}
        </div>
      )}

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <RevealRepeat delay={0.1} className="mt-12 flex justify-center">
          <Link
            to="/home-02/projects"
            className="group inline-flex items-center gap-3 rounded-md border-2 border-[#073B70] pl-6 pr-2 py-2 text-[14px] font-semibold text-[#073B70] transition-colors duration-300 hover:bg-[#073B70] hover:text-white"
          >
            View All {projects.length} Projects
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5C518] transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={14} className="text-[#073B70]" />
            </span>
          </Link>
        </RevealRepeat>
      </div>
    </section>
  );
}
