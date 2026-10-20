"use client";

import React from "react";
import Link from "next/link";
import {
  BDS_SUBJECTS,
  BDS_RESOURCES
} from "@/lib/bds-content";
import {
  Award,
  Layers,
  FileText,
  Clock,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  Flame
} from "lucide-react";

export default function StudentDashboardPage() {
  const firstYearSubjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");

  // Mock student state
  const student = {
    name: "Dr. Ayesha Khan",
    college: "Dr. Ishrat-ul-Ebad Khan Institute of Oral Health Sciences (DIKIOHS), DUHS",
    year: "DUHS BDS 1st Year",
    membership: {
      planName: "Full Academic Pass",
      status: "Active",
      expiresAt: "October 19, 2027",
      isPremium: true
    },
    stats: {
      quizzesAttempted: 8,
      totalMCQsAnswered: 142,
      averageScore: 78,
      flashcardsMastered: 85,
      savedQuestions: 14
    },
    recentQuizzes: [
      {
        id: "q-1",
        title: "Anatomy: Cranial Nerves (CN V & VII) & Foramina",
        date: "Today, 4:15 PM",
        score: "9 / 10",
        percentage: 90,
        passed: true
      },
      {
        id: "q-2",
        title: "Oral Biology: Amelogenesis & Dentin Sensitivity",
        date: "Yesterday",
        score: "8 / 10",
        percentage: 80,
        passed: true
      },
      {
        id: "q-3",
        title: "Physiology: Action Potentials & Cardiac Cycle",
        date: "3 days ago",
        score: "7 / 10",
        percentage: 70,
        passed: true
      }
    ]
  };

  const getSubjectColorStyles = (subjectId: string) => {
    switch (subjectId) {
      case "anat":
      case "subj-anat-1":
        return {
          badge: "bg-amber-950/70 text-amber-300 border-amber-700/60",
          glow: "group-hover:border-amber-500/40"
        };
      case "phys":
      case "subj-physio-1":
        return {
          badge: "bg-rose-950/70 text-rose-300 border-rose-700/60",
          glow: "group-hover:border-rose-500/40"
        };
      case "oral-bio":
      case "subj-oralbio-1":
        return {
          badge: "bg-cyan-950/70 text-cyan-300 border-cyan-700/60",
          glow: "group-hover:border-cyan-500/40"
        };
      case "biochem":
      case "subj-biochem-1":
        return {
          badge: "bg-purple-950/70 text-purple-300 border-purple-700/60",
          glow: "group-hover:border-purple-500/40"
        };
      case "pharm":
      case "subj-pharm-1":
        return {
          badge: "bg-emerald-950/70 text-emerald-300 border-emerald-700/60",
          glow: "group-hover:border-emerald-500/40"
        };
      case "path":
      case "subj-path-1":
        return {
          badge: "bg-blue-950/70 text-blue-300 border-blue-700/60",
          glow: "group-hover:border-blue-500/40"
        };
      default:
        return {
          badge: "bg-slate-800 text-slate-300 border-slate-700",
          glow: "group-hover:border-indigo-500/40"
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Welcome Header */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-600/30 shrink-0">
              {student.name.charAt(4) || "A"}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {student.name}
                </h1>
                <span className="text-[10px] bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 font-bold px-2.5 py-0.5 rounded-full">
                  {student.year}
                </span>
                <span className="text-[10px] bg-amber-950/70 text-amber-300 border border-amber-800/60 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>5-Day Streak</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {student.college}
              </p>
            </div>
          </div>

          {/* Membership Badge Card */}
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-3 w-full md:w-auto shadow-inner">
            <div className="p-2.5 bg-indigo-950/80 text-indigo-400 border border-indigo-700/60 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white">{student.membership.planName}</span>
                <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                  {student.membership.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Valid until: {student.membership.expiresAt}
              </div>
            </div>
          </div>
        </div>

        {/* Study Analytics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>BCQs Practiced</span>
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {student.stats.totalMCQsAnswered}
            </div>
            <div className="text-[11px] text-cyan-400 font-medium">
              Across 8 quiz attempts
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Average Score</span>
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {student.stats.averageScore}%
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Passing threshold: ≥ 60%
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Cards Mastered</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">
              {student.stats.flashcardsMastered}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              In Spaced Active Recall
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl space-y-1">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Saved Questions</span>
              <Bookmark className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
              {student.stats.savedQuestions}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Bookmarked for revision
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">
              DUHS BDS 1st Year Core Subjects (6)
            </h2>
            <Link
              href="/subjects"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              <span>View All 6</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {firstYearSubjects.map((subj) => {
              const style = getSubjectColorStyles(subj.id);
              return (
                <div
                  key={subj.id}
                  className={`bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group ${style.glow}`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">{subj.icon}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                        {subj.code}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition leading-snug">
                      {subj.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {subj.mcqCount}+ BCQs • {subj.flashcardCount} Cards
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <Link
                      href={`/practice?subject=${subj.id}`}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Quick Quiz
                    </Link>
                    <Link
                      href={`/subjects/${subj.slug}`}
                      className="text-xs font-medium text-slate-400 hover:text-white transition flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-Column: Recent Quizzes & Recent Study Handouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Quiz Attempts */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Recent Quiz Attempts
              </h2>
              <Link
                href="/practice"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                New Quiz +
              </Link>
            </div>

            <div className="space-y-3">
              {student.recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-xs sm:text-sm text-white leading-snug">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{quiz.date}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-white">
                      {quiz.score}
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                      {quiz.percentage}% Passed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Downloadable Notes & Lecture Slides */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">
                DUHS 1st Year Study Handouts
              </h2>
              <Link
                href="/resources"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                View Library
              </Link>
            </div>

            <div className="space-y-3">
              {BDS_RESOURCES.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-xl flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {res.type}
                      </span>
                      {res.isPremium && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                          PRO
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-xs text-white group-hover:text-cyan-300 transition leading-tight">
                      {res.title}
                    </h3>
                    <div className="text-[10px] text-slate-400">
                      {res.fileSize} • {res.author}
                    </div>
                  </div>

                  <Link
                    href={`/api/resources/${res.id}/download`}
                    className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 border border-slate-800 rounded-lg transition shrink-0"
                    title="Download"
                  >
                    <FileText className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
