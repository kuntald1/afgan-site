import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import FallbackImage from "../home/FallbackImage";
import ProjectsFilterBar2, { useProjectFilters } from "./ProjectsFilterBar2";
import { EASE } from "./tokens";
import { useProjects } from "../../hooks/useProjects";
import { resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * ProjectsList2 — 2-up grid, no sidebar (the "Latest Projects" panel was
 * removed). Now sources its data from the admin panel's Projects CRUD
 * (useProjects) instead of the static projectsList in content.ts — add,
 * edit, or remove a project from the admin panel and it appears here with
 * no code change or deploy needed.
 */
export default function ProjectsList2() {
  const { projects, loading } = useProjects();
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

  if (loading) return null;

  return (
    <section className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 flex justify-center"
        >
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
        </motion.div>

        {projects.length === 0 ? (
          <div className="rounded-2xl bg-[#F7F7F5] p-10 text-center">
            <p className="text-[15px] font-semibold text-[#073B70]/65">No projects yet.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-[#F7F7F5] p-10 text-center">
            <p className="text-[15px] font-semibold text-[#073B70]/65">
              No projects match those filters.{" "}
              <button
                type="button"
                onClick={() => {
                  setType(ALL);
                  setYear(ALL);
                  setClient(ALL);
                }}
                className="font-bold text-[#073B70] underline decoration-[#F5C518] decoration-2 underline-offset-4"
              >
                Clear filters
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
            {filtered.map((p) => (
              <motion.article
                key={p.slug}
                variants={{
                  hidden: { opacity: 0, y: 32 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                }}
                className="group"
              >
                <Link
                  to={`/home-02/projects/${p.slug}`}
                  className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl"
                >
                  <FallbackImage
                    src={resolveMediaUrl(p.image_url ?? "")}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 right-4 rounded-xl bg-white px-4 py-2 text-center shadow-lg">
                    <p
                      className="leading-none text-[#073B70]"
                      style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "22px" }}
                    >
                      {p.year}
                    </p>
                    <p className="mt-1 rounded bg-[#F5C518] px-2 py-0.5 text-[10.5px] font-bold text-[#073B70]">
                      {p.type}
                    </p>
                  </div>
                </Link>

                <div className="mt-5">
                  <span className="inline-block rounded-md bg-[#F5C518]/20 px-3 py-1 text-[13px] font-bold uppercase tracking-wide text-[#073B70]">
                    {p.org}
                  </span>

                  <h3 className="mt-3">
                    <Link
                      to={`/home-02/projects/${p.slug}`}
                      className="text-[#073B70] transition-colors hover:text-[#073B70]/65"
                      style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "22px" }}
                    >
                      {p.title}
                    </Link>
                  </h3>

                  <p className="mt-3 font-semibold leading-relaxed text-[#073B70]/75" style={{ fontSize: "15.5px" }}>
                    {p.summary}
                  </p>

                  <Link
                    to={`/home-02/projects/${p.slug}`}
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
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
