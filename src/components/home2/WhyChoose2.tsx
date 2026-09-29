import { Blocks, Compass, Target, Users2 } from "lucide-react";
import { motion } from "framer-motion";
import { assets } from "../../assets";
import { teamStats } from "../../content";
import FallbackImage from "../home/FallbackImage";
import SectionHeading from "./SectionHeading";
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

const EASE = [0.22, 1, 0.36, 1] as const;

function FeatureCard({
  icon: Icon,
  title,
  body,
  align,
}: {
  icon: typeof Compass;
  title: string;
  body: string;
  align: "left" | "right";
}) {
  return (
    <div className="group transition-transform duration-500 ease-out hover:-translate-y-1.5">
      <div className={`flex items-center gap-4 ${align === "left" ? "sm:flex-row-reverse sm:text-right" : ""}`}>
        <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#F5C518] transition-transform duration-700 ease-out group-hover:rotate-[360deg]">
          <Icon size={22} className="text-[#073B70]" />
        </span>
        <h3
          className="text-[19px] leading-snug text-white"
          style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700 }}
        >
          {title}
        </h3>
      </div>
      <p
        className={`mt-3 leading-relaxed text-white/65 transition-colors duration-500 group-hover:text-white/85 ${
          align === "left" ? "sm:text-right" : ""
        }`}
        style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 500, fontSize: "15px" }}
      >
        {body}
      </p>
    </div>
  );
}

export default function WhyChoose2() {
  const eyebrow = useDynamicContent("home2.whychoose.eyebrow", "Why Choose Us");
  const heading = useDynamicContent("home2.whychoose.heading", "Why Institutions Trust ACE");
  const intro = useDynamicContent(
    "home2.whychoose.intro",
    "Government agencies, private-sector firms and NGO partners choose ACE for strategic clarity, disciplined delivery, and a decade of proven results in some of Afghanistan's hardest working environments."
  );
  const image = resolveMediaUrl(useDynamicContent("home2.whychoose.image", assets.home2WhyChoose));

  // Feature 2's title was previously computed from teamStats — now
  // independently editable, seeded with that exact computed string as the
  // fallback. Editing teamStats elsewhere no longer changes this unless
  // re-typed here too.
  const feature1Title = useDynamicContent("home2.whychoose.feature_1_title", "Independent assessment");
  const feature1Body = useDynamicContent(
    "home2.whychoose.feature_1_body",
    "Evidence-based evaluation, not assumptions — every recommendation is grounded in what we find on the ground."
  );
  const feature2Title = useDynamicContent(
    "home2.whychoose.feature_2_title",
    `${teamStats[0].value} local consultants`
  );
  const feature2Body = useDynamicContent(
    "home2.whychoose.feature_2_body",
    "A majority-Afghan team means context and relationships you can't outsource."
  );
  const feature3Title = useDynamicContent("home2.whychoose.feature_3_title", "Since 2012");
  const feature3Body = useDynamicContent(
    "home2.whychoose.feature_3_body",
    "Over a decade of continuous, on-the-ground delivery across five provinces."
  );
  const feature4Title = useDynamicContent(
    "home2.whychoose.feature_4_title",
    "Four connected pillars"
  );
  const feature4Body = useDynamicContent(
    "home2.whychoose.feature_4_body",
    "Assess, Transform, Empower, Comply — one team covering the full arc of institutional reform."
  );

  const features = [
    { icon: Compass, title: feature1Title, body: feature1Body, side: "left" as const },
    { icon: Users2, title: feature2Title, body: feature2Body, side: "right" as const },
    { icon: Target, title: feature3Title, body: feature3Body, side: "left" as const },
    { icon: Blocks, title: feature4Title, body: feature4Body, side: "right" as const },
  ];
  const left = features.filter((f) => f.side === "left");
  const right = features.filter((f) => f.side === "right");

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#073B70] overflow-hidden">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow={eyebrow} title={heading} body={intro} dark />

        {/* Three real columns: features spread wide to the left and right of
            the arched photo, instead of floating cards crammed over it. */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-14 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            className="flex flex-col gap-14 order-2 lg:order-1"
          >
            {left.map((f) => (
              <motion.div
                key={f.title}
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
                }}
              >
                <FeatureCard {...f} align="left" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative order-1 lg:order-2 mx-auto w-full max-w-[400px]"
          >
            {/* Clean rounded card with a yellow plate offset behind it —
                no arch/capsule shape. */}
            <div
              aria-hidden
              className="absolute -inset-4 translate-x-3 translate-y-3 rounded-2xl bg-[#F5C518]"
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
              <FallbackImage
                src={image}
                alt="ACE consultant presenting"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
            className="flex flex-col gap-14 order-3"
          >
            {right.map((f) => (
              <motion.div
                key={f.title}
                variants={{
                  hidden: { opacity: 0, x: 40 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
                }}
              >
                <FeatureCard {...f} align="right" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
