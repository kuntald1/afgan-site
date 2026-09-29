import { useState } from "react";
import { ChevronDown, MapPin, Calendar, Briefcase } from "lucide-react";
import { careerIntro, careerValues, contact } from "../content";
import { Reveal, RevealGroup, RevealItem } from "./motion/Reveal";
import { useCareerJobs } from "../hooks/useCareerJobs";
import ApplicationModal from "./ApplicationModal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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
    <div className="glass-panel overflow-hidden rounded-2xl transition-colors duration-300 hover:border-[#F26522]/30">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 p-6 sm:p-7 text-left"
      >
        <div className="flex-1">
          <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#16212b]">
            {job.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#16212b]/55">
            <span className="flex items-center gap-1">
              <Briefcase size={12} /> {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {job.location}
            </span>
            {job.employment_type && <span>{job.employment_type}</span>}
            <span className="flex items-center gap-1">
              <Calendar size={12} /> Posted {formatDate(job.posted_date)}
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-[#16212b]/65">{job.summary}</p>
        </div>
        <ChevronDown
          size={18}
          className={`mt-1 flex-shrink-0 text-[#16212b]/40 transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className="grid overflow-hidden transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-black/8 px-6 sm:px-7 py-6 space-y-5">
            {job.responsibilities && (
              <div>
                <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#16212b]/50">
                  Responsibilities
                </h4>
                <p className="text-[14px] leading-relaxed text-[#16212b]/70 whitespace-pre-line">
                  {job.responsibilities}
                </p>
              </div>
            )}
            {job.qualifications && (
              <div>
                <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#16212b]/50">
                  Qualifications
                </h4>
                <p className="text-[14px] leading-relaxed text-[#16212b]/70 whitespace-pre-line">
                  {job.qualifications}
                </p>
              </div>
            )}
            {job.deadline && (
              <p className="text-[12px] text-[#16212b]/45">
                Applications close {formatDate(job.deadline)}
              </p>
            )}
            <button
              type="button"
              onClick={onApply}
              className="rounded-full bg-[#F26522] px-6 py-2.5 text-[13px] sm:text-[14px] font-medium text-white transition-colors duration-300 hover:bg-[#e05a1a]"
            >
              Apply for this role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Career() {
  const { jobs, loading } = useCareerJobs();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [applyingTo, setApplyingTo] = useState<{ id: number; title: string } | null>(null);

  return (
    <section id="career" className="pt-6 sm:pt-8 pb-10 sm:pb-16">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="text-[15px] sm:text-[17px] leading-relaxed text-[#16212b]/75 max-w-3xl">
            {careerIntro}
          </p>
        </Reveal>

        <RevealGroup className="mt-9 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {careerValues.map((v) => (
            <RevealItem key={v.title}>
              <h3 className="text-[13px] font-semibold tracking-wide uppercase text-[#16212b] pb-2 border-b-2 border-[#F26522] inline-block">
                {v.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[#16212b]/65">{v.detail}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-14 sm:mt-16 mb-6">
          <h2
            className="font-medium tracking-[-0.02em] text-[#16212b]"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.6rem)" }}
          >
            Current openings
          </h2>
        </Reveal>

        {loading ? (
          <p className="text-[14px] text-[#16212b]/50">Loading openings…</p>
        ) : jobs.length === 0 ? (
          <p className="text-[14px] text-[#16212b]/50">
            No open roles right now — check back soon, or send your CV to{" "}
            <a href={`mailto:${contact.email}`} className="font-medium text-[#F26522] underline underline-offset-4">
              {contact.email}
            </a>
            .
          </p>
        ) : (
          <RevealGroup className="flex flex-col gap-4">
            {jobs.map((job) => (
              <RevealItem key={job.id}>
                <JobCard
                  job={job}
                  expanded={expandedId === job.id}
                  onToggle={() => setExpandedId(expandedId === job.id ? null : job.id)}
                  onApply={() => setApplyingTo({ id: job.id, title: job.title })}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        {jobs.length > 0 && (
          <Reveal delay={0.1}>
            <p className="mt-10 text-[14px] text-[#16212b]/60">
              Don't see a fit? Send your CV to{" "}
              <a
                href={`mailto:${contact.email}`}
                className="font-medium text-[#F26522] underline underline-offset-4"
              >
                {contact.email}
              </a>
              .
            </p>
          </Reveal>
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
  );
}
