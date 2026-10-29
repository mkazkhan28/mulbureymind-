/** One list of everything a student can open: lecture PDFs and textbooks. Used by search, continue-reading and progress. */

import { BOOKS_DATA } from "@/lib/books";
import { SUBJECT_STRUCTURES, type StudyFile } from "@/lib/subject-structure";

export interface CatalogItem {
  id: string;
  title: string;
  kind: "lecture" | "book";
  href: string;
  /** small first-slide image, when available */
  thumb?: string;
  pages?: number;
  subjectSlug?: string;
  areaSlug?: string;
  areaTitle?: string;
  topic?: string;
  by?: string;
}

const thumbFor = (f: StudyFile) => (f.pdf ? `/files/thumbs/${f.id}.webp` : undefined);

export const CATALOG: CatalogItem[] = [
  ...Object.values(SUBJECT_STRUCTURES).flatMap((st) =>
    [...st.courseOutline, ...st.ppts.combined, ...st.ppts.ddc]
      .filter((f) => f.pdf || f.drive)
      .map((f) => ({
        id: f.id,
        title: f.title,
        kind: "lecture" as const,
        href: f.pdf ? `/read/${f.id}` : `/subjects/${st.subjectSlug}/${f.area ?? ""}`,
        thumb: thumbFor(f),
        pages: f.pages,
        subjectSlug: st.subjectSlug,
        areaSlug: f.area,
        areaTitle: st.areas.find((a) => a.slug === f.area)?.title,
        topic: f.topic,
        by: f.by,
      }))
  ),
  ...BOOKS_DATA.map((b) => ({
    id: b.id,
    title: b.title,
    kind: "book" as const,
    href: `/read/${b.id}`,
    topic: b.edition,
    by: b.authors,
  })),
];

export const catalogById = new Map(CATALOG.map((c) => [c.id, c]));

/** Lectures that belong to an area (filed there or linked in). */
export function lecturesInArea(subjectSlug: string, area: string): string[] {
  const st = SUBJECT_STRUCTURES[subjectSlug];
  if (!st) return [];
  return [...st.ppts.combined, ...st.ppts.ddc]
    .filter((f) => f.area === area || f.alsoIn?.includes(area))
    .map((f) => f.id);
}

export function searchCatalog(q: string, limit = 8): CatalogItem[] {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return CATALOG.map((c) => {
    const hay = `${c.title} ${c.topic ?? ""} ${c.areaTitle ?? ""} ${c.by ?? ""}`.toLowerCase();
    if (!words.every((w) => hay.includes(w))) return null;
    const score = (c.title.toLowerCase().startsWith(words[0]) ? 2 : 0) + (c.title.toLowerCase().includes(q.toLowerCase()) ? 1 : 0);
    return { c, score };
  })
    .filter((x): x is { c: CatalogItem; score: number } => !!x)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.c);
}
