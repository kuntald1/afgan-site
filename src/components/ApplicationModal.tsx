import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, CheckCircle2, AlertCircle, Upload } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ApplicationModal({
  jobId,
  jobTitle,
  onClose,
}: {
  jobId: number;
  jobTitle: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [resumeName, setResumeName] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Resume is mandatory — checked here too, not just via the `required`
    // attribute, since some browsers handle file-input validation loosely.
    const resumeFile = data.get("resume");
    if (!(resumeFile instanceof File) || resumeFile.size === 0) {
      setErrorMessage("Please attach your resume — it's required to apply.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/careers/${jobId}/apply`, {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const body = await res.json().catch(() => ({}));
        // FastAPI's validation errors (422) return `detail` as an ARRAY of
        // {type, loc, msg, input} objects, not a string — rendering that
        // array directly crashed the page (React can't render plain
        // objects as children). This normalizes any shape of `detail`
        // (string, array of error objects, or missing) into one readable
        // string.
        let message = "Something went wrong submitting your application.";
        if (typeof body.detail === "string") {
          message = body.detail;
        } else if (Array.isArray(body.detail)) {
          message = body.detail
            .map((err: { msg?: string; loc?: unknown[] }) => {
              const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : "";
              return field ? `${field}: ${err.msg}` : err.msg;
            })
            .filter(Boolean)
            .join("; ") || message;
        }
        setErrorMessage(message);
        setStatus("error");
      }
    } catch {
      setErrorMessage("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  return createPortal(
    // Rendered via a portal directly into document.body, deliberately
    // bypassing React's normal component tree position. Reason: Layout.tsx
    // wraps every page in a framer-motion <motion.div> for the page-
    // transition animation, and Motion applies an inline CSS `transform`
    // to that wrapper (even after the animation finishes, the transform
    // stays present, just at its resting value). A `transform` on ANY
    // ancestor makes that ancestor the containing block for descendant
    // `position: fixed` elements — so without the portal, this modal was
    // positioning itself relative to the page wrapper instead of the
    // actual browser viewport, which is why it appeared to scroll with
    // the page and show its header cut off instead of staying centered.
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-3 sm:p-4 py-6">
      <div className="relative w-full max-w-2xl lg:max-w-4xl rounded-2xl bg-white p-5 sm:p-7 shadow-2xl my-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#16212b]/50 hover:bg-black/5 hover:text-[#16212b]"
        >
          <X size={18} />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <CheckCircle2 size={36} className="text-[#F26522]" />
            <p className="text-[17px] font-semibold text-[#16212b]">Application received</p>
            <p className="max-w-sm text-[14px] text-[#16212b]/65">
              Thanks for applying to <strong>{jobTitle}</strong>. ACE will review your
              application and get in touch if there's a fit.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 rounded-full bg-[#16212b] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#243542]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#16212b] mb-1">
              Apply for this job
            </h2>
            <p className="mb-6 text-[13px] text-[#16212b]/55">{jobTitle}</p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Field label="First name" name="first_name" required />
              <Field label="Middle name" name="middle_name" />
              <Field label="Last name" name="last_name" required />
              <Field label="Mobile phone" name="mobile_phone" required type="tel" />
              <Field label="Email" name="email" required type="email" className="sm:col-span-2 lg:col-span-1" />

              <SelectField
                label="Gender"
                name="gender"
                options={["Male", "Female", "Other", "Prefer not to say"]}
              />
              <Field label="Date of birth" name="date_of_birth" type="date" />

              <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
                <Field label="Experience (years)" name="experience_years" type="number" min={0} />
                <Field label="Experience (months)" name="experience_months" type="number" min={0} max={11} />
              </div>

              <Field label="Current salary" name="current_salary" placeholder="e.g. AFN 40,000/mo" />
              <Field label="Expected salary" name="expected_salary" placeholder="e.g. AFN 50,000/mo" />
              <Field label="Available to join (days)" name="available_to_join_days" type="number" min={0} />
              <Field label="Current organization" name="current_organization" />

              <Field label="Current location" name="current_location" />
              <Field label="Preferred location" name="preferred_location" />

              <SelectField
                label="Legally eligible to work here?"
                name="legally_eligible"
                options={["Yes", "No"]}
              />
              <Field label="Know someone at ACE?" name="know_someone_at_ace" placeholder="Name (optional)" />

              <Field
                label="Skills"
                name="skills"
                placeholder="Comma-separated, e.g. Data collection, Dari, English"
                className="sm:col-span-2 lg:col-span-4"
              />

              {/* Resume — mandatory */}
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="mb-1.5 block text-[12px] font-medium text-[#16212b]/70">
                  Resume <span className="text-[#F26522]">*</span>{" "}
                  <span className="font-normal text-[#16212b]/45">
                    (.doc, .docx, .pdf, .rtf, .odt — max 10MB)
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-black/20 px-3.5 py-3 text-[13px] text-[#16212b]/70 hover:border-[#F26522]">
                  <Upload size={15} />
                  {resumeName || "Choose file"}
                  <input
                    type="file"
                    name="resume"
                    required
                    accept=".doc,.docx,.pdf,.rtf,.odt"
                    className="hidden"
                    onChange={(e) => setResumeName(e.target.files?.[0]?.name || "")}
                  />
                </label>
              </div>

              <label className="sm:col-span-2 lg:col-span-4 flex items-start gap-2 text-[12px] text-[#16212b]/60">
                <input type="checkbox" required className="mt-0.5" />
                By applying, you agree that ACE may store and process this information to
                evaluate your application.
              </label>

              {status === "error" && (
                <p className="sm:col-span-2 lg:col-span-4 flex items-center gap-2 text-[13px] text-red-600">
                  <AlertCircle size={14} /> {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="sm:col-span-2 lg:col-span-4 mt-2 flex items-center justify-center gap-2 rounded-full bg-[#F26522] px-6 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#e05a1a] disabled:opacity-60"
              >
                {status === "submitting" ? (
                  <>
                    Submitting <Loader2 size={14} className="animate-spin" />
                  </>
                ) : (
                  "Submit application"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  placeholder,
  min,
  max,
  className = "",
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[12px] font-medium text-[#16212b]/70">
        {label} {required && <span className="text-[#F26522]">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full rounded-lg border border-black/12 bg-white px-3.5 py-2.5 text-[14px] text-[#16212b] outline-none transition-colors focus:border-[#F26522]"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-[#16212b]/70">{label}</label>
      <select
        name={name}
        className="w-full rounded-lg border border-black/12 bg-white px-3.5 py-2.5 text-[14px] text-[#16212b] outline-none transition-colors focus:border-[#F26522]"
      >
        <option value="">Select an option</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
