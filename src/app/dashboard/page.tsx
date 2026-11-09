"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CalendarClock,
  ChevronDown,
  Clock,
  GraduationCap,
  Lightbulb,
  ListChecks,
  PlayCircle,
  Shuffle,
  Target,
} from "lucide-react";
import { BDS_SUBJECTS } from "@/lib/bds-content";
import { SUBJECT_STRUCTURES, getSubjectStructure } from "@/lib/subject-structure";
import { SubjectArt, AreaArt } from "@/components/Illustrations";
import { SectionHeader } from "@/components/PageHeader";
import { ContinueReading, StudyPanel } from "@/components/Motivation";
import ResourceGateway from "@/components/ResourceGateway";
import { useProgress, daysUntil, dayKey } from "@/lib/progress";
import { catalogById, lecturesInArea } from "@/lib/catalog";
import { useBookmarks } from "@/lib/bookmarks";
import { m, AnimatePresence, AnimatedNumber, Stagger, StaggerItem, ProgressBar, EASE } from "@/components/motion";
import { BookmarkButton, EmptyState, Skeleton } from "@/components/ui";

/**
 * Student dashboard.
 * Top: a compact overview (greeting, library progress, what's next, one insight from your own data).
 * Main column: overall status, recently opened, saved resources, study materials.
 * Side column: subjects (compact), quick practice, recent activity, chapter progress.
 * Everything shown comes from real data (the library and the progress saved on this device).
 */
const SHORT: Record<string, string> = { anat: "Anatomy", phys: "Physiology", "oral-bio": "Oral Biology", biochem: "Biochemistry", pharm: "Pharmacology", path: "Pathology", "gen-ed": "General Education" };

const ago = (t: number) => {
  const s = Math.max(1, Math.round((Date.now() - t) / 1000));
  if (s < 60) return "just now";
  const mins = Math.round(s / 60);
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
};

