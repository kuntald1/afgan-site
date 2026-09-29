import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type LightboxState =
  | { kind: "photo"; index: number }
  | { kind: "video"; src: string }
  | { kind: "youtube"; id: string }
  | null;

export default function GalleryLightbox2({
  state,
  photos,
  captions,
  onClose,
  onNavigate,
}: {
  state: LightboxState;
  photos: string[];
  captions: string[];
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
}) {
  // Keyboard nav — Escape closes, arrows step through photos.
  useEffect(() => {
    if (!state) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (state?.kind === "photo") {
        if (e.key === "ArrowRight") onNavigate(1);
        if (e.key === "ArrowLeft") onNavigate(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [state, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#073B70]/95 backdrop-blur-sm px-4 py-10"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>

          {state.kind === "photo" && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(-1);
                }}
                aria-label="Previous photo"
                className="absolute left-3 sm:left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#F5C518] hover:text-[#073B70]"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(1);
                }}
                aria-label="Next photo"
                className="absolute right-3 sm:right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#F5C518] hover:text-[#073B70]"
              >
                <ChevronRight size={20} />
              </button>

              <motion.div
                key={state.index}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[85vh] max-w-[90vw] flex-col items-center"
              >
                <img
                  src={photos[state.index]}
                  alt={captions[state.index] ?? "ACE field photo"}
                  className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
                />
                <p className="mt-4 text-[13.5px] text-white/70">
                  {captions[state.index] ?? "ACE field photo"} · {state.index + 1} / {photos.length}
                </p>
              </motion.div>
            </>
          )}

          {state.kind === "video" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
            >
              <video src={state.src} controls autoPlay className="aspect-video w-full bg-black" />
            </motion.div>
          )}

          {state.kind === "youtube" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
            >
              <iframe
                src={`https://www.youtube.com/embed/${state.id}?autoplay=1`}
                title="ACE video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full bg-black"
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type { LightboxState };
