"use client";

import React, { useState, useEffect, Suspense } from "react";
import QuerySync from "@/components/QuerySync";
import Link from "next/link";
import {
  BDS_MCQS,
  BDS_SUBJECTS,
  MCQ
} from "@/lib/bds-content";
import {
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Bookmark,
  Flame,
  Zap,
  Target,
  ChevronRight,
  Check,
  Layers
} from "lucide-react";
import { SubjectArt } from "@/components/Illustrations";
import PageHeader from "@/components/PageHeader";
import { m, AnimatePresence, EASE, ProgressBar, CountUp } from "@/components/motion";

export default function PracticeQuizPage() {
  // Quiz configuration
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [examMode, setExamMode] = useState<"tutor" | "exam" | "mock">("tutor");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Active quiz state
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [showInstantFeedback, setShowInstantFeedback] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(600); // in seconds
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong" | "marked" | "skipped">("all");

  // Filter only 1st year subjects
  const firstYearSubjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");

  // Start Quiz
  const handleStartQuiz = () => {
    let pool = [...BDS_MCQS];
    if (selectedSubject !== "all") {
      pool = pool.filter((q) => q.subjectId === selectedSubject);
    }

    // In Mock Exam mode, simulate test with timer
    if (examMode === "mock") {
      let expandedPool: MCQ[] = [];
      while (expandedPool.length < 20) {
        expandedPool = [...expandedPool, ...pool];
      }
      pool = expandedPool.slice(0, 20);
      setTimeLeft(20 * 60); // 20 minutes
    } else {
      setTimeLeft(pool.length * 60); // 1 min per question
    }

    setQuestions(pool);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setShowInstantFeedback({});
    setQuizCompleted(false);
    setConfirmSubmit(false);
    setReviewFilter("all");
    setQuizStarted(true);
    window.scrollTo({ top: 0 });
  };

  // Timer logic for timed & mock modes
  useEffect(() => {
    if (!quizStarted || quizCompleted || examMode === "tutor") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQuizCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, examMode]);

  // Handle option select
  const handleSelectOption = (optionIndex: number) => {
    if (quizCompleted) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));

    if (examMode === "tutor") {
      setShowInstantFeedback((prev) => ({
        ...prev,
        [currentIndex]: true
      }));
    }
  };

  const toggleFlag = (index: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const currentQ = questions[currentIndex];

  // Calculate score & breakdown
  const calculateScore = () => {
    let correct = 0;
    const subjectStats: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q, idx) => {
      if (!subjectStats[q.subjectId]) {
        subjectStats[q.subjectId] = { total: 0, correct: 0 };
      }
      subjectStats[q.subjectId].total++;

      if (userAnswers[idx] === q.correctIndex) {
        correct++;
        subjectStats[q.subjectId].correct++;
      }
    });

    const percentage = Math.round((correct / (questions.length || 1)) * 100);
    let grade = "Needs revision";
    if (percentage >= 80) grade = "Distinction";
    else if (percentage >= 60) grade = "Pass";

    return {
      correct,
      total: questions.length,
      percentage,
      passed: percentage >= 60,
      grade,
      subjectStats
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const markedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const inQuiz = quizStarted && !quizCompleted && !!currentQ;
  const poolFor = (id: string) => (id === "all" ? BDS_MCQS.length : BDS_MCQS.filter((q) => q.subjectId === id).length);
  const poolSize = poolFor(selectedSubject);
  const plannedCount = examMode === "mock" ? 20 : poolSize;
  const plannedTime = examMode === "mock" ? 20 : poolSize;

  // Keyboard: A–D or 1–4 to answer, ← → to move, M to mark for review
  useEffect(() => {
    if (!inQuiz) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (confirmSubmit || t.closest("input, textarea, select, [contenteditable]")) return;
      const k = e.key.toLowerCase();
      const idx = "abcd".indexOf(k) >= 0 ? "abcd".indexOf(k) : "1234".indexOf(k);
      if (idx >= 0 && currentQ && idx < currentQ.options.length) {
        e.preventDefault();
        handleSelectOption(idx);
      } else if (e.key === "ArrowRight") setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
      else if (e.key === "ArrowLeft") setCurrentIndex((i) => Math.max(0, i - 1));
      else if (k === "m") toggleFlag(currentIndex);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const MODES = [
    { id: "tutor" as const, icon: Zap, title: "Tutor mode", text: "See if you're right and read the explanation straight after each answer.", meta: "No timer" },
    { id: "exam" as const, icon: Clock, title: "Timed test", text: "One minute per question. Answers and explanations at the end.", meta: "1 min per question" },
    { id: "mock" as const, icon: Target, title: "Mock exam", text: "A 20-question paper against the clock, marked like an exam.", meta: "20 questions · 20 min" },
  ];

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Suspense fallback={null}>
        <QuerySync
          onParams={(p) => {
            if (p.get("subject")) setSelectedSubject(p.get("subject") as string);
          }}
        />
      </Suspense>

      {/* ============================ SETUP ============================ */}
      {!quizStarted && !quizCompleted && (
        <div className="mx-auto max-w-4xl">
          <PageHeader
            eyebrow="MCQ practice"
            title="Test your knowledge. Strengthen your concepts."
            intro="Pick a subject and a mode, then start. Every question comes with an explanation."
          />

          <section aria-labelledby="step-subject" className="space-y-3">
            <h2 id="step-subject" className="flex items-center gap-2 text-sm font-bold text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-on-primary">1</span> Choose a subject
            </h2>
            <div role="radiogroup" aria-label="Subject" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {[{ id: "all", name: "All subjects" }, ...firstYearSubjects].map((s) => {
                const on = selectedSubject === s.id;
                const n = poolFor(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setSelectedSubject(s.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                      on ? "border-primary bg-soft ring-1 ring-primary" : "border-line bg-surface hover:border-primary/40"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                      {s.id === "all" ? <Layers className="h-5 w-5 text-primary" /> : <SubjectArt id={s.id} className="h-7 w-7" />}
                    </span>
                    <span className="min-w-0">
                      <span className={`block truncate text-sm font-semibold ${on ? "text-primary" : "text-ink"}`}>{s.name}</span>
                      <span className="block text-xs text-muted">{n ? `${n} question${n === 1 ? "" : "s"}` : "Coming soon"}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="step-mode" className="mt-8 space-y-3">
            <h2 id="step-mode" className="flex items-center gap-2 text-sm font-bold text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-on-primary">2</span> Choose a mode
            </h2>
            <div role="radiogroup" aria-label="Mode" className="grid gap-3 sm:grid-cols-3">
              {MODES.map((md) => {
                const on = examMode === md.id;
                return (
                  <button
                    key={md.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setExamMode(md.id)}
                    className={`flex flex-col rounded-2xl border p-4 text-left transition-colors ${on ? "border-primary bg-soft ring-1 ring-primary" : "border-line bg-surface hover:border-primary/40"}`}
                  >
                    <span className="flex items-center justify-between">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${on ? "bg-primary text-on-primary" : "bg-surface-2 text-primary"}`}>
                        <md.icon className="h-5 w-5" />
                      </span>
                      {on && <Check className="h-5 w-5 text-primary" />}
                    </span>
                    <span className="card-title mt-3">{md.title}</span>
                    <span className="mt-1 flex-1 text-sm text-muted">{md.text}</span>
                    <span className="mt-3 text-xs font-semibold text-muted">{md.meta}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted">
              <span className="font-semibold text-ink">{plannedCount ? `${plannedCount} question${plannedCount === 1 ? "" : "s"}` : "No questions yet"}</span>
              {examMode !== "tutor" && plannedCount > 0 && <> · {plannedTime} min</>} · no negative marking · pass mark 60%
            </div>
            <button onClick={handleStartQuiz} disabled={poolSize === 0} className="btn-primary !px-6">
              Start {examMode === "tutor" ? "practice" : examMode === "exam" ? "timed test" : "mock exam"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {poolSize === 0 && <p className="mt-3 text-center text-sm text-muted">Questions for this subject are being added. Choose “All subjects” to practise now.</p>}
        </div>
      )}

      {/* ============================ EXAM ============================ */}
      {inQuiz && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-4">
            {/* question header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-display text-xl font-extrabold text-ink">
                  Question {currentIndex + 1} <span className="font-semibold text-muted">of {questions.length}</span>
                </span>
                {currentQ.yearSource && <span className="chip">{currentQ.yearSource}</span>}
              </div>
              <button
                onClick={() => toggleFlag(currentIndex)}
                aria-pressed={!!flaggedQuestions[currentIndex]}
                className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition ${
                  flaggedQuestions[currentIndex] ? "border-amber-500/60 bg-amber-500/10 text-amber-600 dark:text-amber-400" : "border-line bg-surface text-muted hover:text-ink"
                }`}
                title="Mark for review (M)"
              >
                <Bookmark className={`h-3.5 w-3.5 ${flaggedQuestions[currentIndex] ? "fill-current" : ""}`} />
                {flaggedQuestions[currentIndex] ? "Marked for review" : "Mark for review"}
              </button>
            </div>

            <ProgressBar pct={(answeredCount / questions.length) * 100} className="!h-1" barClassName="bg-gradient-to-r from-brand-500 to-accent-500" />

            {/* question card */}
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={currentIndex}
                  className="space-y-6"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  <p className="text-lg font-semibold leading-relaxed text-ink sm:text-xl">{currentQ.question}</p>

                  <div className="space-y-3" role="group" aria-label="Answer options">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[currentIndex] === optIdx;
                      const isCorrect = optIdx === currentQ.correctIndex;
                      const showFeedback = examMode === "tutor" && showInstantFeedback[currentIndex];

                      let btnStyle = "border-line bg-canvas hover:border-primary/50 hover:bg-soft/60 text-slate-200";
                      if (isSelected && !showFeedback) btnStyle = "border-primary bg-soft text-ink font-semibold ring-1 ring-primary";
                      if (showFeedback) {
                        if (isCorrect) btnStyle = "border-emerald-500 bg-emerald-500/10 text-ink font-semibold ring-1 ring-emerald-500";
                        else if (isSelected) btnStyle = "border-rose-500 bg-rose-500/10 text-ink ring-1 ring-rose-500";
                        else btnStyle = "border-line opacity-50 text-muted";
                      }
                      // feedback motion: wrong pick shakes, right answer gives a soft pop
                      const fx =
                        showFeedback && isSelected && !isCorrect
                          ? { x: [0, -7, 7, -5, 5, -2, 0], scale: 1 }
                          : showFeedback && isCorrect
                          ? { x: 0, scale: [1, 1.025, 1] }
                          : { x: 0, scale: isSelected ? 1.01 : 1 };
                      return (
                        <m.button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          aria-pressed={isSelected}
                          animate={fx}
                          whileTap={showFeedback ? undefined : { scale: 0.985 }}
                          transition={{ duration: showFeedback ? 0.45 : 0.2, ease: EASE }}
                          className={`flex min-h-[56px] w-full cursor-pointer items-start gap-3.5 rounded-xl border px-4 py-3.5 text-left text-[15px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${btnStyle}`}
                        >
                          <span
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition ${
                              showFeedback && isCorrect
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : showFeedback && isSelected
                                ? "border-rose-500 bg-rose-500 text-white"
                                : isSelected
                                ? "border-primary bg-primary text-on-primary"
                                : "border-line bg-surface-2 text-muted"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-snug">{opt}</span>
                          {showFeedback && isCorrect && (
                            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-5 w-5" /> Correct
                            </span>
                          )}
                          {showFeedback && isSelected && !isCorrect && (
                            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                              <XCircle className="h-5 w-5" /> Your answer
                            </span>
                          )}
                        </m.button>
                      );
                    })}
                  </div>

                  <AnimatePresence initial={false}>
                    {examMode === "tutor" && showInstantFeedback[currentIndex] && (
                      <m.section
                        key="explanation"
                        aria-live="polite"
                        className="origin-top space-y-2 rounded-2xl border border-primary/25 bg-soft p-4 text-sm sm:p-5"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: EASE, delay: 0.15 }}
                      >
                        <h3 className="flex items-center gap-2 text-sm font-bold text-primary">
                          <HelpCircle className="h-4 w-4" /> Explanation
                        </h3>
                        <p className="leading-relaxed text-slate-300">{currentQ.explanation}</p>
                      </m.section>
                    )}
                  </AnimatePresence>
                </m.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
                <button disabled={currentIndex === 0} onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))} className="btn-secondary">
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                {currentIndex < questions.length - 1 ? (
                  <button onClick={() => setCurrentIndex((prev) => prev + 1)} className="btn-primary">
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={() => setConfirmSubmit(true)} className="btn-primary">
                    <CheckCircle2 className="h-4 w-4" /> Finish & see results
                  </button>
                )}
              </div>
            </div>
            <p className="hidden text-center text-xs text-muted sm:block">Keyboard: A–D to answer · ← → to move · M to mark for review</p>
          </div>

          {/* navigator */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="Question navigator">
            {examMode !== "tutor" && (
              <div
                role="timer"
                aria-live="off"
                className={`flex items-center justify-between rounded-2xl border p-4 ${timeLeft < 180 ? "border-rose-500/50 bg-rose-500/10" : "border-line bg-surface"}`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-muted">
                  <Clock className="h-4 w-4" /> Time left
                </span>
                <span className={`font-display text-2xl font-extrabold tabular-nums ${timeLeft < 180 ? "text-rose-600 dark:text-rose-400" : "text-ink"}`}>{formatTime(timeLeft)}</span>
              </div>
            )}
            <div className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink">Questions</span>
                <span className="text-muted">
                  {answeredCount}/{questions.length} answered
                </span>
              </div>
              <div className="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
                {questions.map((_, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];
                  let pill = "border-line bg-canvas text-muted hover:border-primary/40 hover:text-ink";
                  if (isAnswered) pill = "border-primary/30 bg-soft text-primary font-semibold";
                  if (isCurrent) pill = "border-primary bg-primary text-on-primary font-extrabold";
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to question ${idx + 1}${isAnswered ? ", answered" : ""}${isFlagged ? ", marked for review" : ""}`}
                      aria-current={isCurrent ? "step" : undefined}
                      className={`relative flex h-10 items-center justify-center rounded-lg border text-xs transition ${pill}`}
                    >
                      {idx + 1}
                      {isFlagged && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-amber-500" />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-soft ring-1 ring-primary/30" /> Answered</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded border border-line bg-canvas" /> Not answered</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Marked ({markedCount})</span>
              </div>
            </div>
            <button onClick={() => setConfirmSubmit(true)} className="btn-secondary w-full">
              Submit {examMode === "tutor" ? "practice" : "exam"}
            </button>
          </aside>
        </div>
      )}

      {/* submit confirmation (in-page, no browser pop-up) */}
      <AnimatePresence>
        {confirmSubmit && inQuiz && (
          <m.div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmSubmit(false)}>
            <m.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="submit-title"
              className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-lift"
              initial={{ y: 24, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="submit-title" className="font-display text-xl font-bold text-ink">Submit and see results?</h2>
              <ul className="mt-3 space-y-1 text-sm text-muted">
                <li>{answeredCount} of {questions.length} answered</li>
                {questions.length - answeredCount > 0 && <li className="text-amber-600 dark:text-amber-400">{questions.length - answeredCount} not answered yet</li>}
                {markedCount > 0 && <li>{markedCount} marked for review</li>}
              </ul>
              <div className="mt-6 flex gap-2">
                <button autoFocus onClick={() => setConfirmSubmit(false)} className="btn-secondary flex-1">
                  Keep going
                </button>
                <button
                  onClick={() => {
                    setConfirmSubmit(false);
                    setQuizCompleted(true);
                    window.scrollTo({ top: 0 });
                  }}
                  className="btn-primary flex-1"
                >
                  Submit
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* ============================ RESULTS ============================ */}
      {quizCompleted &&
        (() => {
          const score = calculateScore();
          const wrong = questions.filter((q, i) => userAnswers[i] !== undefined && userAnswers[i] !== q.correctIndex).length;
          const skipped = questions.length - Object.keys(userAnswers).length;
          const list = questions
            .map((q, idx) => ({ q, idx }))
            .filter(({ q, idx }) =>
              reviewFilter === "all"
                ? true
                : reviewFilter === "wrong"
                ? userAnswers[idx] !== undefined && userAnswers[idx] !== q.correctIndex
                : reviewFilter === "marked"
                ? !!flaggedQuestions[idx]
                : userAnswers[idx] === undefined
            );
          const r = 52;
          const c = 2 * Math.PI * r;
          return (
            <div className="mx-auto max-w-4xl space-y-10">
              <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                <div className="flex flex-col items-center gap-8 sm:flex-row">
                  <div className="relative h-36 w-36 shrink-0">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
                      <circle cx="60" cy="60" r={r} strokeWidth="10" fill="none" className="stroke-slate-800" />
                      <m.circle
                        cx="60"
                        cy="60"
                        r={r}
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={c}
                        initial={{ strokeDashoffset: c }}
                        animate={{ strokeDashoffset: c * (1 - score.percentage / 100) }}
                        transition={{ duration: 1.1, ease: EASE }}
                        className={score.passed ? "stroke-primary" : "stroke-amber-500"}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-3xl font-extrabold text-ink">
                        <CountUp to={score.percentage} suffix="%" />
                      </span>
                      <span className="text-xs text-muted">score</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="eyebrow">{examMode === "tutor" ? "Practice" : examMode === "exam" ? "Timed test" : "Mock exam"} result</p>
                    <h1 className="page-title mt-2">{score.grade}</h1>
                    <p className="mt-1 text-muted">{score.passed ? "Well done — you're above the 60% pass mark." : "Below the 60% pass mark. Review the explanations below and try again."}</p>
                    <dl className="mt-5 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-emerald-500/10 p-3">
                        <dd className="font-display text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{score.correct}</dd>
                        <dt className="text-xs text-muted">Correct</dt>
                      </div>
                      <div className="rounded-xl bg-rose-500/10 p-3">
                        <dd className="font-display text-xl font-extrabold text-rose-600 dark:text-rose-400">{wrong}</dd>
                        <dt className="text-xs text-muted">Incorrect</dt>
                      </div>
                      <div className="rounded-xl bg-surface-2 p-3">
                        <dd className="font-display text-xl font-extrabold text-ink">{skipped}</dd>
                        <dt className="text-xs text-muted">Skipped</dt>
                      </div>
                    </dl>
                  </div>
                </div>

                {Object.keys(score.subjectStats).length > 1 && (
                  <div className="mt-8 space-y-3 border-t border-line pt-6">
                    <h2 className="text-sm font-bold text-ink">By subject</h2>
                    {Object.entries(score.subjectStats).map(([subjId, stat]) => {
                      const subj = BDS_SUBJECTS.find((x) => x.id === subjId);
                      const pct = Math.round((stat.correct / (stat.total || 1)) * 100);
                      return (
                        <div key={subjId}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-300">
                              <SubjectArt id={subjId} className="h-5 w-5" /> {subj?.name || subjId}
                            </span>
                            <span className={`font-semibold tabular-nums ${pct >= 60 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                              {stat.correct}/{stat.total} · {pct}%
                            </span>
                          </div>
                          <ProgressBar pct={pct} barClassName={pct >= 60 ? "bg-emerald-500" : "bg-rose-500"} />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
                  <button onClick={handleStartQuiz} className="btn-primary">
                    <RotateCcw className="h-4 w-4" /> Try again
                  </button>
                  <button
                    onClick={() => {
                      setQuizStarted(false);
                      setQuizCompleted(false);
                    }}
                    className="btn-secondary"
                  >
                    Change subject or mode
                  </button>
                  <Link href="/dashboard" className="btn-secondary">
                    Back to dashboard
                  </Link>
                </div>
              </section>

              {/* review */}
              <section aria-labelledby="review" className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <h2 id="review" className="section-title">Review answers</h2>
                  <div role="tablist" aria-label="Filter review" className="inline-flex flex-wrap gap-1 rounded-xl border border-line bg-surface-2 p-1">
                    {(
                      [
                        ["all", `All ${questions.length}`],
                        ["wrong", `Incorrect ${wrong}`],
                        ["marked", `Marked ${markedCount}`],
                        ["skipped", `Skipped ${skipped}`],
                      ] as const
                    ).map(([k, label]) => (
                      <button
                        key={k}
                        role="tab"
                        aria-selected={reviewFilter === k}
                        onClick={() => setReviewFilter(k)}
                        className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${reviewFilter === k ? "text-ink" : "text-muted hover:text-ink"}`}
                      >
                        {reviewFilter === k && <m.span layoutId="review-tab" className="absolute inset-0 rounded-lg bg-surface shadow-soft ring-1 ring-primary/20" />}
                        <span className="relative">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {list.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">Nothing here.</p>
                ) : (
                  list.map(({ q, idx }) => {
                    const choice = userAnswers[idx];
                    const right = choice === q.correctIndex;
                    return (
                      <article key={q.id + idx} className={`rounded-2xl border bg-surface p-5 sm:p-6 ${choice === undefined ? "border-line" : right ? "border-emerald-500/40" : "border-rose-500/40"}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="flex items-center gap-2">
                            <span className="font-bold text-muted">Question {idx + 1}</span>
                            {q.yearSource && <span className="chip">{q.yearSource}</span>}
                            {flaggedQuestions[idx] && <span className="chip !text-amber-600 dark:!text-amber-400">Marked</span>}
                          </span>
                          {choice === undefined ? (
                            <span className="font-bold text-muted">Skipped</span>
                          ) : right ? (
                            <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-4 w-4" /> Correct
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                              <XCircle className="h-4 w-4" /> Incorrect
                            </span>
                          )}
                        </div>
                        <p className="mt-3 font-semibold leading-relaxed text-ink">{q.question}</p>
                        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                          {q.options.map((opt, oi) => {
                            const isRight = oi === q.correctIndex;
                            const isMine = oi === choice;
                            return (
                              <li
                                key={oi}
                                className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                                  isRight ? "border-emerald-500/60 bg-emerald-500/10 text-ink" : isMine ? "border-rose-500/60 bg-rose-500/10 text-ink" : "border-line text-muted"
                                }`}
                              >
                                <span className="font-bold">{String.fromCharCode(65 + oi)}.</span>
                                <span className="flex-1">{opt}</span>
                                {isRight && <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Correct</span>}
                                {isMine && !isRight && <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Your answer</span>}
                              </li>
                            );
                          })}
                        </ul>
                        <div className="mt-3 rounded-xl border border-primary/20 bg-soft p-4 text-sm text-slate-300">
                          <strong className="flex items-center gap-1.5 text-primary">
                            <HelpCircle className="h-4 w-4" /> Explanation
                          </strong>
                          <p className="mt-1 leading-relaxed">{q.explanation}</p>
                        </div>
                      </article>
                    );
                  })
                )}
              </section>
            </div>
          );
        })()}
    </div>
  );
}
