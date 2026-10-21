"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText, BookOpen, ChevronRight, Eye, Lock,
  Download, Search, Filter, ExternalLink, X, Maximize2
} from "lucide-react";

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
  // ── ANATOMY ──────────────────────────────────────────────────────────────
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
  { id: "all",     label: "All Subjects",  color: "text-slate-300",   badge: "bg-slate-800 border-slate-700" },
  { id: "anat",    label: "Anatomy",       color: "text-amber-400",   badge: "bg-amber-950/60 border-amber-700/50" },
  { id: "phys",    label: "Physiology",    color: "text-rose-400",    badge: "bg-rose-950/60 border-rose-700/50" },
  { id: "oral-bio",label: "Oral Biology",  color: "text-cyan-400",    badge: "bg-cyan-950/60 border-cyan-700/50" },
  { id: "biochem", label: "Biochemistry",  color: "text-violet-400",  badge: "bg-violet-950/60 border-violet-700/50" },
  { id: "pharm",   label: "Pharmacology",  color: "text-emerald-400", badge: "bg-emerald-950/60 border-emerald-700/50" },
  { id: "path",    label: "Pathology",     color: "text-blue-400",    badge: "bg-blue-950/60 border-blue-700/50" },
];

const TYPE_FILTER = [
  { id: "all",       label: "All Types" },
  { id: "past-papers", label: "Past Papers" },
  { id: "topic-q",  label: "Topic Questions" },
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
  return driveId.startsWith("PASTE_");
}

