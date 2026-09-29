import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import SectionHeading from "./SectionHeading";
import { useDynamicContent } from "../../hooks/useDynamicContent";

/**
 * ACE has no published individual staff names or headshots, so these are
 * placeholder entries — replace `name` and `role` with real people and
 * drop matching photos into public/assets/images/home2/team/ (the paths
 * are listed in src/assets.ts under `home2Team`).
 */
const team = [
  { name: "Add name", role: "Consultant", image: assets.home2Team[0] },
  { name: "Add name", role: "Programme lead", image: assets.home2Team[1] },
  { name: "Add name", role: "M&E specialist", image: assets.home2Team[2] },
  { name: "Add name", role: "Training lead", image: assets.home2Team[3] },
  { name: "Add name", role: "Compliance advisor", image: assets.home2Team[4] },
  { name: "Add name", role: "Field coordinator", image: assets.home2Team[5] },
];

export default function Team2() {
  const eyebrow = useDynamicContent("home2.team.eyebrow", "Meet the Team");
  const heading = useDynamicContent("home2.team.heading", "The People Behind Our Work");

  // Duplicated so .marquee-track's -50% translate loops seamlessly.
  const track = [...team, ...team];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F7F7F5] overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow={eyebrow} title={heading} center />
      </div>

      {/* Full-bleed marquee, scrolling right to left; pauses on hover */}
      <div className="relative overflow-hidden">
        <div className="marquee-track flex w-max gap-7">
          {track.map((m, i) => (
            <div key={i} className="group w-[260px] flex-shrink-0">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
                <FallbackImage
                  src={m.image}
                  alt={m.name}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#073B70]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {/* Designation sits on the photo, just above the name */}
                <span className="absolute bottom-4 left-4 rounded-md bg-[#F5C518] px-3 py-1.5 text-[12px] font-semibold text-[#073B70]">
                  {m.role}
                </span>
              </div>
              <p
                className="mt-4 text-[#073B70]"
                style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "19px" }}
              >
                {m.name}
              </p>
            </div>
          ))}
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F7F7F5] to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F7F7F5] to-transparent" />
      </div>
    </section>
  );
}
