"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, Film, Images, ListChecks, FileText, Info } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import QuerySync from "@/components/QuerySync";
import { SubjectArt } from "@/components/Illustrations";
import { Stagger, StaggerItem } from "@/components/motion";
import { BDS_SUBJECTS } from "@/lib/bds-content";
import { QBANK_SETS } from "@/lib/qbank-meta";
import { QBANK_FILES, QBANK_FILE_GROUPS, QBANK_GROUP_NOTES, type QBankFile } from "@/lib/qbank-library";

/**
 * The Question Bank hub: the topic-wise MCQ sets (practised in /practice and /past-papers)
 * and the files that are read rather than practised (question banks, class tests, OSPE and viva, notes).
 */

const SUBJECT_IDS = ["anat", "phys", "biochem", "oral-bio"];

export default function QuestionBankPage() {
  const [subject, setSubject] = useState("anat");
  const subj = BDS_SUBJECTS.find((s) => s.id === subject);
  const sets = QBANK_SETS.filter((s) => s.subjectId === subject);
  const practice = sets.filter((s) => !s.pastPaper);
  const papers = sets.filter((s) => s.pastPaper);
  const files = QBANK_FILES.filter((f) => f.subjectId === subject);
  const n = (list: typeof sets) => list.reduce((a, s) => a + s.count, 0);
  const modules = Array.from(new Set(practice.map((s) => s.module)));

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Suspense fallback={null}>
        <QuerySync onParams={(p) => SUBJECT_IDS.includes(p.get("subject") ?? "") && setSubject(p.get("subject") as string)} />
      </Suspense>
      <PageHeader
        eyebrow="Question bank"
        title="Topic-wise question bank"
        intro="Practise MCQs by topic, work through past papers, and open the class tests, OSPE and viva material for each subject."
      />

      {/* subject switch */}
      <div role="tablist" aria-label="Subject" className="flex flex-wrap gap-2">
        {SUBJECT_IDS.map((id) => {
          const s = BDS_SUBJECTS.find((x) => x.id === id);
          const on = id === subject;
          const count = QBANK_SETS.filter((x) => x.subjectId === id).reduce((a, x) => a + x.count, 0);
          return (
            <button
              key={id}
              role="tab"
              aria-selected={on}
              onClick={() => setSubject(id)}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors ${on ? "border-primary bg-soft ring-1 ring-primary" : "border-line bg-surface hover:border-primary/40"}`}
            >
              <SubjectArt id={id} className="h-7 w-7" />
              <span>
                <span className={`block text-sm font-semibold ${on ? "text-primary" : "text-ink"}`}>{s?.name}</span>
                <span className="block text-xs text-muted">{count.toLocaleString()} MCQs</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* practice + past papers */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="qb-practice" className="min-w-0 rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="qb-practice" className="card-title flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" /> Topic practice sets
              </h2>
              <p className="mt-1 text-sm text-muted">
                {practice.length ? `${n(practice).toLocaleString()} questions in ${practice.length} sets, with answers and explanations.` : "No practice sets for this subject yet — its past papers are below."}
              </p>
            </div>
            {practice.length > 0 && (
              <Link href={`/practice?subject=${subject}`} className="btn-primary shrink-0 !px-3 text-xs">
                Practise <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          {modules.map((mod) => (
            <div key={mod} className="mt-4">
              <h3 className="eyebrow">{mod}</h3>
              <ul className="mt-1.5 divide-y divide-line">
                {practice
                  .filter((s) => s.module === mod)
                  .map((s) => (
                    <li key={s.id}>
                      <Link href={`/practice?set=${s.id}`} className="group flex items-center justify-between gap-3 py-2 text-sm">
                        <span className="min-w-0 truncate text-ink group-hover:text-primary">{s.title}</span>
                        <span className="shrink-0 text-xs tabular-nums text-muted">{s.count} Qs</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </section>

        <section aria-labelledby="qb-papers" className="min-w-0 rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="qb-papers" className="card-title flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> Past papers by topic
              </h2>
              <p className="mt-1 text-sm text-muted">
                {papers.length ? `${n(papers).toLocaleString()} past-paper questions in ${papers.length} topics.` : "No topic-wise past papers for this subject yet."}
              </p>
            </div>
            {papers.length > 0 && (
              <Link href="/past-papers" className="btn-secondary shrink-0 !px-3 text-xs">
                Browse <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          <ul className="mt-3 divide-y divide-line">
            {papers.map((s) => (
              <li key={s.id}>
                <Link href={`/practice?set=${s.id}`} className="group flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="min-w-0 truncate text-ink group-hover:text-primary">
                    {s.title}
                    {s.module !== "Past papers" && s.module !== s.title && <span className="text-muted"> · {s.module}</span>}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted">{s.count} Qs</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* files */}
      <section aria-labelledby="qb-files" className="mt-10">
        <h2 id="qb-files" className="section-title flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" /> {subj?.name} files
        </h2>
        <p className="mt-1 text-sm text-muted">Question banks, class tests, OSPE and viva material — open any file in the reader.</p>
        {QBANK_FILE_GROUPS.filter((g) => files.some((f) => f.group === g)).map((g) => (
          <div key={g} className="mt-6">
            <h3 className="text-sm font-bold text-ink">{g}</h3>
            {QBANK_GROUP_NOTES[g] && (
              <p className="mt-1 flex items-start gap-1.5 text-xs text-muted">
                <Info className="mt-px h-3.5 w-3.5 shrink-0" /> {QBANK_GROUP_NOTES[g]}
              </p>
            )}
            <Stagger as="ul" className="mt-2.5 grid gap-2 sm:grid-cols-2" gap={0.02}>
              {files
                .filter((f) => f.group === g)
                .map((f) => (
                  <FileRow key={f.id} file={f} />
                ))}
            </Stagger>
          </div>
        ))}
      </section>
    </div>
  );
}

function FileRow({ file }: { file: QBankFile }) {
  const Icon = file.kind === "video" ? Film : file.kind === "album" ? Images : FileText;
  const meta = file.kind === "video" ? "Video" : file.kind === "album" ? `${file.pages} photos` : `${file.pages} page${file.pages === 1 ? "" : "s"}`;
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink group-hover:text-primary">{file.title}</span>
        <span className="block text-xs text-muted">{meta}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </>
  );
  const cls = "group flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 transition duration-200 hover:border-primary/40";
  return (
    <StaggerItem as="li">
      {file.kind === "video" ? (
        <a href={file.file} target="_blank" rel="noopener" className={cls}>
          {inner}
        </a>
      ) : (
        <Link href={`/read/${file.id}`} className={cls}>
          {inner}
        </Link>
      )}
    </StaggerItem>
  );
}
