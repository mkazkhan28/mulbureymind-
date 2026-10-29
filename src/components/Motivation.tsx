"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarClock,
  Flame,
  Lightbulb,
  Lock,
  Minus,
  Plus,
  Target,
  Trophy,
} from "lucide-react";
import {
  badgesFor,
  dayKey,
  daysUntil,
  openedToday,
  streakOf,
  tipOfTheDay,
  update,
  useProgress,
  type Progress,
} from "@/lib/progress";
import { catalogById } from "@/lib/catalog";

/* ======================================================================== */
/* Study panel: streak · daily goal · exam countdown · tip · badges          */
/* ======================================================================== */
export function StudyPanel({ compact = false }: { compact?: boolean }) {
  const p = useProgress();
  const streak = p ? streakOf(p.days) : 0;
  const today = p ? openedToday(p) : 0;
  const goal = p?.goal ?? 3;
  const done = today >= goal;
  const left = daysUntil(p?.examDate);

  // celebrate once a day when the goal is reached
  const [party, setParty] = useState(false);
  useEffect(() => {
    if (p && done && p.celebrated !== dayKey()) {
      setParty(true);
      update((x) => ({ ...x, celebrated: dayKey() }));
      const t = setTimeout(() => setParty(false), 2600);
      return () => clearTimeout(t);
    }
  }, [p, done]);

  return (
    <div className="relative space-y-4">
      {party && <Confetti />}
      <div className={`grid gap-4 ${compact ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
        {/* Streak */}
        <Tile tone="amber">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Study streak</span>
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 ${streak ? "animate-float" : ""}`}>
              <Flame className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-display text-4xl font-bold text-ink">{p ? streak : "–"}</span>
            <span className="text-sm text-slate-400">day{streak === 1 ? "" : "s"}</span>
          </div>
          <WeekDots p={p} />
          <p className="mt-2 text-xs text-slate-400">
            {!p ? " " : streak === 0 ? "Open a lecture today to start your streak." : streak < 3 ? "Nice start — keep it going tomorrow!" : "You're on fire. Don't break the chain!"}
          </p>
        </Tile>

        {/* Daily goal */}
        <Tile tone="brand">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Today&apos;s goal</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => update((x) => ({ ...x, goal: Math.max(1, x.goal - 1) }))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-ink"
                aria-label="Lower daily goal"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => update((x) => ({ ...x, goal: Math.min(10, x.goal + 1) }))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-ink"
                aria-label="Raise daily goal"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <Ring value={today} max={goal} />
            <div>
              <div className="font-display text-2xl font-bold text-ink">
                {p ? Math.min(today, goal) : "–"}
                <span className="text-base font-medium text-slate-400"> / {goal}</span>
              </div>
              <p className="text-xs text-slate-400">{done ? "Goal reached — brilliant!" : "lectures opened today"}</p>
            </div>
          </div>
          {done && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-500">
              <Trophy className="h-3.5 w-3.5" /> Daily goal done
            </p>
          )}
        </Tile>

        {/* Exam countdown */}
        <Tile tone="accent">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Exam countdown</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/15 text-accent-400">
              <CalendarClock className="h-5 w-5" />
            </span>
          </div>
          {left !== null && left >= 0 ? (
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold text-ink">{left}</span>
              <span className="text-sm text-slate-400">day{left === 1 ? "" : "s"} to go</span>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">{left !== null ? "Exam date has passed — set the next one." : "Set your exam date to see the countdown."}</p>
          )}
          <label className="mt-3 block">
            <span className="sr-only">Exam date</span>
            <input
              id="exam-date"
              type="date"
              value={p?.examDate ?? ""}
              onChange={(e) => update((x) => ({ ...x, examDate: e.target.value || undefined }))}
              className="w-full rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-sm text-ink focus:border-brand-500 focus:outline-none"
            />
          </label>
        </Tile>

        {/* Tip of the day */}
        <Tile tone="sky">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Tip of the day</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
              <Lightbulb className="h-5 w-5" />
            </span>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-ink">{tipOfTheDay()}</p>
        </Tile>
      </div>

      {!compact && <Badges p={p} />}
    </div>
  );
}

