"use client";

/**
 * In-site textbook reader with highlights and notes.
 * Renders the PDF with PDF.js (canvas + selectable text layer) so students can:
 *   - select text → highlight in 4 colours, add a note, or copy
 *   - add page notes, edit/delete notes, export them as a .txt file
 *   - browse the book's contents (outline) and jump to pages
 *   - toggle the contents and notes panels, or hide everything with Focus mode
 *   - zoom, night mode for the pages, keyboard shortcuts (← → + - F)
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  Focus,
  Highlighter,
  ListTree,
  Loader2,
  Minus,
  Moon,
  NotebookPen,
  PanelLeft,
  PanelRight,
  Plus,
  StickyNote,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import type { BookItem } from "@/lib/books";
import {
  annotationsToText,
  HIGHLIGHT_COLORS,
  loadAnnotations,
  loadPosition,
  newId,
  saveAnnotations,
  savePosition,
  type Annotation,
  type HighlightColor,
  type PageRect,
} from "@/lib/annotations";
import { driveFileId, drivePreviewUrl } from "@/lib/drive";
import { recordOpen } from "@/lib/progress";

type PdfJs = typeof import("pdfjs-dist");
/** Anything the reader can open: a textbook or a lecture PDF. */
export type ReaderDoc = Pick<BookItem, "id" | "title" | "edition" | "authors" | "driveId" | "pdfUrl">;
type OutlineItem = { title: string; dest: unknown; items: OutlineItem[] };
type PendingSelection = { page: number; rects: PageRect[]; quote: string; x: number; y: number };

const fillOf = (c: HighlightColor) => HIGHLIGHT_COLORS.find((h) => h.key === c)?.fill ?? HIGHLIGHT_COLORS[0].fill;
const dotOf = (c: HighlightColor) => HIGHLIGHT_COLORS.find((h) => h.key === c)?.dot ?? HIGHLIGHT_COLORS[0].dot;

