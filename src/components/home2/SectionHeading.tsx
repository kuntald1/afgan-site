import { motion } from "framer-motion";
import { EASE, headingStyle, bodyStyle } from "./tokens";

export default function SectionHeading({
  eyebrow,
  title,
  body,
  dark = false,
  center = false,
  right,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  dark?: boolean;
  center?: boolean;
  right?: React.ReactNode;
}) {
  const titleColor = dark ? "text-white" : "text-[#073B70]";
  const bodyColor = dark ? "text-white/65" : "text-[#073B70]/60";

  if (center) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.75, ease: EASE }}
        className="mb-12 text-center"
      >
        <span className="inline-block mb-5 rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
          {eyebrow}
        </span>
        <h2 className={`leading-[1.08] tracking-[-0.025em] ${titleColor}`} style={headingStyle}>
          {title}
        </h2>
        {body && (
          <p className={`mt-4 mx-auto max-w-2xl leading-relaxed ${bodyColor}`} style={bodyStyle}>
            {body}
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-100px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 mb-14 items-start"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -32 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
        }}
      >
        <span className="inline-block mb-5 rounded-md bg-[#F5C518] px-4 py-2 text-[13px] font-semibold text-[#073B70]">
          {eyebrow}
        </span>
        <h2 className={`leading-[1.08] tracking-[-0.025em] ${titleColor}`} style={headingStyle}>
          {title}
        </h2>
      </motion.div>
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -32 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } },
        }}
        className={`flex items-center lg:pt-3 ${right ? "lg:justify-end" : ""}`}
      >
        {right ?? (body && <p className={`leading-relaxed ${bodyColor}`} style={bodyStyle}>{body}</p>)}
      </motion.div>
    </motion.div>
  );
}
