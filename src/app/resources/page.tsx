"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import QuerySync from "@/components/QuerySync";
import { drivePreviewUrl, driveDownloadUrl } from "@/lib/drive";
import { BDS_RESOURCES, BDS_SUBJECTS, type StudyResource } from "@/lib/bds-content";
import { SUBJECT_STRUCTURES } from "@/lib/subject-structure";
import { lecturesInArea } from "@/lib/catalog";
import { ArrowRight, DownloadCloud, Eye, FileText, Lock, Maximize2, Search, X } from "lucide-react";
import PageHeader, { SectionHeader } from "@/components/PageHeader";
import ResourceGateway from "@/components/ResourceGateway";
import { SubjectArt, AreaArt } from "@/components/Illustrations";
import { Stagger, StaggerItem, Reveal } from "@/components/motion";
import { count } from "@/lib/stats";

/**
 * Resources: a gateway to each study library, then the lecture slides by subject and chapter,
 * then the revision notes. Nothing is previewed inline; every row opens its own page or file.
 */
export default function ResourcesPage() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewing, setViewing] = useState<StudyResource | null>(null);

  const firstYearSubjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");
  const subjectName = (id: string) => firstYearSubjects.find((s) => s.id === id)?.name ?? "";

  const q = searchQuery.trim().toLowerCase();
  const notes = BDS_RESOURCES.filter(
    (r) =>
      (selectedSubject === "all" || r.subjectId === selectedSubject) &&
      (selectedType === "all" || r.type === selectedType) &&
      (!q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
  );

  const libraries = Object.values(SUBJECT_STRUCTURES).filter((st) => {
    const s = firstYearSubjects.find((x) => x.slug === st.subjectSlug);
    return selectedSubject === "all" || s?.id === selectedSubject;
  });

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Suspense fallback={null}>
        <QuerySync
          onParams={(p) => {
            if (p.get("subject")) setSelectedSubject(p.get("subject") as string);
            if (p.get("type")) setSelectedType(p.get("type") as string);
          }}
        />
      </Suspense>

      <PageHeader eyebrow="Resources" title="Study resources" intro="Every library in one place. Pick one to open it." />

      {/* Libraries */}
      <ResourceGateway columns={3} exclude={["/resources#slides"]} />

      {/* Lecture slides by subject and chapter */}
      <section id="slides" aria-labelledby="slides-h" className="mt-16 scroll-mt-24">
        <SectionHeader
          id="slides-h"
          title="Lecture slides"
          intro="Every lecture opens in the reader, with highlights and notes."
          action={
            selectedSubject !== "all" ? (
              <button onClick={() => setSelectedSubject("all")} className="link text-sm">
                Show all subjects
              </button>
            ) : undefined
          }
        />
        {libraries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-5 py-4 text-sm text-muted">Lecture slides for {subjectName(selectedSubject)} haven&apos;t been added yet.</p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {libraries.map((st) => {
              const subject = firstYearSubjects.find((x) => x.slug === st.subjectSlug)!;
              const total = new Set(st.areas.flatMap((a) => lecturesInArea(st.subjectSlug, a.slug))).size;
              return (
                <Reveal key={st.subjectSlug} className="rounded-2xl border border-line bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <SubjectArt id={subject.id} className="h-9 w-9" />
                    <div className="min-w-0 flex-1">
                      <h3 className="card-title">{subject.name}</h3>
                      <p className="text-xs text-muted">
                        {count(total, "lecture")} · {count(st.areas.length, "chapter")}
                      </p>
                    </div>
                    <Link href={`/subjects/${st.subjectSlug}`} className="link inline-flex shrink-0 items-center gap-1 text-sm">
                      Open <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <ul className="mt-4 grid gap-1 sm:grid-cols-2">
                    {st.areas.map((a) => {
                      const n = lecturesInArea(st.subjectSlug, a.slug).length;
                      return (
                        <li key={a.slug}>
                          <Link href={`/subjects/${st.subjectSlug}/${a.slug}`} className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2">
                            <AreaArt slug={a.slug} className="h-6 w-6 shrink-0" />
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink group-hover:text-primary">{a.title}</span>
                            <span className="text-xs tabular-nums text-muted">{n}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* Revision notes */}
      <section aria-labelledby="notes-h" className="mt-16">
        <SectionHeader id="notes-h" title="Revision notes" intro="Handouts and summaries. Files appear here as they are uploaded." />
        <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search notes</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input type="search" placeholder="Search notes" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="field !py-2.5 pl-10" />
          </label>
          <select aria-label="Subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="field !w-auto cursor-pointer !py-2.5 sm:min-w-[13rem]">
            <option value="all">All subjects</option>
            {firstYearSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select aria-label="File type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="field !w-auto cursor-pointer !py-2.5">
            <option value="all">All types</option>
            <option value="PDF">PDF</option>
            <option value="PPTX">PowerPoint</option>
          </select>
        </div>

        {notes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-5 py-4 text-sm text-muted">No notes match these filters.</p>
        ) : (
          <Stagger as="ul" className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface" gap={0.04}>
            {notes.map((res) => (
              <StaggerItem as="li" key={res.id} className="flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2 sm:flex-row sm:items-center sm:px-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-soft text-primary">
                  <FileText className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-[15px] font-semibold text-ink">{res.title}</h3>
                  <p className="truncate text-[13px] text-muted">
                    {subjectName(res.subjectId)} · {res.type}
                    <span className="hidden md:inline"> · {res.description}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {res.driveFileId ? (
                    <>
                      <button onClick={() => setViewing(res)} className="btn-primary !min-h-[36px] !px-4 !py-1.5 text-sm">
                        <Eye className="h-4 w-4" /> View
                      </button>
                      <a href={driveDownloadUrl(res.driveFileId)} target="_blank" rel="noopener noreferrer" className="btn-secondary !min-h-[36px] !px-3 !py-1.5 text-sm" aria-label={`Download ${res.title}`}>
                        <DownloadCloud className="h-4 w-4" />
                      </a>
                    </>
                  ) : res.isPremium ? (
                    <Link href="/pricing" className="chip-pro !py-1">
                      <Lock className="h-3.5 w-3.5" /> Pro · coming soon
                    </Link>
                  ) : (
                    <span className="chip !py-1">File coming soon</span>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>

      {/* Drive viewer, for notes whose file has been added */}
      {viewing?.driveFileId && (
        <div className="fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6" onClick={() => setViewing(null)} role="dialog" aria-modal="true" aria-label={viewing.title}>
          <div className="flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-line bg-surface" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-ink">{viewing.title}</div>
                <div className="text-xs text-muted">{viewing.type}</div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <a href={driveDownloadUrl(viewing.driveFileId)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-surface-2 hover:text-ink">
                  <DownloadCloud className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Download</span>
                </a>
                <a href={`https://drive.google.com/file/d/${viewing.driveFileId}/view`} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-slate-300 hover:bg-surface-2 hover:text-ink" aria-label="Open in Google Drive">
                  <Maximize2 className="h-4 w-4" />
                </a>
                <button onClick={() => setViewing(null)} className="rounded-lg p-2 text-slate-300 hover:bg-surface-2 hover:text-ink" aria-label="Close viewer">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <iframe src={drivePreviewUrl(viewing.driveFileId)} title={viewing.title} className="w-full flex-1 bg-black" allow="autoplay" />
          </div>
        </div>
      )}
    </div>
  );
}
