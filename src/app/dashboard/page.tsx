"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, BookOpen, Flame, GraduationCap, ListChecks, PlayCircle, Shuffle, Target } from "lucide-react";
import { BDS_SUBJECTS, BDS_TOPICS } from "@/lib/bds-content";
import { SUBJECT_STRUCTURES, getSubjectStructure } from "@/lib/subject-structure";
import { SubjectArt, AreaArt } from "@/components/Illustrations";
import { SectionHeader } from "@/components/PageHeader";
import GlobalSearch from "@/components/GlobalSearch";
import { ContinueReading, StudyPanel } from "@/components/Motivation";
import { useProgress, streakOf } from "@/lib/progress";
import { catalogById, lecturesInArea } from "@/lib/catalog";
import { useBookmarks } from "@/lib/bookmarks";
import { subjectStats, count } from "@/lib/stats";
import { Stagger, StaggerItem, ProgressBar } from "@/components/motion";
import { BookmarkButton, EmptyState, Skeleton } from "@/components/ui";

/**
 * Student dashboard — study first.
 * Top: welcome, search, BDS year, continue studying. Then subjects, recent lectures,
 * quick MCQs, saved items and progress. Everything shown comes from real data
 * (the library and progress saved on this device).
 */
const SHORT: Record<string, string> = { anat: "Anatomy", phys: "Physiology", "oral-bio": "Oral Biology", biochem: "Biochemistry", pharm: "Pharmacology", path: "Pathology" };

