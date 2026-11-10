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
  FolderOpen,
  Menu,
  Moon,
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
import { m, AnimatePresence, PageTransition, SPRING, EASE } from "@/components/motion";
import GlobalSearch from "@/components/GlobalSearch";

/* Routes that render full-screen without the top bar */
const BARE_ROUTES = ["/login", "/signup", "/forgot-password", "/read/"];

/*
 * Navigation (no sidebar):
 *  - top bar: Subjects menu (every subject and its chapters), Library menu, More menu
 *  - bottom dock: the pages students use every day
 * Each link lives in exactly one of them. Phones use the bottom tab bar + Menu drawer instead.
 * Saved items live on the dashboard ("Saved resources"), so there is no separate Bookmarks entry.
 */
const PRIMARY_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "MCQs", icon: ListChecks },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/resources", label: "Resources", icon: Presentation },
  { href: "/profile", label: "Profile", icon: UserRound },
];

/* Top-bar menus */
const LIBRARY_NAV = [
  { href: "/question-bank", label: "Question bank", icon: FolderOpen, text: "Topic sets, class tests, OSPE & viva" },
  { href: "/past-papers", label: "Past papers", icon: Award, text: "DUHS questions with explanations" },
  { href: "/books", label: "Textbooks", icon: Library, text: "Recommended reference books" },
  { href: "/content", label: "Content library", icon: FileText, text: "Annual papers and question sets" },
];
const MORE_LINKS = [
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/subscription", label: "Plan status", icon: ShieldCheck },
  { href: "/contact", label: "Help & support", icon: HelpCircle },
  { href: "/admin", label: "Admin console", icon: Settings },
];
/* Phone drawer: everything that isn't in the phone tab bar */
const MORE_NAV = [...LIBRARY_NAV, ...MORE_LINKS];

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
  const [openSubject, setOpenSubject] = useState<string | null>(null);
  /* Which top-bar menu is open */
  const [menu, setMenu] = useState<null | "subjects" | "library" | "more">(null);
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [dockHidden, setDockHidden] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearch(false);
    setMenu(null);
  }, [pathname]);

  // Close a top-bar menu when clicking anywhere else
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menu]);

  // Open the subject you're currently in, so its chapters are one click away
  useEffect(() => {
    const match = firstYearSubjects.find((s) => pathname.startsWith(`/subjects/${s.slug}`));
    setOpenSubject(match ? match.id : null);
  }, [pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // the bottom bar slides away while reading down the page and returns on scrolling up
      if (y > lastY + 6 && y > 160) setDockHidden(true);
      else if (y < lastY - 6 || y < 160) setDockHidden(false);
      lastY = y;
    };
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
        setMenu(null);
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
  /* Phone drawer contents                                               */
  /* ------------------------------------------------------------------ */
  const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-sm font-medium tracking-[-0.01em] transition-colors duration-200 ${
          active ? "bg-soft font-semibold text-primary" : "text-slate-300 hover:bg-slate-850 hover:text-ink"
        }`}
      >
        <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-primary" : "text-slate-400 group-hover:text-primary"}`} />
        <span className="flex-1 truncate">{label}</span>
      </Link>
    );
  };

  const DrawerBody = () => (
    <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-3 py-4">
      <nav className="space-y-0.5" aria-label="More pages">
        {PRIMARY_NAV.filter((n) => !TAB_HREFS.has(n.href)).map((n) => (
          <React.Fragment key={n.href}>{NavItem({ ...n })}</React.Fragment>
        ))}
      </nav>
      <div className="space-y-0.5">
        <div className="px-3 pb-1.5 font-display text-[12.5px] font-semibold text-muted">Your subjects</div>
        {firstYearSubjects.map((s) => {
          const open = openSubject === s.id;
          const onSubject = pathname.startsWith(`/subjects/${s.slug}`);
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
      </div>
      <div className="space-y-0.5">
        <div className="px-3 pb-1.5 font-display text-[12.5px] font-semibold text-muted">More pages</div>
        {MORE_NAV.map((n) => (
          <React.Fragment key={n.href}>{NavItem({ href: n.href, label: n.label, icon: n.icon })}</React.Fragment>
        ))}
      </div>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /* Top-bar menus (desktop)                                             */
  /* ------------------------------------------------------------------ */
  const MenuButton = ({ id, label, active }: { id: "subjects" | "library" | "more"; label: string; active?: boolean }) => (
    <button
      type="button"
      onClick={() => setMenu(menu === id ? null : id)}
      aria-expanded={menu === id}
      aria-controls={`menu-${id}`}
      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 font-display text-[15px] font-semibold tracking-[-0.01em] transition-colors ${
        menu === id || active ? "bg-soft text-primary" : "text-slate-300 hover:bg-slate-850 hover:text-ink"
      }`}
    >
      {label}
      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${menu === id ? "rotate-180" : ""}`} />
    </button>
  );

  const menuPanel = (id: string, children: React.ReactNode, className: string) => (
    <m.div
      id={`menu-${id}`}
      key={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: EASE }}
      className={`absolute top-full z-40 mt-2 rounded-2xl border border-line bg-surface shadow-lift ${className}`}
    >
      {children}
    </m.div>
  );

  const SubjectsPanel = () =>
    menuPanel(
      "subjects",
      <div className="p-5">
        <div className="grid gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
          {firstYearSubjects.map((s) => {
            const chapters = chaptersOf(s);
            const onSubject = pathname.startsWith(`/subjects/${s.slug}`);
            return (
              <div key={s.id} className="min-w-0">
                <Link href={`/subjects/${s.slug}`} className={`group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface-2 ${onSubject ? "bg-soft" : ""}`}>
                  <SubjectArt id={s.id} className="h-8 w-8 shrink-0" />
                  <span className={`truncate font-display text-[15px] font-semibold ${onSubject ? "text-primary" : "text-ink group-hover:text-primary"}`}>{s.name}</span>
                </Link>
                {chapters.length > 0 ? (
                  <ul className="mt-1 space-y-0.5 pl-2">
                    {chapters.slice(0, 6).map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className={`flex items-center gap-2 rounded-lg px-2 py-1 text-[13px] transition-colors hover:bg-surface-2 hover:text-ink ${pathname === c.href ? "font-semibold text-primary" : "text-slate-400"}`}>
                          <c.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{c.label}</span>
                        </Link>
                      </li>
                    ))}
                    {chapters.length > 6 && (
                      <li>
                        <Link href={`/subjects/${s.slug}`} className="px-2 text-xs font-semibold text-primary hover:underline">
                          +{chapters.length - 6} more
                        </Link>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="mt-1 px-2 text-xs text-muted">Lectures coming soon</p>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
          <span className="text-muted">DUHS BDS 1st Year</span>
          <Link href="/subjects" className="link inline-flex items-center gap-1 font-semibold">
            All subjects <ChevronDown className="h-4 w-4 -rotate-90" />
          </Link>
        </div>
      </div>,
      "inset-x-4 sm:inset-x-6 lg:inset-x-8 mx-auto max-w-content"
    );

  const ListPanel = (id: string, items: { href: string; label: string; icon: React.ElementType; text?: string }[]) =>
    menuPanel(
      id,
      <ul className="p-2">
        {items.map((n) => (
          <li key={n.href}>
            <Link href={n.href} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2 ${isActive(n.href) ? "bg-soft" : ""}`}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-soft text-primary">
                <n.icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0">
                <span className={`block font-display text-sm font-semibold ${isActive(n.href) ? "text-primary" : "text-ink group-hover:text-primary"}`}>{n.label}</span>
                {n.text && <span className="block truncate text-xs text-muted">{n.text}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>,
      "left-0 w-72"
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

  const inLibrary = LIBRARY_NAV.some((n) => isActive(n.href));
  const inMore = MORE_LINKS.some((n) => isActive(n.href));

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <a href="#main" className="sr-only z-[80] rounded-lg bg-primary px-4 py-2 text-on-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>

      {/* ============================ PHONE DRAWER ============================ */}
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
          {DrawerBody()}
          <div className="border-t border-line p-3">{ThemeSwitch({})}</div>
        </m.div>
      </div>

      {/* ============================ SEARCH SHEET (phones & narrow screens) ============================ */}
      {mobileSearch && (
        <div className="fixed inset-0 z-[60] bg-canvas/95 p-4 backdrop-blur-sm animate-fadeIn xl:hidden" role="dialog" aria-modal="true" aria-label="Search">
          <div className="mx-auto flex max-w-2xl items-center gap-2">
            <GlobalSearch autoFocus className="flex-1" onNavigate={() => setMobileSearch(false)} />
            <button onClick={() => setMobileSearch(false)} className="rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:text-ink">
              Cancel
            </button>
          </div>
          <p className="mt-6 text-center text-sm text-muted">Search subjects, chapters, lectures and textbooks.</p>
        </div>
      )}

      {/* ============================ PAGE ============================ */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          ref={headerRef}
          className={`sticky top-0 z-30 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
            scrolled || menu ? "border-line bg-canvas/90 shadow-soft backdrop-blur-xl" : "border-transparent bg-canvas/70 backdrop-blur-md"
          }`}
        >
          <div className="relative mx-auto flex h-16 max-w-[90rem] items-center gap-2 px-4 sm:px-6 lg:gap-3 lg:px-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl p-2 text-slate-300 transition hover:bg-slate-850 hover:text-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="mr-2 shrink-0">{Brand({ small: true })}</div>

            {/* Desktop menus */}
            <nav aria-label="Site" className="hidden items-center gap-1 lg:flex">
              {MenuButton({ id: "subjects", label: "Subjects", active: pathname.startsWith("/subjects") })}
              <div className="relative">
                {MenuButton({ id: "library", label: "Library", active: inLibrary })}
                <AnimatePresence>{menu === "library" && ListPanel("library", LIBRARY_NAV)}</AnimatePresence>
              </div>
              <div className="relative">
                {MenuButton({ id: "more", label: "More", active: inMore })}
                <AnimatePresence>{menu === "more" && ListPanel("more", MORE_LINKS)}</AnimatePresence>
              </div>
            </nav>

            <GlobalSearch inputRef={searchRef} className="ml-auto hidden w-full max-w-sm xl:block" />

            <div className="ml-auto flex items-center gap-2 xl:ml-0">
              <Link
                href="/"
                aria-label="Home"
                title="Home"
                aria-current={pathname === "/" ? "page" : undefined}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition hover:text-primary ${
                  pathname === "/" ? "border-primary/40 bg-soft text-primary" : "border-line bg-surface text-slate-300"
                }`}
              >
                <Home className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setMobileSearch(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-slate-300 transition hover:text-primary xl:hidden"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
              <Link
                href="/subscription"
                className="hidden items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/15 dark:text-emerald-400 2xl:flex"
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

            {/* Menu panels */}
            <AnimatePresence>{menu === "subjects" && SubjectsPanel()}</AnimatePresence>
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
        className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${dockHidden && !mobileMenuOpen ? "translate-y-full" : ""}`}
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
        className={`pointer-events-none fixed bottom-4 right-0 z-40 hidden justify-center px-6 transition-[transform,opacity] duration-300 ease-out lg:flex left-0 ${dockHidden ? "translate-y-[140%] opacity-0" : ""}`}
      >
        <nav aria-label="Main" onFocusCapture={() => setDockHidden(false)} className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-surface/90 p-1.5 shadow-lift backdrop-blur-xl">
          {PRIMARY_NAV.map((n) => {
            const active = isActive(n.href);
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
