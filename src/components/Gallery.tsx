import { galleryPhotos } from "../galleryPhotos";
import { galleryVideos } from "../galleryVideos";
import { galleryPhotoCaptions } from "../content";
import { RevealGroup, RevealItem, Reveal } from "./motion/Reveal";
import { ScrollZoom } from "./motion/ScrollEffects";

export default function Gallery() {
  return (
    <section id="gallery" className="pt-6 sm:pt-8 pb-10 sm:pb-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        {/* Videos — any number, from src/media/gallery-videos/ */}
        {galleryVideos.length > 0 && (
          <div className="mb-14 sm:mb-20">
            <Reveal>
              <h3 className="text-[13px] font-semibold tracking-widest uppercase text-[#16212b]/55 mb-4">
                Video
              </h3>
            </Reveal>

            <RevealGroup
              className={`grid gap-5 ${
                galleryVideos.length === 1 ? "grid-cols-1" : "sm:grid-cols-2"
              }`}
            >
              {galleryVideos.map((src, i) => (
                <RevealItem key={src}>
                  <div className="overflow-hidden rounded-2xl bg-black shadow-[0_20px_60px_rgba(22,33,43,0.12)]">
                    <video src={src} controls muted className="aspect-video w-full" />
                  </div>
                  <p className="mt-2 text-[12px] text-[#16212b]/50">
                    Video {i + 1} of {galleryVideos.length}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )}

        {/* Photos — any number, from src/media/gallery-photos/ */}
        <Reveal>
          <h3 className="text-[13px] font-semibold tracking-widest uppercase text-[#16212b]/55 mb-4">
            Photos
          </h3>
        </Reveal>

        <RevealGroup className="columns-2 sm:columns-3 gap-4 sm:gap-5 [column-fill:_balance]">
          {galleryPhotos.map((src, i) => (
            <RevealItem key={src} className="mb-4 sm:mb-5 break-inside-avoid">
              <div className="group relative overflow-hidden rounded-xl">
                <ScrollZoom className="w-full aspect-square">
                  <img
                    src={src}
                    alt={galleryPhotoCaptions[i] ?? "ACE field photo"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </ScrollZoom>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="pointer-events-none absolute bottom-3 left-3 right-3 text-[12px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {galleryPhotoCaptions[i] ?? "ACE field photo"}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-8 text-[13px] text-[#16212b]/50">
          Photos and video shown here are placeholders — see the README for
          where to drop in ACE's real media.
        </p>
      </div>
    </section>
  );
}
