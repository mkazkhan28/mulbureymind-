"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  ChevronDown,
  CreditCard,
  FileText,
  GraduationCap,
  Heart,
  HelpCircle,
  Home,
  Layers,
  LayoutDashboard,
  Library,
  ListChecks,
  Menu,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Presentation,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
  Zap,
  FolderOpen,
  ListTree,
  Sprout,
  Microscope,
  Brain,
  ScanFace,
  Bone,
  HeartPulse,
  UserRound,
} from "lucide-react";
import { getSubjectStructure } from "@/lib/subject-structure";
import { BDS_SUBJECTS, BDS_TOPICS } from "@/lib/bds-content";
import { useTheme } from "@/context/ThemeContext";
import { SubjectArt, areaIcon } from "@/components/Illustrations";
import { m, PageTransition, SPRING, EASE } from "@/components/motion";
import GlobalSearch from "@/components/GlobalSearch";

const SIDEBAR_KEY = "hmh-sidebar";
type SidebarPrefs = { collapsed: boolean; subjectsOpen: boolean; pagesOpen: boolean };
const DEFAULT_PREFS: SidebarPrefs = { collapsed: false, subjectsOpen: true, pagesOpen: true };

/* Routes that render full-screen without the sidebar / top bar */
const BARE_ROUTES = ["/login", "/signup", "/forgot-password", "/read/"];

/* Primary navigation (bottom dock on desktop). Saved items live on the dashboard ("Saved resources"),
   so there is no separate Bookmarks entry here. */
const PRIMARY_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: GraduationCap },
  { href: "/practice", label: "MCQs", icon: ListChecks },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/resources", label: "Resources", icon: Presentation },
  { href: "/profile", label: "Profile", icon: UserRound },
];

/* Everything else lives in the sidebar, never in the dock */
const MORE_NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/past-papers", label: "Past papers", icon: Award },
  { href: "/books", label: "Textbooks", icon: Library },
  { href: "/content", label: "Content library", icon: FileText },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/subscription", label: "Plan status", icon: ShieldCheck },
  { href: "/contact", label: "Help & support", icon: HelpCircle },
  { href: "/admin", label: "Admin console", icon: Settings },
];

/* Phone bottom bar: the five most-used places (the rest are in the side menu) */
const TAB_NAV = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: GraduationCap },
  { href: "/practice", label: "MCQs", icon: ListChecks },
  { href: "/flashcards", label: "Cards", icon: Layers },
  { href: "/resources", label: "Resources", icon: Presentation },
];
const TAB_HREFS = new Set(TAB_NAV.map((t) => t.href));

const firstYearSubjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");

/** `inert` keeps hidden menus out of the tab order (React 18 passes it through as a plain attribute). */
const inertProps = (on: boolean) =>
  on ? ({ inert: Number(React.version.split(".")[0]) >= 19 ? true : "" } as unknown as Record<string, string>) : {};

