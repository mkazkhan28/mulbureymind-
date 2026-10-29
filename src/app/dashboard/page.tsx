"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, Download, Layers, Library, ListChecks, Presentation } from "lucide-react";
import { BDS_SUBJECTS, BDS_RESOURCES } from "@/lib/bds-content";
import { SubjectArt } from "@/components/Illustrations";
import PageHeader, { SectionHeader } from "@/components/PageHeader";
import { StudyPanel, ContinueReading } from "@/components/Motivation";
import { useProgress } from "@/lib/progress";
import { subjectStats, count } from "@/lib/stats";

/**
 * Student dashboard — shows only real data:
 * study progress saved on this device (streak, goal, opened lectures) and the actual content in the library.
 */
export default function StudentDashboardPage() {
  const firstYearSubjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");
  const progress = useProgress();
  const opened = progress ? Object.keys(progress.opened).length : 0;
  const isNew = progress !== null && opened === 0;

  const quickActions = [
    { href: "/practice", icon: ListChecks, label: "Practice MCQs", text: "Tutor, timed or mock mode" },
    { href: "/subjects/anatomy/ppts-combined", icon: Presentation, label: "Open lecture slides", text: "Read in the site" },
    { href: "/flashcards", icon: Layers, label: "Review flashcards", text: "Active recall decks" },
    { href: "/past-papers", icon: Award, label: "Past papers", text: "Questions with explanations" },
  ];

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        eyebrow="My dashboard"
        title={opened ? "Welcome back" : isNew ? "Welcome to HMHDental" : "Your study space"}
        intro={
          opened
            ? `You've opened ${opened} lecture${opened === 1 ? "" : "s"} so far. Here's everything you need for today's session.`
            : "Start with a subject or a lecture — your streak, goal and recent reading will appear here as you study."
        }
        actions={
          <>
            <Link href="/subjects/anatomy" className="btn-primary">
              {opened ? "Continue studying" : "Start with Anatomy"} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/subscription" className="btn-secondary">
              View plan status
            </Link>
          </>
        }
      />

      <div className="space-y-16">
        {/* Quick actions */}
        <section aria-label="Quick actions" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft text-primary">
                <a.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink group-hover:text-primary">{a.label}</span>
                <span className="block truncate text-xs text-muted">{a.text}</span>
              </span>
            </Link>
          ))}
        </section>

        {/* Progress (real, stored on this device) */}
        <section aria-labelledby="progress">
          <SectionHeader id="progress" title="Your progress" intro="Saved on this device. Open lectures to build your streak and reach today's goal." />
          <StudyPanel />
        </section>

        <section aria-labelledby="recent">
          <SectionHeader id="recent" title="Continue learning" intro="The lectures and books you opened most recently." />
          <ContinueReading limit={8} />
        </section>

        {/* Subjects */}
        <section aria-labelledby="subjects">
          <SectionHeader
            id="subjects"
            title="Your subjects"
            intro="All six BDS 1st Year subjects."
            action={
              <Link href="/subjects" className="link inline-flex items-center gap-1 text-sm">
                Browse all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {firstYearSubjects.map((s) => {
              const st = subjectStats(s.id);
              const meta = [count(st.lectures, "lecture"), count(st.books, "textbook"), count(st.mcqs, "MCQ")].filter(Boolean);
              return (
                <Link key={s.id} href={`/subjects/${s.slug}`} className="resource-card group !flex-row items-center gap-4 !p-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-soft">
                    <SubjectArt id={s.id} className="h-10 w-10" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold text-primary">{s.code}</span>
                    <span className="card-title block truncate group-hover:text-primary">{s.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted">{meta.join(" · ") || "Content being added"}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Handouts */}
        <section aria-labelledby="handouts">
          <SectionHeader
            id="handouts"
            title="Study handouts"
            intro="Notes and slide decks from the resource library."
            action={
              <Link href="/resources" className="link inline-flex items-center gap-1 text-sm">
                <Library className="h-4 w-4" /> View library
              </Link>
            }
          />
          {BDS_RESOURCES.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BDS_RESOURCES.slice(0, 6).map((res) => (
                <div key={res.id} className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="chip">{res.type}</span>
                      {res.isPremium ? <span className="chip-pro">Pro</span> : <span className="chip-free">Free</span>}
                    </div>
                    <h3 className="text-sm font-semibold leading-snug text-ink">{res.title}</h3>
                    <p className="text-xs text-muted">
                      {res.fileSize} · {res.author}
                    </p>
                  </div>
                  <Link
                    href={`/api/resources/${res.id}/download`}
                    className="btn-secondary !min-h-[40px] !w-10 shrink-0 !p-0"
                    title={`Download ${res.title}`}
                    aria-label={`Download ${res.title}`}
                  >
                    <Download className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
              <BookOpen className="h-5 w-5 text-primary" /> Handouts will appear here once they're added to the library.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
