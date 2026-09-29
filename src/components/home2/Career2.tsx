import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Calendar, Briefcase, ArrowUpRight, Send } from "lucide-react";
import { careerIntro, careerValues, contact } from "../../content";
import { useCareerJobs } from "../../hooks/useCareerJobs";
import ApplicationModal from "../ApplicationModal";
import SectionHeading from "./SectionHeading";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import { EASE } from "./tokens";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * Career2 — the Home-02 styling of the careers page.
 *
 * REQUIRED in src/assets.ts, next to the other home2 image entries:
 *   careerIntroImage: "/assets/images/home2/career-intro.jpg",
 * Then drop a photo at: public/assets/images/home2/career-intro.jpg
 * (landscape or portrait both work with the aspect-[4/4.3] frame below;
 * a real ACE team/office shot reads best here).
 *
 * Data layer is untouched: same `useCareerJobs` hook hitting the same API,
 * same `ApplicationModal`, same job fields. Only the presentation changed,
 * plus two additions — location/type filter chips and a live count of open
 * roles — which are pure client-side work over the jobs already fetched.
 */

// Local fade-up with once:false, so entrances replay on scroll. Deliberately
// not the shared <Reveal>, which the original site's pages also use.
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const ALL = "All";

function JobCard({
  job,
  expanded,
  onToggle,
  onApply,
}: {
  job: ReturnType<typeof useCareerJobs>["jobs"][number];
  expanded: boolean;
  onToggle: () => void;
  onApply: () => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(15,61,46,0.08)] transition-all duration-500 ${
        expanded ? "ring-2 ring-[#F5C518]" : "hover:shadow-[0_26px_60px_rgba(15,61,46,0.16)]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-4 p-6 sm:p-7 text-left"
      >
        <div className="flex-1">
          <h3
            className="text-[#073B70] transition-colors duration-300 group-hover:text-[#073B70]/70"
            style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "20px" }}
          >
            {job.title}
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] font-bold text-[#073B70]/65">
            <span className="flex items-center gap-1.5">
              <Briefcase size={13} className="text-[#F5C518]" /> {job.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#F5C518]" /> {job.location}
            </span>
            {job.employment_type && (
              <span className="rounded-full bg-[#073B70]/6 px-2.5 py-0.5 font-bold text-[#073B70]/75">
                {job.employment_type}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#F5C518]" /> Posted {formatDate(job.posted_date)}
            </span>
          </div>

          <p className="mt-3.5 font-semibold text-[15px] leading-relaxed text-[#073B70]/75">{job.summary}</p>
        </div>

        <span
          className={`mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            expanded ? "rotate-180 bg-[#F5C518]" : "bg-[#073B70]/6 group-hover:bg-[#F5C518]"
          }`}
        >
          <ChevronDown size={17} className="text-[#073B70]" />
        </span>
      </button>

      {/* 0fr → 1fr grid trick: height animates without measuring the content */}
      <div
        className="grid overflow-hidden transition-all duration-500 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#073B70]/10 bg-[#F7F7F5] px-6 sm:px-7 py-7 space-y-6">
            {job.responsibilities && (
              <div>
                <h4 className="mb-2.5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[#073B70]/60">
                  <span className="h-px w-5 bg-[#F5C518]" />
                  Responsibilities
                </h4>
                <p className="text-[14.5px] leading-relaxed text-[#073B70]/75 whitespace-pre-line">
                  {job.responsibilities}
                </p>
              </div>
            )}

            {job.qualifications && (
              <div>
                <h4 className="mb-2.5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[#073B70]/60">
                  <span className="h-px w-5 bg-[#F5C518]" />
                  Qualifications
                </h4>
                <p className="text-[14.5px] leading-relaxed text-[#073B70]/75 whitespace-pre-line">
                  {job.qualifications}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <button
                type="button"
                onClick={onApply}
                className="group inline-flex items-center gap-3 rounded-md bg-[#F5C518] hover:bg-[#e6b800] pl-6 pr-2 py-2.5 text-[14px] font-semibold text-[#073B70] transition-colors duration-300"
              >
                Apply for this role
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#073B70] transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={15} className="text-[#F5C518]" />
                </span>
              </button>

              {job.deadline && (
                <p className="text-[12.5px] text-[#073B70]/50">
                  Applications close{" "}
                  <span className="font-semibold text-[#073B70]/75">{formatDate(job.deadline)}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Career2() {
  const { jobs, loading } = useCareerJobs();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [applyingTo, setApplyingTo] = useState<{ id: number; title: string } | null>(null);
  const [location, setLocation] = useState<string>(ALL);
  const [type, setType] = useState<string>(ALL);

  const section1Eyebrow = useDynamicContent("career.section1_eyebrow", "Work With Us");
  const section1Heading = useDynamicContent(
    "career.section1_heading",
    "Build a Career That Builds the Country"
  );
  const openingsEyebrow = useDynamicContent("career.openings_eyebrow", "Current Openings");
  const openingsHeading = useDynamicContent("career.openings_heading", "Roles Open Right Now");
  const noFitHeading = useDynamicContent("career.no_fit_heading", "Don't see a fit?");
  const noFitBody = useDynamicContent(
    "career.no_fit_body",
    "Send us your CV and we'll keep it on file for future openings."
  );
  const introText = useDynamicContent("career.intro_text", careerIntro);
  const introImage = resolveMediaUrl(useDynamicContent("career.intro_image", assets.careerIntroImage));
  const value1Title = useDynamicContent("career.value_1_title", careerValues[0]?.title ?? "");
  const value1Body = useDynamicContent("career.value_1_body", careerValues[0]?.detail ?? "");
  const value2Title = useDynamicContent("career.value_2_title", careerValues[1]?.title ?? "");
  const value2Body = useDynamicContent("career.value_2_body", careerValues[1]?.detail ?? "");
  const value3Title = useDynamicContent("career.value_3_title", careerValues[2]?.title ?? "");
  const value3Body = useDynamicContent("career.value_3_body", careerValues[2]?.detail ?? "");
  const values = [
    { title: value1Title, detail: value1Body },
    { title: value2Title, detail: value2Body },
    { title: value3Title, detail: value3Body },
  ];

  // Filter options derived from whatever the API actually returned, so no
  // hardcoded list can drift out of sync with the database.
  const locations = useMemo(
    () => [ALL, ...Array.from(new Set(jobs.map((j) => j.location).filter(Boolean)))],
    [jobs]
  );
  const types = useMemo(
    () => [
      ALL,
      ...Array.from(
        new Set(jobs.map((j) => j.employment_type).filter((t): t is string => Boolean(t)))
      ),
    ],
    [jobs]
  );

  const visible = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (location === ALL || j.location === location) &&
          (type === ALL || j.employment_type === type)
      ),
    [jobs, location, type]
  );

  const showFilters = !loading && jobs.length > 1 && (locations.length > 2 || types.length > 2);

  return (
    <>
      {/* Intro + values */}
      <section className="py-16 sm:py-20 bg-white overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <SectionHeading eyebrow={section1Eyebrow} title={section1Heading} />

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            <RevealRepeat>
              <p
                className="max-w-xl leading-relaxed text-[#073B70]/80"
                style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "19px" }}
              >
                {introText}
              </p>
            </RevealRepeat>

            {/* Animated photo — same tilt + wipe-open treatment used
                elsewhere on Home-02 (About2.tsx, the About page's Overview
                section). */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.18 } } }}
              className="relative max-w-[420px] mx-auto lg:mx-0"
            >
              <motion.div
                aria-hidden
                variants={{
                  hidden: { opacity: 0, rotate: 0, scale: 0.94 },
                  visible: {
                    opacity: 1,
                    rotate: -4,
                    scale: 1,
                    transition: { duration: 0.9, ease: EASE },
                  },
                }}
                className="absolute -inset-4 rounded-2xl bg-[#F5C518]"
              />
              <motion.div
                variants={{
                  hidden: { clipPath: "inset(0 100% 0 0)" },
                  visible: {
                    clipPath: "inset(0 0% 0 0)",
                    transition: { duration: 1.05, ease: EASE },
                  },
                }}
                className="relative aspect-[4/4.3] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(15,61,46,0.2)]"
              >
                <FallbackImage
                  src={introImage}
                  alt="Join the ACE team"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-7"
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 34 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                }}
                className="group relative overflow-hidden rounded-2xl bg-[#F7F7F5] p-7 transition-all duration-500 hover:bg-[#073B70]"
              >
                {/* Ghosted index, echoing the Services2 cards */}
                <span
                  className="pointer-events-none absolute right-5 top-3 text-[38px] font-bold text-[#073B70]/[0.06] transition-colors duration-500 group-hover:text-white/10"
                  style={{ fontFamily: "Urbanist, sans-serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="mb-4 block h-1 w-10 rounded-full bg-[#F5C518]" />
                <h3
                  className="text-[17px] uppercase tracking-wide text-[#073B70] transition-colors duration-500 group-hover:text-white"
                  style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800 }}
                >
                  {v.title}
                </h3>
                <p className="mt-3 font-semibold text-[15px] leading-relaxed text-[#073B70]/75 transition-colors duration-500 group-hover:text-white/80">
                  {v.detail}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Openings */}
      <section id="career" className="py-16 sm:py-20 bg-[#F7F7F5] overflow-hidden">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12">
          <RevealRepeat className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block mb-4 rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
                {openingsEyebrow}
              </span>
              <h2
                className="leading-[1.08] tracking-[-0.025em] text-[#073B70]"
                style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem, 4.2vw, 3rem)" }}
              >
                {openingsHeading}
              </h2>
            </div>

            {!loading && jobs.length > 0 && (
              <p className="text-[14px] text-[#073B70]/55">
                <span
                  className="text-[28px] font-extrabold text-[#073B70]"
                  style={{ fontFamily: "Urbanist, sans-serif" }}
                >
                  {visible.length}
                </span>{" "}
                {visible.length === 1 ? "role" : "roles"}
                {visible.length !== jobs.length && ` of ${jobs.length}`}
              </p>
            )}
          </RevealRepeat>

          {/* Filter chips — only shown when there's actually something to filter */}
          {showFilters && (
            <RevealRepeat className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              {locations.length > 2 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-[#073B70]/45">
                    Location
                  </span>
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
                        location === loc
                          ? "bg-[#073B70] text-white"
                          : "bg-white text-[#073B70]/70 hover:bg-[#F5C518]/25"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}

              {types.length > 2 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-[#073B70]/45">
                    Type
                  </span>
                  {types.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
                        type === t
                          ? "bg-[#073B70] text-white"
                          : "bg-white text-[#073B70]/70 hover:bg-[#F5C518]/25"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </RevealRepeat>
          )}

          {loading ? (
            // Skeleton cards rather than a bare line of text, so the layout
            // doesn't jump when the API responds.
            <div className="flex flex-col gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-7">
                  <div className="h-5 w-1/3 rounded bg-[#073B70]/10" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-[#073B70]/8" />
                  <div className="mt-4 h-3 w-full rounded bg-[#073B70]/8" />
                  <div className="mt-2 h-3 w-4/5 rounded bg-[#073B70]/8" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center">
              <p className="text-[15px] text-[#073B70]/65">
                No open roles right now — check back soon, or send your CV to{" "}
                <a
                  href={`mailto:${contact.email}`}
                  className="font-semibold text-[#073B70] underline decoration-[#F5C518] decoration-2 underline-offset-4"
                >
                  {contact.email}
                </a>
                .
              </p>
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center">
              <p className="text-[15px] text-[#073B70]/65">
                No roles match those filters.{" "}
                <button
                  type="button"
                  onClick={() => {
                    setLocation(ALL);
                    setType(ALL);
                  }}
                  className="font-semibold text-[#073B70] underline decoration-[#F5C518] decoration-2 underline-offset-4"
                >
                  Clear filters
                </button>
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {visible.map((job, i) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.07, ease: EASE } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25 } }}
                  >
                    <JobCard
                      job={job}
                      expanded={expandedId === job.id}
                      onToggle={() => setExpandedId(expandedId === job.id ? null : job.id)}
                      onApply={() => setApplyingTo({ id: job.id, title: job.title })}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Open application card */}
          {!loading && jobs.length > 0 && (
            <RevealRepeat delay={0.1} className="mt-10">
              <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#073B70] p-8 sm:flex-row sm:items-center">
                <div>
                  <p
                    className="text-white"
                    style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "20px" }}
                  >
                    {noFitHeading}
                  </p>
                  <p className="mt-1.5 text-[14.5px] text-white/65">
                    {noFitBody}
                  </p>
                </div>
                <a
                  href={`mailto:${contact.email}`}
                  className="group inline-flex items-center gap-3 rounded-md bg-[#F5C518] hover:bg-[#e6b800] pl-6 pr-2 py-2.5 text-[14px] font-semibold text-[#073B70] transition-colors duration-300"
                >
                  {contact.email}
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#073B70] transition-transform duration-500 group-hover:translate-x-0.5">
                    <Send size={15} className="text-[#F5C518]" />
                  </span>
                </a>
              </div>
            </RevealRepeat>
          )}
        </div>

        {applyingTo && (
          <ApplicationModal
            jobId={applyingTo.id}
            jobTitle={applyingTo.title}
            onClose={() => setApplyingTo(null)}
          />
        )}
      </section>
    </>
  );
}
