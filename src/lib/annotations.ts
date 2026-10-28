/**
 * Highlights & notes made in the book reader.
 *
 * Stored in the student's browser (localStorage) for now. When Supabase auth is wired up,
 * swap load/save for the `book_annotations` table (see supabase/migrations/20261029_book_annotations.sql)
 * so notes follow the student across devices.
 */

export type HighlightColor = "yellow" | "green" | "blue" | "pink";

/** A rectangle on a page, stored as fractions (0–1) of the page width/height so it survives zoom changes. */
export interface PageRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Annotation {
  id: string;
  page: number;
  /** Empty for a page note (no highlighted text) */
  rects: PageRect[];
  color: HighlightColor;
  /** The highlighted text */
  quote: string;
  /** The student's note */
  note: string;
  createdAt: number;
  updatedAt: number;
}

export const HIGHLIGHT_COLORS: { key: HighlightColor; label: string; fill: string; dot: string }[] = [
  { key: "yellow", label: "Yellow", fill: "rgba(250, 204, 21, 0.38)", dot: "#facc15" },
  { key: "green", label: "Green", fill: "rgba(22, 196, 127, 0.32)", dot: "#16c47f" },
  { key: "blue", label: "Blue", fill: "rgba(47, 107, 255, 0.28)", dot: "#2f6bff" },
  { key: "pink", label: "Pink", fill: "rgba(244, 63, 94, 0.28)", dot: "#f43f5e" },
];

const key = (bookId: string) => `hmh-notes:${bookId}`;

export function loadAnnotations(bookId: string): Annotation[] {
  try {
    const raw = localStorage.getItem(key(bookId));
    const list = raw ? (JSON.parse(raw) as Annotation[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveAnnotations(bookId: string, list: Annotation[]) {
  try {
    localStorage.setItem(key(bookId), JSON.stringify(list));
  } catch {
    /* storage full or blocked — notes stay for this visit only */
  }
}

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Plain-text export of all highlights and notes for one book. */
export function annotationsToText(title: string, list: Annotation[]) {
  const lines = [`${title} — my highlights & notes`, ""];
  for (const a of [...list].sort((x, y) => x.page - y.page || x.createdAt - y.createdAt)) {
    lines.push(`Page ${a.page}${a.rects.length ? ` · ${a.color} highlight` : " · page note"}`);
    if (a.quote) lines.push(`"${a.quote}"`);
    if (a.note) lines.push(`Note: ${a.note}`);
    lines.push("");
  }
  return lines.join("\n");
}

/** Reading position (last page + zoom) per book. */
export function loadPosition(bookId: string): { page: number; zoom?: number } | null {
  try {
    const raw = localStorage.getItem(`hmh-reader:${bookId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function savePosition(bookId: string, pos: { page: number; zoom?: number }) {
  try {
    localStorage.setItem(`hmh-reader:${bookId}`, JSON.stringify(pos));
  } catch {
    /* ignore */
  }
}
