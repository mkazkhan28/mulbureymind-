"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BDS_SUBJECTS,
  BDS_YEARS,
  BDS_TOPICS
} from "@/lib/bds-content";
import {
  BookOpen,
  ChevronRight,
  Layers,
  FileText,
  Search,
  Sparkles,
  Lock,
  ArrowRight
} from "lucide-react";

export default function SubjectsPage() {
  const [selectedYear, setSelectedYear] = useState("bds-1");
  const [searchQuery, setSearchQuery] = useState("");

  const activeYearObj = BDS_YEARS.find((y) => y.id === selectedYear);

  const filteredSubjects = BDS_SUBJECTS.filter((subject) => {
    const matchesYear = subject.yearId === selectedYear;
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const subjectThemes: Record<string, { gradient: string; border: string; badge: string; text: string }> = {
    anat: {
      gradient: "from-amber-500/15 via-[#0e1628] to-[#090d18]",
      border: "border-amber-500/30 hover:border-amber-400",
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      text: "text-amber-400"
    },
    phys: {
      gradient: "from-rose-500/15 via-[#0e1628] to-[#090d18]",
      border: "border-rose-500/30 hover:border-rose-400",
      badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      text: "text-rose-400"
    },
    "oral-bio": {
      gradient: "from-cyan-500/15 via-[#0e1628] to-[#090d18]",
      border: "border-cyan-500/30 hover:border-cyan-400",
      badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      text: "text-cyan-400"
    },
    biochem: {
      gradient: "from-violet-500/15 via-[#0e1628] to-[#090d18]",
      border: "border-violet-500/30 hover:border-violet-400",
      badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
      text: "text-violet-400"
    },
    pharm: {
      gradient: "from-emerald-500/15 via-[#0e1628] to-[#090d18]",
      border: "border-emerald-500/30 hover:border-emerald-400",
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      text: "text-emerald-400"
    },
    path: {
      gradient: "from-blue-500/15 via-[#0e1628] to-[#090d18]",
      border: "border-blue-500/30 hover:border-blue-400",
      badge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      text: "text-sky-400"
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>DUHS BDS 1st Year Modular Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Browse DUHS 1st Year Subjects & Modules
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            6 core modules customized for Dow University dental students (DIKIOHS, DDC & DIDC) with chapter breakdowns, BCQs, and flashcards.
          </p>
        </div>

        {/* Academic Year Tabs */}
        <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-2">
          {BDS_YEARS.map((year) => {
            const isSelected = selectedYear === year.id;
            return (
              <button
                key={year.id}
                onClick={() => setSelectedYear(year.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{year.name}</span>
                {year.isActive ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-medium px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Pending</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* If selected year is Pending, show stylish pending notice */}
        {!activeYearObj?.isActive ? (
          <div className="bg-[#0e1628]/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 animate-fadeIn shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                Curriculum Module Pending
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                {activeYearObj?.name} Content In Progress
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                {activeYearObj?.description} Our academic team is currently curating past papers and textbook rationales for this year.
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-300 text-left space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Currently Active & Unrestricted:</span>
              </div>
              <p className="text-slate-400">
                <strong className="text-white">BDS 1st Year</strong> is 100% active right now with 6 comprehensive core subjects: Anatomy, Physiology, Oral Biology, Biochemistry, Pharmacology, and Pathology.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedYear("bds-1");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition shadow-lg shadow-indigo-600/30 inline-flex items-center gap-2"
            >
              <span>Switch to BDS 1st Year (Active)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by subject name or code (e.g. Oral Biology)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-800 bg-[#0e1628]/90 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 shadow-sm"
                />
              </div>
            </div>

            {/* Subjects Grid */}
            {filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map((subj) => {
                  const subjectTopics = BDS_TOPICS.filter((t) => t.subjectId === subj.id);
                  const theme = subjectThemes[subj.id] || {
                    gradient: "from-indigo-500/15 via-[#0e1628] to-[#090d18]",
                    border: "border-slate-800 hover:border-indigo-500",
                    badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
                    text: "text-indigo-400"
                  };

                  return (
                    <div
                      key={subj.id}
                      className={`rounded-2xl border p-6 bg-gradient-to-br ${theme.gradient} ${theme.border} shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between`}
                    >
                      <div className="space-y-4">
                        {/* Top Row: Icon, Code & Title */}
                        <div className="flex items-start gap-3">
                          <span className="text-3xl p-2 bg-slate-900/80 border border-slate-700/80 rounded-xl shrink-0 shadow">
                            {subj.icon}
                          </span>
                          <div>
                            <span className={`text-[10px] font-bold tracking-wider uppercase ${theme.text}`}>
                              {subj.code}
                            </span>
                            <h2 className="text-lg font-bold text-white leading-snug">
                              {subj.name}
                            </h2>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {subj.description}
                        </p>

                        {/* High-yield topics pill list */}
                        <div>
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            High-Yield Topics:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {subjectTopics.map((top) => (
                              <Link
                                key={top.id}
                                href={`/subjects/${subj.slug}/${top.slug}`}
                                className="text-[11px] px-2 py-0.5 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-700/80 rounded-md text-slate-300 transition flex items-center gap-1 font-medium"
                              >
                                <span>{top.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                          <div className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg">
                            <div className="text-sm font-bold text-white">{subj.mcqCount}+</div>
                            <div className="text-[10px] text-slate-400">BCQs</div>
                          </div>
                          <div className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg">
                            <div className={`text-sm font-bold ${theme.text}`}>{subj.flashcardCount}</div>
                            <div className="text-[10px] text-slate-400">Cards</div>
                          </div>
                          <div className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg">
                            <div className="text-sm font-bold text-white">{subj.pastPapersCount} Yrs</div>
                            <div className="text-[10px] text-slate-400">Papers</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/practice?subject=${subj.id}`}
                            className="px-2.5 py-1 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg transition flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3 text-cyan-400" />
                            <span>Quiz</span>
                          </Link>
                          <Link
                            href={`/flashcards?subject=${subj.id}`}
                            className="px-2.5 py-1 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg transition flex items-center gap-1"
                          >
                            <Layers className="w-3 h-3 text-rose-400" />
                            <span>Cards</span>
                          </Link>
                        </div>

                        <Link
                          href={`/subjects/${subj.slug}`}
                          className={`px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 ${theme.text} rounded-lg border border-slate-700 transition flex items-center gap-1 group`}
                        >
                          <span>Explore</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#0e1628]/90 rounded-2xl border border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white">
                  No matching subjects found
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Try searching for another subject like Anatomy, Physiology, Oral Biology, Biochemistry, Pharmacology, or Pathology.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition shadow-md"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
