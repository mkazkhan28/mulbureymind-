/**
 * Real content counts, computed from the data that actually exists in the site.
 * Use these instead of the planned/target numbers stored on Subject (mcqCount, flashcardCount…),
 * so the UI never shows statistics that aren't backed by real content.
 */
import { BDS_MCQS, BDS_FLASHCARD_DECKS, BDS_FLASHCARDS, BDS_RESOURCES, BDS_SUBJECTS, BDS_TOPICS } from "@/lib/bds-content";
import { BOOKS_DATA } from "@/lib/books";
import { SUBJECT_STRUCTURES } from "@/lib/subject-structure";
import { QBANK_SETS } from "@/lib/qbank-meta";

const bankCount = (subjectId: string, pastPaper?: boolean) =>
  QBANK_SETS.filter((s) => s.subjectId === subjectId && (pastPaper === undefined || s.pastPaper === pastPaper)).reduce((n, s) => n + s.count, 0);

export interface SubjectStats {
  mcqs: number;
  pastPaperMcqs: number;
  decks: number;
  cards: number;
  lectures: number;
  books: number;
  notes: number;
  topics: number;
}

const slugOf = (subjectId: string) => BDS_SUBJECTS.find((s) => s.id === subjectId)?.slug;

export function subjectStats(subjectId: string): SubjectStats {
  const slug = slugOf(subjectId);
  const structure = slug ? SUBJECT_STRUCTURES[slug] : undefined;
  const decks = BDS_FLASHCARD_DECKS.filter((d) => d.subjectId === subjectId);
  const deckIds = new Set(decks.map((d) => d.id));
  return {
    // hand-written sample questions + the Question Bank (counted from its index, without loading it)
    mcqs: BDS_MCQS.filter((q) => q.subjectId === subjectId).length + bankCount(subjectId),
    pastPaperMcqs: BDS_MCQS.filter((q) => q.subjectId === subjectId && q.yearSource).length + bankCount(subjectId, true),
    decks: decks.length,
    cards: BDS_FLASHCARDS.filter((c) => deckIds.has(c.deckId)).length,
    lectures: structure ? structure.ppts.combined.filter((f) => f.pdf || f.drive).length : 0,
    books: BOOKS_DATA.filter((b) => b.subjectId === subjectId).length,
    notes: BDS_RESOURCES.filter((r) => r.subjectId === subjectId).length,
    topics: BDS_TOPICS.filter((t) => t.subjectId === subjectId).length,
  };
}

export function siteStats() {
  const firstYear = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");
  const per = firstYear.map((s) => subjectStats(s.id));
  const sum = (k: keyof SubjectStats) => per.reduce((n, p) => n + p[k], 0);
  return {
    subjects: firstYear.length,
    mcqs: sum("mcqs"),
    pastPaperMcqs: sum("pastPaperMcqs"),
    decks: sum("decks"),
    lectures: sum("lectures"),
    books: BOOKS_DATA.length,
    notes: sum("notes"),
  };
}

/** "12 MCQs" / "1 lecture" / "" when zero */
export const count = (n: number, one: string, many = `${one}s`) => (n ? `${n.toLocaleString()} ${n === 1 ? one : many}` : "");
