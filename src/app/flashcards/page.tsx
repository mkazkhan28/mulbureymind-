"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BDS_FLASHCARD_DECKS,
  BDS_SUBJECTS
} from "@/lib/bds-content";
import {
  ChevronRight,
  Search,
  Zap
} from "lucide-react";

export default function FlashcardsLibraryPage() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const firstYearSubjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");

  const filteredDecks = BDS_FLASHCARD_DECKS.filter((deck) => {
    const matchesSubject = selectedSubject === "all" || deck.subjectId === selectedSubject;
    const matchesSearch =
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const getSubjectColorStyles = (subjectId: string) => {
    switch (subjectId) {
      case "anat":
      case "subj-anat-1":
        return {
          badge: "bg-amber-950/70 text-amber-300 border-amber-700/60",
          accent: "text-amber-400",
          glow: "group-hover:border-amber-500/40"
        };
      case "phys":
      case "subj-physio-1":
        return {
          badge: "bg-rose-950/70 text-rose-300 border-rose-700/60",
          accent: "text-rose-400",
          glow: "group-hover:border-rose-500/40"
        };
      case "oral-bio":
      case "subj-oralbio-1":
        return {
          badge: "bg-cyan-950/70 text-cyan-300 border-cyan-700/60",
          accent: "text-cyan-400",
          glow: "group-hover:border-cyan-500/40"
        };
      case "biochem":
      case "subj-biochem-1":
        return {
          badge: "bg-purple-950/70 text-purple-300 border-purple-700/60",
          accent: "text-purple-400",
          glow: "group-hover:border-purple-500/40"
        };
      case "pharm":
      case "subj-pharm-1":
        return {
          badge: "bg-emerald-950/70 text-emerald-300 border-emerald-700/60",
          accent: "text-emerald-400",
          glow: "group-hover:border-emerald-500/40"
        };
      case "path":
      case "subj-path-1":
        return {
          badge: "bg-blue-950/70 text-blue-300 border-blue-700/60",
          accent: "text-blue-400",
          glow: "group-hover:border-blue-500/40"
        };
      default:
        return {
          badge: "bg-slate-800 text-slate-300 border-slate-700",
          accent: "text-indigo-400",
          glow: "group-hover:border-indigo-500/40"
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold shadow-sm">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>DUHS Active-Recall Flashcards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Flashcard Library for DUHS BDS 1st Year
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Master high-yield cranial nerves, oral histological structures, dental therapeutics, and metabolic enzymes through active spaced repetition.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search flashcard decks (e.g. Hunter-Schreger, Cranial Nerves, Lidocaine)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-700/80 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-700/80 bg-slate-950/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-medium cursor-pointer"
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

        {/* Decks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map((deck) => {
            const subject = BDS_SUBJECTS.find((s) => s.id === deck.subjectId);
            const style = getSubjectColorStyles(deck.subjectId);

            return (
              <div
                key={deck.id}
                className={`bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group ${style.glow}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
                      {subject?.icon || "🦷"}
                    </span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-950/90 text-slate-300 border border-slate-800">
                      {deck.cardCount} Cards
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                      {subject?.name}
                    </span>
                    <h2 className="text-lg font-bold text-white leading-snug mt-2.5 group-hover:text-cyan-300 transition">
                      {deck.title}
                    </h2>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {deck.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Spaced Recall
                  </span>
                  <Link
                    href={`/flashcards/${deck.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-indigo-600/25"
                  >
                    <span>Study Deck</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
