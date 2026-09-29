import { motion } from "framer-motion";
import { assets } from "../../assets";
import { stats, projectsList, teamStats, offices } from "../../content";
import Counter from "../motion/Counter";
import FallbackImage from "../home/FallbackImage";

const EASE = [0.22, 1, 0.36, 1] as const;

// All figures below come from ACE's own published numbers (src/content.ts)
// — no invented metrics.
const metrics = [
  { value: stats[0].value, label: stats[0].label },
  { value: stats[1].value, label: stats[1].label },
  { value: stats[2].value, label: stats[2].label },
  { value: teamStats[0].value, label: "core team members" },
  { value: teamStats[1].value, label: "project specialists" },
  { value: `${offices.length}`, label: "provinces with an ACE office" },
];

export default function Impact2() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F7F7F5]">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.75, ease: EASE }}
          className="mb-12 leading-[1.08] tracking-[-0.025em] text-[#073B70]"
          style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem, 4.2vw, 3rem)" }}
        >
          Our Impact
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
          {/* Feature card — photo above a single headline figure */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_rgba(15,61,46,0.08)]"
          >
            <div className="h-56 w-full overflow-hidden">
              <FallbackImage
                src={assets.home2AboutSmall}
                alt="ACE field work"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-7">
              <p
                className="text-[46px] leading-none text-[#073B70]"
                style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700 }}
              >
                <Counter value={`${projectsList.length}+`} startValue={1} />
              </p>
              <p
                className="mt-2 text-[#073B70]/70"
                style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 500, fontSize: "18px" }}
              >
                projects delivered for partners
              </p>
            </div>
          </motion.div>

          {/* Metric grid — each figure over a rule, staggered in */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8"
          >
            {metrics.map((m) => (
              <motion.div
                key={m.label}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
                }}
                className="border-b border-[#073B70]/15 pb-4"
              >
                <p
                  className="text-[34px] leading-none text-[#073B70]"
                  style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700 }}
                >
                  <Counter value={m.value} />
                </p>
                <p
                  className="mt-2 text-[#073B70]/65"
                  style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 500, fontSize: "16px" }}
                >
                  {m.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
