import { useSeo } from "../hooks/useSeo";
import PageVideoHero from "../components/PageVideoHero";
import Gallery from "../components/Gallery";

export default function GalleryPage() {
  useSeo({
    title: "Media Gallery",
    description:
      "Photo and video media gallery — a look at ACE's work across Afghanistan.",
    path: "/gallery",
  });

  return (
    <>
      <PageVideoHero eyebrow="Media Gallery" title="Photo & Video Media Gallery" />
      <Gallery />
    </>
  );
}
