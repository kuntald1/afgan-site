import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import { assets } from "../../assets";
import { contact, offices, serviceDetails } from "../../content";
import FallbackImage from "../home/FallbackImage";

// lucide-react no longer ships brand icons, so these are small inline SVGs.
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
      <path d="M13.5 21v-8.1h2.72l.41-3.16H13.5V7.71c0-.92.25-1.54 1.57-1.54h1.68V3.35C16.47 3.24 15.4 3.15 14.16 3.15c-2.6 0-4.38 1.59-4.38 4.5v2.25H7.05v3.16h2.73V21h3.72z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
      <path d="M18.24 3H21l-6.55 7.49L22.2 21h-6.03l-4.72-6.17L6.02 21H3.25l7-8.01L2 3h6.18l4.27 5.64L18.24 3zm-1.06 16.17h1.68L7.9 4.74H6.1l11.08 14.43z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.4 8.75h3.08V21H3.4V8.75zm5.42 0h2.95v1.68h.04c.41-.78 1.42-1.6 2.92-1.6 3.12 0 3.7 2.05 3.7 4.72V21h-3.08v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9.02V8.75z" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
      <path d="M22 12s0-3.2-.41-4.74a2.78 2.78 0 0 0-1.95-1.96C18.1 5 12 5 12 5s-6.1 0-7.64.3a2.78 2.78 0 0 0-1.95 1.96C2 8.8 2 12 2 12s0 3.2.41 4.74a2.78 2.78 0 0 0 1.95 1.96C5.9 19 12 19 12 19s6.1 0 7.64-.3a2.78 2.78 0 0 0 1.95-1.96C22 15.2 22 12 22 12zm-12 3V9l5 3-5 3z" />
    </svg>
  );
}

const SOCIALS = [
  { href: contact.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: contact.twitter, label: "Twitter", Icon: XIcon },
  { href: contact.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: contact.youtube, label: "YouTube", Icon: YouTubeIcon },
];

const RESOURCES = [
  { label: "About Us", to: "/home-02/about" },
  { label: "Projects", to: "/home-02/projects" },
  { label: "Gallery", to: "/home-02/gallery" },
  { label: "Blog Post", to: "/home-02/blog" },
  { label: "Career", to: "/home-02/career" },
  { label: "Contact Us", to: "/home-02/contact" },
];

const headingFont = { fontFamily: "Urbanist, sans-serif", fontWeight: 700 } as const;

export default function Footer2() {
  const galleryShots = assets.home2FooterGallery;

  return (
    <footer className="relative overflow-hidden bg-[#073B70]">
      {/* Soft diagonal wash, echoing the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(245,197,24,0.05)_60%,rgba(245,197,24,0.12)_100%)]"
      />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16">
          {/* Left — identity, newsletter, socials */}
          <div>
            <Link to="/home-02" className="flex items-center gap-3">
              <img
                src={assets.logoColor}
                alt="ACE"
                className="h-[95px] w-16 flex-shrink-0 object-contain object-top"
              />
              <span className="text-[26px] text-white" style={headingFont}>
                ACE
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-white/60">
              Afghanistan Center for Excellence — an Afghan-owned professional
              services company turning local challenges into lasting local
              solutions since 2012.
            </p>

            {/* Contact line (mailto) rather than a newsletter box, since
                there's no mailing-list backend wired up on this site. */}
            <a
              href={`mailto:${contact.email}`}
              className="group mt-7 flex max-w-sm items-center justify-between gap-4 border-b border-white/25 pb-3 text-white/80 transition-colors hover:border-[#F5C518]"
            >
              <span className="text-[14.5px]">{contact.email}</span>
              <Send size={18} className="text-[#F5C518] transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <div className="mt-7 flex items-center gap-3">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-[#F5C518] hover:bg-[#F5C518] hover:text-[#073B70]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Right — panelled link columns + gallery */}
          <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-8 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <p className="mb-4 text-[17px] text-white" style={headingFont}>
                  Our Services
                </p>
                <ul className="space-y-2.5">
                  {serviceDetails.map((s) => (
                    <li key={s.key}>
                      <Link
                        to="/home-02/services"
                        className="flex items-center gap-2 text-[14px] text-white/65 transition-colors hover:text-[#F5C518]"
                      >
                        <span className="text-[#F5C518]">&raquo;</span>
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-4 text-[17px] text-white" style={headingFont}>
                  Resources
                </p>
                <ul className="space-y-2.5">
                  {RESOURCES.map((r) => (
                    <li key={r.label}>
                      <Link
                        to={r.to}
                        className="flex items-center gap-2 text-[14px] text-white/65 transition-colors hover:text-[#F5C518]"
                      >
                        <span className="text-[#F5C518]">&raquo;</span>
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-4 text-[17px] text-white" style={headingFont}>
                  Our Offices
                </p>
                <p className="text-[12px] text-white/45">Head office</p>
                <p className="text-[14.5px] text-white/85">Kabul, Afghanistan</p>
                <p className="mt-4 text-[12px] text-white/45">Regional offices</p>
                <p className="text-[14.5px] leading-relaxed text-white/85">
                  {offices.slice(1).join(" · ")}
                </p>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="mt-4 inline-block text-[14.5px] text-white/85 transition-colors hover:text-[#F5C518]"
                >
                  {contact.phone}
                </a>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5">
              <p className="text-[17px] text-white whitespace-nowrap" style={headingFont}>
                Our Gallery
              </p>
              <div className="flex gap-3">
                {galleryShots.map((src, i) => (
                  <Link
                    key={i}
                    to="/home-02/gallery"
                    className="h-16 w-20 overflow-hidden rounded-lg transition-transform duration-500 hover:scale-105"
                  >
                    <FallbackImage
                      src={src}
                      alt="ACE gallery"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/12 py-4 text-center text-[13px] text-white/55">
        © {new Date().getFullYear()} Afghanistan Center for Excellence. All Rights Reserved.
      </div>
    </footer>
  );
}
