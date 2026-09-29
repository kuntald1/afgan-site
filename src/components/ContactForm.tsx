import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Reveal } from "./motion/Reveal";

/**
 * IMPORTANT — read before deploying:
 *
 * This site has no backend, so the form can't send email itself. It posts
 * to Formspree (https://formspree.io), a free hosted form-to-email service
 * that needs no server code — Formspree receives the POST and emails it to
 * whatever address you connect.
 *
 * To make this actually deliver email:
 *   1. Create a free account at https://formspree.io
 *   2. Create a new form, connect it to the inbox you want notifications
 *      sent to (e.g. info@ace.af)
 *   3. Formspree gives you a form ID like "xyzabcde" — replace the
 *      placeholder below with the real one.
 *
 * Until that's done, submitting this form will fail — the placeholder ID
 * doesn't point at a real form.
 */
const FORMSPREE_FORM_ID = "REPLACE_WITH_YOUR_FORMSPREE_FORM_ID";
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Reveal className="glass-panel flex flex-col items-center gap-3 rounded-2xl px-6 py-14 text-center">
        <CheckCircle2 size={32} className="text-[#F26522]" />
        <p className="text-[16px] font-semibold text-[#16212b]">Message sent</p>
        <p className="max-w-xs text-[14px] text-[#16212b]/65">
          Thanks for reaching out — someone from ACE will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-[13px] font-medium text-[#F26522] underline underline-offset-4"
        >
          Send another message
        </button>
      </Reveal>
    );
  }

  return (
    <Reveal>
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl px-6 sm:px-8 py-8 sm:py-10">
        <h3 className="text-[13px] font-semibold tracking-widest uppercase text-[#16212b]/55 mb-6">
          Send a message
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-[12px] font-medium text-[#16212b]/70">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-black/12 bg-white/70 px-3.5 py-2.5 text-[14px] text-[#16212b] outline-none transition-colors focus:border-[#F26522]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[12px] font-medium text-[#16212b]/70">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-black/12 bg-white/70 px-3.5 py-2.5 text-[14px] text-[#16212b] outline-none transition-colors focus:border-[#F26522]"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="mb-4 sm:mb-5">
          <label htmlFor="subject" className="mb-1.5 block text-[12px] font-medium text-[#16212b]/70">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            className="w-full rounded-lg border border-black/12 bg-white/70 px-3.5 py-2.5 text-[14px] text-[#16212b] outline-none transition-colors focus:border-[#F26522]"
            placeholder="What's this about?"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="mb-1.5 block text-[12px] font-medium text-[#16212b]/70">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full resize-none rounded-lg border border-black/12 bg-white/70 px-3.5 py-2.5 text-[14px] text-[#16212b] outline-none transition-colors focus:border-[#F26522]"
            placeholder="Tell us a bit about what you need."
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center gap-2.5 rounded-full bg-[#F26522] px-6 py-2.5 text-[13px] sm:text-[14px] font-medium text-white transition-colors duration-300 hover:bg-[#e05a1a] disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              Sending <Loader2 size={14} className="animate-spin" />
            </>
          ) : (
            <>
              Send message
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>

        {status === "error" && (
          <p className="mt-4 flex items-center gap-2 text-[13px] text-red-600">
            <AlertCircle size={14} />
            Something went wrong — the form isn't connected to a real
            Formspree endpoint yet. See the comment at the top of
            ContactForm.tsx.
          </p>
        )}
      </form>
    </Reveal>
  );
}
