export default function PageHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="bg-white pt-8 sm:pt-12 pb-10 sm:pb-14">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <span className="rounded-full border border-gray-200 px-3 sm:px-4 py-1 sm:py-1.5 text-[12px] sm:text-[13px] font-medium text-gray-600">
          {eyebrow}
        </span>
        <h1
          className="mt-5 font-medium leading-[1.05] tracking-[-0.03em] text-gray-900"
          style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