let pdfjsPromise: Promise<PdfJs> | null = null;
function loadPdfJs() {
  if (!pdfjsPromise) {
    // PDF.js 4 uses Promise.withResolvers; add it for older browsers.
    const P = Promise as unknown as { withResolvers?: () => unknown };
    if (typeof P.withResolvers !== "function") {
      P.withResolvers = function () {
        let resolve!: (v: unknown) => void, reject!: (e: unknown) => void;
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return { promise, resolve, reject };
      };
    }
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

export default function BookReader({ book, backHref = "/books", backLabel = "Back to textbooks" }: { book: ReaderDoc; backHref?: string; backLabel?: string }) {
  const source = book.pdfUrl || (book.driveId && !book.driveId.startsWith("PASTE_") ? `/api/books/${book.id}/pdf` : "");

  const [pdfjs, setPdfjs] = useState<PdfJs | null>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "missing">(source ? "loading" : "missing");
  const [progress, setProgress] = useState(0);
  const [baseSize, setBaseSize] = useState({ w: 595, h: 842 });
  const [scale, setScale] = useState(1);
  const [page, setPage] = useState(1);
  const [outline, setOutline] = useState<OutlineItem[]>([]);

  const [showContents, setShowContents] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [focus, setFocus] = useState(false);
  const [night, setNight] = useState(false);

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [pending, setPending] = useState<PendingSelection | null>(null);
  const [openAnn, setOpenAnn] = useState<{ id: string; x: number; y: number } | null>(null);
  const [colorFilter, setColorFilter] = useState<HighlightColor | "all">("all");
  const [pageInput, setPageInput] = useState("1");

  const scrollRef = useRef<HTMLDivElement>(null);
  const pageEls = useRef<Map<number, HTMLDivElement>>(new Map());
  const restored = useRef(false);

  /* ---------------- load annotations, panels default by screen size ---------------- */
  useEffect(() => {
    setAnnotations(loadAnnotations(book.id));
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    setShowContents(wide);
    setShowNotes(wide && window.matchMedia("(min-width: 1280px)").matches);
  }, [book.id]);

  const persist = useCallback(
    (next: Annotation[]) => {
      setAnnotations(next);
      saveAnnotations(book.id, next);
    },
    [book.id]
  );

  /* ---------------- load the PDF ---------------- */
  useEffect(() => {
    if (!source) return;
    let cancelled = false;
    let loadingTask: { destroy: () => Promise<void> } | null = null;
    (async () => {
      try {
        const lib = await loadPdfJs();
        if (cancelled) return;
        setPdfjs(lib);
        const task = lib.getDocument({ url: source, disableAutoFetch: true, disableStream: false });
        loadingTask = task;
        task.onProgress = ({ loaded, total }: { loaded: number; total: number }) => total && setProgress(Math.round((loaded / total) * 100));
        const pdf = await task.promise;
        if (cancelled) return;
        const first = await pdf.getPage(1);
        const vp = first.getViewport({ scale: 1 });
        setBaseSize({ w: vp.width, h: vp.height });
        setDoc(pdf);
        setStatus("ready");
        pdf.getOutline().then((o) => !cancelled && setOutline((o as OutlineItem[]) ?? [])).catch(() => {});
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
      loadingTask?.destroy().catch(() => {});
    };
  }, [source]);

  /* ---------------- fit width once loaded, restore last position ---------------- */
  const fitWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const avail = el.clientWidth - (window.innerWidth < 640 ? 16 : 64);
    setScale(Math.max(0.4, Math.min(2.2, avail / baseSize.w)));
  }, [baseSize.w]);

  useEffect(() => {
    if (status !== "ready" || restored.current) return;
    restored.current = true;
    const pos = loadPosition(book.id);
    if (pos?.zoom) setScale(pos.zoom);
    else fitWidth();
    if (pos?.page && pos.page > 1) setTimeout(() => goTo(pos.page, "auto"), 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /* ---------------- current page tracking ---------------- */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !doc) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = el.scrollTop + el.clientHeight * 0.35;
        let current = 1;
        pageEls.current.forEach((node, n) => {
          if (node.offsetTop <= mid) current = Math.max(current, n);
        });
        setPage(current);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [doc]);

  useEffect(() => {
    setPageInput(String(page));
    if (status === "ready") {
      savePosition(book.id, { page, zoom: scale });
      recordOpen(book.id, page); // streak, daily goal & continue-reading
    }
  }, [page, scale, status, book.id]);

  const goTo = useCallback(
    (n: number, behavior: ScrollBehavior = "smooth") => {
      if (!doc) return;
      const target = Math.min(Math.max(1, n), doc.numPages);
      const node = pageEls.current.get(target);
      const el = scrollRef.current;
      if (node && el) el.scrollTo({ top: node.offsetTop - 12, behavior });
      setPage(target);
    },
    [doc]
  );

  const zoomBy = useCallback((d: number) => {
    const el = scrollRef.current;
    const ratio = el ? el.scrollTop / Math.max(1, el.scrollHeight) : 0;
    setScale((s) => Math.round(Math.min(3, Math.max(0.4, s + d)) * 100) / 100);
    requestAnimationFrame(() => el && (el.scrollTop = ratio * el.scrollHeight));
  }, []);

  /* ---------------- keyboard shortcuts ---------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") goTo(page + 1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") goTo(page - 1);
      else if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        zoomBy(0.1);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        zoomBy(-0.1);
      } else if (e.key.toLowerCase() === "f" && !e.ctrlKey && !e.metaKey) setFocus((f) => !f);
      else if (e.key === "Escape") {
        setPending(null);
        setOpenAnn(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, page, zoomBy]);

  /* ---------------- text selection → highlight popup ---------------- */
  const onPointerUp = useCallback(() => {
    // Wait a tick so the browser finalises the selection
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const startEl = (range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement) as HTMLElement | null;
      const pageEl = startEl?.closest<HTMLElement>("[data-page]");
      if (!pageEl) return;
      const pageNo = Number(pageEl.dataset.page);
      const box = pageEl.getBoundingClientRect();
      const rects = mergeRects(
        Array.from(range.getClientRects())
          .filter((r) => r.width > 1 && r.height > 1 && r.top >= box.top - 2 && r.bottom <= box.bottom + 2)
          .map((r) => ({ x: (r.left - box.left) / box.width, y: (r.top - box.top) / box.height, w: r.width / box.width, h: r.height / box.height }))
      );
      const quote = sel.toString().replace(/\s+/g, " ").trim();
      if (!rects.length || !quote) return;
      const last = range.getBoundingClientRect();
      setOpenAnn(null);
      setPending({ page: pageNo, rects, quote, x: last.left + last.width / 2, y: last.bottom });
    }, 10);
  }, []);

  const addHighlight = (color: HighlightColor, withNote = false) => {
    if (!pending) return;
    const now = Date.now();
    const a: Annotation = { id: newId(), page: pending.page, rects: pending.rects, color, quote: pending.quote, note: "", createdAt: now, updatedAt: now };
    persist([...annotations, a]);
    window.getSelection()?.removeAllRanges();
    if (withNote) {
      setShowNotes(true);
      setOpenAnn({ id: a.id, x: pending.x, y: pending.y });
    }
    setPending(null);
  };

  const addPageNote = () => {
    const now = Date.now();
    const a: Annotation = { id: newId(), page, rects: [], color: "yellow", quote: "", note: "", createdAt: now, updatedAt: now };
    persist([...annotations, a]);
    setShowNotes(true);
    setTimeout(() => document.getElementById(`note-${a.id}`)?.focus(), 50);
  };

  const updateAnn = (id: string, patch: Partial<Annotation>) =>
    persist(annotations.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: Date.now() } : a)));
  const deleteAnn = (id: string) => {
    persist(annotations.filter((a) => a.id !== id));
    setOpenAnn(null);
  };

  const exportNotes = () => {
    const blob = new Blob([annotationsToText(`${book.title} (${book.edition ?? ""})`, annotations)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${book.title} - notes.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const byPage = useMemo(() => {
    const m = new Map<number, Annotation[]>();
    for (const a of annotations) m.set(a.page, [...(m.get(a.page) ?? []), a]);
    return m;
  }, [annotations]);

  const visibleNotes = useMemo(
    () =>
      [...annotations]
        .filter((a) => colorFilter === "all" || a.color === colorFilter)
        .sort((x, y) => x.page - y.page || (x.rects[0]?.y ?? 0) - (y.rects[0]?.y ?? 0)),
    [annotations, colorFilter]
  );

  const contentsOpen = showContents && !focus;
  const notesOpen = showNotes && !focus;
  const active = openAnn ? annotations.find((a) => a.id === openAnn.id) : null;

  /* ================================ UI ================================ */
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-canvas text-ink">
      {/* ---------- toolbar ---------- */}
      <header
        className={`flex shrink-0 items-center gap-1.5 border-b border-line bg-surface px-2 transition-all duration-300 sm:gap-2 sm:px-3 ${
          focus ? "h-12" : "h-14"
        }`}
      >
        <Link href={backHref} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-ink" title={backLabel} aria-label={backLabel}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <ToolButton label="Contents" pressed={contentsOpen} onClick={() => { setFocus(false); setShowContents((v) => !v); }} icon={PanelLeft} />
        <div className="hidden min-w-0 flex-1 sm:block">
          <div className="truncate text-sm font-semibold">{book.title}</div>
          <div className="truncate text-xs text-slate-400">{[book.edition, book.authors].filter(Boolean).join(" · ")}</div>
        </div>
        <div className="flex-1 sm:hidden" />

        {doc && (
          <div className="flex items-center gap-0.5 rounded-xl border border-line bg-canvas px-1 py-0.5">
            <ToolButton label="Previous page" onClick={() => goTo(page - 1)} icon={ChevronLeft} small />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goTo(Number(pageInput) || page);
              }}
              className="flex items-center gap-1 text-xs text-slate-400"
            >
              <input
                id="reader-page"
                aria-label="Page number"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ""))}
                className="w-10 rounded-md border border-line bg-surface px-1 py-1 text-center text-xs text-ink focus:border-brand-500 focus:outline-none"
              />
              <span className="hidden sm:inline">/ {doc.numPages}</span>
            </form>
            <ToolButton label="Next page" onClick={() => goTo(page + 1)} icon={ChevronRight} small />
          </div>
        )}

        {doc && (
          <div className="hidden items-center gap-0.5 rounded-xl border border-line bg-canvas px-1 py-0.5 md:flex">
            <ToolButton label="Zoom out" onClick={() => zoomBy(-0.1)} icon={Minus} small />
            <button onClick={fitWidth} className="w-12 rounded-md py-1 text-xs font-medium text-slate-300 hover:text-ink" title="Fit to width">
              {Math.round(scale * 100)}%
            </button>
            <ToolButton label="Zoom in" onClick={() => zoomBy(0.1)} icon={Plus} small />
          </div>
        )}

        <ToolButton label={night ? "Day pages" : "Night pages"} pressed={night} onClick={() => setNight((v) => !v)} icon={night ? Sun : Moon} />
        <ToolButton label={focus ? "Show side panels" : "Focus mode (hide all side panels)"} pressed={focus} onClick={() => setFocus((v) => !v)} icon={Focus} />
        <ToolButton label="Notes" pressed={notesOpen} onClick={() => { setFocus(false); setShowNotes((v) => !v); }} icon={PanelRight} badge={annotations.length || undefined} />
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* ---------- contents panel ---------- */}
        <aside
          className={`absolute inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-line bg-surface shadow-lift transition-transform duration-300 lg:static lg:shadow-none ${
            contentsOpen ? "translate-x-0" : "-translate-x-full lg:hidden"
          }`}
          aria-label="Book contents"
        >
          <PanelHeader icon={ListTree} title="Contents" onClose={() => setShowContents(false)} />
          <div className="flex-1 overflow-y-auto p-2 text-sm">
            {outline.length ? (
              <OutlineList items={outline} doc={doc} onGo={(n) => { goTo(n); if (window.innerWidth < 1024) setShowContents(false); }} />
            ) : (
              <p className="px-2 py-3 text-xs text-slate-400">{doc ? "This PDF has no chapter list. Use the page box above to jump." : "Loading…"}</p>
            )}
            {byPage.size > 0 && (
              <div className="mt-4 border-t border-line pt-3">
                <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Pages with notes</div>
                <div className="flex flex-wrap gap-1.5 px-2">
                  {[...byPage.keys()].sort((a, b) => a - b).map((p) => (
                    <button key={p} onClick={() => goTo(p)} className="rounded-md bg-slate-850 px-2 py-1 text-xs text-slate-300 hover:text-ink">
                      p.{p} <span className="text-slate-500">({byPage.get(p)!.length})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ---------- pages ---------- */}
        <div
          ref={scrollRef}
          className="relative min-w-0 flex-1 overflow-auto bg-slate-850 px-2 py-4 sm:px-8 sm:py-6"
          onMouseUp={onPointerUp}
          onTouchEnd={onPointerUp}
          onScroll={() => {
            if (pending) setPending(null);
            if (openAnn) setOpenAnn(null);
          }}
        >
          {status === "missing" && <MissingState book={book} backHref={backHref} />}
          {status === "error" && <ErrorState book={book} />}
          {status === "loading" && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
              Opening the book{progress ? ` · ${progress}%` : "…"}
            </div>
          )}
          {doc && pdfjs && (
            <div className="mx-auto flex flex-col items-center gap-4" style={{ width: baseSize.w * scale }}>
              {Array.from({ length: doc.numPages }, (_, i) => i + 1).map((n) => (
                <PdfPage
                  key={n}
                  pdfjs={pdfjs}
                  doc={doc}
                  pageNumber={n}
                  scale={scale}
                  baseSize={baseSize}
                  night={night}
                  annotations={byPage.get(n) ?? []}
                  register={(el) => (el ? pageEls.current.set(n, el) : pageEls.current.delete(n))}
                  onOpenAnn={(id, x, y) => {
                    setPending(null);
                    setOpenAnn({ id, x, y });
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ---------- notes panel ---------- */}
        <aside
          className={`absolute inset-y-0 right-0 z-20 flex w-80 flex-col border-l border-line bg-surface shadow-lift transition-transform duration-300 xl:static xl:shadow-none ${
            notesOpen ? "translate-x-0" : "translate-x-full xl:hidden"
          }`}
          aria-label="My notes"
        >
          <PanelHeader icon={NotebookPen} title={`My notes${annotations.length ? ` (${annotations.length})` : ""}`} onClose={() => setShowNotes(false)} />
          <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
            <FilterChip active={colorFilter === "all"} onClick={() => setColorFilter("all")}>All</FilterChip>
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.key}
                onClick={() => setColorFilter(c.key)}
                aria-label={`Show ${c.label} only`}
                className={`h-6 w-6 rounded-full border-2 transition ${colorFilter === c.key ? "scale-110 border-ink" : "border-transparent"}`}
                style={{ background: c.dot }}
              />
            ))}
            <div className="flex-1" />
            <button onClick={exportNotes} disabled={!annotations.length} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-ink disabled:opacity-40" title="Download notes (.txt)">
              <Download className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {doc && (
              <button onClick={addPageNote} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 py-2.5 text-sm text-slate-300 transition hover:border-brand-500/50 hover:text-brand-400">
                <StickyNote className="h-4 w-4" /> Add a note to page {page}
              </button>
            )}
            {!visibleNotes.length && (
              <p className="px-1 py-4 text-center text-sm text-slate-400">
                Select any text in the book to highlight it or add a note. Your notes are saved on this device.
              </p>
            )}
            {visibleNotes.map((a) => (
              <div key={a.id} className="group rounded-xl border border-line bg-canvas p-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.rects.length ? dotOf(a.color) : "transparent", border: a.rects.length ? "none" : "1.5px solid currentColor" }} />
                  <button onClick={() => goTo(a.page)} className="font-semibold text-brand-400 hover:underline">
                    Page {a.page}
                  </button>
                  <span className="text-slate-500">{a.rects.length ? "Highlight" : "Page note"}</span>
                  <div className="flex-1" />
                  <button onClick={() => deleteAnn(a.id)} className="rounded p-1 text-slate-500 opacity-0 transition hover:text-rose-400 group-hover:opacity-100 focus:opacity-100" aria-label="Delete note">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {a.quote && (
                  <blockquote className="mt-2 line-clamp-4 border-l-2 pl-2 text-[13px] italic leading-relaxed text-slate-300" style={{ borderColor: dotOf(a.color) }}>
                    {a.quote}
                  </blockquote>
                )}
                <textarea
                  id={`note-${a.id}`}
                  value={a.note}
                  onChange={(e) => updateAnn(a.id, { note: e.target.value })}
                  placeholder="Write a note…"
                  rows={a.note ? Math.min(6, a.note.split("\n").length + 1) : 1}
                  className="mt-2 w-full resize-none rounded-lg border border-transparent bg-transparent px-1 py-1 text-sm text-ink placeholder:text-slate-500 focus:border-line focus:bg-surface focus:outline-none"
                />
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ---------- selection popup ---------- */}
      {pending && (
        <Popover x={pending.x} y={pending.y} onClose={() => setPending(null)}>
          <div className="flex items-center gap-1">
            <Highlighter className="ml-1 h-4 w-4 text-slate-400" />
            {HIGHLIGHT_COLORS.map((c) => (
              <button key={c.key} onClick={() => addHighlight(c.key)} aria-label={`Highlight ${c.label}`} title={`Highlight ${c.label}`} className="h-7 w-7 rounded-full border-2 border-surface shadow transition hover:scale-110" style={{ background: c.dot }} />
            ))}
            <span className="mx-1 h-6 w-px bg-line" />
            <button onClick={() => addHighlight("yellow", true)} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-ink">
              <NotebookPen className="h-4 w-4" /> Note
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(pending.quote).catch(() => {});
                setPending(null);
              }}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-ink"
              aria-label="Copy text"
              title="Copy"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </Popover>
      )}

      {/* ---------- existing highlight popup ---------- */}
      {active && openAnn && (
        <Popover x={openAnn.x} y={openAnn.y} onClose={() => setOpenAnn(null)} wide>
          <div className="space-y-2">
            {active.rects.length > 0 && (
              <div className="flex items-center gap-1.5">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => updateAnn(active.id, { color: c.key })}
                    aria-label={`Change to ${c.label}`}
                    className={`h-6 w-6 rounded-full border-2 transition ${active.color === c.key ? "border-ink" : "border-transparent"}`}
                    style={{ background: c.dot }}
                  />
                ))}
                <div className="flex-1" />
                <button onClick={() => deleteAnn(active.id)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            )}
            <textarea
              autoFocus
              value={active.note}
              onChange={(e) => updateAnn(active.id, { note: e.target.value })}
              placeholder="Write a note for this highlight…"
              rows={3}
              className="w-full resize-none rounded-lg border border-line bg-canvas p-2 text-sm text-ink placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
            />
            <div className="flex justify-end">
              <button onClick={() => setOpenAnn(null)} className="rounded-lg bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-400">
                Done
              </button>
            </div>
          </div>
        </Popover>
      )}

      {/* focus-mode hint */}
      {focus && (
        <button onClick={() => setFocus(false)} className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3 py-2 text-xs text-slate-300 shadow-lift backdrop-blur hover:text-ink">
          <Eye className="h-3.5 w-3.5" /> Show panels <kbd className="rounded bg-slate-850 px-1.5 font-mono text-[10px]">F</kbd>
        </button>
      )}
    </div>
  );
}

