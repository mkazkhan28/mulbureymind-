"use client";

import React, { useEffect } from "react";
import { DownloadCloud, Maximize2, X } from "lucide-react";
import { driveDownloadUrl, driveFileId, drivePreviewUrl } from "@/lib/drive";

/** Full-screen modal that shows a Google Drive PPT/PDF inside the site. */
export default function DriveViewer({
  title,
  subtitle,
  drive,
  onClose,
}: {
  title: string;
  subtitle?: string;
  drive: string;
  onClose: () => void;
}) {
  const id = driveFileId(drive);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md animate-fadeIn sm:p-6" onClick={onClose}>
      <div className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-ink">{title}</div>
            {subtitle && <div className="truncate text-xs text-slate-400">{subtitle}</div>}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <a
              href={driveDownloadUrl(id)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-ink"
            >
              <DownloadCloud className="h-4 w-4" /> <span className="hidden sm:inline">Download</span>
            </a>
            <a
              href={`https://drive.google.com/file/d/${id}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-ink"
              title="Open in Google Drive"
            >
              <Maximize2 className="h-4 w-4" />
            </a>
            <button onClick={onClose} className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-ink" aria-label="Close viewer">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <iframe src={drivePreviewUrl(id)} title={title} className="w-full flex-1 bg-slate-950" allow="autoplay; fullscreen" allowFullScreen />
      </div>
    </div>
  );
}
