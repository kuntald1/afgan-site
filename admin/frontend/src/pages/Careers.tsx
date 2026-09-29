import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Users, X, Loader2, Search, Sparkles } from "lucide-react";
import { api, type JobPosting, type JobPostingInput, type JobApplication } from "../lib/api";

const EMPTY_FORM: JobPostingInput = {
  title: "",
  company: "ACE",
  location: "",
  employment_type: "",
  posted_date: new Date().toISOString().slice(0, 10),
  deadline: "",
  summary: "",
  responsibilities: "",
  qualifications: "",
};

function isExpired(job: JobPosting): boolean {
  if (!job.deadline) return false;
  return new Date(job.deadline) < new Date(new Date().toISOString().slice(0, 10));
}

function JobForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: JobPostingInput;
  onSave: (job: JobPostingInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<JobPostingInput>(initial);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof JobPostingInput, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave({
        ...form,
        employment_type: form.employment_type || null,
        deadline: form.deadline || null,
        responsibilities: form.responsibilities || null,
        qualifications: form.qualifications || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LabeledInput label="Job title" value={form.title} onChange={(v) => set("title", v)} />
        <LabeledInput label="Company" value={form.company} onChange={(v) => set("company", v)} />
        <LabeledInput label="Location" value={form.location} onChange={(v) => set("location", v)} />
        <LabeledInput
          label="Employment type"
          value={form.employment_type || ""}
          onChange={(v) => set("employment_type", v)}
          placeholder="Full time, Contract, ..."
        />
        <LabeledInput
          label="Posted date"
          type="date"
          value={form.posted_date}
          onChange={(v) => set("posted_date", v)}
        />
        <div>
          <LabeledInput
            label="Application deadline"
            type="date"
            value={form.deadline || ""}
            onChange={(v) => set("deadline", v)}
          />
          <p className="mt-1 text-[11px] text-gray-400">
            Leave blank for no deadline. Once this date passes, the role automatically stops
            showing on the public Career page — no need to delete it manually.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-[13px] font-medium text-gray-700">
          Summary (shown on the card)
        </label>
        <textarea
          value={form.summary}
          onChange={(e) => set("summary", e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-[14px] outline-none focus:border-[#073B70]"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-[13px] font-medium text-gray-700">
          Responsibilities (shown when expanded)
        </label>
        <textarea
          value={form.responsibilities || ""}
          onChange={(e) => set("responsibilities", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-[14px] outline-none focus:border-[#073B70]"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-[13px] font-medium text-gray-700">
          Qualifications (shown when expanded)
        </label>
        <textarea
          value={form.qualifications || ""}
          onChange={(e) => set("qualifications", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-[14px] outline-none focus:border-[#073B70]"
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !form.title || !form.location || !form.summary}
          className="flex items-center gap-1.5 rounded-lg bg-[#073B70] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#052c54] disabled:opacity-40"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[13px] text-gray-500 hover:text-[#073B70]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-[14px] outline-none focus:border-[#073B70]"
      />
    </div>
  );
}

function ApplicationsPanel({ jobId, onClose }: { jobId: number; onClose: () => void }) {
  const [apps, setApps] = useState<JobApplication[] | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"keyword" | "smart">("keyword");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unfiltered count, loaded once, so "3 of 12" style context is available
  // even while a search filter is active.
  useEffect(() => {
    setError(null);
    api
      .listApplications(jobId)
      .then((all) => {
        setTotalCount(all.length);
        setApps(all);
      })
      .catch((err) => {
        // Previously this had no .catch() at all — a failed request left
        // the panel stuck on "Loading…" forever with no indication
        // anything had gone wrong. Now it shows the real error instead.
        setError(err instanceof Error ? err.message : "Failed to load applications.");
      });
  }, [jobId]);

  const runSearch = async (term: string) => {
    setSearching(true);
    setError(null);
    try {
      const results =
        mode === "smart"
          ? await api.smartSearchApplications(jobId, term)
          : await api.listApplications(jobId, term);
      setApps(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "smart" && !search.trim()) return; // smart search requires a query
    runSearch(search);
  };

  const clearSearch = () => {
    setSearch("");
    setError(null);
    api.listApplications(jobId).then(setApps);
  };

  const handleDeleteApplication = async (applicationId: number) => {
    if (!confirm("Delete this application? This also deletes the uploaded résumé file — it can't be undone.")) {
      return;
    }
    try {
      await api.deleteApplication(jobId, applicationId);
      // Refresh whatever's currently shown — respects an active search filter.
      const refreshed = await api.listApplications(jobId, search);
      setApps(refreshed);
      setTotalCount((c) => (c !== null ? c - 1 : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete application.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#073B70]">
            Applications{totalCount !== null && ` (${apps?.length ?? 0} of ${totalCount})`}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-[#073B70]">
            <X size={18} />
          </button>
        </div>

        {/* Search mode toggle */}
        <div className="mb-3 flex items-center gap-1 rounded-lg bg-gray-100 p-1 text-[12px] font-medium">
          <button
            type="button"
            onClick={() => setMode("keyword")}
            className={`flex-1 rounded-md px-3 py-1.5 transition-colors ${
              mode === "keyword" ? "bg-white text-[#073B70] shadow-sm" : "text-gray-500"
            }`}
          >
            Keyword search
          </button>
          <button
            type="button"
            onClick={() => setMode("smart")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-md px-3 py-1.5 transition-colors ${
              mode === "smart" ? "bg-white text-[#073B70] shadow-sm" : "text-gray-500"
            }`}
          >
            <Sparkles size={12} /> Smart search (AI)
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                mode === "smart"
                  ? "e.g. python developer with 3 years experience"
                  : "Search résumé content or skills, e.g. Python, FastAPI"
              }
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-[13px] outline-none focus:border-[#073B70]"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="flex items-center gap-1.5 rounded-lg bg-[#073B70] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#052c54] disabled:opacity-50"
          >
            {searching ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-[13px] text-gray-500 hover:text-[#073B70]"
            >
              Clear
            </button>
          )}
        </form>
        <p className="mb-4 text-[11px] text-gray-400">
          {mode === "keyword"
            ? "Literal keyword match against the résumé's extracted text and listed skills. Only .pdf and .docx résumés are text-searchable."
            : "AI-ranked by meaning, not just literal words — e.g. \"backend engineer\" can match a résumé that says \"API development\" instead. Candidates below a relevance threshold are excluded entirely, not just ranked last — each result shows its match score."}
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-600">{error}</p>
        )}

        {apps === null ? (
          error ? null : <p className="text-[13px] text-gray-500">Loading…</p>
        ) : apps.length === 0 ? (
          <p className="text-[13px] text-gray-500">
            {search ? `No applications match "${search}".` : "No applications submitted yet."}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {apps.map((a) => (
              <div key={a.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium text-[#073B70]">
                    {a.first_name} {a.middle_name ? a.middle_name + " " : ""}
                    {a.last_name}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400">
                      {new Date(a.submitted_at).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteApplication(a.id)}
                      title="Delete this application and its résumé file"
                      className="flex h-6 w-6 items-center justify-center rounded text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-[13px] text-gray-600">
                  {a.email} · {a.mobile_phone}
                </p>
                {(a.experience_years || a.current_location) && (
                  <p className="mt-1 text-[12px] text-gray-500">
                    {a.experience_years != null && `${a.experience_years}y experience`}
                    {a.current_location && ` · ${a.current_location}`}
                  </p>
                )}
                {a.skills && (
                  <p className="mt-1 text-[12px] text-gray-500">Skills: {a.skills}</p>
                )}

                {/* AI-extracted data, if present */}
                {a.ai_extraction_status === "done" && (
                  <div className="mt-2 rounded-lg bg-purple-50 p-2.5">
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-1 text-[11px] font-medium text-purple-700">
                        <Sparkles size={11} /> AI-extracted from résumé
                      </p>
                      {a.match_score !== null && (
                        <span
                          title="Relevance to the current smart search — not a stored property, recalculated per search"
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            a.match_score >= 70
                              ? "bg-green-100 text-green-700"
                              : a.match_score >= 40
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {a.match_score}% match
                        </span>
                      )}
                    </div>
                    {a.extracted_summary && (
                      <p className="mt-1 text-[12px] text-gray-700">{a.extracted_summary}</p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-gray-500">
                      {a.extracted_years_experience != null && (
                        <span>{a.extracted_years_experience}y experience</span>
                      )}
                      {a.extracted_education && <span>{a.extracted_education}</span>}
                    </div>
                    {a.extracted_skills && a.extracted_skills.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {a.extracted_skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-white px-2 py-0.5 text-[10px] text-gray-600"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <a
                  href={api.mediaUrl(a.resume_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[12px] font-medium text-blue-600 hover:underline"
                >
                  Download resume ({a.resume_filename})
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Careers() {
  const [jobs, setJobs] = useState<JobPosting[] | null>(null);
  const [editing, setEditing] = useState<"new" | number | null>(null);
  const [viewingApplicationsFor, setViewingApplicationsFor] = useState<number | null>(null);

  const load = () => api.listJobsAdmin().then(setJobs);

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (job: JobPostingInput) => {
    if (editing === "new") {
      await api.createJob(job);
    } else if (typeof editing === "number") {
      await api.updateJob(editing, job);
    }
    setEditing(null);
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this posting? This also deletes any applications submitted for it.")) return;
    await api.deleteJob(id);
    await load();
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[#073B70]">Career postings</h2>
        {editing === null && (
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="flex items-center gap-1.5 rounded-lg bg-[#073B70] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#052c54]"
          >
            <Plus size={14} /> New posting
          </button>
        )}
      </div>

      {editing === "new" && (
        <div className="mb-6">
          <JobForm initial={EMPTY_FORM} onSave={handleSave} onCancel={() => setEditing(null)} />
        </div>
      )}

      {jobs === null ? (
        <p className="text-[14px] text-gray-500">Loading…</p>
      ) : jobs.length === 0 ? (
        <p className="text-[14px] text-gray-500">No postings yet — add one above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) =>
            editing === job.id ? (
              <JobForm
                key={job.id}
                initial={job}
                onSave={handleSave}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div key={job.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-medium text-[#073B70]">{job.title}</p>
                    <p className="mt-0.5 text-[12px] text-gray-500">
                      {job.location} · Posted {job.posted_date}
                      {job.deadline && ` · Closes ${job.deadline}`}
                      {" · "}
                      {job.application_count} application{job.application_count === 1 ? "" : "s"}
                    </p>
                    {isExpired(job) && (
                      <span className="mt-1 inline-block rounded-full bg-red-50 px-2 py-0.5 text-[11px] text-red-600">
                        Expired — hidden from public Career page
                      </span>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewingApplicationsFor(job.id)}
                      title="View applications"
                      className="relative flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                    >
                      <Users size={15} />
                      {job.application_count > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#073B70] px-1 text-[10px] font-semibold text-white">
                          {job.application_count}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(job.id)}
                      title="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(job.id)}
                      title="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {viewingApplicationsFor !== null && (
        <ApplicationsPanel
          jobId={viewingApplicationsFor}
          onClose={() => setViewingApplicationsFor(null)}
        />
      )}
    </div>
  );
}
