import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { EASE } from "./tokens";
import { assets } from "../../assets";
import FallbackImage from "../home/FallbackImage";
import SectionHeading from "./SectionHeading"; // reuses the shared heading used by every Home-02 section
import { useDynamicContent, resolveMediaUrl } from "../../hooks/useDynamicContent";

/**
 * ContactForm2
 * Map deliberately removed (was showing "API key required" placeholder tiles).
 * Layout: photo on the left, form pushed to the right column, 3 info cards
 * below spanning both.
 *
 * REQUIRED in src/assets.ts, next to the other home2 image entries:
 *   contactFormImage: "/assets/images/home2/contact-form.jpg",
 * Then drop a photo at: public/assets/images/home2/contact-form.jpg
 * (portrait or square works best against the tall form column).
 *
 * Wire up onSubmit to your real contact endpoint when ready — currently a stub.
 */
export default function ContactForm2() {
  const eyebrow = useDynamicContent("contact.form_eyebrow", "Contact Us");
  const heading = useDynamicContent("contact.form_heading", "Let's Discuss How We Can Help You Succeed");
  const formImage = resolveMediaUrl(useDynamicContent("contact.form_image", assets.contactFormImage));
  const phoneLabel = useDynamicContent("contact.info_phone_label", "Have a Question?");
  const phoneValue = useDynamicContent("contact.info_phone_value", "+880 (123) 456 789");
  const emailLabel = useDynamicContent("contact.info_email_label", "Write Email");
  const emailValue = useDynamicContent("contact.info_email_value", "support@ace.org.af");
  const locationLabel = useDynamicContent("contact.info_location_label", "Our Location");
  const locationValue = useDynamicContent("contact.info_location_value", "Kabul, Afghanistan");

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const set = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-20 px-6 bg-white">
      <SectionHeading
        eyebrow={eyebrow}
        title={heading}
        center
      />

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 items-stretch">
        {/* Photo — new, left column */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative hidden lg:block overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(15,61,46,0.14)]"
        >
          <FallbackImage
            src={formImage}
            alt="Get in touch with ACE"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Form — pushed to the right column */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="bg-[#F7F7F5] rounded-2xl p-8 md:p-10"
        >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#073B70]">
              Your Name*
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Name..."
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#F5C518] transition-colors"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-[#073B70]">
              Your Email*
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="Email..."
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#F5C518] transition-colors"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-[#073B70]">
              Phone No
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="Phone..."
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#F5C518] transition-colors"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-[#073B70]">
              Choose an Option
            </label>
            <select
              value={form.subject}
              onChange={(e) => set("subject", e.target.value)}
              className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#F5C518] transition-colors"
            >
              <option value="">Select Option..</option>
              <option value="general">General Inquiry</option>
              <option value="consulting">Business Consulting</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium text-[#073B70]">
            Write Message
          </label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Message..."
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#F5C518] transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#F5C518] text-[#073B70] font-semibold px-6 py-3 hover:brightness-95 transition disabled:opacity-50"
        >
          {status === "submitting" ? "Sending..." : "Submit Now"}
          <span className="w-6 h-6 rounded-md bg-[#073B70] text-white flex items-center justify-center">
            <ArrowUpRight size={14} />
          </span>
        </button>

        {status === "success" && (
          <p className="mt-3 text-[13.5px] font-semibold text-green-700">
            Thanks — your message has been sent. We'll get back to you soon.
          </p>
        )}
        {status === "error" && (
          <p className="mt-3 text-[13.5px] font-semibold text-red-600">
            Something went wrong sending your message. Please try again.
          </p>
        )}
      </motion.form>
      </div>

      {/* Info cards — replaces the old map row, spans both columns */}
      <div className="max-w-3xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoCard
          icon={<Phone size={18} />}
          label={phoneLabel}
          value={phoneValue}
        />
        <InfoCard
          icon={<Mail size={18} />}
          label={emailLabel}
          value={emailValue}
        />
        <InfoCard
          icon={<MapPin size={18} />}
          label={locationLabel}
          value={locationValue}
        />
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-[#F7F7F5] p-5">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#073B70] shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-black/50">{label}</p>
        <p className="font-semibold text-[#073B70]">{value}</p>
      </div>
    </div>
  );
}
