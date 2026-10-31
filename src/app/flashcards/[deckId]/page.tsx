"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BDS_FLASHCARD_DECKS,
  BDS_FLASHCARDS
} from "@/lib/bds-content";
import {
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { m, AnimatePresence, ProgressBar, EASE } from "@/components/motion";

export default function FlashcardStudyPage() {
  const params = useParams();
  const deckId = params?.deckId as string;

  const deck = BDS_FLASHCARD_DECKS.find((d) => d.id === deckId);
  const cards = BDS_FLASHCARDS.filter((c) => c.deckId === deckId || deckId === "deck-pharm-la" || deckId === "deck-anat-cranial");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!deck && cards.length === 0) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="bg-surface p-8 rounded-2xl border border-slate-800 text-center max-w-md space-y-4">
          <Layers className="w-10 h-10 text-slate-500 mx-auto" />
          <h2 className="text-xl font-bold text-ink">Deck Not Found</h2>
          <p className="text-xs text-slate-400">The requested DUHS flashcard deck could not be found.</p>
          <Link
            href="/flashcards"
            className="inline-block px-5 py-2.5 bg-primary hover:bg-primary-hover text-on-primary rounded-xl text-xs font-semibold hover:from-blue-500 hover:to-indigo-500 transition"
          >
            Back to Flashcard Library
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex] || cards[0];

  const handleNextCard = (status: "mastered" | "review") => {
    if (status === "mastered") {
      setMasteredCount((prev) => prev + 1);
    } else {
      setReviewCount((prev) => prev + 1);
    }

    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCount(0);
    setReviewCount(0);
    setIsCompleted(false);
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/flashcards"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-ink transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Flashcard Decks</span>
          </Link>
          <span className="text-xs font-bold text-cyan-300 bg-cyan-950/70 px-3.5 py-1 rounded-full border border-cyan-800/60 shadow-sm">
            {deck?.title || "DUHS BDS Flashcards"}
          </span>
        </div>

        {!isCompleted ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                <span>Card <strong className="text-ink">{currentIndex + 1}</strong> of {cards.length}</span>
                <span className="text-cyan-400 font-bold">{Math.round(((currentIndex + 1) / (cards.length || 1)) * 100)}%</span>
              </div>
              <ProgressBar pct={((currentIndex + 1) / (cards.length || 1)) * 100} className="!h-2" barClassName="bg-gradient-to-r from-brand-500 to-accent-500" />
            </div>

            {/* Interactive 3D Flashcard Container */}
            <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={currentIndex}
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
                aria-label={isFlipped ? "Show the question" : "Show the answer"}
                onClick={() => setIsFlipped(!isFlipped)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsFlipped(!isFlipped);
                  }
                }}
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 170, damping: 22, mass: 0.9 }}
                className="relative w-full min-h-[360px] rounded-2xl cursor-pointer select-none transform-style-3d focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* FRONT FACE (Question / Prompt) */}
                <div className="absolute inset-0 backface-hidden bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-7 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
                    <span className="font-bold text-cyan-300 uppercase tracking-wider bg-cyan-950/60 px-3 py-0.5 rounded-full border border-cyan-800/60">
                      DUHS Concept Prompt
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 hover:text-ink font-medium">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Tap to Flip</span>
                    </div>
                  </div>

                  <div className="my-auto text-center py-6 px-4">
                    <p className="text-lg sm:text-2xl font-bold text-ink leading-relaxed">
                      {currentCard?.front}
                    </p>
                  </div>

                  <div className="text-center text-[11px] text-slate-400 pt-3 border-t border-slate-800">
                    Try to recall the exact answer before flipping the card.
                  </div>
                </div>

                {/* BACK FACE (Answer & Clinical Pearl) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-950 text-ink rounded-2xl p-7 sm:p-8 flex flex-col justify-between border-2 border-primary/70 shadow-[0_0_40px_-12px_rgb(var(--c-primary)/0.5)]">
                  <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-3">
                    <span className="font-bold text-indigo-300 uppercase tracking-wider bg-indigo-950/60 px-3 py-0.5 rounded-full border border-indigo-700/60">
                      Answer & High-Yield Concept
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 hover:text-ink font-medium">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Tap to Flip Back</span>
                    </div>
                  </div>

                  <div className="my-auto text-center py-4 px-2 space-y-4">
                    <p className="text-lg sm:text-2xl font-extrabold text-ink leading-relaxed">
                      {currentCard?.back}
                    </p>
                    {currentCard?.clinicalNote && (
                      <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 text-left max-w-lg mx-auto space-y-1">
                        <strong className="text-cyan-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          DUHS Clinical Pearl:
                        </strong>
                        <p className="leading-relaxed">{currentCard.clinicalNote}</p>
                      </div>
                    )}
                  </div>

                  <div className="text-center text-[11px] text-slate-400 pt-3 border-t border-slate-850">
                    Mark below whether you knew this card or need to revise it.
                  </div>
                </div>
              </m.div>
            </m.div>
            </AnimatePresence>

            {/* Response Buttons */}
            {isFlipped ? (
              <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                <button
                  onClick={() => handleNextCard("review")}
                  className="py-3.5 px-4 rounded-xl border border-rose-800/60 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Needs Revision</span>
                </button>
                <button
                  onClick={() => handleNextCard("mastered")}
                  className="py-3.5 px-4 rounded-xl border border-emerald-800/60 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Mastered (Knew It)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsFlipped(true)}
                className="w-full py-4 bg-primary hover:bg-primary-hover text-on-primary rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                <span>Show Answer (Flip Card)</span>
              </button>
            )}
          </div>
        ) : (
          /* COMPLETION SUMMARY SCREEN */
          <div className="bg-surface rounded-2xl border border-line p-8 sm:p-12 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center mx-auto text-indigo-400">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
                Deck Session Completed!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                You have reviewed all {cards.length} cards in this DUHS 1st Year deck.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="p-2">
                <div className="text-3xl font-extrabold text-emerald-400">{masteredCount}</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Mastered</div>
              </div>
              <div className="p-2">
                <div className="text-3xl font-extrabold text-rose-400">{reviewCount}</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Needs Revision</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Study Deck Again</span>
              </button>
              <Link
                href="/flashcards"
                className="px-6 py-3 border border-slate-800 bg-slate-950/70 text-slate-300 hover:text-ink hover:bg-slate-900 rounded-xl text-xs font-semibold transition"
              >
                Explore Other Decks
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
