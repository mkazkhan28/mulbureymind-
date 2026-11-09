"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bone,
  Brain,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  DownloadCloud,
  Eye,
  FileText,
  FolderOpen,
  HeartPulse,
  Library,
  ListChecks,
  ListTree,
  Lock,
  Microscope,
  Presentation,
  ScanFace,
  Sprout,
  Award,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";
import type { Subject } from "@/lib/bds-content";
import { BOOKS_DATA, type BookItem } from "@/lib/books";
import { driveDownloadUrl, driveFileId } from "@/lib/drive";
import {
  PPT_GROUPS,
  type CollegeGroup,
  type StudyFile,
  type SubjectArea,
  type SubjectStructure,
} from "@/lib/subject-structure";
import DriveViewer from "@/components/DriveViewer";
import { useProgress } from "@/lib/progress";
import { lecturesInArea } from "@/lib/catalog";
import { ContinueReading } from "@/components/Motivation";
import { Reveal, Stagger, StaggerItem, ProgressBar, m, SPRING } from "@/components/motion";
import { SubjectArt, AreaArt, areaIcon } from "@/components/Illustrations";
import { BookmarkButton } from "@/components/ui";
import { Breadcrumb } from "@/components/SubjectOverview";
import { subjectStats } from "@/lib/stats";

export const AREA_ICONS = { Sprout, Microscope, Brain, ScanFace, Bone, HeartPulse } as const;

/* Subject accent (text-*-400 reads well in both themes) */
const TONE: Record<string, { text: string; bg: string; ring: string; bar: string }> = {
  anat: { text: "text-brand-400", hover: "group-hover:text-brand-400", bg: "bg-brand-500/10", ring: "ring-brand-500/30", bar: "from-brand-400 to-accent-500" },
};
const DEFAULT_TONE = { text: "text-brand-400", hover: "group-hover:text-brand-400", bg: "bg-brand-500/10", ring: "ring-brand-500/30", bar: "from-brand-400 to-brand-600" };

const booksFor = (s: SubjectStructure) => BOOKS_DATA.filter((b) => b.subjectId === s.bookSubjectId);
const pptCount = (s: SubjectStructure, area?: string) =>
  PPT_GROUPS.reduce((n, g) => n + s.ppts[g.key].filter((f) => !area || inArea(f, area)).length, 0);
/** A file belongs to an area if it's filed there or linked there via alsoIn. */
const inArea = (f: StudyFile, area: string) => f.area === area || !!f.alsoIn?.includes(area);
/** Files for an area page: its own lectures first, then ones linked in from other areas (filed under their linkTopic). */
const areaFiles = (files: StudyFile[], area: string): StudyFile[] => [
  ...files.filter((f) => f.area === area),
  ...files.filter((f) => f.area !== area && f.alsoIn?.includes(area)).map((f) => ({ ...f, topic: f.linkTopic ?? f.topic })),
];

