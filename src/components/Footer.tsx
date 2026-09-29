import { contact, demographics, offices } from "../content";
import { assets } from "../assets";

// lucide-react no longer ships brand/social icons, so these four are
// simple inline SVGs (24x24 viewBox, single path each).
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
      <path d="M13.5 21v-8.1h2.72l.41-3.16H13.5V7.71c0-.92.25-1.54 1.57-1.54h1.68V3.35C16.47 3.24 15.4 3.15 14.16 3.15c-2.6 0-4.38 1.59-4.38 4.5v2.25H7.05v3.16h2.73V21h3.72z" />
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

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
      <path d="M18.24 3H21l-6.55 7.49L22.2 21h-6.03l-4.72-6.17L6.02 21H3.25l7-8.01L2 3h6.18l4.27 5.64L18.24 3zm-1.06 16.17h1.68L7.9 4.74H6.1l11.08 14.43z" />
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

const SOCIAL_ICONS = [
  { href: contact.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: contact.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: contact.twitter, label: "Twitter", Icon: XIcon },
  { href: contact.youtube, label: "YouTube", Icon: YouTubeIcon },
];

export default function Footer() {
  return (
    <footer className="mt-6 sm:mt-10 bg-[#16212b] pt-12 sm:pt-14 pb-10 sm:pb-12">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <img src={assets.logoWhite} alt="ACE" className="h-8 w-auto object-contain mb-10 sm:mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div>
            <p className="text-[12px] tracking-widest text-white/45 mb-3">CONTACT</p>
            <a href={`mailto:${contact.email}`} className="block text-[14px] text-white/85 hover:text-white">
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="mt-1 block text-[14px] text-white/85 hover:text-white"
            >
              {contact.phone}
            </a>
          </div>

          <div>
            <p className="text-[12px] tracking-widest text-white/45 mb-3">OFFICES</p>
            <p className="text-[14px] leading-relaxed text-white/85">
              {offices.join(" · ")}
            </p>
          </div>

          <div>
            <p className="text-[12px] tracking-widest text-white/45 mb-3">WHO WE SERVE</p>
            <p className="text-[14px] leading-relaxed text-white/85">
              {demographics.join(" · ")}
            </p>
          </div>

          <div>
            <p className="text-[12px] tracking-widest text-white/45 mb-3">ELSEWHERE</p>
            <div className="flex items-center gap-3">
              {SOCIAL_ICONS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-[#F26522] hover:text-[#F26522]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/15 text-[12px] text-white/45">
          © Afghanistan Center for Excellence — {offices.join(" · ")}
        </div>
      </div>
    </footer>
  );
}
