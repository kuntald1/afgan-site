export default function ServiceItemCard2({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-7 sm:p-8 ring-1 ring-[#073B70]/[0.06] shadow-[0_10px_28px_rgba(15,61,46,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(15,61,46,0.14)]">
      {/* Ghosted oversized index number, bottom-right — same visual language
          as the homepage Services2 pillar cards, for consistency across
          the site rather than a separate floating badge. */}
      <span
        className="pointer-events-none absolute -right-1 -bottom-4 text-[64px] font-bold leading-none text-[#073B70]/[0.05] transition-colors duration-500 group-hover:text-[#F5C518]/20"
        style={{ fontFamily: "Urbanist, sans-serif" }}
      >
        {String(index).padStart(2, "0")}
      </span>

      <span className="relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C518] text-[13px] font-extrabold text-[#073B70] transition-transform duration-500 group-hover:rotate-6">
        {String(index).padStart(2, "0")}
      </span>

      <h4
        className="relative z-10 text-[#073B70]"
        style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800, fontSize: "19px", lineHeight: 1.3 }}
      >
        {title}
      </h4>
      <p className="relative z-10 mt-3 text-[15.5px] font-semibold leading-relaxed text-[#073B70]/75">{body}</p>
    </div>
  );
}
