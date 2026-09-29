import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { assets } from "../../assets";
import { contact } from "../../content";

const NAV_LINKS = [
  { label: "Home", to: "/home-02" },
  { label: "About", to: "/home-02/about" },
  { label: "Services", to: "/home-02/services" },
  { label: "Projects", to: "/home-02/projects" },
  { label: "Gallery", to: "/home-02/gallery" },
  { label: "Blog", to: "/home-02/blog" },
  { label: "Career", to: "/home-02/career" },
  { label: "Contact", to: "/home-02/contact" },
];

// Small inline social icons (same set used in Footer.tsx) — kept local here
// since Footer's versions aren't exported, and duplicating three tiny SVGs
// is simpler and safer than refactoring a shared component mid-build.
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor">
      <path d="M13.5 21v-8.1h2.72l.41-3.16H13.5V7.71c0-.92.25-1.54 1.57-1.54h1.68V3.35C16.47 3.24 15.4 3.15 14.16 3.15c-2.6 0-4.38 1.59-4.38 4.5v2.25H7.05v3.16h2.73V21h3.72z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor">
      <path d="M18.24 3H21l-6.55 7.49L22.2 21h-6.03l-4.72-6.17L6.02 21H3.25l7-8.01L2 3h6.18l4.27 5.64L18.24 3zm-1.06 16.17h1.68L7.9 4.74H6.1l11.08 14.43z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor">
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.4 8.75h3.08V21H3.4V8.75zm5.42 0h2.95v1.68h.04c.41-.78 1.42-1.6 2.92-1.6 3.12 0 3.7 2.05 3.7 4.72V21h-3.08v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9.02V8.75z" />
    </svg>
  );
}

const SOCIALS = [
  { href: contact.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: contact.twitter, label: "Twitter", Icon: XIcon },
  { href: contact.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
];

export default function Navbar2() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-black/6">
      {/* Full-width bar — no inset pill, no side margins, spans edge to edge */}
      <nav className="flex items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 py-4">
        <Link to="/home-02" className="flex items-center flex-shrink-0" aria-label="ACE — home">
          <img
            src={assets.logoColor}
            alt="ACE"
            className="h-[104px] w-[70px] -mt-[16px] -mb-[32px] object-contain object-top relative z-10"
          />
        </Link>

        <div className="hidden xl:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `text-[15.5px] font-medium whitespace-nowrap transition-colors ${
                  isActive ? "text-[#073B70]" : "text-[#073B70]/75 hover:text-[#073B70]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-2.5 text-[#073B70]/80">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-[#073B70] transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
          <Link
            to="/home-02/contact"
            className="group flex items-center gap-2 rounded-full bg-[#F5C518] hover:bg-[#e6b800] pl-4 pr-1.5 py-1.5 text-[13.5px] font-semibold text-[#073B70] transition-colors duration-300"
          >
            <span className="h-[18px] overflow-hidden">
              <span className="flex flex-col transition-transform duration-500" style={{ transitionTimingFunction: "cubic-bezier(0.25,0.1,0.25,1)" }}>
                <span
                  className="h-[18px] leading-[18px] group-hover:-translate-y-1/2"
                  style={{ transitionTimingFunction: "cubic-bezier(0.25,0.1,0.25,1)", transition: "transform 500ms" }}
                >
                  Send Enquiry
                </span>
                <span className="h-[18px] leading-[18px]">Send Enquiry</span>
              </span>
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#073B70] transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={13} className="text-[#F5C518]" />
            </span>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="xl:hidden flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-[#073B70] flex-shrink-0"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      {open && (
        <div className="xl:hidden mx-5 sm:mx-8 mb-3 rounded-2xl border border-black/8 bg-white p-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className="text-[15px] font-medium text-[#073B70]/80"
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/home-02/contact"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#F5C518] px-4 py-2 text-[13.5px] font-semibold text-[#073B70]"
          >
            Send Enquiry
          </Link>
        </div>
      )}
    </header>
  );
}
