import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Save, Upload, Check, Loader2, ExternalLink, ArrowRight, Eye } from "lucide-react";
import { api, type ContentBlock } from "../lib/api";
import {
  PAGE_LAYOUT,
  PAGE_META,
  PAGE_ORDER,
  cleanLabel,
  pageKeyOf,
  pageLabel,
  sectionDescription,
  sectionTitle,
  type PageKey,
} from "../lib/siteMeta";

/* ------------------------------------------------------------------ */
/* One editable field (text / paragraph / image)                       */
/* ------------------------------------------------------------------ */
function EditableBlock({
  block,
  onSaved,
  showTechnical,
}: {
  block: ContentBlock;
  onSaved: () => void;
  showTechnical: boolean;
}) {
  const [value, setValue] = useState(block.value ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const dirty = value !== (block.value ?? "");

  const save = async () => {
    setStatus("saving");
    try {
      await api.updateContent(block.key, value);
      setStatus("saved");
      onSaved();
      setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
    }
  };

  const handleFileUpload = async (file: File) => {
    setStatus("saving");
    try {
      const asset = await api.uploadMedia(file);
      setValue(asset.url);
      await api.updateContent(block.key, asset.url);
      setStatus("saved");
      onSaved();
      setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[14px] text-gray-800 outline-none transition-colors focus:border-[#073B70] focus:ring-2 focus:ring-[#073B70]/10";

  return (
    <div className="border-t border-gray-100 px-5 py-4 first:border-t-0 sm:px-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-[13.5px] font-semibold text-gray-800">{cleanLabel(block.label)}</label>
        <div className="flex items-center gap-2">
          {dirty && block.type !== "image" && (
            <span className="rounded-full bg-[#FFF3C4] px-2 py-0.5 text-[10.5px] font-semibold text-[#7A5B00]">
              Unsaved changes
            </span>
          )}
          {showTechnical && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-400">
              {block.key}
            </span>
          )}
        </div>
      </div>

      {block.type === "image" ? (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-24 w-36 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            {value ? (
              <img
                src={api.mediaUrl(value)}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <span className="text-[11.5px] text-gray-400">No photo</span>
            )}
          </div>
          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#073B70]/40 px-4 py-2.5 text-[13px] font-semibold text-[#073B70] transition-colors hover:bg-[#073B70]/5">
              {status === "saving" ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {value ? "Replace photo" : "Upload photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </label>
            {status === "saved" && (
              <p className="mt-2 flex items-center gap-1 text-[12.5px] font-medium text-green-600">
                <Check size={13} /> Photo uploaded and saved
              </p>
            )}
            {status === "error" && <p className="mt-2 text-[12.5px] text-red-600">Upload failed — please try again.</p>}
          </div>
        </div>
      ) : block.type === "richtext" ? (
        <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={4} className={`${inputClass} resize-y`} />
      ) : (
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
      )}

      {block.type !== "image" && (
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={!dirty || status === "saving"}
            className="flex items-center gap-1.5 rounded-lg bg-[#073B70] px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#052c54] disabled:cursor-not-allowed disabled:opacity-35"
          >
            {status === "saving" ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save
          </button>
          {status === "saved" && (
            <span className="flex items-center gap-1 text-[12.5px] font-medium text-green-600">
              <Check size={13} /> Saved — live on the website
            </span>
          )}
          {status === "error" && <span className="text-[12.5px] text-red-600">Failed to save</span>}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mini "page thumbnail": shows where this section sits on the page   */
/* ------------------------------------------------------------------ */
function PageThumb({ slots, activeIndex }: { slots: { ghost: boolean }[]; activeIndex: number }) {
  return (
    <div
      className="w-11 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
      aria-hidden
    >
      <div className="flex gap-0.5 border-b border-gray-100 bg-gray-50 px-1 py-[3px]">
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span className="h-1 w-1 rounded-full bg-gray-300" />
      </div>
      <div className="flex flex-col gap-[3px] p-1">
        {slots.map((s, i) => (
          <span
            key={i}
            className={`block rounded-[2px] ${i === 0 ? "h-2.5" : "h-1.5"} ${
              i === activeIndex ? "bg-[#F5C518]" : s.ghost ? "bg-gray-100" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section card                                                         */
/* ------------------------------------------------------------------ */
type SectionEntry = {
  anchor: string;
  pageKey: string;
  pageName: string;
  sectionKey: string;
  number: number | null; // position on the page (1-based), null if unknown
  total: number;
  slots: { ghost: boolean }[];
  slotIndex: number;
  items: ContentBlock[];
};

function SectionCard({
  entry,
  showPageBadge,
  showTechnical,
  onSaved,
}: {
  entry: SectionEntry;
  showPageBadge: boolean;
  showTechnical: boolean;
  onSaved: () => void;
}) {
  const description = sectionDescription(entry.pageKey, entry.sectionKey);
  const meta = PAGE_META[entry.pageKey as PageKey];

  return (
    <section
      id={entry.anchor}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-[#073B70]/10 bg-white shadow-sm"
    >
      <header className="flex items-start gap-4 border-b border-gray-100 bg-gradient-to-r from-[#F3F7FC] to-white px-5 py-4 sm:px-6">
        {entry.slotIndex >= 0 && <PageThumb slots={entry.slots} activeIndex={entry.slotIndex} />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {entry.number !== null && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5C518] text-[12px] font-bold text-[#073B70]">
                {entry.number}
              </span>
            )}
            <h3 className="text-[16px] font-bold text-[#073B70]">{sectionTitle(entry.pageKey, entry.sectionKey)}</h3>
            {showPageBadge && (
              <span className="rounded-full bg-[#073B70]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#073B70]">
                {entry.pageName} page
              </span>
            )}
          </div>
          {entry.number !== null && (
            <p className="mt-0.5 text-[11.5px] font-medium text-gray-400">
              Section {entry.number} of {entry.total} on the {entry.pageName} page
            </p>
          )}
          {description && <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{description}</p>}
        </div>
        {meta && (
          <a
            href={`${window.location.origin}${meta.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden flex-shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#073B70] transition-colors hover:bg-gray-50 sm:flex"
          >
            <Eye size={13} /> See on website
          </a>
        )}
      </header>

      {entry.items.map((block) => (
        <EditableBlock key={block.key} block={block} onSaved={onSaved} showTechnical={showTechnical} />
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
export default function PageContent() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTechnical, setShowTechnical] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const load = async () => {
    try {
      setBlocks(await api.listContent());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Pages that actually have content, in the order the client asked for:
  // Home, About, Services, Projects, Gallery, Blog, Career, Contact.
  // Anything unexpected is appended at the end alphabetically.
  const pageKeys = useMemo(() => {
    const present = new Set(blocks.map((b) => pageKeyOf(b.page)));
    const known = PAGE_ORDER.filter((k) => present.has(k)) as string[];
    const extra = Array.from(present)
      .filter((k) => !PAGE_ORDER.includes(k as PageKey))
      .sort();
    return [...known, ...extra];
  }, [blocks]);

  const requested = (searchParams.get("page") ?? "all").toLowerCase();
  const activePage = requested === "all" || pageKeys.includes(requested) ? requested : "all";

  const setActivePage = (p: string) => {
    if (p === "all") setSearchParams({});
    else setSearchParams({ page: p });
  };

  // Build the ordered section list for one page.
  const buildEntries = (pageKey: string): SectionEntry[] => {
    const pageBlocks = blocks.filter((b) => pageKeyOf(b.page) === pageKey);
    const bySection = new Map<string, ContentBlock[]>();
    for (const b of pageBlocks) {
      if (!bySection.has(b.section)) bySection.set(b.section, []);
      bySection.get(b.section)!.push(b);
    }

    const layout = PAGE_LAYOUT[pageKey] ?? [];
    const slots = layout.map((s) => ({ ghost: typeof s !== "string" }));
    const editableOrder = layout.filter((s): s is string => typeof s === "string" && bySection.has(s));
    const unknown = Array.from(bySection.keys())
      .filter((k) => !layout.includes(k))
      .sort();
    const ordered = [...editableOrder, ...unknown];
    const name = pageLabel(pageKey);

    return ordered.map((sectionKey) => {
      const slotIndex = layout.findIndex((s) => s === sectionKey);
      return {
        anchor: `sec-${pageKey}-${sectionKey}`,
        pageKey,
        pageName: name,
        sectionKey,
        number: slotIndex >= 0 ? slotIndex + 1 : null,
        total: layout.length,
        slots,
        slotIndex,
        items: bySection.get(sectionKey)!,
      };
    });
  };

  const pagesToShow = activePage === "all" ? pageKeys : [activePage];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</p>}

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : (
        <>
          {/* Page tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {["all", ...pageKeys].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setActivePage(p)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  activePage === p
                    ? "bg-[#073B70] text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#073B70]/30 hover:text-[#073B70]"
                }`}
              >
                {p === "all" ? "All" : pageLabel(p)}
              </button>
            ))}
          </div>

          {/* How-to strip */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#073B70]/10 bg-white px-5 py-3.5 shadow-sm">
            <p className="text-[13px] text-gray-600">
              <span className="font-semibold text-[#073B70]">How it works:</span> change a text or photo, press{" "}
              <span className="font-semibold">Save</span>, and it goes live on the website straight away.
            </p>
            <label className="flex cursor-pointer items-center gap-2 text-[12px] font-medium text-gray-500">
              <input
                type="checkbox"
                checked={showTechnical}
                onChange={(e) => setShowTechnical(e.target.checked)}
                className="h-3.5 w-3.5 accent-[#073B70]"
              />
              Show technical names
            </label>
          </div>

          {pagesToShow.map((pageKey) => {
            const entries = buildEntries(pageKey);
            const meta = PAGE_META[pageKey as PageKey];
            const layout = PAGE_LAYOUT[pageKey] ?? [];

            return (
              <div key={pageKey} className="mb-10">
                {/* Page header */}
                <div className="mb-4 rounded-2xl bg-gradient-to-br from-[#073B70] to-[#0B5AA8] p-6 text-white shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[22px] font-bold">{pageLabel(pageKey)} page</h2>
                      {meta && <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-white/80">{meta.description}</p>}
                    </div>
                    {meta && (
                      <a
                        href={`${window.location.origin}${meta.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-shrink-0 items-center gap-1.5 rounded-full bg-[#F5C518] px-4 py-2 text-[12.5px] font-semibold text-[#073B70] transition-colors hover:bg-[#e6b800]"
                      >
                        Open this page <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  {/* Page layout strip */}
                  {layout.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
                        Page layout — top to bottom
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {layout.map((slot, i) => {
                          if (typeof slot === "string") {
                            if (!entries.some((e) => e.sectionKey === slot)) return null;
                            return (
                              <a
                                key={slot}
                                href={`#sec-${pageKey}-${slot}`}
                                className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/25"
                              >
                                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#F5C518] px-1 text-[10px] font-bold text-[#073B70]">
                                  {i + 1}
                                </span>
                                {sectionTitle(pageKey, slot)}
                              </a>
                            );
                          }
                          return (
                            <Link
                              key={slot.ghost}
                              to={slot.to}
                              title={slot.note}
                              className="flex items-center gap-2 rounded-full border border-dashed border-white/35 px-3 py-1.5 text-[12px] font-medium text-white/75 transition-colors hover:bg-white/10"
                            >
                              <span className="text-[10px] font-bold">{i + 1}</span>
                              {slot.ghost}
                              <ArrowRight size={11} />
                            </Link>
                          );
                        })}
                      </div>
                      <p className="mt-2 text-[11.5px] text-white/50">
                        Dashed items are edited in another menu — click one to go there.
                      </p>
                    </div>
                  )}
                </div>

                {/* Section cards */}
                <div className="space-y-5">
                  {entries.map((entry) => (
                    <SectionCard
                      key={entry.anchor}
                      entry={entry}
                      showPageBadge={activePage === "all"}
                      showTechnical={showTechnical}
                      onSaved={load}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
