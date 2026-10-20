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
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
        <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 text-center max-w-md space-y-4 shadow-2xl">
          <Layers className="w-10 h-10 text-slate-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Deck Not Found</h2>
          <p className="text-xs text-slate-400">The requested DUHS flashcard deck could not be found.</p>
          <Link
            href="/flashcards"
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-indigo-600/20"
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/flashcards"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
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
                <span>Card <strong className="text-white">{currentIndex + 1}</strong> of {cards.length}</span>
                <span className="text-cyan-400 font-bold">{Math.round(((currentIndex + 1) / (cards.length || 1)) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / (cards.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Interactive 3D Flashcard Container */}
            <div className="perspective-1000">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full min-h-[360px] rounded-3xl cursor-pointer select-none transition-transform duration-700 transform-style-3d shadow-2xl ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* FRONT FACE (Question / Prompt) */}
                <div className="absolute inset-0 backface-hidden bg-slate-900/90 backdrop-blur-xl border-2 border-slate-800 rounded-3xl p-7 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
                    <span className="font-bold text-cyan-300 uppercase tracking-wider bg-cyan-950/60 px-3 py-0.5 rounded-full border border-cyan-800/60">
                      DUHS Concept Prompt
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 hover:text-white font-medium">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Tap to Flip</span>
                    </div>
                  </div>

                  <div className="my-auto text-center py-6 px-4">
                    <p className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                      {currentCard?.front}
                    </p>
                  </div>

                  <div className="text-center text-[11px] text-slate-400 pt-3 border-t border-slate-800">
                    Try to recall the exact answer before flipping the card.
                  </div>
                </div>

                {/* BACK FACE (Answer & Clinical Pearl) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-950 text-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between border-2 border-indigo-500/80 shadow-2xl shadow-indigo-500/20">
                  <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-3">
                    <span className="font-bold text-indigo-300 uppercase tracking-wider bg-indigo-950/60 px-3 py-0.5 rounded-full border border-indigo-700/60">
                      Answer & High-Yield Concept
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 hover:text-white font-medium">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Tap to Flip Back</span>
                    </div>
                  </div>

                  <div className="my-auto text-center py-4 px-2 space-y-4">
                    <p className="text-lg sm:text-2xl font-extrabold text-white leading-relaxed">
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
              </div>
            </div>

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
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                <span>Show Answer (Flip Card)</span>
              </button>
            )}
          </div>
        ) : (
          /* COMPLETION SUMMARY SCREEN */
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center mx-auto text-indigo-400 shadow-xl shadow-indigo-600/20">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
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
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Study Deck Again</span>
              </button>
              <Link
                href="/flashcards"
                className="px-6 py-3 border border-slate-800 bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl text-xs font-semibold transition"
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
