"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BDS_FLASHCARD_DECKS, BDS_FLASHCARDS } from "@/lib/bds-content";
import { ArrowLeft, RotateCw, CheckCircle2, XCircle, Award, Layers, RotateCcw, Sparkles, Shuffle, Undo2 } from "lucide-react";
import { m, AnimatePresence, ProgressBar, EASE } from "@/components/motion";
import { EmptyState } from "@/components/ui";

type Result = "mastered" | "review";

export default function FlashcardStudyPage() {
  const params = useParams();
  const deckId = params?.deckId as string;

  const deck = BDS_FLASHCARD_DECKS.find((d) => d.id === deckId);
  const cards = BDS_FLASHCARDS.filter((c) => c.deckId === deckId || deckId === "deck-pharm-la" || deckId === "deck-anat-cranial");

  // order = the cards in this session (indices into `cards`), so a session can be shuffled or limited to missed cards
  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<Record<number, Result>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const masteredCount = Object.values(results).filter((r) => r === "mastered").length;
  const reviewCount = Object.values(results).filter((r) => r === "review").length;
  const currentCard = cards[order[currentIndex]] || cards[0];

  const handleNextCard = (status: Result) => {
    setResults((prev) => ({ ...prev, [order[currentIndex]]: status }));
    setIsFlipped(false);
    if (currentIndex < order.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const goBack = () => {
    if (currentIndex === 0) return;
    setIsFlipped(false);
    setCurrentIndex((i) => i - 1);
  };

  const startSession = (next: number[]) => {
    setOrder(next);
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults({});
    setIsCompleted(false);
  };
  const handleRestart = () => startSession(cards.map((_, i) => i));
  const shuffle = () => {
    const a = [...order];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    startSession(a);
  };
  const reviseMissed = () => startSession(order.filter((i) => results[i] === "review"));

  // Keyboard: Space/Enter flip, ← / 1 needs revision, → / 2 knew it, Backspace previous card
  useEffect(() => {
    if (isCompleted || !cards.length) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      if (t.closest("button, a") && (e.key === " " || e.key === "Enter")) return; // let focused controls act normally
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (isFlipped && (e.key === "ArrowLeft" || e.key === "1")) handleNextCard("review");
      else if (isFlipped && (e.key === "ArrowRight" || e.key === "2")) handleNextCard("mastered");
      else if (e.key === "Backspace") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!deck && cards.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <EmptyState icon={Layers} title="Deck not found" text="We couldn't find that flashcard deck." href="/flashcards" action="Back to flashcards" />
      </div>
    );
  }

  const total = order.length;
  const done = Object.keys(results).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/flashcards" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> All decks
        </Link>
        {!isCompleted && (
          <button onClick={shuffle} className="btn-ghost !min-h-[36px] !px-3 !py-1.5 text-xs" title="Shuffle and start again">
            <Shuffle className="h-3.5 w-3.5" /> Shuffle
          </button>
        )}
      </div>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-ink sm:text-3xl">{deck?.title || "Flashcards"}</h1>
      {deck?.description && <p className="mt-1 text-sm text-muted">{deck.description}</p>}

      {!isCompleted ? (
        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted">
              <span>
                Card <strong className="text-ink">{currentIndex + 1}</strong> of {total}
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {masteredCount}
                </span>
                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                  <XCircle className="h-3.5 w-3.5" /> {reviewCount}
                </span>
              </span>
            </div>
            <ProgressBar pct={(done / (total || 1)) * 100} className="!h-2" barClassName="bg-gradient-to-r from-brand-500 to-accent-500" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={currentIndex + "-" + order[currentIndex]}
              className="perspective-1000"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <m.div
                role="button"
                tabIndex={0}
                aria-pressed={isFlipped}
                aria-label={isFlipped ? "Answer shown. Press to see the question" : "Question shown. Press to see the answer"}
                onClick={() => setIsFlipped(!isFlipped)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsFlipped(!isFlipped);
                  }
                }}
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 170, damping: 22, mass: 0.9 }}
                className="transform-style-3d relative min-h-[340px] w-full cursor-pointer select-none rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-h-[380px]"
              >
                {/* FRONT: question */}
                <div className="backface-hidden absolute inset-0 flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-8">
                  <div className="flex items-center justify-between text-xs">
                    <span className="eyebrow">Question</span>
                    <span className="flex items-center gap-1.5 text-muted">
                      <RotateCw className="h-3.5 w-3.5" /> Tap or press Space
                    </span>
                  </div>
                  <div className="my-auto px-2 py-6 text-center">
                    <p className="font-display text-xl font-bold leading-relaxed text-ink sm:text-2xl">{currentCard?.front}</p>
                  </div>
                  <p className="text-center text-xs text-muted">Recall the answer in your head, then flip.</p>
                </div>

                {/* BACK: answer */}
                <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col rounded-2xl border-2 border-primary/60 bg-surface p-6 shadow-[0_0_40px_-14px_rgb(var(--c-primary)/0.55)] sm:p-8">
                  <div className="flex items-center justify-between text-xs">
                    <span className="eyebrow">Answer</span>
                    <span className="flex items-center gap-1.5 text-muted">
                      <RotateCw className="h-3.5 w-3.5" /> Flip back
                    </span>
                  </div>
                  <div className="my-auto space-y-4 overflow-y-auto px-1 py-4 text-center">
                    <p className="text-lg font-bold leading-relaxed text-ink sm:text-xl">{currentCard?.back}</p>
                    {currentCard?.clinicalNote && (
                      <div className="mx-auto max-w-lg space-y-1 rounded-xl border border-primary/20 bg-soft p-3.5 text-left text-sm text-slate-300">
                        <strong className="flex items-center gap-1.5 text-primary">
                          <Sparkles className="h-3.5 w-3.5" /> Clinical note
                        </strong>
                        <p className="leading-relaxed">{currentCard.clinicalNote}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-xs text-muted">Did you know it?</p>
                </div>
              </m.div>
            </m.div>
          </AnimatePresence>

          {isFlipped ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleNextCard("review")}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-500/20 dark:text-rose-300"
              >
                <XCircle className="h-4 w-4" /> Needs revision
              </button>
              <button
                onClick={() => handleNextCard("mastered")}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-500/20 dark:text-emerald-300"
              >
                <CheckCircle2 className="h-4 w-4" /> Knew it
              </button>
            </div>
          ) : (
            <button onClick={() => setIsFlipped(true)} className="btn-primary w-full !min-h-[52px]">
              <RotateCw className="h-4 w-4" /> Show answer
            </button>
          )}

          <div className="flex items-center justify-between text-xs text-muted">
            <button onClick={goBack} disabled={currentIndex === 0} className="inline-flex items-center gap-1 font-semibold hover:text-ink disabled:opacity-40">
              <Undo2 className="h-3.5 w-3.5" /> Previous card
            </button>
            <span className="hidden sm:inline">Space flip · ← needs revision · → knew it</span>
          </div>
        </div>
      ) : (
        <m.div
          className="mt-6 space-y-6 rounded-2xl border border-line bg-surface p-8 text-center sm:p-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-soft text-primary">
            <Award className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Session complete</h2>
            <p className="text-sm text-muted">
              You went through {total} card{total === 1 ? "" : "s"}.
            </p>
          </div>
          <div className="mx-auto grid max-w-xs grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-4">
              <div className="font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{masteredCount}</div>
              <div className="mt-1 text-xs text-muted">Knew it</div>
            </div>
            <div className="rounded-xl bg-rose-500/10 p-4">
              <div className="font-display text-3xl font-extrabold text-rose-600 dark:text-rose-400">{reviewCount}</div>
              <div className="mt-1 text-xs text-muted">Needs revision</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {reviewCount > 0 && (
              <button onClick={reviseMissed} className="btn-primary">
                <RotateCcw className="h-4 w-4" /> Revise the {reviewCount} missed
              </button>
            )}
            <button onClick={handleRestart} className={reviewCount > 0 ? "btn-secondary" : "btn-primary"}>
              Study whole deck again
            </button>
            <Link href="/flashcards" className="btn-secondary">
              Other decks
            </Link>
          </div>
        </m.div>
      )}
    </div>
  );
}