export default function StudentDashboardPage() {
  const subjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");
  const progress = useProgress();
  const { ready: bmReady, items: saved } = useBookmarks();
  const [greeting, setGreeting] = useState("Welcome back");
  const [name, setName] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 5 ? "Studying late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    try {
      const p = JSON.parse(localStorage.getItem("hmh-profile") || "{}");
      if (p?.name) setName(String(p.name).trim().split(/\s+/)[0]);
    } catch {}
  }, []);

  const libraries = Object.values(SUBJECT_STRUCTURES);
  const allLectureIds = useMemo(
    () => [...new Set(libraries.flatMap((st) => st.areas.flatMap((a) => lecturesInArea(st.subjectSlug, a.slug))))],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const totalLectures = allLectureIds.length;

  const last = useMemo(() => {
    if (!progress) return null;
    const top = Object.entries(progress.opened).sort((a, b) => b[1].at - a[1].at)[0];
    if (!top) return null;
    const item = catalogById.get(top[0]);
    return item ? { item, o: top[1] } : null;
  }, [progress]);

  // Overview numbers, all from this device's progress
  const overview = useMemo(() => {
    if (!progress) return null;
    const openedLectures = allLectureIds.filter((id) => progress.opened[id]).length;
    let chaptersStarted = 0;
    let chaptersTotal = 0;
    let focus: { title: string; done: number; total: number; href: string } | null = null;
    for (const st of libraries) {
      for (const a of st.areas) {
        const ids = lecturesInArea(st.subjectSlug, a.slug);
        if (!ids.length) continue;
        chaptersTotal++;
        const done = ids.filter((id) => progress.opened[id]).length;
        if (done) chaptersStarted++;
        if (done && done < ids.length && (!focus || done > focus.done)) focus = { title: a.title, done, total: ids.length, href: `/subjects/${st.subjectSlug}/${a.slug}` };
      }
    }
    const week: string[] = [];
    const d = new Date();
    for (let i = 0; i < 7; i++) {
      week.push(dayKey(d));
      d.setDate(d.getDate() - 1);
    }
    const activeDays = week.filter((k) => progress.days.includes(k)).length;
    return { openedLectures, chaptersStarted, chaptersTotal, focus, activeDays, examIn: daysUntil(progress.examDate) };
  }, [progress, allLectureIds, libraries]);

  const activity = useMemo(() => {
    if (!progress) return [];
    return Object.entries(progress.opened)
      .sort((a, b) => b[1].at - a[1].at)
      .slice(0, 5)
      .map(([id, o]) => ({ item: catalogById.get(id), o }))
      .filter((x) => x.item);
  }, [progress]);

  const [libPick, setLibPick] = useState<string | null>(null);
  const libSlug = libPick ?? last?.item.subjectSlug ?? libraries[0]?.subjectSlug;
  const lib = libraries.find((st) => st.subjectSlug === libSlug) ?? libraries[0];

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* ===================== OVERVIEW ===================== */}
      <section aria-labelledby="overview" className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <div className="hero-in rounded-2xl border border-line bg-surface p-6 sm:p-7" style={{ "--i": 0 } as React.CSSProperties}>
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
            <Link href="/subjects" className="chip-pro !py-1 hover:bg-primary/15" title="Your year and college">
              <GraduationCap className="h-3.5 w-3.5" /> BDS 1st Year · DUHS
            </Link>
          </div>
          <h1 id="overview" className="mt-3 font-display text-[1.9rem] font-bold leading-tight tracking-[-0.035em] text-ink sm:text-[2.2rem]">
            {greeting}
            {name ? `, ${name}` : ""}
          </h1>

          <dl className="mt-6 grid grid-cols-3 gap-3 sm:gap-5">
            <Stat label="Lectures opened" value={overview?.openedLectures} of={totalLectures} />
            <Stat label="Chapters started" value={overview?.chaptersStarted} of={overview?.chaptersTotal} />
            <Stat label="Active days this week" value={overview?.activeDays} of={7} />
          </dl>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-surface-2 px-3.5 py-3 text-sm">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {!overview ? (
              <span className="h-4 w-2/3 rounded bg-slate-800/60" />
            ) : overview.focus ? (
              <p className="text-muted">
                You&apos;ve opened <strong className="font-semibold text-ink">{overview.focus.done} of {overview.focus.total}</strong> {overview.focus.title} lectures.{" "}
                <Link href={overview.focus.href} className="link">
                  {overview.focus.total - overview.focus.done} to go
                </Link>
              </p>
            ) : (
              <p className="text-muted">Open one lecture today and your progress, streak and insights will start showing here.</p>
            )}
          </div>
        </div>

        {/* Up next */}
        <div className="hero-in" style={{ "--i": 1 } as React.CSSProperties}>
          {!progress ? (
            <Skeleton className="h-full min-h-[240px]" />
          ) : (
            <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <h2 className="font-display text-sm font-semibold text-muted">Up next</h2>
              {last ? (
                <Link href={last.item.href} className="group mt-3 flex flex-1 flex-col">
                  <div className="flex gap-3.5">
                    <span className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-2 ring-1 ring-line">
                      {last.item.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={last.item.thumb} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-primary">
                          <BookOpen className="h-5 w-5" />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-ink group-hover:text-primary">{last.item.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{last.item.areaTitle ?? last.item.topic}</span>
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-xs text-muted">
                      <span>
                        Page {last.o.page}
                        {last.item.pages ? ` of ${last.item.pages}` : ""}
                      </span>
                      <span>{ago(last.o.at)}</span>
                    </div>
                    <ProgressBar pct={last.item.pages ? (last.o.page / last.item.pages) * 100 : 0} />
                  </div>
                  <span className="mt-auto pt-4">
                    <span className="btn-primary w-full !min-h-[42px]">
                      <PlayCircle className="h-4 w-4" /> Resume reading
                    </span>
                  </span>
                </Link>
              ) : (
                <div className="mt-3 flex flex-1 flex-col">
                  <p className="font-display text-lg font-semibold text-ink">Open your first lecture</p>
                  <p className="mt-1 text-sm text-muted">{totalLectures} lectures are ready. Pick a chapter and we&apos;ll remember your page.</p>
                  <Link href="/subjects" className="btn-primary mt-auto w-full">
                    Choose a subject <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
              <a href="#status" className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[13px] text-muted transition hover:text-ink">
                <CalendarClock className="h-4 w-4 text-primary" />
                {overview?.examIn != null && overview.examIn >= 0 ? (
                  <span>
                    Exam in <strong className="font-semibold text-ink">{overview.examIn}</strong> day{overview.examIn === 1 ? "" : "s"}
                  </span>
                ) : (
                  <span>Set your exam date for a countdown</span>
                )}
              </a>
            </div>
          )}
        </div>
      </section>

      <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
        <div className="min-w-0 space-y-12">
          {/* ===================== OVERALL STATUS ===================== */}
          <section aria-labelledby="status" id="status" className="scroll-mt-24">
            <SectionHeader id="status-title" title="Overall status" intro="Streak, today's goal and your exam countdown, saved on this device." />
            <StudyPanel compact />
          </section>

          {/* ===================== RECENTLY OPENED ===================== */}
          <section aria-labelledby="recent">
            <SectionHeader id="recent" title="Recently opened" intro="Jump straight back to where you stopped." />
            <ContinueReading limit={4} cols="sm:grid-cols-2" />
          </section>

          {/* ===================== SAVED ===================== */}
          <section aria-labelledby="saved">
            <SectionHeader
              id="saved"
              title="Saved resources"
              intro="Lectures and books you saved for revision."
              action={
                saved.length > 6 ? (
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
              <EmptyState icon={Bookmark} title="Nothing saved yet" text="Tap the bookmark icon on any lecture or book to keep it here for quick revision." />
            ) : (
              <Stagger className="grid gap-2.5 sm:grid-cols-2">
                {saved.slice(0, 6).map(({ id, item }) => (
                  <StaggerItem key={id} className="group relative flex items-center gap-3 rounded-xl border border-line bg-surface p-2.5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft">
                    <Link href={item.href} className="absolute inset-0 z-10 rounded-xl" aria-label={`Open ${item.title}`} />
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
                    <span className="relative z-20">
                      <BookmarkButton id={id} title={item.title} />
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </section>

          {/* ===================== STUDY MATERIALS (gateway) ===================== */}
          <section aria-labelledby="materials">
            <SectionHeader
              id="materials"
              title="Study materials"
              intro="Open a library to browse it."
              action={
                <Link href="/resources" className="link inline-flex items-center gap-1 text-sm">
                  All resources <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            <ResourceGateway columns={2} />
          </section>
        </div>

        {/* ===================== SIDE COLUMN ===================== */}
        <aside className="space-y-5" aria-label="Subjects and activity">
          <Panel title="Your subjects" icon={GraduationCap} action={<Link href="/subjects" className="link text-xs">All</Link>} collapsible defaultOpen>
            <ul className="-mx-1.5 space-y-0.5">
              {subjects.map((s) => {
                const st = getSubjectStructure(s.slug);
                const ids = st ? [...new Set(st.areas.flatMap((a) => lecturesInArea(s.slug, a.slug)))] : [];
                const opened = progress ? ids.filter((id) => progress.opened[id]).length : 0;
                return (
                  <li key={s.id}>
                    <Link href={`/subjects/${s.slug}`} className="group flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-surface-2">
                      <SubjectArt id={s.id} className="h-7 w-7 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink group-hover:text-primary">{SHORT[s.id] ?? s.name}</span>
                        {ids.length > 0 ? (
                          <ProgressBar pct={(opened / ids.length) * 100} className="mt-1 !h-1" />
                        ) : (
                          <span className="block text-[11px] text-muted">Lectures coming soon</span>
                        )}
                      </span>
                      {ids.length > 0 && (
                        <span className="text-[11px] tabular-nums text-muted">
                          {opened}/{ids.length}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Quick practice" icon={ListChecks}>
            <p className="text-sm text-muted">Exam-style MCQs with explanations.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/practice" className="btn-primary !min-h-[40px] !px-3 !py-2 text-sm">
                <Shuffle className="h-4 w-4" /> Mixed
              </Link>
              <Link href="/past-papers" className="btn-secondary !min-h-[40px] !px-3 !py-2 text-sm">
                Past papers
              </Link>
            </div>
          </Panel>

          <Panel title="Recent activity" icon={Clock}>
            {!progress ? (
              <Skeleton className="h-24" />
            ) : activity.length === 0 ? (
              <p className="text-sm text-muted">Your reading history will appear here.</p>
            ) : (
              <ol className="relative space-y-3.5 border-l border-line pl-4">
                {activity.map(({ item, o }) => (
                  <li key={item!.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary ring-4 ring-surface" />
                    <Link href={item!.href} className="group block">
                      <span className="line-clamp-1 text-sm font-medium text-ink group-hover:text-primary">{item!.title}</span>
                      <span className="block text-xs text-muted">
                        Page {o.page} · {ago(o.at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </Panel>

          {lib && (
            <Panel title="Chapter progress" icon={Target} collapsible>
              {libraries.length > 1 && (
                <div role="tablist" aria-label="Subject" className="mb-3 inline-flex rounded-lg border border-line bg-surface-2 p-0.5">
                  {libraries.map((st) => (
                    <button
                      key={st.subjectSlug}
                      role="tab"
                      aria-selected={st.subjectSlug === lib.subjectSlug}
                      onClick={() => setLibPick(st.subjectSlug)}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${st.subjectSlug === lib.subjectSlug ? "bg-surface text-ink shadow-soft" : "text-muted hover:text-ink"}`}
                    >
                      {st.shortName}
                    </button>
                  ))}
                </div>
              )}
              <div className="space-y-2.5">
                {lib.areas.map((a) => {
                  const ids = lecturesInArea(lib.subjectSlug, a.slug);
                  const o = progress ? ids.filter((id) => progress.opened[id]).length : 0;
                  return (
                    <Link key={a.slug} href={`/subjects/${lib.subjectSlug}/${a.slug}`} className="group block">
                      <div className="mb-1 flex items-center gap-2 text-[13px]">
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
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
}

/** Overview figure: counts up from 0, with an optional "of N" and a thin bar. */
function Stat({ label, value, of }: { label: string; value?: number; of?: number }) {
  return (
    <div className="flex min-w-0 flex-col">
      <dt className="mt-1.5 text-[13px] leading-snug text-muted">{label}</dt>
      <dd className="-order-1 flex items-baseline gap-1 font-display">
        <span className="text-[1.75rem] font-bold leading-none tracking-[-0.04em] text-ink sm:text-[2rem]">
          {value === undefined ? "–" : <AnimatedNumber value={value} />}
        </span>
        {of ? <span className="text-sm font-medium text-muted">/ {of}</span> : null}
      </dd>
      {of ? (
        <dd>
          <ProgressBar pct={value ? (value / of) * 100 : 0} className="mt-2 !h-1" />
        </dd>
      ) : null}
    </div>
  );
}

/** Side-column card; collapsible ones animate open/closed. */
function Panel({
  title,
  icon: Icon,
  action,
  collapsible = false,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: React.ElementType;
  action?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!collapsible || defaultOpen);
  const id = "panel-" + title.toLowerCase().replace(/[^a-z]+/g, "-");
  const heading = (
    <span className="flex items-center gap-2 font-display text-[15px] font-semibold text-ink">
      <Icon className="h-4 w-4 text-primary" /> {title}
    </span>
  );
  return (
    <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5" aria-labelledby={id + "-h"}>
      <div className="flex items-center justify-between gap-2">
        {collapsible ? (
          <button type="button" id={id + "-h"} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className="group flex flex-1 items-center justify-between gap-2 text-left">
            {heading}
            <ChevronDown className={`h-4 w-4 text-muted transition-transform duration-300 group-hover:text-ink ${open ? "rotate-180" : ""}`} />
          </button>
        ) : (
          <h2 id={id + "-h"}>{heading}</h2>
        )}
        {action && <span className={collapsible ? "ml-2" : ""}>{action}</span>}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
