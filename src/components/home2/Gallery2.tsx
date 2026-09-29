import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { EASE } from "./tokens";
import GalleryLightbox2, { type LightboxState } from "./GalleryLightbox2";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";
import { useGallery } from "../../hooks/useGallery";

type Tab = "all" | "photos" | "videos";

/**
 * Gallery photos + videos now come from the admin panel's Gallery CRUD
 * (useGallery) instead of the static galleryPhotos/galleryPhotoCaptions
 * (content.ts) and the hardcoded YOUTUBE_VIDEOS array that used to live
 * here.
 */
export default function Gallery2() {
  const [tab, setTab] = useState<Tab>("all");
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const videoLabel = useDynamicContent("gallery.video_label", "Video");
  const photosLabel = useDynamicContent("gallery.photos_label", "Photos");

  const { photos: photoItems, videos: videoItems, loading } = useGallery();
  const galleryPhotos = photoItems.map((p) => resolveMediaUrl(p.image_url ?? ""));
  const galleryPhotoCaptions = photoItems.map((p) => p.caption ?? "");
  const YOUTUBE_VIDEOS = videoItems.map((v) => ({ id: v.youtube_id ?? "" }));

  if (loading) return null;

  const showVideos = (tab === "all" || tab === "videos") && YOUTUBE_VIDEOS.length > 0;
  const showPhotos = tab === "all" || tab === "photos";

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "photos", label: `Photos${galleryPhotos.length ? ` (${galleryPhotos.length})` : ""}` },
    ...(YOUTUBE_VIDEOS.length > 0
      ? [{ key: "videos" as Tab, label: `Videos (${YOUTUBE_VIDEOS.length})` }]
      : []),
  ];

  return (
    <section className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-40px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 flex justify-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-1.5 rounded-2xl bg-[#F7F7F5] p-1.5">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className="relative rounded-xl px-5 sm:px-6 py-2.5 text-[13.5px] font-semibold transition-colors duration-300"
              >
                {tab === t.key && (
                  <motion.span
                    layoutId="gallery-tab-pill"
                    className="absolute inset-0 rounded-xl bg-[#073B70] shadow-[0_10px_24px_rgba(15,61,46,0.25)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className={`relative ${tab === t.key ? "text-white" : "text-[#073B70]/55 hover:text-[#073B70]"}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Videos */}
        {showVideos && (
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="inline-block rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
                {videoLabel}
              </span>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-60px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              className={`grid gap-6 ${YOUTUBE_VIDEOS.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : "sm:grid-cols-2"}`}
            >
              {YOUTUBE_VIDEOS.map((v, i) => (
                <motion.button
                  key={`${v.id}-${i}`}
                  type="button"
                  onClick={() => setLightbox({ kind: "youtube", id: v.id })}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
                  }}
                  className="group relative aspect-video overflow-hidden rounded-2xl bg-[#073B70] shadow-[0_18px_44px_rgba(15,61,46,0.14)]"
                >
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                    alt={`ACE video ${i + 1}`}
                    className="h-full w-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#073B70]/25 transition-colors duration-300 group-hover:bg-[#073B70]/10">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5C518] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-110">
                      <Play size={24} className="ml-1 text-[#073B70]" fill="#073B70" />
                    </span>
                  </div>
                  <span className="absolute bottom-3 left-4 text-[12px] font-semibold text-white/85">
                    Video {i + 1} of {YOUTUBE_VIDEOS.length}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        )}

        {/* Photos */}
        {showPhotos && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="inline-block rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
                {photosLabel}
              </span>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-60px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
              className="columns-2 sm:columns-3 gap-4 sm:gap-5 [column-fill:_balance]"
            >
              {galleryPhotos.map((src, i) => (
                <motion.button
                  key={src}
                  type="button"
                  onClick={() => setLightbox({ kind: "photo", index: i })}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                  }}
                  className="group relative mb-4 sm:mb-5 block w-full break-inside-avoid overflow-hidden rounded-xl"
                >
                  <img
                    src={src}
                    alt={galleryPhotoCaptions[i] ?? "ACE field photo"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#073B70]/75 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <p className="pointer-events-none absolute bottom-3 left-3 right-3 text-left text-[15px] font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {galleryPhotoCaptions[i] ?? "ACE field photo"}
                  </p>
                  <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="#073B70" strokeWidth={2}>
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      <GalleryLightbox2
        state={lightbox}
        photos={galleryPhotos}
        captions={galleryPhotoCaptions}
        onClose={() => setLightbox(null)}
        onNavigate={(dir) =>
          setLightbox((prev) => {
            if (!prev || prev.kind !== "photo") return prev;
            const next = (prev.index + dir + galleryPhotos.length) % galleryPhotos.length;
            return { kind: "photo", index: next };
          })
        }
      />
    </section>
  );
}
