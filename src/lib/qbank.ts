"use client";

/**
 * Question Bank: the topic-wise MCQ sets from the QBank folder.
 * The index (set names + counts) is bundled; the questions are fetched per subject on demand
 * and cached for the session, so they only load on the pages that use them.
 */
import { useEffect, useState } from "react";
import type { MCQ } from "@/lib/bds-content";
import { QBANK_SETS, type QBankSet } from "@/lib/qbank-meta";

export { QBANK_SETS };
export type { QBankSet };

export type QBankKind = "pp" | "practice";

type Raw = Omit<MCQ, "subjectId" | "difficulty"> & { isPastPaper?: boolean };

const cache = new Map<string, Promise<MCQ[]>>();

/** Files are served from /data/qbank. The static preview sets window.__ASSET_BASE__ to serve them relatively. */
function base() {
  if (typeof window === "undefined") return "/";
  const b = (window as unknown as { __ASSET_BASE__?: string }).__ASSET_BASE__;
  return b ?? "/";
}

function load(subjectId: string, kind: QBankKind): Promise<MCQ[]> {
  const key = `${subjectId}-${kind}`;
  if (!QBANK_SETS.some((s) => s.subjectId === subjectId && s.pastPaper === (kind === "pp"))) return Promise.resolve([]);
  let p = cache.get(key);
  if (!p) {
    p = fetch(`${base()}data/qbank/${key}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Question bank ${key}: ${r.status}`);
        return r.json() as Promise<Raw[]>;
      })
      .then((rows) => rows.map((q) => ({ ...q, subjectId, isPastPaper: kind === "pp" || undefined })))
      .catch((e) => {
        cache.delete(key); // let a later visit retry
        throw e;
      });
    cache.set(key, p);
  }
  return p;
}

/** Load the bank questions for some subjects ("all" = every subject in the bank). */
export function loadQBank(subjectIds: string[] | "all", kinds: QBankKind[] = ["practice", "pp"]): Promise<MCQ[]> {
  const ids = subjectIds === "all" ? Array.from(new Set(QBANK_SETS.map((s) => s.subjectId))) : subjectIds;
  return Promise.all(ids.flatMap((id) => kinds.map((k) => load(id, k)))).then((parts) => parts.flat());
}

/** React hook: bank questions for a subject selection. `questions` is null while loading. */
export function useQBank(subject: string, kinds: QBankKind[] = ["practice", "pp"]) {
  const [questions, setQuestions] = useState<MCQ[] | null>(null);
  const [error, setError] = useState(false);
  const kindKey = kinds.join(",");
  useEffect(() => {
    let live = true;
    setQuestions(null);
    setError(false);
    loadQBank(subject === "all" ? "all" : [subject], kinds)
      .then((q) => live && setQuestions(q))
      .catch(() => {
        if (!live) return;
        setError(true);
        setQuestions([]);
      });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, kindKey]);
  return { questions, error };
}

/** Sets for a subject ("all" = every subject), optionally only past papers or only practice sets. */
export function qbankSets(subject: string, pastPaper?: boolean): QBankSet[] {
  return QBANK_SETS.filter((s) => (subject === "all" || s.subjectId === subject) && (pastPaper === undefined || s.pastPaper === pastPaper));
}

/** Question counts from the index, without loading any questions. */
export function qbankCount(subject: string, pastPaper?: boolean) {
  return qbankSets(subject, pastPaper).reduce((n, s) => n + s.count, 0);
}

export const qbankSet = (id: string) => QBANK_SETS.find((s) => s.id === id);

/** Fisher–Yates shuffle (copy). */
export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