export default function ContentPage() {
  const [activeSubject, setActiveSubject] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [search, setSearch] = useState("");
  const [viewerFile, setViewerFile] = useState<ContentFile | null>(null);

  const filtered = CONTENT_FILES.filter(f => {
    const matchSubject = activeSubject === "all" || f.subject === activeSubject;
    const matchType = activeType === "all"
      || (activeType === "past-papers" && f.topic === "Past Papers")
      || (activeType === "topic-q" && f.topic !== "Past Papers");
    const matchSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.topic.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchType && matchSearch;
  });

  // Group by subject
  const grouped = SUBJECTS.filter(s => s.id !== "all").map(subj => ({
    ...subj,
    files: filtered.filter(f => f.subject === subj.id),
  })).filter(g => g.files.length > 0);

  const displayGroups = activeSubject === "all" ? grouped : grouped.filter(g => g.id === activeSubject);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-20">

      {/* ── Header ── */}
      <div className="bg-[#0a0f1e] border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-white">
                📄 Past Papers &amp; Topic Questions
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                DUHS BDS 1st Year — Verified past papers &amp; topic-wise question sets (2015–2024)
              </p>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search papers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 w-56"
              />
            </div>
          </div>

          {/* Subject filter tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {SUBJECTS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSubject(s.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  activeSubject === s.id
                    ? `${s.badge} ${s.color}`
                    : "bg-transparent border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                {s.label}
              </button>
            ))}
            <div className="w-px h-6 bg-slate-800 mx-1 self-center shrink-0" />
            {TYPE_FILTER.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeType === t.id
                    ? "bg-indigo-950/60 border-indigo-600/50 text-indigo-300"
                    : "bg-transparent border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {displayGroups.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No files found</p>
            <p className="text-xs mt-1">Try changing your filters or search term</p>
          </div>
        ) : (
          displayGroups.map(group => {
            const subjectInfo = SUBJECTS.find(s => s.id === group.id)!;
            const pastPapers = group.files.filter(f => f.topic === "Past Papers").sort((a,b) => (b.year||"0").localeCompare(a.year||"0"));
            const topicFiles = group.files.filter(f => f.topic !== "Past Papers");

            return (
              <section key={group.id} className="space-y-5">
                {/* Subject heading */}
                <div className="flex items-center gap-3">
                  <h2 className={`text-xl font-extrabold ${subjectInfo.color}`}>{group.label}</h2>
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="text-xs text-slate-500">{group.files.length} files</span>
                </div>

                {/* Past Papers sub-section */}
                {pastPapers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      Annual Professional Past Papers
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {pastPapers.map(file => (
                        <FileCard
                          key={file.id}
                          file={file}
                          subjectColor={subjectInfo.color}
                          onView={() => setViewerFile(file)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Topic-wise Questions sub-section */}
                {topicFiles.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      Topic-wise Question Sets
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {topicFiles.map(file => (
                        <FileCard
                          key={file.id}
                          file={file}
                          subjectColor={subjectInfo.color}
                          onView={() => setViewerFile(file)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>

      {/* ── Full-screen File Viewer Modal ── */}
      {viewerFile && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#070b14]/95 backdrop-blur-md">
          {/* Modal header */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#0a0f1e] border-b border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-white text-sm truncate">{viewerFile.title}</p>
                <p className="text-slate-500 text-xs">DUHS BDS 1st Year &bull; {viewerFile.topic}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              {!isPlaceholder(viewerFile.driveId) && (
                <>
                  <a
                    href={getDriveViewUrl(viewerFile.driveId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-600/40 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/30 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open in Drive
                  </a>
                  <a
                    href={getDriveDownloadUrl(viewerFile.driveId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-600/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </>
              )}
              <button
                onClick={() => setViewerFile(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Viewer iframe */}
          <div className="flex-1 relative">
            {isPlaceholder(viewerFile.driveId) ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">File ID Not Yet Added</p>
                  <p className="text-slate-400 text-sm mt-2 max-w-md">
                    This is a placeholder. To add the actual file, replace <code className="text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">{viewerFile.driveId}</code> with the real Google Drive file ID in <code className="text-indigo-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">src/app/content/page.tsx</code>
                  </p>
                </div>
              </div>
            ) : (
              <iframe
                src={getDriveEmbedUrl(viewerFile.driveId)}
                className="w-full h-full border-0"
                allow="autoplay"
                title={viewerFile.title}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── File Card Component ───────────────────────────────────────────────────────
function FileCard({
  file,
  subjectColor,
  onView,
}: {
  file: ContentFile;
  subjectColor: string;
  onView: () => void;
}) {
  const placeholder = isPlaceholder(file.driveId);

  return (
    <div className={`relative p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-3 ${
      file.premium
        ? "bg-slate-900/40 border-slate-800 hover:border-slate-700"
        : "bg-slate-900/70 border-slate-700 hover:border-slate-500 hover:-translate-y-0.5"
    }`}>
      {/* Premium badge */}
      {file.premium && (
        <div className="absolute top-3 right-3">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
        </div>
      )}

      {/* File info */}
      <div className="flex items-start gap-2.5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          file.topic === "Past Papers"
            ? "bg-amber-500/10 border border-amber-500/20"
            : "bg-indigo-500/10 border border-indigo-500/20"
        }`}>
          <FileText className={`w-4 h-4 ${file.topic === "Past Papers" ? "text-amber-400" : "text-indigo-400"}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{file.title}</p>
          <div className="flex items-center gap-2 mt-1">
            {file.year && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{file.year}</span>
            )}
            <span className={`text-[10px] font-semibold ${subjectColor}`}>{file.topic}</span>
          </div>
        </div>
      </div>

      {file.description && (
        <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{file.description}</p>
      )}

      {/* Actions */}
      {file.premium ? (
        <Link
          href="/pricing"
          className="mt-auto w-full py-2 rounded-xl text-center text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition flex items-center justify-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5" /> Unlock Premium
        </Link>
      ) : (
        <div className="mt-auto flex gap-2">
          <button
            onClick={onView}
            className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 hover:bg-indigo-600/30 transition flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            {placeholder ? "Preview" : "View"}
          </button>
          {!placeholder && (
            <a
              href={getDriveDownloadUrl(file.driveId)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition"
              title="Download"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
