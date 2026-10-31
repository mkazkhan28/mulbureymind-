"use client";

import React, { useState, Suspense } from "react";
import QuerySync from "@/components/QuerySync";
import { drivePreviewUrl, driveDownloadUrl } from "@/lib/drive";
import Link from "next/link";
import {
  BDS_RESOURCES,
  BDS_SUBJECTS,
  StudyResource
} from "@/lib/bds-content";
import {
  FileText,
  DownloadCloud,
  Lock,
  Search,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  Eye,
  Maximize2
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function ResourcesPage() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Paywall modal state
  const [lockedModalOpen, setLockedModalOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<StudyResource | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [viewing, setViewing] = useState<StudyResource | null>(null);

  // Student active membership status simulator
  const [isStudentSubscribed, setIsStudentSubscribed] = useState(false);

  const firstYearSubjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");

  const filteredResources = BDS_RESOURCES.filter((res) => {
    const matchesSubject = selectedSubject === "all" || res.subjectId === selectedSubject;
    const matchesType = selectedType === "all" || res.type === selectedType;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesType && matchesSearch;
  });

  const handleResourceAction = (res: StudyResource) => {
    if (res.isPremium && !isStudentSubscribed) {
      setActiveResource(res);
      setLockedModalOpen(true);
    } else {
      setDownloadSuccessMessage(`Starting secure download: "${res.title}" (${res.fileSize})`);
      setTimeout(() => setDownloadSuccessMessage(null), 4000);
    }
  };

  const getSubjectBadge = (subjectId: string) => {
    switch (subjectId) {
      case "anat":
      case "subj-anat-1":
        return "bg-amber-950/70 text-amber-300 border-amber-700/60";
      case "phys":
      case "subj-physio-1":
        return "bg-rose-950/70 text-rose-300 border-rose-700/60";
      case "oral-bio":
      case "subj-oralbio-1":
        return "bg-cyan-950/70 text-cyan-300 border-cyan-700/60";
      case "biochem":
      case "subj-biochem-1":
        return "bg-purple-950/70 text-purple-300 border-purple-700/60";
      case "pharm":
      case "subj-pharm-1":
        return "bg-emerald-950/70 text-emerald-300 border-emerald-700/60";
      case "path":
      case "subj-path-1":
        return "bg-blue-950/70 text-blue-300 border-blue-700/60";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      <Suspense fallback={null}>
        <QuerySync
          onParams={(p) => {
          if (p.get("subject")) setSelectedSubject(p.get("subject") as string);
          if (p.get("type")) setSelectedType(p.get("type") as string);
          }}
        />
      </Suspense>
      {/* Decorative ambient background glows */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Header */}
        <PageHeader
          eyebrow="Notes & PPTs"
          title="Lecture notes and slides"
          lead="Revise from clear, organised study material."
          intro="PDF notes, slide decks and viva guides for each BDS 1st Year subject. Open a file to read it, or download it where your plan allows."
        />

        {/* Membership Access Switcher (Testing & Demo) */}
        <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">Simulated Access Tier:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
              isStudentSubscribed ? "bg-indigo-950/80 text-indigo-300 border-indigo-700/60" : "bg-slate-950/80 text-slate-400 border-slate-800"
            }`}>
              {isStudentSubscribed ? "Full Academic Pass (Active)" : "Free Student Starter"}
            </span>
          </div>
          <button
            onClick={() => setIsStudentSubscribed(!isStudentSubscribed)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 font-semibold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
          >
            Switch to {isStudentSubscribed ? "Free Starter Mode" : "Paid Pass Mode"}
          </button>
        </div>

        {downloadSuccessMessage && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-700/60 rounded-2xl text-xs font-semibold text-emerald-200 flex items-center gap-2 animate-fadeIn shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-line flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes, slide atlases, or presentation guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-700/80 bg-slate-950/80 text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="flex-1 md:w-60 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-700/80 bg-slate-950/80 text-ink focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-medium cursor-pointer"
            >
              <option value="all">All 6 Core 1st Year Subjects</option>
              {firstYearSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-36 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-700/80 bg-slate-950/80 text-ink focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-medium cursor-pointer"
            >
              <option value="all">All Files</option>
              <option value="PDF">PDF Notes</option>
              <option value="PPTX">PowerPoint</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => {
            const subject = BDS_SUBJECTS.find((s) => s.id === res.subjectId);
            const isLocked = res.isPremium && !isStudentSubscribed;

            return (
              <div
                key={res.id}
                className="bg-surface rounded-2xl border border-line p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:border-slate-700/80 hover:-translate-y-1 transition duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                          res.type === "PDF"
                            ? "bg-rose-950/70 text-rose-300 border border-rose-800/60"
                            : "bg-amber-950/70 text-amber-300 border border-amber-800/60"
                        }`}
                      >
                        {res.type}
                      </span>
                      {subject && (
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getSubjectBadge(subject.id)}`}>
                          {subject.name}
                        </span>
                      )}
                    </div>

                    {res.isPremium ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 flex items-center gap-1 shadow-sm">
                        <Lock className="w-3 h-3 text-indigo-400" />
                        <span>Academic Pass</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/80 text-emerald-400 border border-emerald-800/50">
                        Free Starter
                      </span>
                    )}
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-ink group-hover:text-cyan-300 transition leading-snug">
                    {res.title}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {res.fileSize} • {res.author}
                  </span>

                  {res.driveFileId && !isLocked ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewing(res)}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer bg-primary hover:bg-primary-hover text-on-primary"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <a
                        href={driveDownloadUrl(res.driveFileId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-ink"
                        title="Download"
                      >
                        <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </div>
                  ) : (
                  <button
                    onClick={() => handleResourceAction(res)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer ${
                      isLocked
                        ? "bg-primary hover:bg-primary-hover text-on-primary shadow-indigo-600/25"
                        : "bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-ink"
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock Note</span>
                      </>
                    ) : (
                      <>
                        <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Storage Notice */}
        <div className="bg-surface rounded-2xl p-6 border border-slate-800 text-xs text-slate-300 flex items-start gap-3 shadow-xl">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-ink">
              DUHS Karachi Academic Content Storage
            </span>
            <p className="leading-relaxed text-slate-400">
              Files and slide atlases are verified against Dow University of Health Sciences syllabus requirements. High-resolution histology and anatomy plates are formatted for mobile and desktop reading.
            </p>
          </div>
        </div>

        {/* SLIDE VIEWER (Google Drive embed) */}
        {viewing?.driveFileId && (
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
            onClick={() => setViewing(null)}
          >
            <div
              className="bg-surface rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-line"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-ink truncate">{viewing.title}</div>
                  <div className="text-[11px] text-slate-400">{viewing.type} • {viewing.fileSize}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={driveDownloadUrl(viewing.driveFileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-ink hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Download</span>
                  </a>
                  <a
                    href={`https://drive.google.com/file/d/${viewing.driveFileId}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-300 hover:text-ink hover:bg-slate-800"
                    title="Open full screen in Google Drive"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </a>
                  <button onClick={() => setViewing(null)} className="p-2 rounded-lg text-slate-300 hover:text-ink hover:bg-slate-800" aria-label="Close viewer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <iframe
                src={drivePreviewUrl(viewing.driveFileId)}
                title={viewing.title}
                className="flex-1 w-full bg-slate-950"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* UPGRADE PAYWALL MODAL */}
        {lockedModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center animate-fadeIn relative border border-slate-800">
              <button
                onClick={() => setLockedModalOpen(false)}
                className="absolute top-5 right-5 p-1 text-slate-400 hover:text-ink rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400 mx-auto">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-950/70 px-3 py-0.5 rounded-full border border-indigo-700/60 shadow-sm">
                  DUHS 1st Year Pass Resource
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-ink">
                  Unlock Full Academic Access
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-ink">{activeResource?.title}</strong> is part of our complete DUHS BDS First Year examination resource library.
                </p>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl text-left space-y-2 text-xs border border-slate-800">
                <div className="font-bold text-ink">What you unlock:</div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All high-yield lecture slides & summary PDFs</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>DUHS past-paper questions with explanations</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Timed examination simulator with score reports</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/pricing"
                  className="w-full py-4 bg-primary hover:bg-primary-hover text-on-primary rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <span>View Membership Passes (from PKR 1,299)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setLockedModalOpen(false)}
                  className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  Continue browsing free materials
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
