"use client";

/**
 * Study progress, saved on the student's device (localStorage).
 * Feeds the streak, daily goal, continue-reading list, area progress bars and badges.
 * When Supabase auth is connected this can sync to a table like book_annotations.
 */

import { useEffect, useState } from "react";

export interface Progress {
  /** lecture/book id → when it was last opened and the page reached */
  opened: Record<string, { at: number; page: number; first: number }>;
  /** days with study activity, "YYYY-MM-DD" (local time) */
  days: string[];
  /** lectures-per-day goal */
  goal: number;
  /** exam date "YYYY-MM-DD" for the countdown */
  examDate?: string;
  /** last day the goal celebration was shown */
  celebrated?: string;
}

const KEY = "hmh-progress";
const EVENT = "hmh-progress";
const EMPTY: Progress = { opened: {}, days: [], goal: 3 };

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — progress lasts for this visit only */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function update(fn: (p: Progress) => Progress) {
  save(fn(loadProgress()));
}

/** Call when a lecture or book is opened / the page changes. */
export function recordOpen(id: string, page = 1) {
  update((p) => {
    const today = dayKey();
    const prev = p.opened[id];
    return {
      ...p,
      opened: { ...p.opened, [id]: { at: Date.now(), page, first: prev?.first ?? Date.now() } },
      days: p.days.includes(today) ? p.days : [...p.days, today].slice(-400),
    };
  });
}

export function streakOf(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  // today not studied yet → streak continues from yesterday
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function openedToday(p: Progress): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Object.values(p.opened).filter((o) => o.at >= start.getTime()).length;
}

export function daysUntil(date?: string): number | null {
  if (!date) return null;
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return null;
  const target = new Date(y, m - 1, d).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86400000);
}

/** React hook: current progress, updates live when anything records progress. */
export function useProgress(): Progress | null {
  const [p, setP] = useState<Progress | null>(null);
  useEffect(() => {
    const read = () => setP(loadProgress());
    read();
    window.addEventListener(EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);
  return p;
}

export interface Badge {
  key: string;
  title: string;
  hint: string;
  earned: boolean;
}

export function badgesFor(p: Progress): Badge[] {
  const total = Object.keys(p.opened).length;
  const best = (() => {
    // longest run in history
    const sorted = [...new Set(p.days)].sort();
    let bestRun = 0, run = 0, prev: number | null = null;
    for (const s of sorted) {
      const [y, m, d] = s.split("-").map(Number);
      const t = new Date(y, m - 1, d).getTime();
      run = prev !== null && Math.round((t - prev) / 86400000) === 1 ? run + 1 : 1;
      bestRun = Math.max(bestRun, run);
      prev = t;
    }
    return bestRun;
  })();
  return [
    { key: "first", title: "First step", hint: "Open your first lecture", earned: total >= 1 },
    { key: "goal", title: "Goal getter", hint: "Hit your daily goal", earned: openedToday(p) >= p.goal || !!p.celebrated },
    { key: "streak3", title: "On a roll", hint: "Study 3 days in a row", earned: best >= 3 },
    { key: "ten", title: "Ten down", hint: "Open 10 lectures", earned: total >= 10 },
    { key: "streak7", title: "Week warrior", hint: "Study 7 days in a row", earned: best >= 7 },
    { key: "fifty", title: "Half-century", hint: "Open 50 lectures", earned: total >= 50 },
  ];
}

/** Short original study tips, one per day. */
export const STUDY_TIPS = [
  "Read the learning objectives first, then hunt for each answer in the slides.",
  "Highlight one key fact per slide in yellow, and turn it into a viva question in your notes.",
  "Two short sessions beat one long one. Open one lecture now and one after dinner.",
  "Teach it back: explain today's lecture out loud in two minutes without looking.",
  "Draw it. Nerves, triangles and arches stick better as quick sketches.",
  "Revisit yesterday's highlights before starting something new. Spaced repetition wins exams.",
  "Pair every gross anatomy topic with its histology slide — examiners love linking them.",
  "Stuck on a slide? Write the question in a note and move on. Momentum matters.",
  "Before sleeping, skim your notes for five minutes. Your brain files them overnight.",
  "Practise MCQs right after reading a lecture — retrieval is what makes it stick.",
];

export const tipOfTheDay = () => {
  const d = new Date();
  const n = Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);
  return STUDY_TIPS[n % STUDY_TIPS.length];
};
