export default function ServiceItemCard({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative rounded-xl glass-panel p-5 sm:p-6 transition-colors duration-300 hover:border-black/16">
      <span className="absolute -top-3 left-5 flex h-6 items-center rounded-full bg-[#F26522] px-2.5 text-[11px] font-semibold text-[#16212b]">
        {String(index).padStart(2, "0")}
      </span>
      <h4 className="mt-2 text-[14px] sm:text-[15px] font-semibold text-[#16212b]">
        {title}
      </h4>
      <p className="mt-2.5 text-[13.5px] sm:text-[14px] leading-relaxed text-[#16212b]/70">
        {body}
      </p>
    </div>
  );
}
