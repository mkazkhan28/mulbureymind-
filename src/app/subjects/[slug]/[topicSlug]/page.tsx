"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BDS_SUBJECTS,
  BDS_TOPICS,
  BDS_MCQS
} from "@/lib/bds-content";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const topicSlug = params?.topicSlug as string;

  const subject = BDS_SUBJECTS.find((s) => s.slug === slug);
  const topic = BDS_TOPICS.find((t) => t.slug === topicSlug);

  // Expanded explanations state for past-paper questions list
  const [expandedMCQ, setExpandedMCQ] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedMCQ((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!subject || !topic) {
    return (
      <div className="min-h-screen bg-[#0a1424] text-slate-200 flex items-center justify-center p-4">
        <div className="bg-[#132238] p-8 rounded-2xl border border-[#1e3452] text-center max-w-md space-y-4">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">Topic Not Found</h2>
          <p className="text-xs text-slate-400">The requested topic could not be found.</p>
          <Link
            href="/subjects"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-950/50 transition"
          >
            Back to Subjects
          </Link>
        </div>
      </div>
    );
  }

  const topicMCQs = BDS_MCQS.filter((q) => q.topicId === topic.id);

  return (
    <div className="min-h-screen bg-[#0a1424] text-slate-200 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/subjects" className="hover:text-white transition">
            Subjects
          </Link>
          <span>/</span>
          <Link href={`/subjects/${subject.slug}`} className="hover:text-white transition">
            {subject.name}
          </Link>
          <span>/</span>
          <span className="font-semibold text-white">{topic.name}</span>
        </div>

        {/* Topic Header Card */}
        <div className="bg-[#132238] rounded-3xl border border-[#1e3452] p-6 sm:p-8 shadow-sm space-y-4 text-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  {subject.name}
                </span>
                {topic.highYield && (
                  <span className="text-[10px] bg-amber-950/60 border border-amber-800/80 text-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>High-Yield Dental Exam Topic</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {topic.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/practice?topic=${topic.id}`}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-blue-950/50"
              >
                <FileText className="w-4 h-4" />
                <span>Practice MCQs</span>
              </Link>
              <Link
                href={`/flashcards?subject=${subject.id}`}
                className="px-4 py-2.5 bg-[#0c182a] hover:bg-[#182c48] text-slate-200 border border-[#1e3452] rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4" />
                <span>Flashcards</span>
              </Link>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {topic.description}
          </p>

          <div className="flex items-center gap-6 pt-3 border-t border-[#1e3452] text-xs text-slate-400">
            <span>
              <strong className="text-white">{topic.mcqCount}</strong> Questions in database
            </span>
            <span>
              <strong className="text-white">{topic.flashcardCount}</strong> Flashcards
            </span>
            <span>Updated for 2024–2025 BDS Syllabi</span>
          </div>
        </div>

        {/* High-Yield Past-Paper Questions for this Topic */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Past Paper & Practice Questions for this Topic
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Showing high-yield questions
            </span>
          </div>

          {topicMCQs.length > 0 ? (
            <div className="space-y-4">
              {topicMCQs.map((q, idx) => {
                const isExpanded = !!expandedMCQ[q.id];
                return (
                  <div
                    key={q.id}
                    className="bg-[#132238] rounded-2xl border border-[#1e3452] p-5 shadow-sm space-y-4 text-slate-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0c182a] text-slate-300 border border-[#1e3452] text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-sky-300 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded">
                          {q.yearSource || "Past Paper"}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        Difficulty: {q.difficulty}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-white leading-snug">
                      {q.question}
                    </p>

                    {/* Options Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctIndex;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border transition ${
                              isExpanded && isCorrect
                                ? "bg-emerald-950/60 border-emerald-700/80 font-medium text-emerald-200"
                                : "bg-[#0c182a] border-[#1e3452] text-slate-300"
                            }`}
                          >
                            <span className="font-bold mr-1.5 text-slate-400">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Toggle Explanation Button */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => toggleExpand(q.id)}
                        className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isExpanded ? "Hide Answer & Explanation" : "Reveal Answer & Explanation"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Expanded Explanation box */}
                    {isExpanded && (
                      <div className="p-4 bg-[#0c182a] border border-blue-900/60 rounded-xl text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>
                            Correct Answer: Option {String.fromCharCode(65 + q.correctIndex)} (
                            {q.options[q.correctIndex]})
                          </span>
                        </div>
                        <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#132238] rounded-2xl border border-[#1e3452] p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">
                Additional questions for this topic are being compiled by the academic team.
              </p>
              <Link
                href={`/practice?subject=${subject.id}`}
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-950/50 transition"
              >
                Practice All {subject.name} MCQs
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
