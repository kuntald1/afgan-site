import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Newspaper,
  Images,
  Users,
  Mail,
  FileText,
  ExternalLink,
  ArrowRight,
  TriangleAlert,
} from "lucide-react";
import {
  api,
  type BlogPost,
  type ContactMessage,
  type ContentBlock,
  type GalleryItem,
  type JobPosting,
  type Project,
} from "../lib/api";
import { PAGE_META, PAGE_ORDER, pageKeyOf } from "../lib/siteMeta";

type Data = {
  blocks: ContentBlock[] | null;
  jobs: JobPosting[] | null;
  projects: Project[] | null;
  gallery: GalleryItem[] | null;
  posts: BlogPost[] | null;
  messages: ContactMessage[] | null;
};

const EMPTY: Data = { blocks: null, jobs: null, projects: null, gallery: null, posts: null, messages: null };

function StatCard({
  to,
  icon: Icon,
  label,
  value,
  sub,
  tone,
  loading,
}: {
  to: string;
  icon: typeof FileText;
  label: string;
  value: number | string;
  sub: string;
  tone: string; // tailwind classes for the icon bubble
  loading: boolean;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-[#073B70]/10 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={20} />
        </span>
        <ArrowRight
          size={16}
          className="text-[#073B70]/25 transition-all group-hover:translate-x-0.5 group-hover:text-[#073B70]"
        />
      </div>
      {loading ? (
        <div className="mt-4 h-8 w-16 animate-pulse rounded bg-gray-100" />
      ) : (
        <p className="mt-4 text-[30px] font-bold leading-none text-[#073B70]">{value}</p>
      )}
      <p className="mt-2 text-[14px] font-semibold text-gray-800">{label}</p>
      <p className="mt-0.5 text-[12.5px] text-gray-500">{sub}</p>
    </Link>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#073B70]/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="text-[15px] font-semibold text-[#073B70]">{title}</h2>
        {action && (
          <Link
            to={action.to}
            className="flex items-center gap-1 text-[12.5px] font-semibold text-[#073B70]/70 hover:text-[#073B70]"
          >
            {action.label} <ArrowRight size={13} />
          </Link>
        )}
      </div>
      <div className="px-5 py-2">{children}</div>
    </section>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<Data>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // allSettled: one failing endpoint must not blank the whole dashboard.
      const [blocks, jobs, projects, gallery, posts, messages] = await Promise.allSettled([
        api.listContent(),
        api.listJobsAdmin(),
        api.listProjectsAdmin(),
        api.listGallery(),
        api.listPostsAdmin(),
        api.listMessages(),
      ]);
      if (cancelled) return;
      const ok = <T,>(r: PromiseSettledResult<T>): T | null => (r.status === "fulfilled" ? r.value : null);
      setData({
        blocks: ok(blocks),
        jobs: ok(jobs),
        projects: ok(projects),
        gallery: ok(gallery),
        posts: ok(posts),
        messages: ok(messages),
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { blocks, jobs, projects, gallery, posts, messages } = data;

  const photos = gallery?.filter((g) => g.kind === "photo").length ?? 0;
  const videos = gallery?.filter((g) => g.kind === "video").length ?? 0;
  const applicants = jobs?.reduce((sum, j) => sum + (j.application_count ?? 0), 0) ?? 0;

  const blocksPerPage = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of blocks ?? []) map.set(pageKeyOf(b.page), (map.get(pageKeyOf(b.page)) ?? 0) + 1);
    return map;
  }, [blocks]);

  // Things the client should look at before the site goes live.
  const attention = useMemo(() => {
    const items: { text: string; to: string; cta: string }[] = [];
    if (projects && projects.length === 0)
      items.push({ text: "No projects have been added yet.", to: "/projects", cta: "Add a project" });
    if (posts && posts.length === 0)
      items.push({ text: "No blog posts have been published yet.", to: "/blog", cta: "Write a post" });
    if (gallery && gallery.length === 0)
      items.push({ text: "The Gallery is empty.", to: "/gallery", cta: "Add photos or videos" });
    return items;
  }, [projects, posts, gallery]);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const recentMessages = (messages ?? []).slice(0, 5);
  const openJobs = (jobs ?? []).slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8 sm:py-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#073B70] to-[#0B5AA8] p-7 text-white shadow-sm sm:p-9">
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-[#F5C518]/20" />
        <div className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" />
        <p className="text-[12.5px] font-medium uppercase tracking-[0.14em] text-[#F5C518]">{today}</p>
        <h2 className="mt-2 text-[26px] font-bold leading-tight sm:text-[30px]">Welcome to your website control centre</h2>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-white/80">
          Everything visitors see on the ACE website can be managed from here. Pick a page to edit its
          text and photos, add projects and blog posts, and read enquiries as they arrive.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/content"
            className="flex items-center gap-2 rounded-full bg-[#F5C518] px-5 py-2.5 text-[13.5px] font-semibold text-[#073B70] transition-colors hover:bg-[#e6b800]"
          >
            <FileText size={15} /> Edit page content
          </Link>
          <a
            href={`${window.location.origin}/home-02`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-white/10"
          >
            <ExternalLink size={15} /> View live website
          </a>
        </div>
      </section>

      {/* Needs attention */}
      {attention.length > 0 && (
        <section className="rounded-2xl border border-[#F5C518]/60 bg-[#FFF9E0] p-5">
          <p className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-[#7A5B00]">
            <TriangleAlert size={16} /> Needs your attention
          </p>
          <ul className="space-y-2">
            {attention.map((a) => (
              <li key={a.text} className="flex flex-wrap items-center justify-between gap-2 text-[13.5px] text-[#5C4600]">
                <span>{a.text}</span>
                <Link to={a.to} className="font-semibold text-[#073B70] underline underline-offset-2">
                  {a.cta}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          to="/projects"
          icon={FolderKanban}
          label="Projects"
          value={projects?.length ?? "—"}
          sub="shown on the website"
          tone="bg-blue-50 text-blue-700"
          loading={loading}
        />
        <StatCard
          to="/blog"
          icon={Newspaper}
          label="Blog posts"
          value={posts?.length ?? "—"}
          sub="published articles"
          tone="bg-amber-50 text-amber-700"
          loading={loading}
        />
        <StatCard
          to="/gallery"
          icon={Images}
          label="Gallery items"
          value={gallery?.length ?? "—"}
          sub={`${photos} photos · ${videos} videos`}
          tone="bg-emerald-50 text-emerald-700"
          loading={loading}
        />
        <StatCard
          to="/careers"
          icon={Users}
          label="Job openings"
          value={jobs?.length ?? "—"}
          sub={`${applicants} applications received`}
          tone="bg-violet-50 text-violet-700"
          loading={loading}
        />
        <StatCard
          to="/messages"
          icon={Mail}
          label="Messages"
          value={messages?.length ?? "—"}
          sub={messages && messages.length > 0 ? "enquiries from the website" : "no enquiries yet"}
          tone="bg-rose-50 text-rose-700"
          loading={loading}
        />
        <StatCard
          to="/content"
          icon={FileText}
          label="Editable page items"
          value={blocks?.length ?? "—"}
          sub="texts & photos across all pages"
          tone="bg-slate-100 text-slate-700"
          loading={loading}
        />
      </div>

      {/* Two-column: messages + jobs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Latest messages" action={{ to: "/messages", label: "View all" }}>
          {loading ? (
            <div className="space-y-3 py-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <p className="py-6 text-center text-[13.5px] text-gray-400">
              No messages yet. Enquiries sent through the Contact page will appear here.
            </p>
          ) : (
            recentMessages.map((m) => (
              <Link
                key={m.id}
                to="/messages"
                className="block border-b border-gray-100 py-3 last:border-b-0 hover:bg-gray-50/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-[14px] font-semibold text-gray-800">{m.name}</p>
                  <p className="flex-shrink-0 text-[11.5px] text-gray-400">
                    {new Date(m.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-0.5 truncate text-[12.5px] text-gray-500">{m.message}</p>
              </Link>
            ))
          )}
        </Panel>

        <Panel title="Job openings" action={{ to: "/careers", label: "Manage" }}>
          {loading ? (
            <div className="space-y-3 py-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : openJobs.length === 0 ? (
            <p className="py-6 text-center text-[13.5px] text-gray-400">No job openings posted yet.</p>
          ) : (
            openJobs.map((j) => (
              <Link
                key={j.id}
                to="/careers"
                className="flex items-center justify-between gap-3 border-b border-gray-100 py-3 last:border-b-0 hover:bg-gray-50/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-gray-800">{j.title}</p>
                  <p className="truncate text-[12.5px] text-gray-500">
                    {j.location}
                    {j.deadline ? ` · closes ${new Date(j.deadline).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <span className="flex-shrink-0 rounded-full bg-[#073B70]/10 px-2.5 py-1 text-[11.5px] font-semibold text-[#073B70]">
                  {j.application_count} applicant{j.application_count === 1 ? "" : "s"}
                </span>
              </Link>
            ))
          )}
        </Panel>
      </div>

      {/* Website pages */}
      <section>
        <h2 className="mb-3 text-[15px] font-semibold text-[#073B70]">Your website pages</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAGE_ORDER.map((key) => {
            const meta = PAGE_META[key];
            const count = blocksPerPage.get(key) ?? 0;
            return (
              <div
                key={key}
                className="flex flex-col rounded-2xl border border-[#073B70]/10 bg-white p-4 shadow-sm"
              >
                <p className="text-[15px] font-semibold text-[#073B70]">{meta.label}</p>
                <p className="mt-1 line-clamp-3 flex-1 text-[12.5px] leading-relaxed text-gray-500">
                  {meta.description}
                </p>
                <p className="mt-3 text-[11.5px] text-gray-400">{count} editable items</p>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/content?page=${key}`}
                    className="flex-1 rounded-lg bg-[#073B70] px-3 py-2 text-center text-[12.5px] font-semibold text-white transition-colors hover:bg-[#052c54]"
                  >
                    Edit
                  </Link>
                  <a
                    href={`${window.location.origin}${meta.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-[12.5px] font-semibold text-[#073B70] transition-colors hover:bg-gray-50"
                    aria-label={`Open the ${meta.label} page on the website`}
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
