"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Layers,
  FileText,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Search,
  Home,
  Award,
  Zap,
  Flame,
  LayoutDashboard,
  CreditCard,
  Settings,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  GraduationCap,
  Heart,
  Sun,
  Moon
} from "lucide-react";
import { BDS_SUBJECTS } from "@/lib/bds-content";
import { useTheme } from "@/context/ThemeContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Responsive state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [subjectsExpanded, setSubjectsExpanded] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const firstYearSubjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");

  // Subject chip color palette for the 6 DUHS subjects
  const subjectThemes: Record<string, { text: string; bg: string; border: string; icon: string }> = {
    anat: {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: "💀"
    },
    phys: {
      text: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      icon: "🫀"
    },
    "oral-bio": {
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      icon: "🦷"
    },
    biochem: {
      text: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      icon: "🧬"
    },
    pharm: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: "💊"
    },
    path: {
      text: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
      icon: "🔬"
    }
  };

  // Helper for active link styles
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  // Filtered search results for Ctrl+K dialog
  const searchResults = [
    ...firstYearSubjects.map((s) => ({
      title: s.name,
      subtitle: `${s.code} • 1st Year Core Module`,
      href: `/subjects/${s.slug}`,
      category: "Subjects",
      icon: s.icon
    })),
    {
      title: "Modular BCQ Practice Simulator",
      subtitle: "Timed test, tutor mode, and mock annual exams",
      href: "/practice",
      category: "Exam Center",
      icon: "⚡"
    },
    {
      title: "DUHS Past Papers (2015–2024)",
      subtitle: "DIKIOHS, DDC & DIDC annual questions with solutions",
      href: "/past-papers",
      category: "Past Papers",
      icon: "📜"
    },
    {
      title: "3D Active Recall Flashcards",
      subtitle: "Oral histology, cranial nerves, dental pharmacology",
      href: "/flashcards",
      category: "Flashcards",
      icon: "🗂️"
    },
    {
      title: "Lecture Slides & Table Viva Notes",
      subtitle: "High-yield summary PDFs and slide atlases",
      href: "/resources",
      category: "Resources",
      icon: "📑"
    },
    {
      title: "Student Pass & Membership Plans",
      subtitle: "Free student starter & full session passes",
      href: "/pricing",
      category: "Passes",
      icon: "💎"
    }
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* ============================================================== */}
      {/* 1. LEFT SIDEBAR (Desktop permanent / Collapsible)              */}
      {/* ============================================================== */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 bg-[#090e1a]/95 backdrop-blur-xl border-r border-slate-800/80 sticky top-0 h-screen transition-all duration-300 z-40 select-none ${
          sidebarCollapsed ? "w-20" : "w-64 xl:w-72"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-500/30">
              <img src="/logo-icon.svg" alt="Mulberry Mind" className="w-8 h-8 object-contain" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-base text-white tracking-tight leading-tight truncate">
                  Mulberry Mind
                </span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  DUHS 1st Year Edition
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse / Expand Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Search Shortcut Button */}
        {!sidebarCollapsed && (
          <div className="px-4 pt-3 pb-1">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 text-left text-xs text-slate-400 flex items-center justify-between group transition shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 transition" />
                <span className="truncate">Search DUHS Hub...</span>
              </div>
              <span className="text-[10px] bg-slate-800/90 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                Ctrl K
              </span>
            </button>
          </div>
        )}

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {/* Section 1: Core Academics */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Core Academics
              </div>
            )}

            {/* Home / Overview */}
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                isActive("/") && pathname === "/"
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="Home"
            >
              <Home className="w-4 h-4 text-indigo-400 shrink-0" />
              {!sidebarCollapsed && <span>Home & Showcase</span>}
            </Link>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                isActive("/dashboard")
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400 shrink-0" />
              {!sidebarCollapsed && <span>Student Dashboard</span>}
            </Link>

            {/* Subjects with Expandable Accordion */}
            <div>
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer select-none group ${
                  isActive("/subjects")
                    ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
                onClick={() => setSubjectsExpanded(!subjectsExpanded)}
                title="Subjects (6)"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="flex items-center gap-1.5">
                      <span>DUHS 1st Year (6)</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        6
                      </span>
                    </span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      subjectsExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {/* Submenu of all 6 Subjects */}
              {subjectsExpanded && !sidebarCollapsed && (
                <div className="pl-6 pr-1 pt-1.5 pb-1 space-y-1">
                  {firstYearSubjects.map((s) => {
                    const theme = subjectThemes[s.id] || {
                      text: "text-slate-300",
                      bg: "bg-slate-800/50",
                      border: "border-slate-700",
                      icon: "📚"
                    };
                    const isSubjActive = pathname.startsWith(`/subjects/${s.slug}`);
                    return (
                      <Link
                        key={s.id}
                        href={`/subjects/${s.slug}`}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition ${
                          isSubjActive
                            ? `${theme.bg} ${theme.text} font-bold border ${theme.border}`
                            : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{s.icon}</span>
                          <span className="truncate">{s.name}</span>
                        </div>
                        <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${theme.bg} ${theme.text}`}>
                          {s.code}
                        </span>
                      </Link>
                    );
                  })}
                  <Link
                    href="/subjects"
                    className="block text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold px-2.5 py-1 transition"
                  >
                    View All Directory &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Exam & Practice Center */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Exam & Active Recall
              </div>
            )}

            {/* BCQ Exam Simulator */}
            <Link
              href="/practice"
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                isActive("/practice")
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="BCQ Simulator"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                {!sidebarCollapsed && <span>BCQ Simulator</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  LIVE
                </span>
              )}
            </Link>

            {/* DUHS Past Papers */}
            <Link
              href="/past-papers"
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                isActive("/past-papers")
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="DUHS Past Papers"
            >
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                {!sidebarCollapsed && <span>DUHS Past Papers</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[10px] text-slate-400 font-mono">2015–24</span>
              )}
            </Link>

            {/* 3D Flashcards */}
            <Link
              href="/flashcards"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                isActive("/flashcards")
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="Flashcards"
            >
              <Layers className="w-4 h-4 text-rose-400 shrink-0" />
              {!sidebarCollapsed && <span>3D Flashcards</span>}
            </Link>

            {/* Lecture Notes & Slides */}
            <Link
              href="/resources"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                isActive("/resources")
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="Notes & Slides"
            >
              <FileText className="w-4 h-4 text-sky-400 shrink-0" />
              {!sidebarCollapsed && <span>Notes & Slide Atlases</span>}
            </Link>
          </div>

          {/* Section 3: Student Hub & Settings */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Student Center
              </div>
            )}

            <Link
              href="/pricing"
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                isActive("/pricing")
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="Pricing & Passes"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-violet-400 shrink-0" />
                {!sidebarCollapsed && <span>Plans & Passes</span>}
              </div>
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  PKR 0
                </span>
              )}
            </Link>

            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                isActive("/admin")
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="Admin Console"
            >
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              {!sidebarCollapsed && <span>Admin Console</span>}
            </Link>

            <Link
              href="/contact"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                isActive("/contact")
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
              title="Help & Support"
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              {!sidebarCollapsed && <span>Help & Support</span>}
            </Link>
          </div>
        </div>

        {/* Theme Mode Toggle (Dark / Light) */}
        <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/40">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2 text-xs">
                {theme === "dark" ? (
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="font-semibold text-slate-300">
                  {theme === "dark" ? "Dark Theme" : "Light Theme"}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle Dark and Light Theme"
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  theme === "dark" ? "bg-indigo-600" : "bg-slate-300"
                }`}
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    theme === "dark" ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle Dark and Light Theme"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition shadow-sm"
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Student Profile Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between gap-3">
              <Link href="/profile" className="flex items-center gap-2.5 overflow-hidden group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow">
                  A
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate group-hover:text-indigo-400 transition">
                    Dr. Ayesha Khan
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    DIKIOHS • 1st Year
                  </span>
                </div>
              </Link>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 shrink-0" title="5-Day Study Streak">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>5d</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link href="/profile" className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow">
                A
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MOBILE TOP NAVIGATION & SLIDE-OUT DRAWER                   */}
      {/* ============================================================== */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#090e1a]/95 backdrop-blur-xl border-b border-slate-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-500/30">
              <img src="/logo-icon.svg" alt="MM" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-white leading-tight">
                Mulberry Mind
              </span>
              <span className="text-[9px] font-bold text-indigo-400 uppercase">
                DUHS Karachi
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white"
            title="Search"
          >
            <Search className="w-4 h-4 text-indigo-400" />
          </button>
          <Link
            href="/practice"
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Quiz</span>
          </Link>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-full bg-[#090e1a] border-r border-slate-800 flex flex-col h-full shadow-2xl z-10 overflow-y-auto p-4 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-500/30">
                  <img src="/logo-icon.svg" alt="MM" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Mulberry Mind</div>
                  <div className="text-[10px] text-indigo-400 font-semibold">DUHS 1st Year Portal</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <div className="px-2 text-[10px] uppercase font-bold text-slate-400">Core Academics</div>
                <Link href="/" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-200">
                  <Home className="w-4 h-4 text-indigo-400" />
                  <span>Home</span>
                </Link>
                <Link href="/dashboard" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-200">
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  <span>Student Dashboard</span>
                </Link>
                <Link href="/subjects" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-200">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>All 6 DUHS Subjects</span>
                </Link>
              </div>

              {/* 6 Subjects Grid */}
              <div className="pl-4 pr-1 py-1 space-y-1">
                {firstYearSubjects.map((s) => (
                  <Link
                    key={s.id}
                    href={`/subjects/${s.slug}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300"
                  >
                    <span className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <span>{s.name}</span>
                    </span>
                    <span className="text-[9px] font-mono text-indigo-400">{s.code}</span>
                  </Link>
                ))}
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800">
                <div className="px-2 text-[10px] uppercase font-bold text-slate-400">Exam Center</div>
                <Link href="/practice" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-200">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>BCQ Practice Simulator</span>
                </Link>
                <Link href="/past-papers" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-200">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>DUHS Past Papers</span>
                </Link>
                <Link href="/flashcards" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-200">
                  <Layers className="w-4 h-4 text-rose-400" />
                  <span>3D Flashcards</span>
                </Link>
                <Link href="/resources" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-200">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Notes & Lecture Slides</span>
                </Link>
              </div>

              {/* Mobile Drawer Theme Toggle */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold">
                    {theme === "dark" ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    <span>Theme: {theme === "dark" ? "Dark Obsidian" : "Light Mode"}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Toggle
                  </span>
                </button>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800">
                <div className="px-2 text-[10px] uppercase font-bold text-slate-400">Account</div>
                <Link href="/pricing" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-200">
                  <CreditCard className="w-4 h-4 text-violet-400" />
                  <span>Membership Plans</span>
                </Link>
                <Link href="/profile" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-200">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>Student Profile</span>
                </Link>
                <Link href="/admin" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 text-slate-200">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Admin Console</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MAIN CONTENT COLUMN WITH TOP APP BAR & ATMOSPHERIC GLOW     */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Desktop App Bar */}
        <header className="hidden lg:flex items-center justify-between h-16 px-6 lg:px-8 bg-[#080d1a]/85 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30">
          {/* Breadcrumbs / Section Title */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="text-slate-400">DUHS Modular Portal</span>
              <span className="text-slate-600">/</span>
              <span className="text-white capitalize">
                {pathname === "/" ? "Home & Showcase" : pathname.split("/")[1]?.replace(/-/g, " ")}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              DIKIOHS • DDC • DIDC
            </span>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme Mode"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <button
              onClick={() => setSearchModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white flex items-center gap-2 transition"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quick Search...</span>
              <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                Ctrl K
              </span>
            </button>

            <Link
              href="/practice"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5 hover:shadow-lg"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Launch BCQ Simulator</span>
            </Link>

            <Link
              href="/login"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition"
            >
              Log in
            </Link>
          </div>
        </header>

        {/* Ambient Glow Gradient Mesh in Background */}
        <div className="relative flex-1 flex flex-col">
          <div className="fixed top-12 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
          <div className="fixed top-1/2 right-10 w-[450px] h-[450px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed bottom-10 left-10 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Page Body Content */}
          <main className="flex-1 w-full">
            {children}
          </main>

          {/* Sleek App Footer */}
          <footer className="mt-auto bg-[#070b14] text-slate-400 py-12 px-6 lg:px-8 border-t border-slate-800/80">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
              <div className="space-y-3 md:col-span-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-500/30">
                    <img src="/logo-icon.svg" alt="MM" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="font-extrabold text-sm text-white">Mulberry Mind</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  High-yield modular study portal customized specifically for Dow University of Health Sciences (DUHS Karachi) BDS 1st Year dental surgeons.
                </p>
                <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DIKIOHS • DDC • DIDC Syllabus 2024–2025</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">
                  Core 1st Year (6)
                </h4>
                <ul className="space-y-1.5">
                  <li><Link href="/subjects/anatomy" className="hover:text-indigo-400 transition">General Anatomy & Histology</Link></li>
                  <li><Link href="/subjects/physiology" className="hover:text-indigo-400 transition">Human Physiology</Link></li>
                  <li><Link href="/subjects/oral-biology" className="hover:text-indigo-400 transition">Oral Biology & Tooth Morphology</Link></li>
                  <li><Link href="/subjects/biochemistry" className="hover:text-indigo-400 transition">Biochemistry & Genetics</Link></li>
                  <li><Link href="/subjects/pharmacology" className="hover:text-indigo-400 transition">Pharmacology & Therapeutics</Link></li>
                  <li><Link href="/subjects/general-pathology" className="hover:text-indigo-400 transition">General Pathology</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">
                  Exam Resources
                </h4>
                <ul className="space-y-1.5">
                  <li><Link href="/practice" className="hover:text-indigo-400 transition">Modular BCQ Simulator</Link></li>
                  <li><Link href="/past-papers" className="hover:text-indigo-400 transition">DUHS Past Papers (2015–2024)</Link></li>
                  <li><Link href="/flashcards" className="hover:text-indigo-400 transition">3D Interactive Flashcards</Link></li>
                  <li><Link href="/resources" className="hover:text-indigo-400 transition">Slide Atlases & Handouts</Link></li>
                  <li><Link href="/pricing" className="hover:text-indigo-400 transition">Membership & Student Passes</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3 text-[11px]">
                  Support & Contact
                </h4>
                <ul className="space-y-1.5">
                  <li><Link href="/contact" className="hover:text-indigo-400 transition">WhatsApp Student Helpline</Link></li>
                  <li><Link href="/about" className="hover:text-indigo-400 transition">About DUHS Platform</Link></li>
                  <li><Link href="/privacy" className="hover:text-indigo-400 transition">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-indigo-400 transition">Terms of Service</Link></li>
                  <li className="text-amber-400 pt-1">BDS 2nd, 3rd, Final Year (Pending)</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <p>© {new Date().getFullYear()} Mulberry Mind. Custom-crafted for Dow University Dental Students.</p>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                <span>for future dental surgeons</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SPOTLIGHT SEARCH OVERLAY MODAL (Ctrl + K)                   */}
      {/* ============================================================== */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden space-y-3">
            <div className="p-3 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-4 h-4 text-indigo-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search subjects, BCQs, past papers, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                ESC
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setSearchModalOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.category}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No matching DUHS resources found for &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>

            <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Quick Jump to DUHS 1st Year modules</span>
              <span>Use arrow keys or click to navigate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
