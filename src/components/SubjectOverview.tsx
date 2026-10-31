"use client";

/**
 * One subject page for every subject: header, chapter search, the complete chapter
 * list with direct links to each chapter's lectures, books, MCQs and flashcards,
 * then the subject's study materials. Works for Anatomy (areas with lectures) and
 * for subjects whose chapters are topics.
 */
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight, FileText, FolderOpen, Layers, Library, ListChecks, ListTree, PlayCircle, Presentation, Search, X } from "lucide-react";
import { BDS_FLASHCARD_DECKS, BDS_MCQS, BDS_RESOURCES, BDS_TOPICS, type Subject } from "@/lib/bds-content";
import { BOOKS_DATA } from "@/lib/books";
import { PPT_GROUPS, type SubjectStructure } from "@/lib/subject-structure";
import { catalogById, lecturesInArea } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";
import { subjectStats, count } from "@/lib/stats";
import { SubjectArt, AreaArt } from "@/components/Illustrations";
import { ContinueReading } from "@/components/Motivation";
import { SectionHeader } from "@/components/PageHeader";
import { Stagger, StaggerItem, ProgressBar } from "@/components/motion";
import { BookmarkButton } from "@/components/ui";

type Chapter = {
  key: string;
  title: string;
  summary: string;
  href: string;
  art: React.ReactNode;
  topics: string[];
  lectureIds: string[];
  mcqs: number;
  book?: { id: string; title: string };
};

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
          {it.href ? (
            <Link href={it.href} className="transition hover:text-ink">
              {it.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-ink">
              {it.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default function SubjectOverview({ subject, structure }: { subject: Subject; structure?: SubjectStructure }) {
  const [q, setQ] = useState("");
  const progress = useProgress();
  const st = subjectStats(subject.id);
  const base = `/subjects/${subject.slug}`;
  const decks = BDS_FLASHCARD_DECKS.filter((d) => d.subjectId === subject.id);
  const notes = BDS_RESOURCES.filter((r) => r.subjectId === subject.id);
  const books = BOOKS_DATA.filter((b) => b.subjectId === (structure?.bookSubjectId ?? subject.id));

  const chapters: Chapter[] = useMemo(
    () =>
      structure
        ? structure.areas.map((a) => {
            const b = BOOKS_DATA.find((x) => x.area === a.slug);
            return {
              key: a.slug,
              title: a.title,
              summary: a.summary,
              href: `${base}/${a.slug}`,
              art: <AreaArt slug={a.slug} className="h-10 w-10" />,
              topics: a.topics,
              lectureIds: [...new Set(lecturesInArea(subject.slug, a.slug))],
              mcqs: 0,
              book: b ? { id: b.id, title: b.title } : undefined,
            };
          })
        : BDS_TOPICS.filter((t) => t.subjectId === subject.id).map((t) => ({
            key: t.slug,
            title: t.name,
            summary: t.description,
            href: `${base}/${t.slug}`,
            art: <SubjectArt id={subject.id} className="h-9 w-9" />,
            topics: [],
            lectureIds: [],
            mcqs: BDS_MCQS.filter((m) => m.topicId === t.id).length,
          })),
    [structure, base, subject.id, subject.slug]
  );

  // Filter: chapter title/summary/topics, and lecture titles inside the chapter (shown as direct hits)
  const ql = q.trim().toLowerCase();
  const filtered = chapters
    .map((c) => {
      if (!ql) return { c, hits: [] as string[], match: true };
      const hits = c.lectureIds.filter((id) => catalogById.get(id)?.title.toLowerCase().includes(ql));
      const match = `${c.title} ${c.summary} ${c.topics.join(" ")}`.toLowerCase().includes(ql);
      return { c, hits, match: match || hits.length > 0 };
    })
    .filter((x) => x.match);

  const firstLecture = useMemo(() => {
    const id = chapters.flatMap((c) => c.lectureIds)[0];
    return id ? catalogById.get(id) ?? null : null;
  }, [chapters]);
  const lastInSubject = useMemo(() => {
    if (!progress) return null;
    const mine = new Set(chapters.flatMap((c) => c.lectureIds));
    const top = Object.entries(progress.opened)
      .filter(([id]) => mine.has(id))
      .sort((a, b) => b[1].at - a[1].at)[0];
    return top ? catalogById.get(top[0]) ?? null : null;
  }, [progress, chapters]);

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Breadcrumb items={[{ href: "/subjects", label: "My Subjects" }, { label: subject.name }]} />

      {/* Header */}
      <header className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 items-start gap-5">
          <span className="hero-in flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-soft ring-1 ring-primary/15" style={{ "--i": 0 } as React.CSSProperties}>
            <SubjectArt id={subject.id} className="h-16 w-16" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow hero-in" style={{ "--i": 1 } as React.CSSProperties}>
              {subject.code} · BDS 1st Year
            </p>
            <h1 className="page-title hero-in mt-2" style={{ "--i": 2 } as React.CSSProperties}>
              {subject.name}
            </h1>
            <p className="page-intro hero-in mt-2" style={{ "--i": 3 } as React.CSSProperties}>
              {subject.description}
            </p>
            <div className="hero-in mt-4 flex flex-wrap gap-1.5" style={{ "--i": 4 } as React.CSSProperties}>
              <span className="chip">
                <ListTree className="h-3 w-3" /> {count(chapters.length, "chapter")}
              </span>
              {st.lectures > 0 && (
                <span className="chip">
                  <Presentation className="h-3 w-3" /> {count(st.lectures, "lecture")}
                </span>
              )}
              {books.length > 0 && (
                <span className="chip">
                  <Library className="h-3 w-3" /> {count(books.length, "textbook")}
                </span>
              )}
              <span className="chip">
                <ListChecks className="h-3 w-3" /> {st.mcqs ? count(st.mcqs, "MCQ") : "MCQs coming"}
              </span>
              {decks.length > 0 && (
                <span className="chip">
                  <Layers className="h-3 w-3" /> {count(decks.length, "flashcard deck")}
                </span>
              )}
              {notes.length > 0 && (
                <span className="chip">
                  <FileText className="h-3 w-3" /> {count(notes.length, "note")}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Same buttons before and after progress loads, so the header never jumps:
            "Start reading" becomes "Continue" once we know the last lecture opened. */}
        <div className="hero-in flex shrink-0 flex-wrap gap-2" style={{ "--i": 5 } as React.CSSProperties}>
          {(lastInSubject || firstLecture) && (
            <Link href={(lastInSubject ?? firstLecture)!.href} className="btn-primary min-w-[10rem] justify-center">
              <PlayCircle className="h-4 w-4" /> {lastInSubject ? "Continue" : "Start reading"}
            </Link>
          )}
          <Link href={`/practice?subject=${subject.id}`} className={lastInSubject || firstLecture ? "btn-secondary" : "btn-primary"}>
            <ListChecks className="h-4 w-4" /> Practice MCQs
          </Link>
        </div>
      </header>

      {/* Chapters */}
      <section aria-labelledby="chapters" className="mt-12">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="chapters" className="section-title">
              Chapters
            </h2>
            <p className="section-intro">Open a chapter for its lectures, or use the buttons to jump straight to a resource.</p>
          </div>
          <label className="relative w-full sm:w-80">
            <span className="sr-only">Search chapters and lectures in {subject.name}</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chapters and lectures…" className="field !py-2.5 pl-10 pr-9" />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink" aria-label="Clear">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">No chapter or lecture matches “{q}”.</p>
        ) : (
          <Stagger key={ql} immediate className="space-y-3">
            {filtered.map(({ c, hits }, i) => {
              const opened = progress ? c.lectureIds.filter((id) => progress.opened[id]).length : 0;
              return (
                <StaggerItem key={c.key} as="article" className="card-glow group relative rounded-2xl border border-line bg-surface p-4 transition-transform duration-300 sm:p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <Link href={c.href} className="flex min-w-0 flex-1 items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-soft">{c.art}</span>
                      <span className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Chapter {i + 1}</span>
                        <span className="card-title block text-lg group-hover:text-primary">{c.title}</span>
                        <span className="mt-0.5 line-clamp-1 block text-sm text-muted">{c.topics.length ? c.topics.join(" · ") : c.summary}</span>
                        {c.lectureIds.length > 0 && progress && (
                          <span className="mt-2 flex max-w-xs items-center gap-2">
                            <ProgressBar pct={(opened / c.lectureIds.length) * 100} className="flex-1 !h-1" />
                            <span className="text-[11px] tabular-nums text-muted">
                              {opened}/{c.lectureIds.length}
                            </span>
                          </span>
                        )}
                      </span>
                    </Link>
                    {/* direct resource access */}
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {c.lectureIds.length > 0 && (
                        <Link href={c.href} className="btn-primary !min-h-[38px] !px-3.5 !py-1.5 !text-xs">
                          <Presentation className="h-3.5 w-3.5" /> {count(c.lectureIds.length, "lecture")}
                        </Link>
                      )}
                      {c.book && (
                        <Link href={`/read/${c.book.id}`} className="btn-secondary !min-h-[38px] !px-3.5 !py-1.5 !text-xs" title={c.book.title}>
                          <Library className="h-3.5 w-3.5" /> Textbook
                        </Link>
                      )}
                      {!structure && (
                        <Link href={c.href} className="btn-primary !min-h-[38px] !px-3.5 !py-1.5 !text-xs">
                          <BookOpen className="h-3.5 w-3.5" /> Open chapter
                        </Link>
                      )}
                      <Link href={`/practice?subject=${subject.id}`} className="btn-secondary !min-h-[38px] !px-3.5 !py-1.5 !text-xs">
                        <ListChecks className="h-3.5 w-3.5" /> {c.mcqs ? count(c.mcqs, "MCQ") : "MCQs"}
                      </Link>
                      {decks.length > 0 && (
                        <Link href={`/flashcards/${decks[0].id}`} className="btn-secondary !min-h-[38px] !px-3.5 !py-1.5 !text-xs">
                          <Layers className="h-3.5 w-3.5" /> Flashcards
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* lectures matching the search, one click away */}
                  {hits.length > 0 && (
                    <ul className="mt-4 grid gap-1 border-t border-line pt-3 sm:grid-cols-2">
                      {hits.slice(0, 6).map((id) => {
                        const it = catalogById.get(id)!;
                        return (
                          <li key={id} className="flex min-w-0 items-center gap-2">
                            <Link href={it.href} className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-300 hover:bg-soft hover:text-primary">
                              <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
                              <span className="truncate">{it.title}</span>
                            </Link>
                            <BookmarkButton id={id} title={it.title} />
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </section>

      {/* Continue */}
      {structure && (
        <section aria-labelledby="continue" className="mt-14">
          <SectionHeader id="continue" title="Continue reading" intro={`Your recent ${structure.shortName} lectures.`} />
          <ContinueReading subjectSlug={subject.slug} />
        </section>
      )}

      {/* Study materials */}
      <section aria-labelledby="materials" className="mt-14">
        <SectionHeader id="materials" title="Study materials" intro={`Everything else for ${subject.name}, in one place.`} />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {structure ? (
            <>
              <MaterialLink href={`${base}/textbooks`} icon={Library} title="Textbooks" meta={count(books.length, "book") || "Coming soon"} text="Recommended books, readable in the site." />
              <MaterialLink href={`${base}/course-outline`} icon={ListTree} title="Course outline" meta={count(structure.courseOutline.length, "file") || "Coming soon"} text="The DUHS syllabus and lecture plan." />
              {PPT_GROUPS.map((g) => (
                <MaterialLink key={g.key} href={`${base}/${g.slug}`} icon={FolderOpen} title={g.title} meta={count(structure.ppts[g.key].length, "lecture") || "Coming soon"} text={g.description} />
              ))}
            </>
          ) : (
            <>
              <MaterialLink href={`/resources?subject=${subject.id}`} icon={FileText} title="Notes & PPTs" meta={count(notes.length, "file") || "Coming soon"} text="Handouts and slide decks for this subject." />
              <MaterialLink href="/books" icon={Library} title="Textbooks" meta={count(books.length, "book") || "Coming soon"} text="Recommended reference books." />
            </>
          )}
          {decks.length > 0 && <MaterialLink href={`/flashcards/${decks[0].id}`} icon={Layers} title="Flashcards" meta={count(decks.length, "deck")} text={decks.map((d) => d.title).join(", ")} />}
          <MaterialLink href={`/practice?subject=${subject.id}`} icon={ListChecks} title="MCQ practice" meta={st.mcqs ? count(st.mcqs, "question") : "Coming soon"} text="Tutor, timed and mock exam modes." />
        </Stagger>
      </section>
    </div>
  );
}

function MaterialLink({ href, icon: Icon, title, text, meta }: { href: string; icon: React.ElementType; title: string; text: string; meta: string }) {
  return (
    <StaggerItem>
      <Link href={href} className="card-glow group flex h-full items-start gap-4 rounded-2xl border border-line bg-surface p-4 transition-transform duration-300 hover:-translate-y-0.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="card-title block group-hover:text-primary">{title}</span>
          <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{text}</span>
          <span className="mt-2 block text-xs font-semibold text-muted">{meta}</span>
        </span>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
      </Link>
    </StaggerItem>
  );
}
