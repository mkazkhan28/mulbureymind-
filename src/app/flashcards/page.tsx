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
import { SubjectArt } from "@/components/Illustrations";
import PageHeader from "@/components/PageHeader";

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
          badge: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
          accent: "text-amber-800 dark:text-amber-400",
          glow: "group-hover:border-amber-500/40"
        };
      case "phys":
      case "subj-physio-1":
        return {
          badge: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30",
          accent: "text-rose-600 dark:text-rose-400",
          glow: "group-hover:border-rose-500/40"
        };
      case "oral-bio":
      case "subj-oralbio-1":
        return {
          badge: "bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30",
          accent: "text-cyan-800 dark:text-cyan-400",
          glow: "group-hover:border-cyan-500/40"
        };
      case "biochem":
      case "subj-biochem-1":
        return {
          badge: "bg-accent-500/15 text-accent-800 dark:text-accent-300 border-accent-500/30",
          accent: "text-accent-600 dark:text-accent-400",
          glow: "group-hover:border-accent-500/40"
        };
      case "pharm":
      case "subj-pharm-1":
        return {
          badge: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
          accent: "text-emerald-800 dark:text-emerald-400",
          glow: "group-hover:border-emerald-500/40"
        };
      case "path":
      case "subj-path-1":
        return {
          badge: "bg-soft text-primary border-blue-500/30",
          accent: "text-primary",
          glow: "group-hover:border-blue-500/40"
        };
      default:
        return {
          badge: "bg-slate-800 text-slate-300 border-slate-700",
          accent: "text-primary",
          glow: "group-hover:border-indigo-500/40"
        };
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Header */}
        <PageHeader
          eyebrow="Flashcards"
          title="Flashcard library"
          lead="Recall it, flip it, remember it."
          intro="Active-recall decks for cranial nerves, oral histology, dental therapeutics and metabolic enzymes. Pick a deck to start."
        />

        {/* Filter bar */}
        <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-line flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search flashcard decks (e.g. Hunter-Schreger, Cranial Nerves, Lidocaine)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-700/80 bg-slate-950/80 text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-700/80 bg-slate-950/80 text-ink focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-medium cursor-pointer"
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
                className={`bg-surface rounded-2xl border border-line p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition duration-300 flex flex-col justify-between group ${style.glow}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
                      <SubjectArt id={subject?.id ?? "oral-bio"} className="h-9 w-9" />
                    </span>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-950/90 text-slate-300 border border-slate-800">
                      {deck.cardCount} Cards
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                      {subject?.name}
                    </span>
                    <h2 className="text-lg font-bold text-ink leading-snug mt-2.5 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition">
                      {deck.title}
                    </h2>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {deck.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-line flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Spaced Recall
                  </span>
                  <Link
                    href={`/flashcards/${deck.id}`}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary rounded-xl text-xs font-bold transition flex items-center gap-1"
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
