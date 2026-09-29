import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Images,
  Newspaper,
  Users,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { api } from "../lib/api";

type NavItem = { to: string; label: string; hint: string; icon: typeof FileText; end?: boolean };

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", hint: "Summary of your website", icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: "Website",
    items: [
      { to: "/content", label: "Page Content", hint: "Text & photos on each page", icon: FileText },
      { to: "/projects", label: "Projects", hint: "Add or edit projects", icon: FolderKanban },
      { to: "/gallery", label: "Gallery", hint: "Photos & videos", icon: Images },
      { to: "/blog", label: "Blog", hint: "Articles & news", icon: Newspaper },
    ],
  },
  {
    title: "People",
    items: [
      { to: "/careers", label: "Careers", hint: "Job openings & applicants", icon: Users },
      { to: "/messages", label: "Messages", hint: "Enquiries from the website", icon: Mail },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/content": "Page Content",
  "/projects": "Projects",
  "/gallery": "Gallery",
  "/blog": "Blog",
  "/careers": "Careers",
  "/messages": "Messages",
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-[#073B70] text-white">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C518] text-[15px] font-extrabold text-[#073B70]">
          ACE
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold">Admin Panel</p>
          <p className="text-[11.5px] text-white/55">Afghanistan Center for Excellence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="px-3 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/40">
              {group.title}
            </p>
            <div className="flex flex-col gap-1">
              {group.items.map(({ to, label, hint, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#F5C518]" />
                      )}
                      <Icon size={18} className={isActive ? "text-[#F5C518]" : "text-white/60"} />
                      <span className="min-w-0">
                        <span className="block text-[14px] font-medium leading-tight">{label}</span>
                        <span className="block truncate text-[11.5px] leading-tight text-white/45">
                          {hint}
                        </span>
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="border-t border-white/10 p-3">
        <a
          href={`${window.location.origin}/home-02`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={17} className="text-[#F5C518]" />
          View live website
        </a>
        <button
          type="button"
          onClick={() => {
            api.logout();
            navigate("/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <div className="min-h-screen bg-[#F3F6FB]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar (slide-over) */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-2xl">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#073B70]/10 bg-white/90 px-4 py-3.5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-[#073B70] lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="text-[17px] font-semibold text-[#073B70]">{title}</h1>
          </div>
          <a
            href={`${window.location.origin}/home-02`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-[#F5C518] px-4 py-2 text-[12.5px] font-semibold text-[#073B70] transition-colors hover:bg-[#e6b800] sm:flex"
          >
            View live website <ExternalLink size={13} />
          </a>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
