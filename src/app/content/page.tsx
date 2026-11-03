"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Eye, Lock, Download, Search, ExternalLink, X, ArrowRight, ListChecks, Library } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { SubjectArt } from "@/components/Illustrations";
import { Stagger, StaggerItem } from "@/components/motion";

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT DATA — Replace the driveId values with your actual Google Drive
// file IDs. The driveId is the part after /d/ in a Google Drive share link.
// Example: https://drive.google.com/file/d/THIS_PART_HERE/view
// ─────────────────────────────────────────────────────────────────────────────

type FileType = "pdf" | "ppt" | "doc" | "folder";

interface ContentFile {
  id: string;
  title: string;
  type: FileType;
  driveId: string;         // Google Drive file ID
  subject: string;
  topic: string;
  year?: string;           // e.g. "2023" for past papers
  pages?: number;
  premium: boolean;
  description?: string;
}

const CONTENT_FILES: ContentFile[] = [
  // ── ANATOMY BOOKS ────────────────────────────────────────────────────────
  {
    id: "anat-book-gray",
    title: "Gray's Anatomy for Students (Relevant Chapters)",
    type: "pdf",
    driveId: "PASTE_GRAYS_ANATOMY_PDF_ID_HERE",
    subject: "anat",
    topic: "Books",
    premium: false,
    description: "Key chapters for DUHS BDS 1st Year: Head & Neck, Thorax, Embryology",
  },
  {
    id: "anat-book-snell",
    title: "Snell's Clinical Anatomy — BDS Edition",
    type: "pdf",
    driveId: "PASTE_SNELL_ANATOMY_PDF_ID_HERE",
    subject: "anat",
    topic: "Books",
    premium: true,
    description: "Clinical anatomy with dental relevance — preferred by DUHS examiners",
  },
  {
    id: "anat-book-histology",
    title: "Junqueira's Basic Histology (Histology Chapters)",
    type: "pdf",
    driveId: "PASTE_JUNQUEIRA_HISTOLOGY_PDF_ID_HERE",
    subject: "anat",
    topic: "Books",
    premium: true,
    description: "Epithelium, connective tissue, bone and cartilage — high yield for DUHS",
  },

  // ── PHYSIOLOGY BOOKS ──────────────────────────────────────────────────────
  {
    id: "phys-book-guyton",
    title: "Guyton & Hall Medical Physiology (BDS Chapters)",
    type: "pdf",
    driveId: "PASTE_GUYTON_PHYSIOLOGY_PDF_ID_HERE",
    subject: "phys",
    topic: "Books",
    premium: false,
    description: "Standard reference for DUHS Physiology — CVS, Blood, Renal, Respiratory",
  },
  {
    id: "phys-book-ganong",
    title: "Ganong's Review of Medical Physiology",
    type: "pdf",
    driveId: "PASTE_GANONG_PHYSIOLOGY_PDF_ID_HERE",
    subject: "phys",
    topic: "Books",
    premium: true,
    description: "Concise review with exam-focused summaries for BDS 1st Year",
  },

  // ── ORAL BIOLOGY BOOKS ────────────────────────────────────────────────────
  {
    id: "oral-book-ten-cate",
    title: "Ten Cate's Oral Histology",
    type: "pdf",
    driveId: "PASTE_TEN_CATE_PDF_ID_HERE",
    subject: "oral-bio",
    topic: "Books",
    premium: false,
    description: "Primary textbook for Oral Biology & Tooth Morphology at DUHS",
  },
  {
    id: "oral-book-wheeler",
    title: "Wheeler's Dental Anatomy, Physiology & Occlusion",
    type: "pdf",
    driveId: "PASTE_WHEELER_PDF_ID_HERE",
    subject: "oral-bio",
    topic: "Books",
    premium: true,
    description: "Tooth morphology and carving guide — essential for practicals",
  },

  // ── BIOCHEMISTRY BOOKS ────────────────────────────────────────────────────
  {
    id: "biochem-book-lehninger",
    title: "Lehninger Principles of Biochemistry (Key Chapters)",
    type: "pdf",
    driveId: "PASTE_LEHNINGER_PDF_ID_HERE",
    subject: "biochem",
    topic: "Books",
    premium: false,
    description: "Metabolism, enzymes, molecular biology — DUHS BDS 1st Year relevant chapters",
  },
  {
    id: "biochem-book-harper",
    title: "Harper's Illustrated Biochemistry",
    type: "pdf",
    driveId: "PASTE_HARPERS_BIOCHEM_PDF_ID_HERE",
    subject: "biochem",
    topic: "Books",
    premium: true,
    description: "Most recommended by DUHS examiners — clinical correlations included",
  },
  {
    id: "biochem-book-lippincott",
    title: "Lippincott's Illustrated Biochemistry Reviews",
    type: "pdf",
    driveId: "PASTE_LIPPINCOTT_BIOCHEM_PDF_ID_HERE",
    subject: "biochem",
    topic: "Books",
    premium: true,
    description: "High-yield review with colored diagrams — great for rapid revision",
  },

  // ── PHARMACOLOGY BOOKS ────────────────────────────────────────────────────
  {
    id: "pharm-book-katzung",
    title: "Katzung Basic & Clinical Pharmacology",
    type: "pdf",
    driveId: "PASTE_KATZUNG_PDF_ID_HERE",
    subject: "pharm",
    topic: "Books",
    premium: false,
    description: "Primary pharmacology text — Local anesthetics, antimicrobials, analgesics",
  },
  {
    id: "pharm-book-rang",
    title: "Rang & Dale's Pharmacology",
    type: "pdf",
    driveId: "PASTE_RANG_DALE_PDF_ID_HERE",
    subject: "pharm",
    topic: "Books",
    premium: true,
    description: "Comprehensive pharmacology with dental drug focus for BDS students",
  },

  // ── PATHOLOGY BOOKS ───────────────────────────────────────────────────────
  {
    id: "path-book-robbins",
    title: "Robbins Basic Pathology (BDS Chapters)",
    type: "pdf",
    driveId: "PASTE_ROBBINS_PATHOLOGY_PDF_ID_HERE",
    subject: "path",
    topic: "Books",
    premium: false,
    description: "Inflammation, neoplasia, cell injury — the DUHS standard for Pathology",
  },
  {
    id: "path-book-harsh",
    title: "Harsh Mohan Textbook of Pathology",
    type: "pdf",
    driveId: "PASTE_HARSH_MOHAN_PDF_ID_HERE",
    subject: "path",
    topic: "Books",
    premium: true,
    description: "Pakistani curriculum-friendly pathology text — used widely at DUHS",
  },

  // ── ANATOMY PAST PAPERS ───────────────────────────────────────────────────
  {
    id: "anat-pp-2024",
    title: "Anatomy Past Paper 2024 — Annual Professional",
    type: "pdf",
    driveId: "PASTE_ANATOMY_2024_PAPER_ID_HERE",
    subject: "anat",
    topic: "Past Papers",
    year: "2024",
    pages: 4,
    premium: false,
    description: "DUHS BDS 1st Year Annual Professional Examination — General Anatomy & Histology",
  },
  {
    id: "anat-pp-2023",
    title: "Anatomy Past Paper 2023 — Annual Professional",
    type: "pdf",
    driveId: "PASTE_ANATOMY_2023_PAPER_ID_HERE",
    subject: "anat",
    topic: "Past Papers",
    year: "2023",
    pages: 4,
    premium: false,
    description: "DUHS BDS 1st Year Anatomy paper with SEQs and MCQs",
  },
  {
    id: "anat-pp-2022",
    title: "Anatomy Past Paper 2022",
    type: "pdf",
    driveId: "PASTE_ANATOMY_2022_PAPER_ID_HERE",
    subject: "anat",
    topic: "Past Papers",
    year: "2022",
    premium: true,
  },
  {
    id: "anat-pp-2021",
    title: "Anatomy Past Paper 2021",
    type: "pdf",
    driveId: "PASTE_ANATOMY_2021_PAPER_ID_HERE",
    subject: "anat",
    topic: "Past Papers",
    year: "2021",
    premium: true,
  },
  {
    id: "anat-pp-2020",
    title: "Anatomy Past Paper 2020",
    type: "pdf",
    driveId: "PASTE_ANATOMY_2020_PAPER_ID_HERE",
    subject: "anat",
    topic: "Past Papers",
    year: "2020",
    premium: true,
  },
  {
    id: "anat-q-headneck",
    title: "Head & Neck Anatomy — Topic-wise Questions",
    type: "pdf",
    driveId: "PASTE_ANAT_HEAD_NECK_QUESTIONS_ID_HERE",
    subject: "anat",
    topic: "Head & Neck",
    premium: true,
  },
  {
    id: "anat-q-cranial",
    title: "Cranial Nerves — Topic-wise Questions",
    type: "pdf",
    driveId: "PASTE_ANAT_CRANIAL_NERVES_QUESTIONS_ID_HERE",
    subject: "anat",
    topic: "Cranial Nerves",
    premium: true,
  },

  // ── PHYSIOLOGY ────────────────────────────────────────────────────────────
  {
    id: "phys-pp-2024",
    title: "Physiology Past Paper 2024 — Annual Professional",
    type: "pdf",
    driveId: "PASTE_PHYSIOLOGY_2024_PAPER_ID_HERE",
    subject: "phys",
    topic: "Past Papers",
    year: "2024",
    premium: false,
  },
  {
    id: "phys-pp-2023",
    title: "Physiology Past Paper 2023",
    type: "pdf",
    driveId: "PASTE_PHYSIOLOGY_2023_PAPER_ID_HERE",
    subject: "phys",
    topic: "Past Papers",
    year: "2023",
    premium: false,
  },
  {
    id: "phys-pp-2022",
    title: "Physiology Past Paper 2022",
    type: "pdf",
    driveId: "PASTE_PHYSIOLOGY_2022_PAPER_ID_HERE",
    subject: "phys",
    topic: "Past Papers",
    year: "2022",
    premium: true,
  },
  {
    id: "phys-q-cvs",
    title: "Cardiovascular System — Topic-wise Questions",
    type: "pdf",
    driveId: "PASTE_PHYS_CVS_QUESTIONS_ID_HERE",
    subject: "phys",
    topic: "CVS",
    premium: true,
  },
  {
    id: "phys-q-blood",
    title: "Blood & Haematology — Topic-wise Questions",
    type: "pdf",
    driveId: "PASTE_PHYS_BLOOD_QUESTIONS_ID_HERE",
    subject: "phys",
    topic: "Blood",
    premium: true,
  },

  // ── ORAL BIOLOGY ──────────────────────────────────────────────────────────
  {
    id: "oral-pp-2024",
    title: "Oral Biology Past Paper 2024",
    type: "pdf",
    driveId: "PASTE_ORAL_BIO_2024_PAPER_ID_HERE",
    subject: "oral-bio",
    topic: "Past Papers",
    year: "2024",
    premium: false,
  },
  {
    id: "oral-pp-2023",
    title: "Oral Biology Past Paper 2023",
    type: "pdf",
    driveId: "PASTE_ORAL_BIO_2023_PAPER_ID_HERE",
    subject: "oral-bio",
    topic: "Past Papers",
    year: "2023",
    premium: false,
  },
  {
    id: "oral-q-enamel",
    title: "Enamel & Amelogenesis — Topic-wise Questions",
    type: "pdf",
    driveId: "PASTE_ORAL_ENAMEL_QUESTIONS_ID_HERE",
    subject: "oral-bio",
    topic: "Enamel",
    premium: true,
  },
  {
    id: "oral-q-dentin",
    title: "Dentin & Pulp — Topic-wise Questions",
    type: "pdf",
    driveId: "PASTE_ORAL_DENTIN_QUESTIONS_ID_HERE",
    subject: "oral-bio",
    topic: "Dentin",
    premium: true,
  },

  // ── BIOCHEMISTRY ──────────────────────────────────────────────────────────
  {
    id: "biochem-pp-2024",
    title: "Biochemistry Past Paper 2024",
    type: "pdf",
    driveId: "PASTE_BIOCHEM_2024_PAPER_ID_HERE",
    subject: "biochem",
    topic: "Past Papers",
    year: "2024",
    premium: false,
  },
  {
    id: "biochem-pp-2023",
    title: "Biochemistry Past Paper 2023",
    type: "pdf",
    driveId: "PASTE_BIOCHEM_2023_PAPER_ID_HERE",
    subject: "biochem",
    topic: "Past Papers",
    year: "2023",
    premium: false,
  },
  {
    id: "biochem-q-enzymes",
    title: "Enzymes & Metabolism — Topic-wise Questions",
    type: "pdf",
    driveId: "PASTE_BIOCHEM_ENZYMES_QUESTIONS_ID_HERE",
    subject: "biochem",
    topic: "Enzymes",
    premium: true,
  },

  // ── PHARMACOLOGY ──────────────────────────────────────────────────────────
  {
    id: "pharm-pp-2024",
    title: "Pharmacology Past Paper 2024",
    type: "pdf",
    driveId: "PASTE_PHARM_2024_PAPER_ID_HERE",
    subject: "pharm",
    topic: "Past Papers",
    year: "2024",
    premium: false,
  },
  {
    id: "pharm-pp-2023",
    title: "Pharmacology Past Paper 2023",
    type: "pdf",
    driveId: "PASTE_PHARM_2023_PAPER_ID_HERE",
    subject: "pharm",
    topic: "Past Papers",
    year: "2023",
    premium: false,
  },
  {
    id: "pharm-q-la",
    title: "Local Anesthetics — Topic-wise Questions",
    type: "pdf",
    driveId: "PASTE_PHARM_LA_QUESTIONS_ID_HERE",
    subject: "pharm",
    topic: "Local Anesthetics",
    premium: true,
  },

  // ── PATHOLOGY ─────────────────────────────────────────────────────────────
  {
    id: "path-pp-2024",
    title: "Pathology Past Paper 2024",
    type: "pdf",
    driveId: "PASTE_PATH_2024_PAPER_ID_HERE",
    subject: "path",
    topic: "Past Papers",
    year: "2024",
    premium: false,
  },
  {
    id: "path-pp-2023",
    title: "Pathology Past Paper 2023",
    type: "pdf",
    driveId: "PASTE_PATH_2023_PAPER_ID_HERE",
    subject: "path",
    topic: "Past Papers",
    year: "2023",
    premium: false,
  },
  {
    id: "path-q-inflammation",
    title: "Inflammation — Topic-wise Questions",
    type: "pdf",
    driveId: "PASTE_PATH_INFLAMMATION_QUESTIONS_ID_HERE",
    subject: "path",
    topic: "Inflammation",
    premium: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const SUBJECTS = [
  { id: "anat", label: "Anatomy" },
  { id: "phys", label: "Physiology" },
  { id: "oral-bio", label: "Oral Biology" },
  { id: "biochem", label: "Biochemistry" },
  { id: "pharm", label: "Pharmacology" },
  { id: "path", label: "Pathology" },
];

/** Reference books live in the Textbooks library, so they aren't repeated here. */
const LIBRARY_FILES = CONTENT_FILES.filter((f) => f.topic !== "Books");
const isPaper = (f: ContentFile) => f.topic === "Past Papers";

const TYPES = [
  { id: "all", label: "Everything" },
  { id: "papers", label: "Past papers" },
  { id: "sets", label: "Topic question sets" },
];

function getDriveEmbedUrl(driveId: string) {
  return `https://drive.google.com/file/d/${driveId}/preview`;
}
function getDriveDownloadUrl(driveId: string) {
  return `https://drive.google.com/uc?export=download&id=${driveId}`;
}
function getDriveViewUrl(driveId: string) {
  return `https://drive.google.com/file/d/${driveId}/view`;
}
function isPlaceholder(driveId: string) {
  return !driveId || driveId.startsWith("PASTE_");
}

export default function ContentPage() {
  const [activeSubject, setActiveSubject] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [search, setSearch] = useState("");
  const [viewerFile, setViewerFile] = useState<ContentFile | null>(null);

  const q = search.trim().toLowerCase();
  const filtered = LIBRARY_FILES.filter(
    (f) =>
      (activeSubject === "all" || f.subject === activeSubject) &&
      (activeType === "all" || (activeType === "papers" ? isPaper(f) : !isPaper(f))) &&
      (!q || f.title.toLowerCase().includes(q) || f.topic.toLowerCase().includes(q))
  );
  const papers = filtered.filter(isPaper).sort((a, b) => (b.year || "0").localeCompare(a.year || "0"));
  const sets = filtered.filter((f) => !isPaper(f));
  const groups = [
    { id: "papers", title: "Past papers", intro: "DUHS annual professional papers, newest first.", files: papers },
    { id: "sets", title: "Topic question sets", intro: "Questions grouped by topic for focused revision.", files: sets },
  ].filter((g) => g.files.length);

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <PageHeader eyebrow="Content library" title="Past papers and question sets" intro="DUHS BDS 1st Year past papers and topic-wise question sets. Filter by subject or search by topic." />

      {/* Filters */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <label className="relative flex-1 sm:max-w-sm">
            <span className="sr-only">Search the library</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input type="search" placeholder="Search by title or topic" value={search} onChange={(e) => setSearch(e.target.value)} className="field !py-2.5 pl-10" />
          </label>
          <div role="radiogroup" aria-label="Type" className="inline-flex rounded-xl border border-line bg-surface-2 p-1">
            {TYPES.map((t) => (
              <button
                key={t.id}
                role="radio"
                aria-checked={activeType === t.id}
                onClick={() => setActiveType(t.id)}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${activeType === t.id ? "bg-surface text-ink shadow-soft" : "text-muted hover:text-ink"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 scrollbar-hide" role="radiogroup" aria-label="Subject">
          {[{ id: "all", label: "All subjects" }, ...SUBJECTS].map((s) => (
            <button
              key={s.id}
              role="radio"
              aria-checked={activeSubject === s.id}
              onClick={() => setActiveSubject(s.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                activeSubject === s.id ? "border-primary/40 bg-soft text-primary" : "border-line bg-surface text-slate-300 hover:border-primary/30 hover:text-ink"
              }`}
            >
              {s.id !== "all" && <SubjectArt id={s.id} className="h-4 w-4" />}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center text-muted">
          <FileText className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="font-semibold text-ink">Nothing matches</p>
          <p className="mt-1 text-sm">Try another subject or search term.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {groups.map((g) => (
            <section key={g.id} aria-labelledby={`g-${g.id}`}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 id={`g-${g.id}`} className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">
                    {g.title} <span className="ml-1 text-sm font-medium text-muted">{g.files.length}</span>
                  </h2>
                  <p className="mt-0.5 text-sm text-muted">{g.intro}</p>
                </div>
              </div>
              <Stagger as="ul" className="grid gap-2.5 md:grid-cols-2" gap={0.03}>
                {g.files.map((file) => (
                  <FileRow key={file.id} file={file} onView={() => setViewerFile(file)} />
                ))}
              </Stagger>
            </section>
          ))}
        </div>
      )}

      {/* Related libraries, instead of repeating them here */}
      <div className="mt-14 grid gap-3 sm:grid-cols-2">
        <Link href="/past-papers" className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-primary/40">
          <ListChecks className="h-5 w-5 text-primary" />
          <span className="flex-1 text-sm">
            <span className="block font-semibold text-ink">Practise past-paper MCQs</span>
            <span className="text-muted">Interactive, with explanations</span>
          </span>
          <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
        <Link href="/books" className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-primary/40">
          <Library className="h-5 w-5 text-primary" />
          <span className="flex-1 text-sm">
            <span className="block font-semibold text-ink">Looking for reference books?</span>
            <span className="text-muted">They&apos;re in the Textbooks library</span>
          </span>
          <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        More anatomy files are in the{" "}
        <a href="https://drive.google.com/drive/folders/1Vd9BjuLO2ZNv8nIHRsrFiosw80xNhJrz" target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
          anatomy Drive folder <ExternalLink className="h-3 w-3" />
        </a>
      </p>

      {/* File viewer (only for files that have been added) */}
      {viewerFile && !isPlaceholder(viewerFile.driveId) && (
        <div className="fixed inset-0 z-50 flex flex-col bg-canvas/95 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={viewerFile.title}>
          <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{viewerFile.title}</p>
                <p className="text-xs text-muted">{viewerFile.topic}</p>
              </div>
            </div>
            <div className="ml-3 flex shrink-0 items-center gap-2">
              <a href={getDriveViewUrl(viewerFile.driveId)} target="_blank" rel="noopener noreferrer" className="btn-secondary !min-h-[34px] !px-3 !py-1 text-xs">
                <ExternalLink className="h-3.5 w-3.5" /> Open in Drive
              </a>
              <a href={getDriveDownloadUrl(viewerFile.driveId)} className="btn-secondary !min-h-[34px] !px-3 !py-1 text-xs">
                <Download className="h-3.5 w-3.5" /> Download
              </a>
              <button onClick={() => setViewerFile(null)} className="rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-ink" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <iframe src={getDriveEmbedUrl(viewerFile.driveId)} className="h-full w-full flex-1 border-0" allow="autoplay" title={viewerFile.title} />
        </div>
      )}
    </div>
  );
}

function FileRow({ file, onView }: { file: ContentFile; onView: () => void }) {
  const placeholder = isPlaceholder(file.driveId);
  const subject = SUBJECTS.find((s) => s.id === file.subject);
  return (
    <StaggerItem as="li" className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 transition duration-200 hover:border-primary/30">
      <SubjectArt id={file.subject} className="h-8 w-8 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{file.title.replace(/\s+—\s+Annual Professional$/, "")}</p>
        <p className="truncate text-xs text-muted">
          {[subject?.label, file.year && isPaper(file) ? null : file.topic, file.pages ? `${file.pages} pages` : null].filter(Boolean).join(" · ")}
        </p>
      </div>
      {file.year && <span className="chip shrink-0 tabular-nums">{file.year}</span>}
      {file.premium ? (
        <Link href="/pricing" className="chip-pro shrink-0 !py-1" title="Included in paid plans">
          <Lock className="h-3.5 w-3.5" /> Pro
        </Link>
      ) : placeholder ? (
        <span className="shrink-0 text-xs text-muted">Coming soon</span>
      ) : (
        <button onClick={onView} className="btn-primary !min-h-[32px] shrink-0 !px-3 !py-1 text-xs">
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      )}
    </StaggerItem>
  );
}
