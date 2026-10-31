/**
 * Previous / next / related reading for a lecture, so students can move through a
 * chapter without going back to a menu.
 */
import { BOOKS_DATA } from "@/lib/books";
import { findStudyFile, getSubjectStructure } from "@/lib/subject-structure";
import type { ReaderNav } from "@/components/BookReader";

export function lectureNav(id: string, href: (id: string) => string = (x) => `/read/${x}`): ReaderNav | undefined {
  const found = findStudyFile(id);
  if (!found) return undefined;
  const { file, subjectSlug } = found;
  const st = getSubjectStructure(subjectSlug);
  if (!st || !file.area) return undefined;
  const area = st.areas.find((a) => a.slug === file.area);
  const pool = [...st.ppts.combined, ...st.ppts.ddc];
  const own = pool.filter((f, i) => f.area === file.area && f.pdf && pool.findIndex((g) => g.id === f.id) === i);
  const at = own.findIndex((f) => f.id === id);
  const link = (f?: { id: string; title: string }) => (f ? { href: href(f.id), title: f.title } : undefined);

  // related: lectures in other chapters that are linked to this one (or that this one is linked into), then the chapter's textbook
  const linked = pool.filter(
    (f) => f.id !== id && f.pdf && (f.alsoIn?.includes(file.area!) || (file.alsoIn ?? []).includes(f.area ?? "")) && f.area !== file.area
  );
  const sameTopic = own.filter((f) => f.id !== id && f.topic && f.topic === file.topic);
  const related = [
    ...sameTopic.slice(0, 2).map((f) => ({ href: href(f.id), title: f.title, sub: f.topic })),
    ...linked.slice(0, 3).map((f) => ({ href: href(f.id), title: f.title, sub: st.areas.find((a) => a.slug === f.area)?.title })),
    ...BOOKS_DATA.filter((b) => b.area === file.area).map((b) => ({ href: href(b.id), title: b.title, sub: "Textbook" })),
  ].filter((r) => r.href !== link(own[at - 1])?.href && r.href !== link(own[at + 1])?.href);

  return {
    prev: at > 0 ? link(own[at - 1]) : undefined,
    next: at >= 0 && at < own.length - 1 ? link(own[at + 1]) : undefined,
    chapter: area ? { href: `/subjects/${subjectSlug}/${area.slug}`, title: area.title } : undefined,
    related: related.slice(0, 5),
  };
}
