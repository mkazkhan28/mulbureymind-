"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers, ListChecks, Lock, Presentation, Search } from "lucide-react";
import { BDS_SUBJECTS, BDS_YEARS, BDS_TOPICS } from "@/lib/bds-content";
import { getSubjectStructure } from "@/lib/subject-structure";
import { SubjectArt, areaIcon } from "@/components/Illustrations";
import PageHeader from "@/components/PageHeader";
import { subjectStats, count } from "@/lib/stats";
import { Stagger, StaggerItem, m, SPRING } from "@/components/motion";
import { useProgress } from "@/lib/progress";
import { lecturesInArea, catalogById } from "@/lib/catalog";

/** "My Subjects": every subject of the year with its chapters one click away. */
export default function SubjectsPage() {
  const [selectedYear, setSelectedYear] = useState("bds-1");
  const [query, setQuery] = useState("");
  const progress = useProgress();
  const year = BDS_YEARS.find((y) => y.id === selectedYear);
  const q = query.trim().toLowerCase();

  const subjects = BDS_SUBJECTS.filter((s) => s.yearId === selectedYear).map((s) => {
    const structure = getSubjectStructure(s.slug);
    const chapters = structure
      ? structure.areas.map((a) => ({
          key: a.slug,
          title: a.title,
          href: `/subjects/${s.slug}/${a.slug}`,
          icon: areaIcon(a.slug),
          meta: count(lecturesInArea(s.slug, a.slug).length, "lecture"),
          words: `${a.title} ${a.topics.join(" ")} ${lecturesInArea(s.slug, a.slug)
            .map((id) => catalogById.get(id)?.title ?? "")
            .join(" ")}`,
        }))
      : BDS_TOPICS.filter((t) => t.subjectId === s.id).map((t) => ({ key: t.slug, title: t.name, href: `/subjects/${s.slug}/${t.slug}`, icon: null, meta: "", words: `${t.name} ${t.description}` }));
    const subjectMatch = !q || `${s.name} ${s.code} ${s.description}`.toLowerCase().includes(q);
    const shown = subjectMatch ? chapters : chapters.filter((c) => c.words.toLowerCase().includes(q));
    return { s, structure, chapters: shown, visible: subjectMatch || shown.length > 0 };
  });
  const visible = subjects.filter((x) => x.visible);

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        eyebrow="My subjects"
        title="Your subjects and chapters"
        intro="Every subject of your year with its chapters listed — open any chapter to get its lectures, notes and MCQs."
      />

      {/* Year + filter */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="BDS year" className="inline-flex flex-wrap gap-1 rounded-xl border border-line bg-surface-2 p-1">
          {BDS_YEARS.map((y) => {
            const active = y.id === selectedYear;
            return (
              <button
                key={y.id}
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedYear(y.id)}
                className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${active ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {active && <m.span layoutId="year-tab" transition={SPRING} className="absolute inset-0 rounded-lg bg-surface shadow-soft ring-1 ring-primary/20" />}
                <span className="relative">{y.name.replace(/\s*\((Active|Pending)\)/, "")}</span>
                {!y.isActive && <Lock className="relative h-3.5 w-3.5" aria-label="coming soon" />}
              </button>
            );
          })}
        </div>
        <label className="relative w-full lg:w-80">
          <span className="sr-only">Filter subjects and chapters</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter subjects or chapters…" className="field !py-2.5 pl-10" />
        </label>
      </div>

      {!year?.isActive ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface/60 p-10 text-center">
          <Lock className="mx-auto h-8 w-8 text-muted" />
          <h2 className="card-title mt-3">{year?.name.replace(/\s*\(.*\)/, "")} is coming soon</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">{year?.description}. Content for this year is being prepared.</p>
          <button onClick={() => setSelectedYear("bds-1")} className="btn-secondary mt-5">
            Back to BDS 1st Year
          </button>
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">No subject or chapter matches “{query}”.</p>
      ) : (
        <Stagger key={selectedYear + q} immediate className="grid gap-5 lg:grid-cols-2">
          {visible.map(({ s, structure, chapters }) => {
            const st = subjectStats(s.id);
            const ids = structure ? [...new Set(structure.areas.flatMap((a) => lecturesInArea(s.slug, a.slug)))] : [];
            const opened = progress ? ids.filter((id) => progress.opened[id]).length : 0;
            return (
              <StaggerItem key={s.id} as="article" className="card-glow flex flex-col rounded-2xl border border-line bg-surface p-5 transition-transform duration-300 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-soft">
                    <SubjectArt id={s.id} className="h-12 w-12" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold tracking-wide text-primary">{s.code}</span>
                    <h2 className="font-display text-xl font-bold leading-tight text-ink">
                      <Link href={`/subjects/${s.slug}`} className="hover:text-primary">
                        {s.name}
                      </Link>
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{s.description}</p>
                  </div>
                </div>

                {/* resource availability */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {st.lectures > 0 && (
                    <span className="chip">
                      <Presentation className="h-3 w-3" /> {count(st.lectures, "lecture")}
                    </span>
                  )}
                  {st.books > 0 && <span className="chip">{count(st.books, "textbook")}</span>}
                  <span className="chip">
                    <ListChecks className="h-3 w-3" /> {st.mcqs ? count(st.mcqs, "MCQ") : "MCQs soon"}
                  </span>
                  {st.decks > 0 && (
                    <span className="chip">
                      <Layers className="h-3 w-3" /> {count(st.decks, "flashcard deck")}
                    </span>
                  )}
                  {ids.length > 0 && progress && <span className="chip-pro">{opened}/{ids.length} opened</span>}
                </div>

                {/* chapters, direct links */}
                <div className="mt-5 border-t border-line pt-4">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                    {chapters.length} chapter{chapters.length === 1 ? "" : "s"}
                  </h3>
                  <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {chapters.map((c) => (
                      <li key={c.key} className="min-w-0">
                        <Link href={c.href} className="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-slate-300 transition hover:bg-soft hover:text-primary">
                          {c.icon ? <c.icon className="h-5 w-5 shrink-0" /> : <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />}
                          <span className="min-w-0 flex-1 truncate">{c.title}</span>
                          {c.meta && <span className="shrink-0 text-[11px] text-muted">{c.meta}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  <Link href={`/subjects/${s.slug}`} className="btn-primary !min-h-[40px] !py-2">
                    Open subject <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={`/practice?subject=${s.id}`} className="btn-secondary !min-h-[40px] !py-2">
                    Practice MCQs
                  </Link>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
