import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Clock, Menu, X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { assets } from "../assets";
import { offices } from "../content";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Gallery", to: "/gallery" },
  { label: "Blog", to: "/blog" },
  { label: "Career", to: "/career" },
  { label: "Contact", to: "/contact" },
];

const EASE = "cubic-bezier(0.25,0.1,0.25,1)";

function useKabulTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const formatted = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kabul",
      }).format(new Date());
      setTime(formatted);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function RollButton({
  label,
  variant,
  to,
}: {
  label: string;
  variant: "dark" | "orange";
  to: string;
}) {
  const bg = variant === "dark" ? "bg-[#16212b] hover:bg-[#243542]" : "bg-[#F26522] hover:bg-[#e05a1a]";
  const arrowColor = variant === "dark" ? "text-[#16212b]" : "text-[#F26522]";

  return (
    <Link
      to={to}
      className={`group flex items-center gap-2.5 sm:gap-3.5 rounded-full ${bg} pl-6 pr-2.5 py-2.5 text-white text-[14px] font-medium transition-colors duration-300`}
    >
      <span className="h-[22px] overflow-hidden">
        <span
          className="flex flex-col transition-transform duration-500"
          style={{ transitionTimingFunction: EASE }}
        >
          <span
            className="h-[22px] leading-[22px] group-hover:-translate-y-1/2"
            style={{ transitionTimingFunction: EASE, transition: "transform 500ms" }}
          >
            {label}
          </span>
          <span className="h-[22px] leading-[22px]">{label}</span>
        </span>
      </span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white transition-transform duration-500 group-hover:-rotate-45" style={{ transitionTimingFunction: EASE }}>
        <ArrowRight size={13} className={arrowColor} />
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const time = useKabulTime();

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-40 mx-auto max-w-[1440px] p-2 sm:p-3">
        <nav className="glass-nav flex items-center justify-between rounded-full p-[7px]">
          {/* Left: logo + links */}
          <div className="flex items-center gap-7 pl-1.5">
            <Link to="/" className="flex h-[56px] sm:h-[60px] items-center rounded-full bg-[#16212b] px-4 sm:px-5">
              <motion.img
                src={assets.logoWhite}
                alt="Afghanistan Center for Excellence"
                className="h-8 sm:h-9 w-auto object-contain"
                animate={{ scale: [1, 1.7, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </Link>
            <div className="hidden xl:flex items-center gap-4 2xl:gap-6">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.to === "/"}
                  className="relative text-[14.5px] 2xl:text-[15.5px] whitespace-nowrap transition-colors duration-300"
                >
                  {({ isActive }) => (
                    <span
                      className={isActive ? "text-[#16212b] font-medium" : "text-[#16212b]/55 hover:text-[#16212b]"}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute left-0 -bottom-1.5 h-[2px] w-full bg-[#F26522]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: availability + clock + CTA (desktop) */}
          <div className="hidden xl:flex items-center gap-4 pr-1.5">
            <span className="hidden 2xl:inline text-[13px] text-[#16212b]/60 whitespace-nowrap">
              {offices.join(" · ")}
            </span>
            <span className="hidden 2xl:flex items-center gap-1.5 text-[14px] text-[#16212b]/60 whitespace-nowrap">
              <Clock size={15} />
              {time} in Kabul
            </span>
            <RollButton label="Start a conversation" variant="dark" to="/contact" />
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="xl:hidden mr-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#16212b] text-white"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${menuOpen ? "" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className="glass-panel absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-2xl p-6 transition-transform duration-500"
          style={{
            transform: menuOpen ? "translateY(0)" : "translateY(100%)",
            transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-[13px] text-[#16212b]/70">
              <Clock size={14} />
              {time} in Kabul
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16212b] text-white"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex max-h-[52vh] flex-col gap-0.5 overflow-y-auto pr-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `py-1.5 text-[22px] sm:text-[26px] font-medium ${
                    isActive ? "text-[#16212b]" : "text-[#16212b]/45"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-6">
            <RollButton label="Start a conversation" variant="orange" to="/contact" />
          </div>
        </div>
      </div>
    </>
  );
}
