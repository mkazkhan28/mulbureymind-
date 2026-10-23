"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { BDS_RESOURCES, BDS_SUBJECTS, BDS_FLASHCARD_DECKS } from "@/lib/bds-content";
import { useTheme } from "@/context/ThemeContext";

/* Routes that render full-screen without the sidebar / top bar */
const BARE_ROUTES = ["/login", "/signup", "/forgot-password"];

/* Subject accent colours — 400-level text reads well in both themes */
const SUBJECT_TONE: Record<string, { text: string; bg: string; ring: string }> = {
  anat: { text: "text-amber-400", bg: "bg-amber-500/10", ring: "ring-amber-500/30" },
  phys: { text: "text-rose-400", bg: "bg-rose-500/10", ring: "ring-rose-500/30" },
  "oral-bio": { text: "text-cyan-400", bg: "bg-cyan-500/10", ring: "ring-cyan-500/30" },
  biochem: { text: "text-violet-400", bg: "bg-violet-500/10", ring: "ring-violet-500/30" },
  pharm: { text: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/30" },
  path: { text: "text-sky-400", bg: "bg-sky-500/10", ring: "ring-sky-500/30" },
};
const DEFAULT_TONE = { text: "text-brand-400", bg: "bg-brand-500/10", ring: "ring-brand-500/30" };

/* Top bar navigation */
const TOP_NAV = [
  { href: "/", label: "Home" },
  { href: "/content", label: "Content" },
  { href: "/pricing", label: "Pricing" },
  { href: "/subscription", label: "Status" },
];

const firstYearSubjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");

function subjectLinks(s: (typeof BDS_SUBJECTS)[number]) {
  const notes = BDS_RESOURCES.filter((r) => r.subjectId === s.id).length;
  const decks = BDS_FLASHCARD_DECKS.filter((d) => d.subjectId === s.id).length;
  return [
    { href: `/practice?subject=${s.id}`, label: "MCQs", icon: ListChecks, meta: s.mcqCount.toLocaleString() },
    { href: `/resources?subject=${s.id}`, label: "Notes & PPTs", icon: Presentation, meta: notes ? String(notes) : "" },
    { href: `/flashcards`, label: "Flashcards", icon: Layers, meta: decks ? `${decks} decks` : "" },
    { href: `/past-papers`, label: "Past papers", icon: Award, meta: s.pastPapersCount ? `${s.pastPapersCount} yrs` : "" },
    { href: `/subjects/${s.slug}`, label: "Topics", icon: BookOpen, meta: s.topicsCount ? String(s.topicsCount) : "" },
  ];
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme, setTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  // Auto-open the subject you're currently viewing
  useEffect(() => {
    const match = firstYearSubjects.find((s) => pathname.startsWith(`/subjects/${s.slug}`));
    if (match) setOpenSubject(match.id);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchModalOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname.startsWith(path));

  if (BARE_ROUTES.some((r) => pathname.startsWith(r))) {
    return <>{children}</>;
  }

  const searchResults = [
    ...firstYearSubjects.map((s) => ({
      title: s.name,
      subtitle: `${s.code} • MCQs, notes, PPTs & topics`,
      href: `/subjects/${s.slug}`,
      category: "Subject",
      icon: s.icon,
    })),
    { title: "MCQ Practice Simulator", subtitle: "Tutor mode, timed exam, and mock annual papers", href: "/practice", category: "Practice", icon: "⚡" },
    { title: "DUHS Past Papers (2015–2024)", subtitle: "DIKIOHS, DDC & DIDC annual questions with solutions", href: "/past-papers", category: "Past papers", icon: "📜" },
    { title: "Flashcards", subtitle: "Oral histology, cranial nerves, dental pharmacology", href: "/flashcards", category: "Flashcards", icon: "🗂️" },
    { title: "Lecture notes & PPT slides", subtitle: "High-yield PDFs and slide decks", href: "/resources", category: "Notes & PPTs", icon: "📑" },
    { title: "Content library", subtitle: "Every paper and question set in one place", href: "/content", category: "Content", icon: "📚" },
    { title: "Pricing & plans", subtitle: "Free starter and full session passes", href: "/pricing", category: "Pricing", icon: "💎" },
    { title: "My plan status", subtitle: "Active plan, renewal date and receipts", href: "/subscription", category: "Status", icon: "✅" },
  ].filter((item) => {
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  /* ------------------------------------------------------------------ */
  /* Sidebar contents (shared by desktop sidebar and mobile drawer)      */
  /* ------------------------------------------------------------------ */
  const NavItem = ({
    href,
    label,
    icon: Icon,
    badge,
    collapsed = false,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: React.ReactNode;
    collapsed?: boolean;
  }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        title={label}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
          active ? "bg-brand-500/10 text-brand-400" : "text-slate-300 hover:bg-slate-800 hover:text-ink"
        } ${collapsed ? "justify-center" : ""}`}
      >
        {active && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-500" />}
        <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-brand-400" : "text-slate-400 group-hover:text-brand-400"}`} />
        {!collapsed && <span className="flex-1 truncate">{label}</span>}
        {!collapsed && badge}
      </Link>
    );
  };

  const SidebarBody = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      <div className="space-y-1">
        {!collapsed && <SectionLabel>Overview</SectionLabel>}
        {NavItem({ href: "/", label: "Home", icon: Home, collapsed: collapsed })}
        {NavItem({ href: "/dashboard", label: "My dashboard", icon: LayoutDashboard, collapsed: collapsed })}
      </div>

      {/* Subjects, each expanding to its MCQs, notes & PPTs, flashcards ... */}
      <div className="space-y-1">
        {!collapsed && (
          <SectionLabel>
            Subjects <span className="ml-1 rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">{firstYearSubjects.length}</span>
          </SectionLabel>
        )}
        {firstYearSubjects.map((s) => {
          const tone = SUBJECT_TONE[s.id] ?? DEFAULT_TONE;
          const open = openSubject === s.id;
          const onSubject = pathname.startsWith(`/subjects/${s.slug}`);
          if (collapsed) {
            return (
              <Link
                key={s.id}
                href={`/subjects/${s.slug}`}
                title={s.name}
                className={`flex h-10 items-center justify-center rounded-xl text-lg transition hover:bg-slate-800 ${onSubject ? `${tone.bg} ring-1 ${tone.ring}` : ""}`}
              >
                {s.icon}
              </Link>
            );
          }
          return (
            <div key={s.id} className={`rounded-xl transition-colors ${open ? "bg-slate-850" : ""}`}>
              <button
                type="button"
                onClick={() => setOpenSubject(open ? null : s.id)}
                aria-expanded={open}
                className={`group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition hover:bg-slate-800 ${onSubject ? "font-semibold text-ink" : "text-slate-200"}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm ${tone.bg} ring-1 ${tone.ring} transition-transform duration-200 group-hover:scale-110`}>
                  {s.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate leading-tight">{s.name}</span>
                  <span className={`block text-[10px] font-semibold tracking-wide ${tone.text}`}>{s.code}</span>
                </span>
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <ul className="ml-[22px] space-y-0.5 border-l border-slate-700 py-1.5 pl-3 pr-1">
                    {subjectLinks(s).map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-slate-300 transition hover:bg-slate-800 hover:text-ink"
                        >
                          <l.icon className={`h-3.5 w-3.5 shrink-0 ${tone.text}`} />
                          <span className="flex-1">{l.label}</span>
                          {l.meta && <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-300">{l.meta}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
        {!collapsed && (
          <Link href="/subjects" className="block px-3 pt-1 text-xs font-semibold text-brand-400 hover:underline">
            Browse all subjects →
          </Link>
        )}
      </div>

      <div className="space-y-1">
        {!collapsed && <SectionLabel>Study tools</SectionLabel>}
        {NavItem({ href: "/practice", label: "MCQ practice", icon: Zap, collapsed: collapsed, badge: <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">LIVE</span> })}
        {NavItem({ href: "/past-papers", label: "Past papers", icon: Award, collapsed: collapsed, badge: <span className="text-[10px] text-slate-500">2015–24</span> })}
        {NavItem({ href: "/flashcards", label: "Flashcards", icon: Layers, collapsed: collapsed })}
        {NavItem({ href: "/resources", label: "Notes & PPTs", icon: Presentation, collapsed: collapsed })}
        {NavItem({ href: "/books", label: "Textbooks", icon: Library, collapsed: collapsed })}
        {NavItem({ href: "/content", label: "Content library", icon: FileText, collapsed: collapsed })}
      </div>

      <div className="space-y-1">
        {!collapsed && <SectionLabel>Account</SectionLabel>}
        {NavItem({ href: "/pricing", label: "Pricing", icon: CreditCard, collapsed: collapsed })}
        {NavItem({ href: "/subscription", label: "Plan status", icon: ShieldCheck, collapsed: collapsed })}
        {NavItem({ href: "/profile", label: "Profile", icon: GraduationCap, collapsed: collapsed })}
        {NavItem({ href: "/admin", label: "Admin console", icon: Settings, collapsed: collapsed })}
        {NavItem({ href: "/contact", label: "Help & support", icon: HelpCircle, collapsed: collapsed })}
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
        className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-line bg-surface text-slate-300 transition hover:border-brand-500/50 hover:text-brand-400"
      >
        <Sun className={`absolute h-4 w-4 transition-all duration-500 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
        <Moon className={`absolute h-4 w-4 transition-all duration-500 ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
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
      <span className={`flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 ${small ? "h-9 w-9" : "h-11 w-11"}`}>
        <img src="/logo-icon.svg" alt="HMHDental logo" className="h-full w-full" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={`truncate font-display tracking-tight text-ink ${small ? "text-base" : "text-lg"} leading-tight`}>
          <span className="font-bold">HMH</span>
          <span className="font-medium">Dental</span>
        </span>
        <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-brand-400">DUHS · BDS 1st Year</span>
      </span>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      {/* ============================ DESKTOP SIDEBAR ============================ */}
      <aside
        className={`sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-300 lg:flex ${
          sidebarCollapsed ? "w-[76px]" : "w-72"
        }`}
      >
        <div className={`flex h-16 items-center border-b border-line px-4 ${sidebarCollapsed ? "justify-center" : "justify-between gap-2"}`}>
          {!sidebarCollapsed && Brand({})}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-ink"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        {SidebarBody({ collapsed: sidebarCollapsed })}
        <div className="border-t border-line p-3">{sidebarCollapsed ? <div className="flex justify-center">{ThemeSwitch({ compact: true })}</div> : ThemeSwitch({})}</div>
      </aside>

      {/* ============================ MOBILE DRAWER ============================ */}
      <div className={`fixed inset-0 z-50 lg:hidden ${mobileMenuOpen ? "" : "pointer-events-none"}`} aria-hidden={!mobileMenuOpen}>
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            {Brand({ small: true })}
            <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-ink" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-1 border-b border-line px-3 py-2">
            {TOP_NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition ${isActive(n.href) ? "bg-brand-500/10 text-brand-400" : "text-slate-300 hover:bg-slate-800"}`}>
                {n.label}
              </Link>
            ))}
          </div>
          {SidebarBody({})}
          <div className="border-t border-line p-3">
            {ThemeSwitch({})}
          </div>
        </div>
      </div>

      {/* ============================ MAIN COLUMN ============================ */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={`sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
            scrolled ? "border-line bg-surface/85 shadow-soft backdrop-blur-xl" : "border-transparent bg-canvas/60 backdrop-blur-md"
          }`}
        >
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl p-2 text-slate-300 transition hover:bg-slate-800 hover:text-ink lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            {Brand({ small: true })}
          </div>

          {/* Pricing · Content · Status on top */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {TOP_NAV.map((n) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`group relative rounded-lg px-3.5 py-2 text-sm font-medium transition ${active ? "text-ink" : "text-slate-400 hover:text-ink"}`}
                >
                  {n.label}
                  <span
                    className={`absolute inset-x-3.5 -bottom-[13px] h-0.5 origin-left rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="hidden items-center gap-2 rounded-xl border border-line bg-surface py-2 pl-3 pr-2 text-xs text-slate-400 transition hover:border-brand-500/50 hover:text-ink xl:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="w-32 text-left">Search subjects…</span>
              <kbd className="rounded-md border border-line bg-slate-850 px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</kbd>
            </button>
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-slate-300 transition hover:text-brand-400 xl:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Plan status chip */}
            <Link
              href="/subscription"
              className="hidden items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/15 sm:flex"
              title="Your plan status"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Free plan
            </Link>

            <div className="hidden sm:block">{ThemeSwitch({ compact: true })}</div>

            <Link href="/login" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-ink md:block">
              Log in
            </Link>
            <Link href="/signup" className="btn-brand !px-4 !py-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign up free</span>
              <span className="sm:hidden">Join</span>
            </Link>
          </div>
        </header>

        <main className="w-full flex-1">{children}</main>

        {/* ============================ FOOTER ============================ */}
        <footer className="mt-auto border-t border-line bg-surface px-6 py-12 lg:px-8">
          <div className="mx-auto mb-8 grid max-w-7xl grid-cols-1 gap-8 text-sm sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-3">
              {Brand({ small: true })}
              <p className="text-xs leading-relaxed text-slate-400">
                High-yield study portal built for Dow University of Health Sciences (DUHS Karachi) BDS 1st Year students.
              </p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-brand-400">
                <ShieldCheck className="h-3.5 w-3.5" /> DIKIOHS • DDC • DIDC syllabus
              </div>
            </div>
            <FooterCol
              title="Subjects"
              links={firstYearSubjects.map((s) => ({ href: `/subjects/${s.slug}`, label: s.name }))}
            />
            <FooterCol
              title="Study"
              links={[
                { href: "/practice", label: "MCQ practice" },
                { href: "/past-papers", label: "Past papers (2015–2024)" },
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
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} HMHDental. Made for Dow University dental students.</p>
            <p className="flex items-center gap-1.5">
              Made with <Heart className="h-3.5 w-3.5 fill-current text-rose-500" /> for future dental surgeons
            </p>
          </div>
        </footer>
      </div>

      {/* ============================ SEARCH (Ctrl K) ============================ */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-24 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSearchModalOpen(false)}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-lift animate-rise" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-line p-4">
              <Search className="h-4 w-4 text-brand-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search subjects, MCQs, past papers, PPTs…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-ink placeholder:text-slate-500 focus:outline-none"
              />
              <kbd className="rounded-md border border-line bg-slate-850 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">ESC</kbd>
            </div>
            <div className="max-h-80 space-y-0.5 overflow-y-auto p-2">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <Link
                    key={item.href + item.title}
                    href={item.href}
                    onClick={() => setSearchModalOpen(false)}
                    className="group flex items-center justify-between rounded-xl p-2.5 transition hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-ink group-hover:text-brand-400">{item.title}</div>
                        <div className="text-xs text-slate-400">{item.subtitle}</div>
                      </div>
                    </div>
                    <span className="rounded-md bg-slate-850 px-2 py-0.5 text-[10px] font-medium text-slate-400">{item.category}</span>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-slate-400">No results for &ldquo;{searchQuery}&rdquo;.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{children}</div>;
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink">{title}</h4>
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