/** Chapters shown under the subject you're in (Anatomy areas, or topics for the other subjects) */
function chaptersOf(s: (typeof BDS_SUBJECTS)[number]) {
  const st = getSubjectStructure(s.slug);
  if (st) return st.areas.map((a) => ({ href: `/subjects/${s.slug}/${a.slug}`, label: a.title, icon: areaIcon(a.slug) }));
  return BDS_TOPICS.filter((t) => t.subjectId === s.id).map((t) => ({ href: `/subjects/${s.slug}/${t.slug}`, label: t.name, icon: BookOpen }));
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme, setTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [prefs, setPrefs] = useState<SidebarPrefs>(DEFAULT_PREFS);
  const sidebarCollapsed = prefs.collapsed;
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  /* Tooltip for the icon-only sidebar (fixed-position, so the scrolling sidebar can't clip it) */
  const [tip, setTip] = useState<{ label: string; top: number } | null>(null);

  // Remember the sidebar layout between visits (per browser)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    } catch {}
  }, []);
  const updatePrefs = (patch: Partial<SidebarPrefs>) =>
    setPrefs((p) => {
      const next = { ...p, ...patch };
      try {
        localStorage.setItem(SIDEBAR_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  const setSidebarCollapsed = (collapsed: boolean) => {
    setTip(null);
    updatePrefs({ collapsed });
  };
  // only re-render when the tooltip actually changes (a re-render mid-click can swallow the click)
  const showTip = (label: string, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const top = Math.round(r.top + r.height / 2);
    setTip((t) => (t && t.label === label && t.top === top ? t : { label, top }));
  };
  const tipProps = (label: string, on: boolean) =>
    on
      ? {
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => showTip(label, e.currentTarget),
          // keyboard focus only: a state update during a mouse click can swallow the click
          onFocus: (e: React.FocusEvent<HTMLElement>) => {
            if (e.currentTarget.matches(":focus-visible")) showTip(label, e.currentTarget);
          },
          onMouseLeave: () => setTip(null),
          onBlur: () => setTip(null),
        }
      : {};
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearch(false);
  }, [pathname]);

  // Open the subject you're currently in, so its chapters are one click away
  useEffect(() => {
    const match = firstYearSubjects.find((s) => pathname.startsWith(`/subjects/${s.slug}`));
    setOpenSubject(match ? match.id : null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ctrl/⌘ K focuses search anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const el = searchRef.current;
        if (el && el.offsetParent !== null) el.focus();
        else setMobileSearch(true);
      } else if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setMobileSearch(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/"));

  if (BARE_ROUTES.some((r) => pathname.startsWith(r))) {
    // sign-in pages get a main landmark; the reader renders its own full-screen layout
    return pathname.startsWith("/read/") ? <>{children}</> : <main id="main">{children}</main>;
  }

  /* ------------------------------------------------------------------ */
  /* Sidebar contents (shared by desktop sidebar and mobile drawer)      */
  /* ------------------------------------------------------------------ */
  const NavItem = ({
    href,
    label,
    icon: Icon,
    badge,
    collapsed = false,
    small = false,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: React.ReactNode;
    collapsed?: boolean;
    small?: boolean;
  }) => {
    const active = isActive(href) || (href === "/subjects" && pathname.startsWith("/subjects"));
    return (
      <Link
        href={href}
        aria-label={collapsed ? label : undefined}
        aria-current={active ? "page" : undefined}
        {...tipProps(label, collapsed)}
        className={`group relative flex items-center gap-3 rounded-xl px-3 ${small ? "py-2 text-[13.5px]" : "py-2.5 text-sm"} font-display font-medium tracking-[-0.01em] transition-colors duration-200 ${
          active ? "font-semibold text-primary" : "text-slate-300 hover:bg-slate-850 hover:text-ink"
        } ${collapsed ? "justify-center" : ""}`}
      >
        {active && <m.span layoutId={collapsed ? "side-active-c" : "side-active"} transition={SPRING} className="absolute inset-0 rounded-xl bg-soft ring-1 ring-primary/15" />}
        <Icon className={`relative h-[18px] w-[18px] shrink-0 ${active ? "text-primary" : "text-slate-400 group-hover:text-primary"}`} />
        {!collapsed && <span className="relative flex-1 truncate">{label}</span>}
        {!collapsed && badge && <span className="relative">{badge}</span>}
      </Link>
    );
  };

  const SidebarBody = ({ collapsed = false, drawer = false }: { collapsed?: boolean; drawer?: boolean }) => (
    <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-3 py-4">
      {/* Phone drawer only: main pages that aren't in the bottom bar */}
      {drawer && (
        <nav className="space-y-0.5" aria-label="More pages">
          {PRIMARY_NAV.filter((n) => !TAB_HREFS.has(n.href)).map((n) => (
            <React.Fragment key={n.href}>{NavItem({ ...n })}</React.Fragment>
          ))}
        </nav>
      )}

      {/* Your subjects — the one you're in shows its chapters */}
      <div className="space-y-0.5">
        {!collapsed && (
          <GroupToggle label="Your subjects" open={drawer || prefs.subjectsOpen} onToggle={drawer ? undefined : () => updatePrefs({ subjectsOpen: !prefs.subjectsOpen })} />
        )}
        <Collapse open={collapsed || drawer || prefs.subjectsOpen}>
        {firstYearSubjects.map((s) => {
          const open = openSubject === s.id;
          const onSubject = pathname.startsWith(`/subjects/${s.slug}`);
          if (collapsed) {
            return (
              <Link
                key={s.id}
                href={`/subjects/${s.slug}`}
                aria-label={s.name}
                {...tipProps(s.name, true)}
                className={`flex h-10 items-center justify-center rounded-xl transition hover:bg-slate-850 ${onSubject ? "bg-soft ring-1 ring-primary/20" : ""}`}
              >
                <SubjectArt id={s.id} className="h-7 w-7" />
              </Link>
            );
          }
          const chapters = chaptersOf(s);
          return (
            <div key={s.id}>
              <div className={`group flex items-center rounded-xl transition-colors hover:bg-slate-850 ${onSubject ? "bg-slate-850" : ""}`}>
                <Link href={`/subjects/${s.slug}`} className={`flex min-w-0 flex-1 items-center gap-3 px-2.5 py-1.5 font-display text-sm font-semibold tracking-[-0.01em] ${onSubject ? "text-ink" : "text-slate-300"}`}>
                  <SubjectArt id={s.id} className="h-7 w-7 shrink-0" />
                  <span className="truncate">{s.name}</span>
                </Link>
                {chapters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setOpenSubject(open ? null : s.id)}
                    aria-expanded={open}
                    aria-label={`${open ? "Hide" : "Show"} ${s.name} chapters`}
                    className="mr-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-ink"
                  >
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
              <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <ul className="ml-[22px] space-y-0.5 overflow-hidden border-l border-slate-700 pl-3" aria-label={`${s.name} chapters`}>
                  {chapters.map((c, i) => (
                    <li key={c.href} className={i === 0 ? "pt-1" : i === chapters.length - 1 ? "pb-1" : ""}>
                      <Link
                        href={c.href}
                        tabIndex={open ? undefined : -1}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition hover:bg-slate-850 hover:text-ink ${
                          pathname === c.href ? "bg-soft font-semibold text-primary" : "text-slate-400"
                        }`}
                      >
                        <c.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{c.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
        </Collapse>
      </div>

      {/* Everything else */}
      <div className={collapsed ? "space-y-0.5 border-t border-line pt-4" : "space-y-0.5"}>
        {!collapsed && (
          <GroupToggle label="More pages" open={drawer || prefs.pagesOpen} onToggle={drawer ? undefined : () => updatePrefs({ pagesOpen: !prefs.pagesOpen })} />
        )}
        <Collapse open={collapsed || drawer || prefs.pagesOpen}>
          {MORE_NAV.map((n) => (
            <React.Fragment key={n.href}>{NavItem({ ...n, collapsed, small: !collapsed })}</React.Fragment>
          ))}
        </Collapse>
      </div>
    </div>
  );

  const ThemeSwitch = ({ compact = false }: { compact?: boolean }) =>
    compact ? (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-line bg-surface text-slate-300 transition hover:border-primary/50 hover:text-primary"
      >
        <Sun className={`absolute h-4 w-4 transition duration-500 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
        <Moon className={`absolute h-4 w-4 transition duration-500 ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
      </button>
    ) : (
      <div className="relative grid grid-cols-2 rounded-xl border border-line bg-slate-850 p-1 text-xs font-semibold" role="radiogroup" aria-label="Theme">
        <span
          className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-surface shadow-soft transition-transform duration-300 ease-out ${theme === "dark" ? "translate-x-full" : ""}`}
        />
        <button type="button" role="radio" aria-checked={theme === "light"} onClick={() => setTheme("light")} className={`relative z-10 flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition ${theme === "light" ? "text-ink" : "text-slate-400 hover:text-ink"}`}>
          <Sun className="h-3.5 w-3.5" /> Light
        </button>
        <button type="button" role="radio" aria-checked={theme === "dark"} onClick={() => setTheme("dark")} className={`relative z-10 flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition ${theme === "dark" ? "text-ink" : "text-slate-400 hover:text-ink"}`}>
          <Moon className="h-3.5 w-3.5" /> Dark
        </button>
      </div>
    );

  const Brand = ({ small = false }: { small?: boolean }) => (
    <Link href="/" className="group flex min-w-0 items-center gap-2.5">
      <span className={`flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105 ${small ? "h-9 w-9" : "h-10 w-10"}`}>
        <img src="/logo-icon.svg" alt="HMHDental logo" className="h-full w-full" width={40} height={40} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={`truncate font-display font-bold tracking-[-0.045em] text-ink ${small ? "text-lg" : "text-xl"} leading-none`}>
          HMH<span className="text-primary">Dental</span>
        </span>
        <span className="mt-1 truncate text-[11px] font-medium text-slate-400">DUHS · BDS 1st Year</span>
      </span>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <a href="#main" className="sr-only z-[80] rounded-lg bg-primary px-4 py-2 text-on-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>

      {/* ============================ DESKTOP SIDEBAR ============================ */}
      <aside
        className={`sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-line bg-canvas-2 transition-[width] duration-300 lg:flex ${
          sidebarCollapsed ? "w-[76px]" : "w-72"
        }`}
      >
        <div className={`flex h-16 items-center border-b border-line px-4 ${sidebarCollapsed ? "justify-center" : "justify-between gap-2"}`}>
          {!sidebarCollapsed && Brand({})}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-850 hover:text-ink"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!sidebarCollapsed}
            {...tipProps("Expand sidebar", sidebarCollapsed)}
            title={sidebarCollapsed ? undefined : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        {SidebarBody({ collapsed: sidebarCollapsed })}
        <div className="border-t border-line p-3">{sidebarCollapsed ? <div className="flex justify-center">{ThemeSwitch({ compact: true })}</div> : ThemeSwitch({})}</div>
      </aside>

      {/* Tooltip for the icon-only sidebar */}
      {sidebarCollapsed && tip && (
        <div
          role="tooltip"
          className="pointer-events-none fixed left-[84px] z-[70] hidden -translate-y-1/2 animate-fadeIn whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 font-display text-xs font-semibold text-canvas shadow-lift lg:block"
          style={{ top: tip.top }}
        >
          {tip.label}
        </div>
      )}

      {/* ============================ MOBILE DRAWER ============================ */}
      <div className={`fixed inset-0 z-50 lg:hidden ${mobileMenuOpen ? "" : "pointer-events-none"}`} aria-hidden={!mobileMenuOpen}>
        <m.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={false}
          animate={{ opacity: mobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          onClick={() => setMobileMenuOpen(false)}
        />
        <m.div
          className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-canvas-2 shadow-2xl"
          initial={false}
          animate={{ x: mobileMenuOpen ? 0 : "-100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 38 }}
          {...inertProps(!mobileMenuOpen)}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            {Brand({ small: true })}
            <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-850 hover:text-ink" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          {SidebarBody({ drawer: true })}
          <div className="border-t border-line p-3">{ThemeSwitch({})}</div>
        </m.div>
      </div>

      {/* ============================ MOBILE SEARCH SHEET ============================ */}
      {mobileSearch && (
        <div className="fixed inset-0 z-[60] bg-canvas/95 p-4 backdrop-blur-sm animate-fadeIn lg:hidden" role="dialog" aria-modal="true" aria-label="Search">
          <div className="flex items-center gap-2">
            <GlobalSearch autoFocus className="flex-1" onNavigate={() => setMobileSearch(false)} />
            <button onClick={() => setMobileSearch(false)} className="rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:text-ink">
              Cancel
            </button>
          </div>
          <p className="mt-6 text-center text-sm text-muted">Search subjects, chapters, lectures and textbooks.</p>
        </div>
      )}

      {/* ============================ MAIN COLUMN ============================ */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={`sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 transition-[background-color,border-color,box-shadow] duration-300 sm:px-6 lg:px-8 ${
            scrolled ? "border-line bg-canvas/85 shadow-soft backdrop-blur-xl" : "border-transparent bg-canvas/70 backdrop-blur-md"
          }`}
        >
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl p-2 text-slate-300 transition hover:bg-slate-850 hover:text-ink lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">{Brand({ small: true })}</div>

          {/* Always-visible search (desktop/tablet) */}
          <GlobalSearch inputRef={searchRef} className="hidden w-full max-w-md md:block" />

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setMobileSearch(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-slate-300 transition hover:text-primary md:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="/subscription"
              className="hidden items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/15 dark:text-emerald-400 xl:flex"
              title="Your plan status"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Free plan
            </Link>

            <div className="hidden sm:block">{ThemeSwitch({ compact: true })}</div>

            <Link href="/login" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-ink lg:block">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary !min-h-[40px] !px-4 !py-2">
              <span className="hidden sm:inline">Sign up free</span>
              <span className="sm:hidden">Join</span>
            </Link>
          </div>
        </header>

        <main id="main" className="w-full flex-1 pb-20 lg:pb-24">
          <PageTransition key={pathname} routeKey={pathname}>
            {children}
          </PageTransition>
        </main>

        {/* ============================ FOOTER ============================ */}
        <footer className="mt-auto border-t border-line bg-canvas-2 px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto mb-8 grid max-w-content grid-cols-1 gap-8 text-sm sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-3">
              {Brand({ small: true })}
              <p className="text-xs leading-relaxed text-slate-400">
                Study portal built for Dow University of Health Sciences (DUHS Karachi) BDS 1st Year students.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> DIKIOHS • DDC • DIDC syllabus
              </div>
            </div>
            <FooterCol title="Subjects" links={firstYearSubjects.map((s) => ({ href: `/subjects/${s.slug}`, label: s.name }))} />
            <FooterCol
              title="Study"
              links={[
                { href: "/practice", label: "MCQ practice" },
                { href: "/past-papers", label: "Past papers" },
                { href: "/books", label: "Textbooks" },
                { href: "/flashcards", label: "Flashcards" },
                { href: "/resources", label: "Notes & PPTs" },
                { href: "/pricing", label: "Pricing" },
              ]}
            />
            <FooterCol
              title="Support"
              links={[
                { href: "/contact", label: "WhatsApp helpline" },
                { href: "/about", label: "About" },
                { href: "/privacy", label: "Privacy policy" },
                { href: "/terms", label: "Terms of service" },
              ]}
            />
          </div>
          <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} HMHDental. Made for Dow University dental students.</p>
            <p>Built for future dental surgeons</p>
          </div>
        </footer>
      </div>

      {/* ============================ BOTTOM NAVIGATION ============================ */}
      {/* Phones: full-width bar with the five most-used places + Menu (subjects and other pages) */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        {TAB_NAV.map((t) => {
          const active = isActive(t.href) || (t.href === "/subjects" && pathname.startsWith("/subjects"));
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-16 flex-col items-center justify-center gap-1 font-display text-[11px] font-semibold ${active ? "text-primary" : "text-slate-400"}`}
            >
              {active && <m.span layoutId="tab-active" transition={SPRING} className="absolute top-0 h-0.5 w-10 rounded-full bg-primary" />}
              <t.icon className="h-5 w-5" />
              {t.label}
            </Link>
          );
        })}
        <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" className="flex h-16 flex-col items-center justify-center gap-1 font-display text-[11px] font-semibold text-slate-400">
          <Menu className="h-5 w-5" />
          Menu
        </button>
      </nav>

      {/* Desktop: floating dock with the main menu, centred in the content area */}
      <div
        className={`pointer-events-none fixed bottom-4 right-0 z-40 hidden justify-center px-6 transition-[left] duration-300 lg:flex ${sidebarCollapsed ? "left-[76px]" : "left-72"}`}
      >
        <nav aria-label="Main" className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-surface/90 p-1.5 shadow-lift backdrop-blur-xl">
          {PRIMARY_NAV.map((n) => {
            const active = isActive(n.href) || (n.href === "/subjects" && pathname.startsWith("/subjects"));
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 font-display text-[11px] font-semibold tracking-[-0.01em] transition-colors xl:flex-row xl:gap-2 xl:px-4 xl:py-2.5 xl:text-sm ${
                  active ? "text-primary" : "text-slate-300 hover:bg-slate-850 hover:text-ink"
                }`}
              >
                {active && <m.span layoutId="dock-active" transition={SPRING} className="absolute inset-0 rounded-full bg-soft ring-1 ring-primary/20" />}
                <n.icon className={`relative h-[18px] w-[18px] shrink-0 ${active ? "text-primary" : "text-slate-400 group-hover:text-primary"}`} />
                <span className="relative whitespace-nowrap">{n.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/** Sidebar group heading. With onToggle it expands/collapses the group (remembered per browser). */
function GroupToggle({ label, open, onToggle }: { label: string; open: boolean; onToggle?: () => void }) {
  if (!onToggle) return <div className="px-3 pb-1.5 font-display text-[12.5px] font-semibold text-muted">{label}</div>;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="group flex w-full items-center justify-between rounded-lg px-3 pb-1.5 pt-0.5 font-display text-[12.5px] font-semibold text-muted transition-colors hover:text-ink"
    >
      {label}
      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "" : "-rotate-90"}`} />
    </button>
  );
}

/** Smooth height animation for sidebar groups (grid-rows trick: no layout measuring) */
function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`} {...inertProps(!open)}>
      <div className="min-h-0 space-y-0.5 overflow-hidden">{children}</div>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 font-display text-sm font-semibold text-ink">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-slate-400 transition hover:text-brand-400">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