/* ======================================================================== */
/* Page layout with the subject's contents on the left; the contents can be  */
/* hidden for a wider reading area (remembered per browser)                  */
/* ======================================================================== */
const CONTENTS_KEY = "hmh-subject-contents-hidden";
function ContentsLayout({ nav, className = "", mainClassName = "", children }: { nav: React.ReactNode; className?: string; mainClassName?: string; children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    try {
      setHidden(localStorage.getItem(CONTENTS_KEY) === "1");
    } catch {}
  }, []);
  const toggle = (v: boolean) => {
    setHidden(v);
    try {
      localStorage.setItem(CONTENTS_KEY, v ? "1" : "0");
    } catch {}
  };
  return (
    <div className={`grid gap-8 ${hidden ? "" : "lg:grid-cols-[240px_minmax(0,1fr)]"} ${className}`}>
      {!hidden && (
        <aside className="hidden animate-fadeIn lg:block" aria-label="Subject contents">
          <div className="sticky top-24">
            <button
              type="button"
              onClick={() => toggle(true)}
              className="mb-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted transition hover:bg-surface-2 hover:text-ink"
            >
              <PanelLeftClose className="h-3.5 w-3.5" /> Hide contents
            </button>
            {nav}
          </div>
        </aside>
      )}
      <div className={`min-w-0 ${mainClassName}`}>
        {hidden && (
          <button
            type="button"
            onClick={() => toggle(false)}
            className="mb-4 hidden items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-primary/40 hover:text-primary lg:inline-flex"
          >
            <PanelLeft className="h-3.5 w-3.5" /> Show contents
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

/* ======================================================================== */
/* Title list — the subject's table of contents                            */
/* ======================================================================== */
export function SubjectNav({ subject, structure, current }: { subject: Subject; structure: SubjectStructure; current?: string }) {
  const tone = TONE[subject.id] ?? DEFAULT_TONE;
  const base = `/subjects/${subject.slug}`;
  const item = (href: string, label: string, Icon: React.ElementType, slug: string | undefined, meta?: string, indent = false) => {
    const active = current === slug;
    return (
      <Link
        key={href}
        href={href}
        className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition ${indent ? "ml-6" : ""} ${
          active ? `${tone.bg} font-semibold text-ink` : "text-slate-300 hover:bg-slate-800 hover:text-ink"
        }`}
      >
        <Icon className={`h-4 w-4 shrink-0 ${active ? tone.text : `text-muted ${tone.hover}`}`} />
        <span className="flex-1 truncate">{label}</span>
        {meta && <span className="text-[11px] text-muted">{meta}</span>}
      </Link>
    );
  };
  return (
    <nav aria-label={`${subject.name} contents`} className="space-y-5">
      <div>
        <Link href={base} className={`mb-2 flex items-center gap-2 px-2.5 text-xs font-semibold ${current ? "text-muted hover:text-ink" : tone.text}`}>
          <SubjectArt id={subject.id} className="h-5 w-5" /> {structure.shortName} — contents
        </Link>
        <div className="space-y-0.5">
          {item(`${base}/textbooks`, "Textbooks", Library, "textbooks", String(booksFor(structure).length))}
          {item(`${base}/course-outline`, "Course outline", ListTree, "course-outline", structure.courseOutline.length ? String(structure.courseOutline.length) : "")}
          <div className="flex items-center gap-2.5 px-2.5 pb-0.5 pt-2 text-sm text-slate-300">
            <Presentation className="h-4 w-4 text-muted" /> PPTs
          </div>
          {PPT_GROUPS.map((g) => item(`${base}/${g.slug}`, g.short, FolderOpen, g.slug, String(structure.ppts[g.key].length), true))}
        </div>
      </div>
      <div>
        <div className="mb-2 px-2.5 text-xs font-semibold text-muted">Chapters</div>
        <div className="space-y-0.5">
          {structure.areas.map((a) => item(`${base}/${a.slug}`, a.title, areaIcon(a.slug), a.slug))}
        </div>
      </div>
      <div className="space-y-0.5 border-t border-line pt-4">
        {subjectStats(subject.id).mcqs > 0 && item(`/practice?subject=${subject.id}`, "Practice MCQs", ListChecks, "__mcq", String(subjectStats(subject.id).mcqs))}
        {item(`/past-papers`, "Past papers", Award, "__pp")}
      </div>
    </nav>
  );
}

/* ======================================================================== */
/* Subject overview (/subjects/anatomy)                                     */
/* ======================================================================== */
export function SubjectHub({ subject, structure }: { subject: Subject; structure: SubjectStructure }) {
  const tone = TONE[subject.id] ?? DEFAULT_TONE;
  const base = `/subjects/${subject.slug}`;
  const books = booksFor(structure);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-500/10 to-transparent" />
      <div className="relative mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Breadcrumb items={[{ href: "/subjects", label: "Subjects" }, { label: subject.name }]} />

        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl animate-rise">
            <div className="flex items-center gap-3">
              <span className={`flex h-20 w-20 items-center justify-center rounded-2xl ${tone.bg} ring-1 ${tone.ring}`}><SubjectArt id={subject.id} className="h-16 w-16 drop-shadow-sm" /></span>
              <span className={`rounded-full ${tone.bg} px-3 py-1 text-xs font-semibold ${tone.text}`}>{subject.code}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{subject.name}</h1>
            <p className="mt-2 text-slate-400">{subject.description}</p>
          </div>
          {subjectStats(subject.id).mcqs > 0 && (
            <div className="flex gap-3 animate-rise [animation-delay:100ms]">
              <Link href={`/practice?subject=${subject.id}`} className="btn-brand">
                <ListChecks className="h-4 w-4" /> Practice MCQs
              </Link>
            </div>
          )}
        </header>

        {/* Continue where you left off */}
        <section className="space-y-4">
          <SectionTitle eyebrow="Pick up where you stopped" title="Continue reading" />
          <ContinueReading subjectSlug={subject.slug} />
        </section>

        {/* Areas */}
        <section className="space-y-4">
          <SectionTitle eyebrow={`${structure.shortName} subjects`} title={`${structure.areas.length} areas of the syllabus`} />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {structure.areas.map((a) => (
              <StaggerItem key={a.slug} className="h-full">
                <AreaCard area={a} href={`${base}/${a.slug}`} ppts={pptCount(structure, a.slug)} lectureIds={lecturesInArea(subject.slug, a.slug)} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Study materials */}
        <section className="space-y-4">
          <SectionTitle eyebrow="Study materials" title="Books, outline and lecture slides" />
          <div className="grid gap-4 md:grid-cols-3">
            <Reveal>
              <MaterialCard
                href={`${base}/textbooks`}
                icon={Library}
                title="Textbooks"
                text="Recommended anatomy books to read online or download."
                meta={`${books.length} book${books.length === 1 ? "" : "s"}`}
              />
            </Reveal>
            <Reveal delay={80}>
              <MaterialCard
                href={`${base}/course-outline`}
                icon={ListTree}
                title="Course outline"
                text="The official DUHS syllabus and lecture plan for the year."
                meta={structure.courseOutline.length ? `${structure.courseOutline.length} file${structure.courseOutline.length === 1 ? "" : "s"}` : "Coming soon"}
              />
            </Reveal>
            <Reveal delay={160}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                    <Presentation className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">PPTs</h3>
                    <p className="text-xs text-slate-400">Lecture slides in two collections</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {PPT_GROUPS.map((g) => (
                    <Link
                      key={g.key}
                      href={`${base}/${g.slug}`}
                      className="group flex items-center gap-3 rounded-xl border border-line px-3 py-2.5 transition hover:border-brand-500/40 hover:bg-brand-500/5"
                    >
                      <FolderOpen className="h-4 w-4 text-brand-400" />
                      <span className="flex-1 text-sm font-medium text-ink">{g.short}</span>
                      <span className="text-xs text-muted">{structure.ppts[g.key].length || "—"}</span>
                      <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </div>
  );
}

/* ======================================================================== */
/* Section / area page (/subjects/anatomy/<section>)                        */
/* ======================================================================== */
export function SubjectSection({ subject, structure, section }: { subject: Subject; structure: SubjectStructure; section: string }) {
  const tone = TONE[subject.id] ?? DEFAULT_TONE;
  const base = `/subjects/${subject.slug}`;
  const area = structure.areas.find((a) => a.slug === section);
  const group = PPT_GROUPS.find((g) => g.slug === section);

  let title = "";
  let intro = "";
  let body: React.ReactNode = null;

  if (section === "textbooks") {
    title = "Textbooks";
    intro = `Recommended ${structure.shortName.toLowerCase()} books. Read them here or download a copy.`;
    body = <BookList books={booksFor(structure)} />;
  } else if (section === "course-outline") {
    title = "Course outline";
    intro = "The DUHS syllabus and lecture plan for this subject.";
    body = <FileList files={structure.courseOutline} empty="The course outline hasn't been uploaded yet." />;
  } else if (group) {
    title = group.title;
    intro = group.description;
    body = (
      <>
        <GroupTabs base={base} current={group.key} structure={structure} />
        <FileList files={structure.ppts[group.key]} areas={structure.areas} groupByArea empty="No slides in this collection yet." />
      </>
    );
  } else if (area) {
    return <AreaPage subject={subject} structure={structure} area={area} />;
  } else {
    title = "Not found";
    intro = "This section doesn't exist.";
  }

  return (
    <ContentsLayout className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8" mainClassName="space-y-6" nav={<SubjectNav subject={subject} structure={structure} current={section} />}>
        <Breadcrumb items={[{ href: "/subjects", label: "My Subjects" }, { href: base, label: subject.name }, { label: title }]} />
        <header>
          <h1 className="page-title hero-in" style={{ "--i": 0 } as React.CSSProperties}>{title}</h1>
          <p className="page-intro hero-in mt-2" style={{ "--i": 1 } as React.CSSProperties}>{intro}</p>
        </header>
        {/* Mobile: contents as a horizontal strip */}
        <MobileContents subject={subject} structure={structure} current={section} />
        <div className="animate-rise [animation-delay:80ms]">{body}</div>
    </ContentsLayout>
  );
}

/* ======================================================================== */
/* Chapter page (/subjects/anatomy/<area>): search, lectures, prev/next      */
/* ======================================================================== */
function AreaPage({ subject, structure, area }: { subject: Subject; structure: SubjectStructure; area: SubjectStructure["areas"][number] }) {
  const base = `/subjects/${subject.slug}`;
  const [q, setQ] = useState("");
  const progress = useProgress();
  const idx = structure.areas.findIndex((a) => a.slug === area.slug);
  const prev = structure.areas[idx - 1];
  const next = structure.areas[idx + 1];
  const book = booksFor(structure).filter((b) => b.area === area.slug);
  const ql = q.trim().toLowerCase();
  const match = (f: StudyFile) => !ql || `${f.title} ${f.topic ?? ""} ${f.linkTopic ?? ""} ${f.by ?? ""}`.toLowerCase().includes(ql);
  const groups = PPT_GROUPS.map((g) => ({ g, files: areaFiles(structure.ppts[g.key], area.slug) }));
  const shown = groups.map(({ g, files }) => ({ g, files: files.filter(match) }));
  const total = groups.reduce((n, x) => n + x.files.length, 0);
  const found = shown.reduce((n, x) => n + x.files.length, 0);
  const lectureTopics = [...new Set(groups.flatMap((x) => x.files.map((f) => f.topic).filter(Boolean) as string[]))];
  const ids = [...new Set(lecturesInArea(subject.slug, area.slug))];
  const opened = progress ? ids.filter((id) => progress.opened[id]).length : 0;
  const resume = progress
    ? ids
        .filter((id) => progress.opened[id])
        .sort((a, b) => progress.opened[b].at - progress.opened[a].at)[0]
    : undefined;

  return (
    <ContentsLayout className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8 lg:py-10" nav={<SubjectNav subject={subject} structure={structure} current={area.slug} />}>
        <Breadcrumb items={[{ href: "/subjects", label: "My Subjects" }, { href: base, label: subject.name }, { label: area.title }]} />

        <header className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="hero-in flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-soft" style={{ "--i": 0 } as React.CSSProperties}>
              <AreaArt slug={area.slug} className="h-12 w-12" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow hero-in" style={{ "--i": 1 } as React.CSSProperties}>
                {structure.shortName} · Chapter {idx + 1} of {structure.areas.length}
              </p>
              <h1 className="page-title hero-in mt-1.5" style={{ "--i": 2 } as React.CSSProperties}>{area.title}</h1>
              <p className="page-intro hero-in mt-2" style={{ "--i": 3 } as React.CSSProperties}>{area.summary}</p>
              {ids.length > 0 && (
                // always rendered (hidden until progress loads) so the header keeps its height
                <div className={`hero-in mt-3 flex max-w-sm items-center gap-2 ${progress ? "" : "invisible"}`} style={{ "--i": 4 } as React.CSSProperties} aria-hidden={!progress}>
                  <ProgressBar pct={(opened / ids.length) * 100} className="flex-1" />
                  <span className="text-xs tabular-nums text-muted">{opened}/{ids.length} opened</span>
                </div>
              )}
            </div>
          </div>
          <div className="hero-in grid shrink-0 grid-cols-3 gap-2 sm:flex sm:flex-wrap" style={{ "--i": 4 } as React.CSSProperties}>
            {(resume || ids[0]) && (
              <Link href={`/read/${resume ?? ids[0]}`} className="btn-primary min-w-0 justify-center !gap-1.5 !px-2.5 sm:min-w-[8.5rem] sm:!px-5">
                <Eye className="h-4 w-4 shrink-0" /> <span className="truncate">{resume ? "Continue" : "Start"}</span>
              </Link>
            )}
            {book[0] && (
              <Link href={`/read/${book[0].id}`} className="btn-secondary min-w-0 justify-center !gap-1.5 !px-2.5 sm:!px-5" title={book[0].title}>
                <Library className="h-4 w-4 shrink-0" /> Textbook
              </Link>
            )}
            {subjectStats(subject.id).mcqs > 0 && (
              <Link href={`/practice?subject=${subject.id}`} className="btn-secondary min-w-0 justify-center !gap-1.5 !px-2.5 sm:!px-5">
                <ListChecks className="h-4 w-4 shrink-0" /> MCQs
              </Link>
            )}
          </div>
        </header>

        <div className="mt-5 lg:hidden">
          <MobileContents subject={subject} structure={structure} current={area.slug} />
        </div>

        {/* chapter search + topic quick filters */}
        <div className="sticky top-16 z-20 -mx-4 mt-6 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-2xl lg:border lg:px-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search lectures in {area.title}</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${total} lectures in ${area.title}…`} className="field !py-2.5 pl-10 pr-9" />
              {q && (
                <button onClick={() => setQ("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            {ql && <span className="text-sm text-muted">{found} of {total} lectures</span>}
          </div>
          {lectureTopics.length > 1 && (
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5" aria-label="Topics">
              {lectureTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(q.toLowerCase() === t.toLowerCase() ? "" : t)}
                  aria-pressed={q.toLowerCase() === t.toLowerCase()}
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    q.toLowerCase() === t.toLowerCase() ? "border-primary bg-soft text-primary" : "border-line bg-surface text-muted hover:border-primary/40 hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-10">
          {!ql && book.length > 0 && (
            <section aria-labelledby="book" className="space-y-3">
              <h2 id="book" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <Library className="h-5 w-5 text-primary" /> Textbook
              </h2>
              <BookList books={book} />
            </section>
          )}
          {shown.map(({ g, files }) =>
            ql && files.length === 0 ? null : (
              <section key={g.key} aria-label={`${g.short} lectures`} className="space-y-3">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <FolderOpen className="h-5 w-5 text-primary" /> {g.short} lectures
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-muted">{files.length}</span>
                </h2>
                <FileList files={files} empty={`No ${g.short} slides for ${area.title} yet.`} areas={structure.areas} currentArea={area.slug} />
              </section>
            )
          )}
          {ql && found === 0 && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">No lecture in {area.title} matches “{q}”.</p>}
        </div>

        {/* previous / next chapter */}
        <nav aria-label="Chapters" className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={`${base}/${prev.slug}`} className="card-glow group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
              <ChevronLeft className="h-5 w-5 text-muted group-hover:text-primary" />
              <AreaArt slug={prev.slug} className="h-9 w-9" />
              <span className="min-w-0">
                <span className="block text-xs text-muted">Previous chapter</span>
                <span className="block truncate font-semibold text-ink group-hover:text-primary">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`${base}/${next.slug}`} className="card-glow group flex items-center justify-end gap-3 rounded-2xl border border-line bg-surface p-4 text-right">
              <span className="min-w-0">
                <span className="block text-xs text-muted">Next chapter</span>
                <span className="block truncate font-semibold text-ink group-hover:text-primary">{next.title}</span>
              </span>
              <AreaArt slug={next.slug} className="h-9 w-9" />
              <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary" />
            </Link>
          )}
        </nav>
    </ContentsLayout>
  );
}

/* ======================================================================== */
/* Building blocks                                                          */
/* ======================================================================== */
function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-brand-400">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h2>
    </div>
  );
}

function MaterialCard({ href, icon: Icon, title, text, meta }: { href: string; icon: React.ElementType; title: string; text: string; meta: string }) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-500/40"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 transition-transform group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-semibold text-ink">{title}</h3>
      <p className="mt-1 flex-1 text-sm text-slate-400">{text}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted">{meta}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-brand-400">
          Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export const AREA_STYLE: Record<string, { grad: string; chip: string; icon: string; bar: string }> = {
  // 500–700 shades look the same in light and dark themes, so tiles stay bright in both.
  // One area per colour of the palette: pink · yellow · blue · brown · grey · blue→pink
  embryology: { grad: "from-pink-500/15 to-brand-500/10", chip: "bg-pink-500/10 text-pink-600 dark:text-pink-400", icon: "text-pink-600", bar: "from-brand-500 to-brand-600" },
  histology: { grad: "from-amber-500/15 to-brand-500/10", chip: "bg-amber-500/10 text-amber-800 dark:text-amber-400", icon: "text-amber-700", bar: "from-brand-500 to-brand-600" },
  neuroanatomy: { grad: "from-brand-500/20 to-accent-500/10", chip: "bg-brand-500/10 text-brand-400", icon: "text-brand-600", bar: "from-brand-500 to-brand-600" },
  "head-and-neck": { grad: "from-stone-500/15 to-brand-500/10", chip: "bg-stone-500/10 text-stone-400", icon: "text-stone-600", bar: "from-brand-500 to-brand-600" },
  "general-anatomy": { grad: "from-sky-500/15 to-brand-500/10", chip: "bg-sky-500/10 text-sky-800 dark:text-sky-400", icon: "text-sky-700", bar: "from-brand-500 to-brand-600" },
  "thorax-and-abdomen": { grad: "from-rose-500/15 to-brand-500/10", chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400", icon: "text-rose-600", bar: "from-brand-500 to-brand-600" },
  // Biochemistry
  "cell-water-and-ph": { grad: "from-sky-500/15 to-brand-500/10", chip: "bg-sky-500/10 text-sky-800 dark:text-sky-400", icon: "text-sky-700", bar: "from-brand-500 to-brand-600" },
  carbohydrates: { grad: "from-amber-500/15 to-brand-500/10", chip: "bg-amber-500/10 text-amber-800 dark:text-amber-400", icon: "text-amber-700", bar: "from-brand-500 to-brand-600" },
  lipids: { grad: "from-pink-500/15 to-amber-500/10", chip: "bg-pink-500/10 text-pink-600 dark:text-pink-400", icon: "text-pink-600", bar: "from-brand-500 to-brand-600" },
  proteins: { grad: "from-brand-500/20 to-pink-500/10", chip: "bg-brand-500/10 text-brand-400", icon: "text-brand-600", bar: "from-brand-500 to-brand-600" },
  "haemoglobin-and-liver": { grad: "from-rose-500/15 to-brand-500/10", chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400", icon: "text-rose-600", bar: "from-brand-500 to-brand-600" },
  enzymes: { grad: "from-sky-500/15 to-amber-500/10", chip: "bg-sky-500/10 text-sky-800 dark:text-sky-400", icon: "text-sky-700", bar: "from-brand-500 to-brand-600" },
  "nucleotides-and-genetics": { grad: "from-brand-500/15 to-pink-500/15", chip: "bg-brand-500/10 text-brand-400", icon: "text-brand-600", bar: "from-brand-500 to-brand-600" },
  "vitamins-and-minerals": { grad: "from-orange-500/15 to-amber-500/10", chip: "bg-orange-500/10 text-orange-700 dark:text-orange-400", icon: "text-orange-600", bar: "from-brand-500 to-brand-600" },
  endocrinology: { grad: "from-pink-500/15 to-brand-500/10", chip: "bg-pink-500/10 text-pink-600 dark:text-pink-400", icon: "text-pink-600", bar: "from-brand-500 to-brand-600" },
  "clinical-topics": { grad: "from-amber-500/15 to-stone-500/10", chip: "bg-amber-500/10 text-amber-800 dark:text-amber-400", icon: "text-amber-700", bar: "from-brand-500 to-brand-600" },
  "practicals-and-revision": { grad: "from-stone-500/15 to-brand-500/10", chip: "bg-stone-500/10 text-stone-400", icon: "text-stone-600", bar: "from-brand-500 to-brand-600" },
  // General Education
  "islamic-studies": { grad: "from-brand-500/20 to-amber-500/10", chip: "bg-brand-500/10 text-brand-400", icon: "text-brand-600", bar: "from-brand-500 to-brand-600" },
  "pakistan-studies": { grad: "from-emerald-500/15 to-brand-500/10", chip: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-400", icon: "text-emerald-700", bar: "from-brand-500 to-brand-600" },
  "research-methods": { grad: "from-sky-500/15 to-brand-500/10", chip: "bg-sky-500/10 text-sky-800 dark:text-sky-400", icon: "text-sky-700", bar: "from-brand-500 to-brand-600" },
  philosophy: { grad: "from-stone-500/15 to-amber-500/10", chip: "bg-stone-500/10 text-stone-400", icon: "text-stone-600", bar: "from-brand-500 to-brand-600" },
  "behavioural-sciences": { grad: "from-pink-500/15 to-brand-500/10", chip: "bg-pink-500/10 text-pink-600 dark:text-pink-400", icon: "text-pink-600", bar: "from-brand-500 to-brand-600" },
};
export const DEFAULT_AREA_STYLE = { grad: "from-brand-500/15 to-accent-500/10", chip: "bg-brand-500/15 text-brand-400", icon: "text-brand-600", bar: "from-brand-500 to-accent-500" };

function AreaCard({ area, href, ppts, lectureIds }: { area: SubjectArea; href: string; ppts: number; lectureIds: string[]; tone?: typeof DEFAULT_TONE }) {
  const st = AREA_STYLE[area.slug] ?? DEFAULT_AREA_STYLE;
  const progress = useProgress();
  const opened = progress ? lectureIds.filter((id) => progress.opened[id]).length : 0;
  const pct = lectureIds.length ? Math.round((opened / lectureIds.length) * 100) : 0;
  return (
    <Link
      href={href}
      className="card-glow group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-transform duration-300 hover:-translate-y-1"
    >
      <div className={`relative h-28 overflow-hidden border-b border-line bg-gradient-to-br ${st.grad}`}>
        <AreaArt slug={area.slug} className="absolute -bottom-2 right-3 h-28 w-28 drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full border border-line bg-surface/90 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur">
          {ppts ? `${ppts} lecture${ppts === 1 ? "" : "s"}` : "Coming soon"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink">{area.title}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-400">{area.summary}</p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">{progress ? `${opened} of ${lectureIds.length} opened` : `${lectureIds.length} lectures`}</span>
            <span className={`rounded-full px-2 py-0.5 font-semibold ${st.chip}`}>{pct}%</span>
          </div>
          <ProgressBar pct={pct} className="mt-1.5 !h-2" barClassName={`bg-gradient-to-r ${st.bar}`} />
        </div>
      </div>
    </Link>
  );
}

function GroupTabs({ base, current, structure }: { base: string; current: CollegeGroup; structure: SubjectStructure }) {
  return (
    <div className="mb-6 inline-flex rounded-xl border border-line bg-slate-850 p-1">
      {PPT_GROUPS.map((g) => (
        <Link
          key={g.key}
          href={`${base}/${g.slug}`}
          aria-current={g.key === current ? "page" : undefined}
          className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${g.key === current ? "text-ink" : "text-slate-400 hover:text-ink"}`}
        >
          {g.key === current && (
            <m.span layoutId="ppt-group-tab" transition={SPRING} className="absolute inset-0 rounded-lg bg-surface shadow-soft ring-1 ring-primary/20" />
          )}
          <span className="relative">
            {g.short} <span className="ml-1 text-xs text-muted">{structure.ppts[g.key].length}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function MobileContents({ subject, structure, current }: { subject: Subject; structure: SubjectStructure; current: string }) {
  const base = `/subjects/${subject.slug}`;
  const links = [
    { slug: "textbooks", label: "Textbooks" },
    { slug: "course-outline", label: "Outline" },
    ...PPT_GROUPS.map((g) => ({ slug: g.slug, label: `PPTs · ${g.key === "ddc" ? "DDC" : "Combined"}` })),
    ...structure.areas.map((a) => ({ slug: a.slug, label: a.title })),
  ];
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
      {links.map((l) => (
        <Link
          key={l.slug}
          href={`${base}/${l.slug}`}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
            l.slug === current ? "border-brand-500/40 bg-brand-500/10 text-brand-400" : "border-line bg-surface text-slate-300"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-surface/50 px-5 py-6 text-sm text-slate-400">
      <FileText className="h-5 w-5 shrink-0 text-muted" />
      <span>{text} New files will appear here as soon as they're added.</span>
    </div>
  );
}

function FileList({
  files,
  empty,
  areas,
  groupByArea = false,
  currentArea,
}: {
  files: StudyFile[];
  empty: string;
  areas?: SubjectArea[];
  groupByArea?: boolean;
  /** On an area page: files filed under another area get a "From …" label */
  currentArea?: string;
}) {
  const [viewing, setViewing] = useState<StudyFile | null>(null);
  const progress = useProgress();
  if (!files.length) return <EmptyState text={empty} />;

  const groups: { title?: string; files: StudyFile[] }[] =
    groupByArea && areas
      ? [
          ...areas.map((a) => ({ title: a.title, files: files.filter((f) => f.area === a.slug) })),
          { title: "Other", files: files.filter((f) => !f.area || !areas.some((a) => a.slug === f.area)) },
        ].filter((g) => g.files.length)
      : [{ files }];

  const byTopic = (list: StudyFile[]) => {
    const out: { topic?: string; files: StudyFile[] }[] = [];
    for (const f of list) {
      const group = out.find((g) => g.topic === f.topic);
      if (group) group.files.push(f);
      else out.push({ topic: f.topic, files: [f] });
    }
    return out;
  };

  return (
    <div className="space-y-10">
      {groups.map((g, gi) => (
        <div key={gi} className="space-y-6">
          {g.title && <h3 className="text-sm font-semibold text-muted">{g.title}</h3>}
          {byTopic(g.files).map((t, ti) => (
            <section key={ti} className="space-y-3">
              {t.topic && (
                <h4 className="flex items-center gap-2 text-base font-semibold text-ink">
                  <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-brand-400 to-accent-500" />
                  {t.topic}
                  <span className="rounded-full bg-slate-850 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                    {t.files.length} lecture{t.files.length === 1 ? "" : "s"}
                  </span>
                </h4>
              )}
              <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" gap={0.04}>
                {t.files.map((f) => {
                  const seen = progress?.opened[f.id];
                  const pct = seen && f.pages ? Math.min(100, Math.round((seen.page / f.pages) * 100)) : 0;
                  const from = currentArea && f.area && f.area !== currentArea ? areas?.find((a) => a.slug === f.area)?.title ?? f.area : null;
                  const canRead = !f.isPremium && !!f.pdf;
                  return (
                    <StaggerItem
                      as="article"
                      key={f.id}
                      className="card-glow group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-transform duration-300 hover:-translate-y-1"
                    >
                      {/* whole card opens the lecture */}
                      {canRead ? (
                        <Link href={`/read/${f.id}`} className="absolute inset-0 z-10" aria-label={`Open ${f.title}`} />
                      ) : f.drive && !f.isPremium ? (
                        <button onClick={() => setViewing(f)} className="absolute inset-0 z-10" aria-label={`Open ${f.title}`} />
                      ) : f.isPremium ? (
                        <Link href="/pricing" className="absolute inset-0 z-10" aria-label={`Unlock ${f.title}`} />
                      ) : null}

                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-850">
                        {f.pdf ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/files/thumbs/${f.id}.webp`}
                            alt=""
                            loading="lazy"
                            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${f.isPremium ? "blur-[2px]" : ""}`}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-amber-800 dark:text-amber-400">
                            <Presentation className="h-10 w-10" />
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                          {f.pages ? `${f.pages} slides` : "Slides"}
                        </span>
                        {f.isPremium ? (
                          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-[#1c1206]">
                            <Lock className="h-3 w-3" /> Pass
                          </span>
                        ) : progress && !seen ? (
                          <span className="absolute right-2.5 top-2.5 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-on-primary shadow">New</span>
                        ) : seen ? (
                          <span className="absolute right-2.5 top-2.5 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-[#0e7490]">
                            {pct >= 95 ? "Finished ✓" : "In progress"}
                          </span>
                        ) : null}
                        <span className="pointer-events-none absolute bottom-2.5 left-1/2 flex -translate-x-1/2 translate-y-2 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#09090b] opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <Eye className="h-3.5 w-3.5" /> {f.isPremium ? "Unlock" : seen ? "Continue" : "Open"}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-3.5">
                        <div className="flex items-start gap-2">
                          <h5 className="line-clamp-2 flex-1 text-[15px] font-semibold leading-snug text-ink">{f.title}</h5>
                          {f.pdf && <BookmarkButton id={f.id} title={f.title} />}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                          {f.by && <span className="truncate">{f.by}</span>}
                          {from && <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-400">From {from}</span>}
                        </div>
                        <div className="mt-auto flex items-center gap-2 pt-3">
                          <ProgressBar pct={pct} className="flex-1" barClassName="bg-gradient-to-r from-brand-500 to-accent-500" />
                          {f.pdf && !f.isPremium && (
                            <a
                              href={f.pdf}
                              download
                              className="relative z-20 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-ink"
                              title="Download PDF"
                              aria-label={`Download ${f.title}`}
                            >
                              <DownloadCloud className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </section>
          ))}
        </div>
      ))}
      {viewing?.drive && <DriveViewer title={viewing.title} subtitle={viewing.by} drive={viewing.drive} onClose={() => setViewing(null)} />}
    </div>
  );
}

function BookList({ books }: { books: BookItem[] }) {
  if (!books.length) return <EmptyState text="No textbooks added for this subject yet." />;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {books.map((b) => (
          <article key={b.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-soft">
            <div className="flex items-start gap-4">
              <div className={`flex h-20 w-14 shrink-0 items-end rounded-md bg-surface-2 bg-gradient-to-br ${b.coverGradient} p-1.5 shadow-md ring-1 ring-line`}>
                <BookOpen className="h-4 w-4 text-amber-800 dark:text-amber-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold leading-snug text-ink">{b.title}</h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  {b.authors}
                  {b.edition ? ` · ${b.edition}` : ""}
                </p>
                {b.isHighYield && <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">High yield</span>}
              </div>
            </div>
            <p className="mt-3 flex-1 text-sm text-slate-400">{b.description}</p>
            <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
              {b.premium ? (
                <Link href="/pricing" className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-400">
                  <Lock className="h-3.5 w-3.5" /> Unlock
                </Link>
              ) : (
                <>
                  <Link href={`/read/${b.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-400 transition hover:bg-brand-500/20">
                    <Eye className="h-3.5 w-3.5" /> {b.driveId || b.pdfUrl ? "Read & take notes" : "PDF coming soon"}
                  </Link>
                  {b.driveId && <a
                    href={driveDownloadUrl(b.driveId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-ink"
                  >
                    <DownloadCloud className="h-3.5 w-3.5" /> Download
                  </a>}
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
