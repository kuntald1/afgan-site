import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

/**
 * CustomSelect2 — a styled dropdown replacing native <select>, since the
 * browser's default listbox (system font, blue highlight) can't be themed
 * and looked out of place next to the rest of Home-02.
 */
export default function CustomSelect2({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[13.5px] transition-colors duration-300 ${
          open
            ? "border-[#F5C518] bg-[#F5C518] shadow-[0_8px_20px_rgba(15,61,46,0.18)]"
            : "border-[#073B70] bg-[#073B70] hover:bg-[#073B70]/90"
        }`}
        style={{ fontFamily: "Urbanist, sans-serif" }}
      >
        <span className={`font-medium ${open ? "text-[#073B70]/60" : "text-white/55"}`}>{label}</span>
        <span className={`font-bold ${open ? "text-[#073B70]" : "text-[#F5C518]"}`}>{value}</span>
        <ChevronDown
          size={15}
          className={`transition-transform duration-300 ${open ? "rotate-180 text-[#073B70]/60" : "text-white/60"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-[calc(100%+8px)] z-30 min-w-[200px] overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_20px_50px_rgba(15,61,46,0.18)] ring-1 ring-[#073B70]/[0.06]"
          >
            {options.map((o) => {
              const active = o === value;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-left text-[13.5px] transition-colors duration-150 ${
                    active ? "bg-[#073B70] text-white" : "text-[#073B70]/75 hover:bg-[#F5C518]/15"
                  }`}
                  style={{ fontFamily: "Urbanist, sans-serif", fontWeight: active ? 700 : 500 }}
                >
                  {o}
                  {active && <Check size={15} className="text-[#F5C518]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
