import { motion } from "framer-motion";
import { Landmark, Layers, ShieldCheck } from "lucide-react";
import { EASE } from "./tokens";
import { useDynamicContent } from "../../hooks/useDynamicContent";

/**
 * AboutPillars2 — the three-card row above the "Smart Consulting for..."
 * block in the reference. Content is real (drawn from content.ts's
 * overview/serviceDetails/offices), not the Rovix demo's identical
 * repeated filler text.
 */
export default function AboutPillars2() {
  const title1 = useDynamicContent("about.pillar_1_title", "Afghan-Owned, Field-Tested");
  const body1 = useDynamicContent(
    "about.pillar_1_body",
    "Headquartered in Kabul since 2012, with regional offices in Jalalabad, Mazar, Herat and Kandahar."
  );
  const title2 = useDynamicContent("about.pillar_2_title", "Four Connected Pillars");
  const body2 = useDynamicContent(
    "about.pillar_2_body",
    "Assess, Transform, Empower, Comply — one methodology covering the full arc of institutional reform."
  );
  const title3 = useDynamicContent("about.pillar_3_title", "Trusted by Government & NGOs");
  const body3 = useDynamicContent(
    "about.pillar_3_body",
    "Working alongside government agencies, the private sector, and UN agencies since our founding."
  );

  const PILLARS = [
    { icon: Landmark, title: title1, body: body1 },
    { icon: Layers, title: title2, body: body2 },
    { icon: ShieldCheck, title: title3, body: body3 },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-60px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-6"
    >
      {PILLARS.map((p, i) => (
        <motion.div
          key={p.title}
          variants={{
            hidden: { opacity: 0, y: 28 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
          }}
          className="group rounded-2xl bg-white p-6 sm:p-7 ring-1 ring-[#073B70]/[0.06] shadow-[0_10px_28px_rgba(15,61,46,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,61,46,0.13)]"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5C518] transition-transform duration-700 ease-out group-hover:rotate-[360deg]">
              <p.icon size={20} className="text-[#073B70]" />
            </span>
            <span
              className="text-[26px] font-bold leading-none text-[#073B70]/10"
              style={{ fontFamily: "Urbanist, sans-serif" }}
            >
              {String(i + 1).padStart(2, "0")}.
            </span>
          </div>

          <h3
            className="mt-5 text-[#073B70]"
            style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700, fontSize: "17px" }}
          >
            {p.title}
          </h3>
          <p className="mt-2.5 text-[14px] leading-relaxed text-[#073B70]/60">{p.body}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
