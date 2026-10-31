"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BDS_SUBJECTS, BDS_TOPICS, BDS_MCQS, BDS_RESOURCES, BDS_FLASHCARD_DECKS } from "@/lib/bds-content";
import { Breadcrumb } from "@/components/SubjectOverview";
import { SubjectArt } from "@/components/Illustrations";
import { getSubjectStructure, CORE_SECTIONS } from "@/lib/subject-structure";
import { SubjectSection } from "@/components/SubjectHub";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ListChecks
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

  // Structured subjects: Textbooks, Course outline, PPT collections and areas
  const structure = getSubjectStructure(slug);
  if (subject && structure && (CORE_SECTIONS.some((c) => c.slug === topicSlug) || structure.areas.some((a) => a.slug === topicSlug))) {
    return <SubjectSection subject={subject} structure={structure} section={topicSlug} />;
  }

  if (!subject || !topic) {
    return (
      <div className="min-h-screen bg-surface text-slate-200 flex items-center justify-center p-4">
        <div className="bg-surface-2 p-8 rounded-2xl border border-line text-center max-w-md space-y-4">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h2 className="text-lg font-bold text-ink">Topic Not Found</h2>
          <p className="text-xs text-slate-400">The requested topic could not be found.</p>
          <Link
            href="/subjects"
            className="inline-block px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary rounded-lg text-xs font-semibold transition"
          >
            Back to Subjects
          </Link>
        </div>
      </div>
    );
  }

  const topicMCQs = BDS_MCQS.filter((q) => q.topicId === topic.id);

  const chapters = BDS_TOPICS.filter((t) => t.subjectId === subject.id);
  const idx = chapters.findIndex((t) => t.id === topic.id);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  const notes = BDS_RESOURCES.filter((r) => r.subjectId === subject.id);
  const decks = BDS_FLASHCARD_DECKS.filter((d) => d.subjectId === subject.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-8">
        <Breadcrumb items={[{ href: "/subjects", label: "My Subjects" }, { href: `/subjects/${subject.slug}`, label: subject.name }, { label: topic.name }]} />

        {/* Chapter header */}
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="hero-in flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-soft" style={{ "--i": 0 } as React.CSSProperties}>
              <SubjectArt id={subject.id} className="h-12 w-12" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow hero-in flex flex-wrap items-center gap-2" style={{ "--i": 1 } as React.CSSProperties}>
                {subject.name} · Chapter {idx + 1} of {chapters.length}
                {topic.highYield && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-3 w-3" /> High-yield
                  </span>
                )}
              </p>
              <h1 className="page-title hero-in mt-1.5" style={{ "--i": 2 } as React.CSSProperties}>{topic.name}</h1>
              <p className="page-intro hero-in mt-2" style={{ "--i": 3 } as React.CSSProperties}>{topic.description}</p>
            </div>
          </div>
          <div className="hero-in flex shrink-0 flex-wrap gap-2" style={{ "--i": 4 } as React.CSSProperties}>
            <Link href={`/practice?subject=${subject.id}`} className="btn-primary">
              <ListChecks className="h-4 w-4" /> Practice MCQs
            </Link>
            {decks[0] && (
              <Link href={`/flashcards/${decks[0].id}`} className="btn-secondary">
                <Layers className="h-4 w-4" /> Flashcards
              </Link>
            )}
          </div>
        </header>

        {/* Resources for this chapter, no extra menus */}
        <section aria-label="Resources" className="grid gap-3 sm:grid-cols-3">
          <a href="#questions" className="card-glow rounded-2xl border border-line bg-surface p-4 transition-transform hover:-translate-y-0.5">
            <ListChecks className="h-5 w-5 text-primary" />
            <div className="card-title mt-2">Questions</div>
            <div className="text-sm text-muted">{topicMCQs.length ? `${topicMCQs.length} with explanations` : "Coming soon"}</div>
          </a>
          <Link href={`/resources?subject=${subject.id}`} className="card-glow rounded-2xl border border-line bg-surface p-4 transition-transform hover:-translate-y-0.5">
            <FileText className="h-5 w-5 text-primary" />
            <div className="card-title mt-2">Notes &amp; PPTs</div>
            <div className="text-sm text-muted">{notes.length ? `${notes.length} for ${subject.name}` : "Coming soon"}</div>
          </Link>
          <Link href={decks[0] ? `/flashcards/${decks[0].id}` : "/flashcards"} className="card-glow rounded-2xl border border-line bg-surface p-4 transition-transform hover:-translate-y-0.5">
            <Layers className="h-5 w-5 text-primary" />
            <div className="card-title mt-2">Flashcards</div>
            <div className="text-sm text-muted">{decks.length ? decks.map((d) => d.title).join(", ") : "Coming soon"}</div>
          </Link>
        </section>

        {/* Questions for this chapter */}
        <div id="questions" className="scroll-mt-24 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Questions for this chapter</h2>
            <span className="text-xs font-medium text-muted">Reveal each answer when you&apos;re ready</span>
          </div>

          {topicMCQs.length > 0 ? (
            <div className="space-y-4">
              {topicMCQs.map((q, idx) => {
                const isExpanded = !!expandedMCQ[q.id];
                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-line bg-surface p-5 space-y-4 text-slate-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-surface text-slate-300 border border-line text-xs font-bold flex items-center justify-center shrink-0">
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

                    <p className="text-sm font-medium text-ink leading-snug">
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
                                ? "bg-emerald-500/10 border-emerald-500 font-medium text-ink"
                                : "bg-surface border-line text-slate-300"
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
                        className="link flex items-center gap-1 text-xs"
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
                      <div className="p-4 bg-soft border border-primary/25 rounded-xl text-sm text-slate-300 space-y-1.5 animate-fadeIn">
                        <div className="font-semibold text-ink flex items-center gap-1.5">
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
            <div className="bg-surface-2 rounded-2xl border border-line p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">
                Additional questions for this topic are being compiled by the academic team.
              </p>
              <Link
                href={`/practice?subject=${subject.id}`}
                className="inline-block px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary rounded-lg text-xs font-semibold transition"
              >
                Practice All {subject.name} MCQs
              </Link>
            </div>
          )}
        </div>

        {/* previous / next chapter */}
        <nav aria-label="Chapters" className="grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={`/subjects/${subject.slug}/${prev.slug}`} className="card-glow group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
              <ChevronLeft className="h-5 w-5 text-muted group-hover:text-primary" />
              <span className="min-w-0">
                <span className="block text-xs text-muted">Previous chapter</span>
                <span className="block truncate font-semibold text-ink group-hover:text-primary">{prev.name}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/subjects/${subject.slug}/${next.slug}`} className="card-glow group flex items-center justify-end gap-3 rounded-2xl border border-line bg-surface p-4 text-right">
              <span className="min-w-0">
                <span className="block text-xs text-muted">Next chapter</span>
                <span className="block truncate font-semibold text-ink group-hover:text-primary">{next.name}</span>
              </span>
              <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary" />
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