function Tile({ children, tone }: { children: React.ReactNode; tone: "amber" | "brand" | "accent" | "sky" }) {
  const glow = {
    amber: "from-amber-500/10",
    brand: "from-brand-500/10",
    accent: "from-accent-500/10",
    sky: "from-sky-500/10",
  }[tone];
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br ${glow} to-transparent bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift`}>
      {children}
    </div>
  );
}

function WeekDots({ p }: { p: Progress | null }) {
  const days = useMemo(() => {
    const out: { key: string; label: string }[] = [];
    const d = new Date();
    d.setDate(d.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      out.push({ key: dayKey(d), label: d.toLocaleDateString(undefined, { weekday: "narrow" }) });
      d.setDate(d.getDate() + 1);
    }
    return out;
  }, []);
  return (
    <div className="mt-3 flex gap-1.5">
      {days.map((d) => {
        const on = !!p?.days.includes(d.key);
        return (
          <div key={d.key} className="flex flex-col items-center gap-1">
            <span className={`h-2.5 w-6 rounded-full transition-colors ${on ? "bg-amber-500" : "bg-slate-800"}`} />
            <span className="text-[10px] text-slate-500">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Ring({ value, max }: { value: number; max: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, max ? value / max : 0);
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" strokeWidth="7" className="stroke-slate-800" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        className={`transition-[stroke-dashoffset] duration-700 ${pct >= 1 ? "stroke-amber-500" : "stroke-brand-500"}`}
      />
    </svg>
  );
}

function Badges({ p }: { p: Progress | null }) {
  const list = p ? badgesFor(p) : [];
  if (!p) return null;
  const earned = list.filter((b) => b.earned).length;
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <Award className="h-4 w-4 text-amber-500" /> Badges
        <span className="rounded-full bg-slate-850 px-2 py-0.5 text-[11px] font-medium text-slate-400">
          {earned} / {list.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((b) => (
          <div
            key={b.key}
            title={b.hint}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
              b.earned ? "border-amber-500/40 bg-amber-500/10 text-ink" : "border-line bg-canvas text-slate-500"
            }`}
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${b.earned ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-500"}`}>
              {b.earned ? <Trophy className="h-3.5 w-3.5" /> : <Lock className="h-3 w-3" />}
            </span>
            <span>
              <span className="block font-semibold">{b.title}</span>
              <span className="block text-[10px] text-slate-500">{b.hint}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => i);
  const colors = ["#8b5cf6", "#22e4ff", "#3b6dff", "#18181b", "#f2b63d"];
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-4 z-20 h-0 overflow-visible" aria-hidden="true">
      {pieces.map((i) => (
        <span
          key={i}
          className="absolute top-0 block h-2.5 w-1.5 rounded-sm animate-confetti"
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 7) * 60}ms`,
            ["--drift" as string]: `${((i * 53) % 120) - 60}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ======================================================================== */
/* Continue where you left off                                               */
/* ======================================================================== */
export function ContinueReading({ subjectSlug, limit = 4 }: { subjectSlug?: string; limit?: number }) {
  const p = useProgress();
  const recent = useMemo(() => {
    if (!p) return [];
    return Object.entries(p.opened)
      .sort((a, b) => b[1].at - a[1].at)
      .map(([id, o]) => ({ item: catalogById.get(id), o }))
      .filter((x) => x.item && (!subjectSlug || x.item.subjectSlug === subjectSlug || x.item.kind === "book"))
      .slice(0, limit);
  }, [p, subjectSlug, limit]);

  if (!p) return null;
  if (!recent.length) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-surface/60 px-5 py-4 text-sm text-slate-400">
        <BookOpen className="h-5 w-5 text-brand-400" />
        <span className="flex-1">Open any lecture and it will appear here, so you can jump back in with one tap.</span>
        <Link href="/subjects/anatomy" className="inline-flex items-center gap-1 font-semibold text-brand-400 hover:underline">
          Browse Anatomy <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {recent.map(({ item, o }) => {
        const pct = item!.pages ? Math.min(100, Math.round((o.page / item!.pages) * 100)) : 0;
        return (
          <Link
            key={item!.id}
            href={item!.href}
            className="group flex overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-lift"
          >
            <div className="relative w-28 shrink-0 overflow-hidden bg-slate-850">
              {item!.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item!.thumb} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center text-brand-400">
                  <BookOpen className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
              <div>
                <div className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{item!.title}</div>
                <div className="mt-0.5 truncate text-[11px] text-slate-500">{item!.areaTitle ?? item!.topic}</div>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Page {o.page}{item!.pages ? ` of ${item!.pages}` : ""}</span>
                  <span className="font-semibold text-brand-400 opacity-0 transition group-hover:opacity-100">Continue →</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