export default function StudentDashboardPage() {
  const subjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");
  const progress = useProgress();
  const { ready: bmReady, items: saved } = useBookmarks();
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 5 ? "Studying late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);

  const last = useMemo(() => {
    if (!progress) return null;
    const top = Object.entries(progress.opened).sort((a, b) => b[1].at - a[1].at)[0];
    if (!top) return null;
    const item = catalogById.get(top[0]);
    return item ? { item, o: top[1] } : null;
  }, [progress]);

  const streak = progress ? streakOf(progress.days) : 0;
  const anatomy = SUBJECT_STRUCTURES.anatomy;

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* ===================== TOP: welcome · search · year · continue ===================== */}
      <section className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="hero-in flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 sm:p-7" style={{ "--i": 0 } as React.CSSProperties}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/subjects" className="chip-pro !py-1 hover:bg-primary/15" title="Change year in My Subjects">
                <GraduationCap className="h-3.5 w-3.5" /> BDS 1st Year · DUHS
              </Link>
              {progress && streak > 0 && (
                <span className="chip !py-1">
                  <Flame className="h-3.5 w-3.5 text-amber-500" /> {streak}-day streak
                </span>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-[2.25rem]">{greeting}</h1>
            <p className="mt-1.5 text-muted">What would you like to study? Search any subject, chapter or lecture.</p>
          </div>
          <GlobalSearch size="lg" className="mt-5" placeholder="Try “thalamus”, “enamel” or “cranial nerves”" />
        </div>

        {/* Continue studying */}
        <div className="hero-in" style={{ "--i": 1 } as React.CSSProperties}>
          {!progress ? (
            <Skeleton className="h-full min-h-[268px]" />
          ) : last ? (
            <Link
              href={last.item.href}
              className="card-glow group relative flex h-full min-h-[268px] flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="relative h-28 overflow-hidden bg-surface-2 sm:h-32">
                {last.item.thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={last.item.thumb} alt="" className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.03]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                <span className="absolute left-4 top-4 chip-pro border border-primary/30 !bg-surface/90">Continue studying</span>
              </div>
              <div className="flex flex-1 flex-col p-5 pt-3">
                <h2 className="card-title line-clamp-2 text-lg">{last.item.title}</h2>
                <p className="mt-0.5 truncate text-sm text-muted">{[last.item.areaTitle, last.item.topic].filter(Boolean).join(" · ")}</p>
                <div className="mt-auto flex items-center gap-4 pt-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-xs text-muted">
                      Page {last.o.page}
                      {last.item.pages ? ` of ${last.item.pages}` : ""}
                    </div>
                    <ProgressBar pct={last.item.pages ? (last.o.page / last.item.pages) * 100 : 0} />
                  </div>
                  <span className="btn-primary !min-h-[40px] shrink-0 !px-4 !py-2">
                    <PlayCircle className="h-4 w-4" /> Resume
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex h-full min-h-[268px] flex-col justify-between rounded-2xl border border-line bg-gradient-to-br from-soft to-surface p-6">
              <div>
                <span className="chip-pro">Start here</span>
                <h2 className="card-title mt-3 text-lg">Open your first lecture</h2>
                <p className="mt-1 text-sm text-muted">
                  {anatomy ? `${anatomy.ppts.combined.length} Anatomy lectures are ready to read. Pick a chapter and we'll remember your page.` : "Pick a subject to begin."}
                </p>
              </div>
              <Link href="/subjects/anatomy" className="btn-primary mt-5 self-start">
                Start with Anatomy <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="mt-12 space-y-14">
        {/* ===================== YOUR SUBJECTS ===================== */}
        <section aria-labelledby="subjects">
          <SectionHeader
            id="subjects"
            title="Your subjects"
            intro="Open a subject to see every chapter and its lectures, notes and MCQs."
            action={
              <Link href="/subjects" className="link inline-flex items-center gap-1 text-sm">
                All subjects <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => {
              const st = subjectStats(s.id);
              const structure = getSubjectStructure(s.slug);
              const chapters = structure ? structure.areas.length : BDS_TOPICS.filter((t) => t.subjectId === s.id).length;
              const ids = structure ? [...new Set(structure.areas.flatMap((a) => lecturesInArea(s.slug, a.slug)))] : [];
              const opened = progress ? ids.filter((id) => progress.opened[id]).length : 0;
              const meta = [count(chapters, "chapter"), count(st.lectures, "lecture"), count(st.mcqs, "MCQ")].filter(Boolean).join(" · ");
              return (
                <StaggerItem key={s.id}>
                  <Link href={`/subjects/${s.slug}`} className="card-glow group flex h-full items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-transform duration-300 hover:-translate-y-0.5">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-soft">
                      <SubjectArt id={s.id} className="h-11 w-11" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="card-title block truncate group-hover:text-primary">{s.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{meta || "Content being added"}</span>
                      {ids.length > 0 && (
                        <span className="mt-2 flex items-center gap-2">
                          <ProgressBar pct={(opened / ids.length) * 100} className="flex-1 !h-1" />
                          <span className="text-[11px] tabular-nums text-muted">
                            {opened}/{ids.length}
                          </span>
                        </span>
                      )}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        <div className="grid gap-14 xl:grid-cols-[1fr_340px] xl:gap-8">
          <div className="min-w-0 space-y-14">
            {/* ===================== RECENTLY OPENED ===================== */}
            <section aria-labelledby="recent">
              <SectionHeader id="recent" title="Recently opened" intro="Jump straight back to where you stopped." />
              <ContinueReading limit={6} />
            </section>

            {/* ===================== SAVED ===================== */}
            <section aria-labelledby="saved">
              <SectionHeader
                id="saved"
                title="Saved resources"
                intro="Lectures and books you bookmarked for revision."
                action={
                  saved.length > 0 ? (
                    <Link href="/bookmarks" className="link inline-flex items-center gap-1 text-sm">
                      All saved ({saved.length}) <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : undefined
                }
              />
              {!bmReady ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              ) : saved.length === 0 ? (
                <EmptyState icon={Bookmark} title="No saved resources yet" text="Tap the bookmark icon on any lecture to keep it here for quick revision." />
              ) : (
                <Stagger className="grid gap-3 sm:grid-cols-2">
                  {saved.slice(0, 6).map(({ id, item }) => (
                    <StaggerItem key={id} className="group relative flex items-center gap-3 rounded-xl border border-line bg-surface p-2.5 transition-colors hover:border-primary/40">
                      <Link href={item.href} className="absolute inset-0 z-10" aria-label={`Open ${item.title}`} />
                      <span className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-2 text-primary">
                        {item.thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          <BookOpen className="h-4 w-4" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink group-hover:text-primary">{item.title}</span>
                        <span className="block truncate text-xs text-muted">{item.kind === "book" ? "Textbook" : item.areaTitle}</span>
                      </span>
                      <BookmarkButton id={id} title={item.title} />
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </section>

            {/* ===================== PROGRESS ===================== */}
            <section aria-labelledby="progress">
              <SectionHeader id="progress" title="Study progress" intro="Streak, today's goal and your exam countdown — saved on this device." />
              <StudyPanel compact />
            </section>
          </div>

          {/* ===================== SIDE: quick MCQs + chapter progress ===================== */}
          <aside className="space-y-6">
            <section aria-labelledby="quick-mcq" className="rounded-2xl border border-line bg-surface p-5">
              <h2 id="quick-mcq" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <ListChecks className="h-5 w-5 text-primary" /> Quick MCQ practice
              </h2>
              <p className="mt-1 text-sm text-muted">Pick a subject — questions start straight away.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {subjects.map((s) => (
                  <Link
                    key={s.id}
                    href={`/practice?subject=${s.id}`}
                    className="flex items-center gap-2 rounded-xl border border-line bg-canvas px-2.5 py-2 text-xs font-semibold text-slate-300 transition hover:border-primary/40 hover:text-primary"
                  >
                    <SubjectArt id={s.id} className="h-5 w-5 shrink-0" />
                    <span className="truncate">{SHORT[s.id] ?? s.name}</span>
                  </Link>
                ))}
              </div>
              <Link href="/practice" className="btn-primary mt-4 w-full">
                <Shuffle className="h-4 w-4" /> Mixed practice
              </Link>
            </section>

            {anatomy && (
              <section aria-labelledby="chapters" className="rounded-2xl border border-line bg-surface p-5">
                <h2 id="chapters" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <Target className="h-5 w-5 text-primary" /> Chapter progress
                </h2>
                <p className="mt-1 text-sm text-muted">Anatomy lectures you&apos;ve opened, by chapter.</p>
                <div className="mt-4 space-y-3">
                  {anatomy.areas.map((a) => {
                    const ids = lecturesInArea("anatomy", a.slug);
                    const o = progress ? ids.filter((id) => progress.opened[id]).length : 0;
                    return (
                      <Link key={a.slug} href={`/subjects/anatomy/${a.slug}`} className="group block">
                        <div className="mb-1 flex items-center gap-2 text-sm">
                          <AreaArt slug={a.slug} className="h-5 w-5" />
                          <span className="flex-1 truncate text-slate-300 group-hover:text-primary">{a.title}</span>
                          <span className="text-[11px] tabular-nums text-muted">
                            {o}/{ids.length}
                          </span>
                        </div>
                        <ProgressBar pct={ids.length ? (o / ids.length) * 100 : 0} className="!h-1" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
