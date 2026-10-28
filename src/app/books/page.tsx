"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen, Search, Eye, Download, ExternalLink, X,
  ShieldCheck, Sparkles, Filter, ChevronRight, Lock, Bookmark
} from "lucide-react";

import { BOOKS_DATA, type BookItem } from "@/lib/books";

const SUBJECT_FILTER_LIST = [
  { id: "all", name: "All Subjects" },
  { id: "anat", name: "Anatomy & Histology" },
  { id: "oral-bio", name: "Oral Biology" },
  { id: "phys", name: "Physiology" },
  { id: "biochem", name: "Biochemistry" },
  { id: "comm-dent", name: "Community Dentistry" }
];

export default function BooksLibraryPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);

  const filteredBooks = BOOKS_DATA.filter((b) => {
    const matchesSubject = selectedSubject === "all" || b.subjectId === selectedSubject;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subjectName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  // Group books by subject
  const subjectsWithBooks = SUBJECT_FILTER_LIST.filter((s) => s.id !== "all").map((subj) => ({
    ...subj,
    books: filteredBooks.filter((b) => b.subjectId === subj.id)
  })).filter((group) => group.books.length > 0);

  const getDriveEmbedUrl = (driveId: string) => `https://drive.google.com/file/d/${driveId}/preview`;
  const getDriveDownloadUrl = (driveId: string) => `https://drive.google.com/uc?export=download&id=${driveId}`;
  const getDriveDirectUrl = (driveId: string) => `https://drive.google.com/file/d/${driveId}/view`;

  return (
    <div className="min-h-screen bg-canvas text-slate-100 pb-24">
      {/* ── Page Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface via-surface to-canvas border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/70 border border-violet-700/50 text-violet-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Curated Academic Reference Vault
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight">
              Standard BDS Textbooks{" "}
              <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">
                &amp; Digital Atlases
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Official reference volumes, illustrated atlases, and high-yield handbooks recommended by Dow University of Health Sciences (DIKIOHS, DDC &amp; DIDC) faculty for BDS 1st Year.
            </p>
          </div>

          {/* Search & Subject Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by book title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-ink placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span>{filteredBooks.length} Volumes Available</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide pt-2">
            {SUBJECT_FILTER_LIST.map((subj) => (
              <button
                key={subj.id}
                onClick={() => setSelectedSubject(subj.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border shrink-0 ${
                  selectedSubject === subj.id
                    ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30"
                    : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {subj.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Books Catalog ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {subjectsWithBooks.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-ink">No textbooks found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn&apos;t match any books with your current filters or query. Try resetting your search terms.
            </p>
          </div>
        ) : (
          subjectsWithBooks.map((group) => (
            <section key={group.id} className="space-y-6">
              {/* Category Subtitle */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-violet-500 shadow-sm shadow-violet-500/50" />
                  <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                    {group.name}
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-400 border border-slate-700">
                    {group.books.length} Books
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  DUHS Professional Recommended Reading
                </span>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.books.map((book) => {
                  const hasDrive = !!book.driveId && !book.driveId.startsWith("PASTE_");
                  const isPlaceholder = !hasDrive && !book.pdfUrl;
                  return (
                    <div
                      key={book.id}
                      className={`relative flex flex-col justify-between rounded-3xl p-6 bg-gradient-to-br ${book.coverGradient} border border-slate-800/90 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-900/10 group`}
                    >
                      <div className="space-y-4">
                        {/* Top Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border ${book.badgeColor}`}>
                            {book.subjectName}
                          </span>
                          {book.isHighYield && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Bookmark className="w-3 h-3" /> DUHS Core
                            </span>
                          )}
                        </div>

                        {/* Title & Meta */}
                        <div>
                          <h3 className="font-extrabold text-ink text-lg leading-tight group-hover:text-violet-300 transition-colors">
                            {book.title}
                          </h3>
                          {book.edition && (
                            <p className="text-xs font-semibold text-slate-400 mt-1">
                              {book.edition}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            By {book.authors}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {book.description}
                        </p>

                        {/* Topics Pill Cloud */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {book.topicsCovered.map((topic, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center gap-2">
                        {isPlaceholder ? (
                          <div className="w-full py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center text-xs font-semibold text-slate-500">
                            PDF coming soon
                          </div>
                        ) : (
                          <>
                            <Link
                              href={`/read/${book.id}`}
                              className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition flex items-center justify-center gap-2 group-hover:shadow-lg"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Read &amp; take notes</span>
                            </Link>
                            {hasDrive && (<>
                            <a
                              href={getDriveDirectUrl(book.driveId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-ink transition"
                              title="Open Original in Google Drive"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <a
                              href={getDriveDownloadUrl(book.driveId)}
                              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-ink transition"
                              title="Direct Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            </>)}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>

      {/* ── Reader Modal ── */}
      {activeBook && (
        <div className="fixed inset-0 z-50 flex flex-col bg-canvas/95 backdrop-blur-md">
          {/* Reader Header */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-surface border-b border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-ink text-sm truncate">
                  {activeBook.title}
                </h3>
                <p className="text-slate-400 text-xs">
                  {activeBook.authors} &bull; {activeBook.edition || activeBook.subjectName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={getDriveDirectUrl(activeBook.driveId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open Drive Tab</span>
              </a>
              <a
                href={getDriveDownloadUrl(activeBook.driveId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>
              <button
                onClick={() => setActiveBook(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-ink transition ml-2"
                title="Close Viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reader Frame */}
          <div className="flex-1 w-full bg-slate-950 relative">
            <iframe
              src={getDriveEmbedUrl(activeBook.driveId)}
              className="w-full h-full border-0"
              allow="autoplay"
              title={activeBook.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}