/* ====================================================================== */
/* One PDF page: canvas + selectable text layer + highlight overlay        */
/* ====================================================================== */
function PdfPage({
  pdfjs,
  doc,
  pageNumber,
  scale,
  baseSize,
  night,
  annotations,
  register,
  onOpenAnn,
}: {
  pdfjs: PdfJs;
  doc: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  baseSize: { w: number; h: number };
  night: boolean;
  annotations: Annotation[];
  register: (el: HTMLDivElement | null) => void;
  onOpenAnn: (id: string, x: number, y: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState(baseSize);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "1200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textDiv = textRef.current;
    if (!canvas || !textDiv) return;
    if (!visible) {
      // free memory for pages far off-screen
      canvas.width = 0;
      canvas.height = 0;
      textDiv.replaceChildren();
      return;
    }
    let cancelled = false;
    let renderTask: RenderTask | null = null;
    let textLayer: { cancel: () => void } | null = null;
    (async () => {
      try {
        const page = await doc.getPage(pageNumber);
        if (cancelled) return;
        const base = page.getViewport({ scale: 1 });
        if (base.width !== size.w || base.height !== size.h) setSize({ w: base.width, h: base.height });
        const viewport = page.getViewport({ scale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        renderTask = page.render({ canvasContext: ctx, viewport, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined });
        await renderTask.promise;
        if (cancelled) return;
        textDiv.replaceChildren();
        textDiv.style.setProperty("--scale-factor", String(scale));
        const tl = new pdfjs.TextLayer({ textContentSource: page.streamTextContent(), container: textDiv, viewport });
        textLayer = tl;
        await tl.render();
        if (cancelled) return;
        const end = document.createElement("div");
        end.className = "endOfContent";
        textDiv.append(end);
      } catch {
        /* render cancelled or failed — page stays blank until visible again */
      }
    })();
    return () => {
      cancelled = true;
      renderTask?.cancel();
      textLayer?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, scale, doc, pageNumber, pdfjs]);

  const w = size.w * scale;
  const h = size.h * scale;

  // Click on a highlight (text layer stays on top for selecting, so we hit-test manually)
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) return;
    const box = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - box.left) / box.width;
    const fy = (e.clientY - box.top) / box.height;
    const hit = [...annotations].reverse().find((a) => a.rects.some((r) => fx >= r.x && fx <= r.x + r.w && fy >= r.y && fy <= r.y + r.h));
    if (hit) onOpenAnn(hit.id, e.clientX, e.clientY + 8);
  };

  const pageNotes = annotations.filter((a) => !a.rects.length);

  return (
    <div
      ref={(el) => {
        wrapRef.current = el;
        register(el);
      }}
      data-page={pageNumber}
      onClick={onClick}
      className="pdf-page relative shrink-0 overflow-hidden rounded-sm bg-white shadow-soft"
      style={{ width: w, height: h }}
    >
      <canvas ref={canvasRef} className={`absolute inset-0 ${night ? "[filter:invert(0.9)_hue-rotate(180deg)]" : ""}`} />
      {/* highlights (under the text layer so text stays selectable) */}
      <div className="pointer-events-none absolute inset-0">
        {annotations.flatMap((a) =>
          a.rects.map((r, i) => (
            <div
              key={`${a.id}-${i}`}
              className="absolute rounded-[2px]"
              style={{ left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.w * 100}%`, height: `${r.h * 100}%`, background: fillOf(a.color), mixBlendMode: night ? "screen" : "multiply" }}
            />
          ))
        )}
      </div>
      <div
        ref={textRef}
        className="textLayer"
        onMouseDown={(e) => {
          // While dragging, stretch PDF.js's end-of-content element over the page (under the text)
          // and keep it right after the current selection end. Crossing a gap between words, lines
          // or columns then keeps the selection where it is instead of collapsing or jumping to the
          // end of the page (same technique as PDF.js's own viewer).
          const layer = e.currentTarget;
          const end = layer.querySelector<HTMLElement>(".endOfContent");
          if (!end) return;
          end.classList.add("active");
          const follow = () => {
            const sel = window.getSelection();
            if (!sel?.rangeCount) return;
            let node: Node | null = sel.getRangeAt(0).endContainer;
            if (node.nodeType === 3) node = node.parentElement;
            const span = (node as HTMLElement | null)?.closest?.("span");
            if (span && layer.contains(span) && span.nextSibling !== end) span.after(end);
          };
          const stop = () => {
            end.classList.remove("active");
            layer.append(end);
            document.removeEventListener("selectionchange", follow);
            document.removeEventListener("mouseup", stop);
          };
          document.addEventListener("selectionchange", follow);
          document.addEventListener("mouseup", stop);
        }}
      />
      {/* page notes pinned to the top-right corner */}
      {pageNotes.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenAnn(pageNotes[0].id, e.clientX, e.clientY + 8);
          }}
          className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-amber-300 px-2 py-1 text-[11px] font-semibold text-amber-950 shadow"
          title="Page note"
        >
          <StickyNote className="h-3.5 w-3.5" /> {pageNotes.length}
        </button>
      )}
      <span className="pointer-events-none absolute bottom-1.5 right-2 text-[10px] text-slate-400/70">{pageNumber}</span>
    </div>
  );
}

/* ====================================================================== */
/* Small pieces                                                            */
/* ====================================================================== */
function ToolButton({
  label,
  icon: Icon,
  onClick,
  pressed,
  small,
  badge,
}: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  pressed?: boolean;
  small?: boolean;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`relative flex shrink-0 items-center justify-center rounded-lg transition ${small ? "h-7 w-7" : "h-9 w-9"} ${
        pressed ? "bg-brand-500/10 text-brand-400" : "text-slate-300 hover:bg-slate-800 hover:text-ink"
      }`}
    >
      <Icon className="h-4 w-4" />
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-on-primary">{badge}</span>
      ) : null}
    </button>
  );
}

function PanelHeader({ icon: Icon, title, onClose }: { icon: React.ElementType; title: string; onClose: () => void }) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b border-line px-3 text-sm font-semibold">
      <Icon className="h-4 w-4 text-brand-400" />
      <span className="flex-1">{title}</span>
      <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-ink" aria-label={`Close ${title}`}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full px-2.5 py-1 text-xs font-medium ${active ? "bg-brand-500/10 text-brand-400" : "text-slate-400 hover:text-ink"}`}>
      {children}
    </button>
  );
}

function Popover({ x, y, children, onClose, wide }: { x: number; y: number; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  const width = wide ? 300 : 280;
  const left = Math.min(Math.max(8, x - width / 2), (typeof window !== "undefined" ? window.innerWidth : 1200) - width - 8);
  const top = Math.min(y + 8, (typeof window !== "undefined" ? window.innerHeight : 800) - (wide ? 200 : 60));
  return (
    <>
      <div className="fixed inset-0 z-40" onMouseDown={onClose} />
      <div
        className="fixed z-50 rounded-xl border border-line bg-surface p-2 shadow-lift animate-fadeIn"
        style={{ left, top, width: wide ? width : "auto" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
}

function OutlineList({ items, doc, onGo, depth = 0 }: { items: OutlineItem[]; doc: PDFDocumentProxy | null; onGo: (page: number) => void; depth?: number }) {
  const resolve = async (dest: unknown) => {
    if (!doc || !dest) return;
    try {
      const explicit = typeof dest === "string" ? await doc.getDestination(dest) : (dest as unknown[]);
      if (!explicit) return;
      const ref = explicit[0] as { num: number; gen: number } | number;
      const idx = typeof ref === "number" ? ref : await doc.getPageIndex(ref);
      onGo(idx + 1);
    } catch {
      /* broken link in the PDF's outline */
    }
  };
  return (
    <ul className={depth ? "ml-3 border-l border-line pl-2" : ""}>
      {items.map((it, i) => (
        <li key={i}>
          <button onClick={() => resolve(it.dest)} className="w-full rounded-md px-2 py-1.5 text-left text-[13px] leading-snug text-slate-300 hover:bg-slate-800 hover:text-ink">
            {it.title}
          </button>
          {it.items?.length > 0 && depth < 3 && <OutlineList items={it.items} doc={doc} onGo={onGo} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

function MissingState({ book, backHref }: { book: ReaderDoc; backHref: string }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-soft">
      <NotebookPen className="mx-auto h-8 w-8 text-brand-400" />
      <h2 className="mt-3 text-lg font-semibold">PDF coming soon</h2>
      <p className="mt-2 text-sm text-slate-400">
        {book.title}{book.edition ? ` (${book.edition})` : ""} will be readable here, with highlights and notes, as soon as the PDF is added.
      </p>
      <Link href={backHref} className="btn-ghost mt-5">
        Go back
      </Link>
    </div>
  );
}

function ErrorState({ book }: { book: ReaderDoc }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-soft">
      <h2 className="text-lg font-semibold">Couldn&apos;t open this book</h2>
      <p className="mt-2 text-sm text-slate-400">
        The PDF didn&apos;t load. Check your connection and try again. If it keeps happening, the file may not be shared publicly yet.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button onClick={() => window.location.reload()} className="btn-brand">
          Try again
        </button>
        {book.driveId && (
          <a href={drivePreviewUrl(driveFileId(book.driveId))} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Open in Google Drive
          </a>
        )}
      </div>
    </div>
  );
}

/** Merge selection rectangles that sit on the same line and touch/overlap. */
function mergeRects(rects: PageRect[]): PageRect[] {
  const sorted = [...rects].sort((a, b) => a.y - b.y || a.x - b.x);
  const out: PageRect[] = [];
  for (const r of sorted) {
    const prev = out[out.length - 1];
    const sameLine = prev && Math.abs(prev.y - r.y) < Math.min(prev.h, r.h) * 0.5;
    if (sameLine && r.x <= prev.x + prev.w + 0.01) {
      const right = Math.max(prev.x + prev.w, r.x + r.w);
      const top = Math.min(prev.y, r.y);
      const bottom = Math.max(prev.y + prev.h, r.y + r.h);
      prev.x = Math.min(prev.x, r.x);
      prev.w = right - prev.x;
      prev.y = top;
      prev.h = bottom - top;
    } else {
      out.push({ ...r });
    }
  }
  return out;
}
