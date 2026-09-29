import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function AccordionItem({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:border-gray-300"
      >
        {open ? <Minus size={13} /> : <Plus size={13} />}
      </button>
      <div className="flex-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-left text-[13px] font-semibold tracking-wide text-gray-900"
        >
          {title.toUpperCase()}
        </button>
        <div
          className="grid overflow-hidden transition-all duration-300 ease-in-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-gray-600">
              {body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
