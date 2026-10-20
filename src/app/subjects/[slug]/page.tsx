"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BDS_SUBJECTS,
  BDS_TOPICS,
  BDS_RESOURCES
} from "@/lib/bds-content";
import {
  BookOpen,
  ChevronRight,
  FileText,
  Layers,
  DownloadCloud,
  ArrowLeft,
  Sparkles
} from "lucide-react";

export default function SubjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const subject = BDS_SUBJECTS.find((s) => s.slug === slug);
  if (!subject) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
        <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 text-center max-w-md space-y-4 shadow-2xl">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Subject Not Found</h2>
          <p className="text-xs text-slate-400">The requested DUHS BDS subject could not be located.</p>
          <Link
            href="/subjects"
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-indigo-600/20"
          >
            Back to All Subjects
          </Link>
        </div>
      </div>
    );
  }

  const topics = BDS_TOPICS.filter((t) => t.subjectId === subject.id);
  const resources = BDS_RESOURCES.filter((r) => r.subjectId === subject.id);

  const getSubjectColorStyles = (subjectId: string) => {
    switch (subjectId) {
      case "anat":
      case "subj-anat-1":
        return {
          badge: "bg-amber-950/70 text-amber-300 border-amber-700/60",
          accentText: "text-amber-400",
          glow: "group-hover:border-amber-500/40"
        };
      case "phys":
      case "subj-physio-1":
        return {
          badge: "bg-rose-950/70 text-rose-300 border-rose-700/60",
          accentText: "text-rose-400",
          glow: "group-hover:border-rose-500/40"
        };
      case "oral-bio":
      case "subj-oralbio-1":
        return {
          badge: "bg-cyan-950/70 text-cyan-300 border-cyan-700/60",
          accentText: "text-cyan-400",
          glow: "group-hover:border-cyan-500/40"
        };
      case "biochem":
      case "subj-biochem-1":
        return {
          badge: "bg-purple-950/70 text-purple-300 border-purple-700/60",
          accentText: "text-purple-400",
          glow: "group-hover:border-purple-500/40"
        };
      case "pharm":
      case "subj-pharm-1":
        return {
          badge: "bg-emerald-950/70 text-emerald-300 border-emerald-700/60",
          accentText: "text-emerald-400",
          glow: "group-hover:border-emerald-500/40"
        };
      case "path":
      case "subj-path-1":
        return {
          badge: "bg-blue-950/70 text-blue-300 border-blue-700/60",
          accentText: "text-blue-400",
          glow: "group-hover:border-blue-500/40"
        };
      default:
        return {
          badge: "bg-slate-800 text-slate-300 border-slate-700",
          accentText: "text-indigo-400",
          glow: "group-hover:border-indigo-500/40"
        };
    }
  };

  const style = getSubjectColorStyles(subject.id);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Back Link */}
        <div>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Subjects Directory</span>
          </Link>
        </div>

        {/* Subject Banner Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl p-4 bg-slate-950/80 border border-slate-800 rounded-3xl shadow-inner">
                {subject.icon}
              </span>
              <div>
                <span className={`text-xs font-bold tracking-wider uppercase px-3 py-0.5 rounded-full border ${style.badge}`}>
                  DUHS BDS 1st Year • {subject.code}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
                  {subject.name}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/practice?subject=${subject.id}`}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/25"
              >
                <FileText className="w-4 h-4" />
                <span>Start Practice Quiz</span>
              </Link>
              <Link
                href={`/flashcards?subject=${subject.id}`}
                className="px-5 py-3 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Study Flashcards</span>
              </Link>
            </div>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
            {subject.description}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-slate-800/80">
            <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">DUHS BCQs in Bank</div>
              <div className="text-xl font-extrabold text-white mt-1">{subject.mcqCount}+ Questions</div>
            </div>
            <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Digital Flashcards</div>
              <div className={`text-xl font-extrabold mt-1 ${style.accentText}`}>{subject.flashcardCount} Cards</div>
            </div>
            <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Past Papers Included</div>
              <div className="text-xl font-extrabold text-white mt-1">{subject.pastPapersCount} Years</div>
            </div>
            <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Modular Topics</div>
              <div className="text-xl font-extrabold text-white mt-1">{topics.length} High-Yield Modules</div>
            </div>
          </div>
        </div>

        {/* High-Yield Topics Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Modular Topics Breakdown & Quizzes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select a module to review clinical concepts and launch targeted DUHS practice tests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((top) => (
              <div
                key={top.id}
                className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 sm:p-6 hover:border-slate-700/80 hover:shadow-2xl transition flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition">
                      {top.name}
                    </h3>
                    {top.highYield && (
                      <span className="text-[10px] bg-amber-950/70 text-amber-300 border border-amber-700/60 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>High-Yield</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {top.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {top.mcqCount} BCQs • {top.flashcardCount} Flashcards
                  </span>
                  <Link
                    href={`/practice?subject=${subject.id}`}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                  >
                    <span>Practice Topic</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Downloadable Handouts / Notes */}
        {resources.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              DUHS Academic Notes & Slide Handouts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 flex items-start justify-between gap-4 hover:border-slate-700/80 shadow-xl transition group"
                >
                  <div className="flex items-start gap-3">
                    <span className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-bold text-xs uppercase">
                      {res.type}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-white group-hover:text-cyan-300 transition leading-snug">
                        {res.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {res.fileSize} • {res.author}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/resources"
                    className="text-xs font-semibold px-3 py-1.5 bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg transition shrink-0 flex items-center gap-1"
                  >
                    <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Access</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
