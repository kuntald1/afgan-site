import { useSeo } from "../hooks/useSeo";
import PageVideoHero from "../components/PageVideoHero";
import Blog from "../components/Blog";

export default function BlogPage() {
  useSeo({
    title: "Blog",
    description:
      "News, insights, and field notes from ACE's work across Afghanistan.",
    path: "/blog",
  });

  return (
    <>
      <PageVideoHero eyebrow="Blog" title="News, insight and field notes." />
      <Blog />
    </>
  );
}
