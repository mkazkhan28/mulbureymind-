"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BDS_MCQS,
  BDS_SUBJECTS
} from "@/lib/bds-content";
import {
  Award,
  Search,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from "lucide-react";

export default function PastPapersPage() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMCQs, setExpandedMCQs] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedMCQs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Only 1st year subjects
  const firstYearSubjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");

  const filteredMCQs = BDS_MCQS.filter((q) => {
    const matchesSubject = selectedSubject === "all" || q.subjectId === selectedSubject;
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.yearSource && q.yearSource.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const getSubjectBadge = (subjectId: string) => {
    switch (subjectId) {
      case "anat":
      case "subj-anat-1":
        return "bg-amber-950/70 text-amber-300 border-amber-700/60";
      case "phys":
      case "subj-physio-1":
        return "bg-rose-950/70 text-rose-300 border-rose-700/60";
      case "oral-bio":
      case "subj-oralbio-1":
        return "bg-cyan-950/70 text-cyan-300 border-cyan-700/60";
      case "biochem":
      case "subj-biochem-1":
        return "bg-purple-950/70 text-purple-300 border-purple-700/60";
      case "pharm":
      case "subj-pharm-1":
        return "bg-emerald-950/70 text-emerald-300 border-emerald-700/60";
      case "path":
      case "subj-path-1":
        return "bg-blue-950/70 text-blue-300 border-blue-700/60";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/60 text-indigo-300 text-xs font-semibold shadow-sm">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>DUHS Karachi BDS 1st Year Archive</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            DUHS Past-Paper BCQs (2015–2024)
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Verified past examination questions and modular assessment tests from Dow University of Health Sciences (DIKIOHS, DDC & DIDC) with textbook-referenced solutions.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-800/80 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search DUHS questions (e.g. lingula, amelogenin, lidocaine, necrosis)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-700/80 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>

            {/* Subject Selector */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full sm:w-64 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-700/80 bg-slate-950/80 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-medium cursor-pointer"
              >
                <option value="all">All 6 Core 1st Year Subjects</option>
                {firstYearSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick College & Module Tags */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 overflow-x-auto text-xs text-slate-400">
            <span className="font-semibold text-slate-300 shrink-0">DUHS Colleges:</span>
            <span className="px-2.5 py-1 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-300 font-medium shrink-0">
              DIKIOHS (Ojha Campus)
            </span>
            <span className="px-2.5 py-1 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-300 font-medium shrink-0">
              DDC (Dow Dental College, DMC)
            </span>
            <span className="px-2.5 py-1 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-300 font-medium shrink-0">
              DIDC (Dow International)
            </span>
            <span className="ml-auto text-slate-400 font-semibold shrink-0">
              Showing <span className="text-white font-bold">{filteredMCQs.length}</span> questions
            </span>
          </div>
        </div>

        {/* MCQs List */}
        <div className="space-y-4">
          {filteredMCQs.length === 0 ? (
            <div className="bg-slate-900/80 backdrop-blur-xl p-12 rounded-3xl border border-slate-800/80 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No questions found matching your filter</h3>
              <p className="text-xs text-slate-400">Try adjusting your search keywords or select "All 6 Core 1st Year Subjects".</p>
            </div>
          ) : (
            filteredMCQs.map((q, idx) => {
              const subj = BDS_SUBJECTS.find((s) => s.id === q.subjectId);
              const isExpanded = !!expandedMCQs[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 shadow-xl transition space-y-4"
                >
                  {/* Top Meta info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-400">#{idx + 1}</span>
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getSubjectBadge(q.subjectId)}`}>
                        {subj?.name}
                      </span>
                      <span className="bg-slate-950/80 border border-slate-800 text-indigo-300 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                        {q.yearSource}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <span>Hide Solution</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Show Solution & Rationale</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Question Stem */}
                  <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctIndex;
                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${
                            isExpanded && isCorrect
                              ? "bg-emerald-950/40 border-emerald-500/70 text-emerald-200 font-semibold ring-1 ring-emerald-500/50"
                              : "bg-slate-950/50 border-slate-800 text-slate-300"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[11px] font-bold ${
                            isExpanded && isCorrect
                              ? "bg-emerald-500 text-slate-950 font-extrabold"
                              : "border border-slate-700 bg-slate-900 text-slate-400"
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-snug">{opt}</span>
                          {isExpanded && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Expanded Textbook Rationale Drawer */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-slate-950/90 rounded-2xl border border-cyan-900/60 text-xs sm:text-sm space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-2 font-bold text-cyan-300">
                        <HelpCircle className="w-4 h-4 text-cyan-400" />
                        <span>Official DUHS Key & Clinical Explanation:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-purple-950/80 backdrop-blur-xl border border-indigo-800/60 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Want to take these under official exam conditions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Launch the DUHS Exam Simulator with real-time countdown timer, instant marking, and modular analytics.
            </p>
          </div>
          <Link
            href="/practice"
            className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 shrink-0"
          >
            <span>Launch Exam Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
