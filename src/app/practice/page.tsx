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
  Check
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

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
    setQuizStarted(true);
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
    let grade = "Revision Required (< 60%)";
    if (percentage >= 80) grade = "Distinction (Honors) 🌟";
    else if (percentage >= 60) grade = "DUHS Pass (Clear)";

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

  return (
    <div className="min-h-screen bg-canvas text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      <Suspense fallback={null}>
        <QuerySync
          onParams={(p) => {
          if (p.get("subject")) setSelectedSubject(p.get("subject") as string);
          }}
        />
      </Suspense>
      {/* Decorative ambient background glows */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* PRE-QUIZ SETUP SCREEN */}
        {!quizStarted && !quizCompleted && (
          <div className="bg-surface rounded-2xl border border-line p-6 sm:p-10 space-y-8">
            <PageHeader
              eyebrow="MCQ practice"
              title="Test your knowledge. Strengthen your concepts."
              intro="Choose a subject and a mode, practice exam-style questions, and review the explanation for every answer."
              className="!pb-0"
            />

            <div className="space-y-6 max-w-lg mx-auto">
              {/* Subject Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Select 1st Year Subject:</span>
                  <span className="text-[11px] text-indigo-400 font-semibold">6 Modules Available</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-700/80 bg-slate-950/80 text-ink text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition cursor-pointer appearance-none"
                  >
                    <option value="all">All 6 Core 1st Year Subjects (Comprehensive DUHS Pool)</option>
                    {firstYearSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                </div>
              </div>

              {/* Mode Select */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Choose Examination Mode:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setExamMode("tutor")}
                    className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
                      examMode === "tutor"
                        ? "border-cyan-500/80 bg-cyan-950/40 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500"
                        : "border-slate-800 bg-slate-950/50 hover:bg-slate-900/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-ink">Tutor Mode</span>
                      <Zap className={`w-3.5 h-3.5 ${examMode === "tutor" ? "text-cyan-400" : "text-slate-500"}`} />
                    </div>
                    <div className="text-[11px] text-slate-400 leading-snug">
                      Instant feedback & textbook clinical rationales.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExamMode("exam")}
                    className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
                      examMode === "exam"
                        ? "border-indigo-500/80 bg-indigo-950/40 ring-1 ring-indigo-500"
                        : "border-slate-800 bg-slate-950/50 hover:bg-slate-900/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-ink">Timed Test</span>
                      <Clock className={`w-3.5 h-3.5 ${examMode === "exam" ? "text-indigo-400" : "text-slate-500"}`} />
                    </div>
                    <div className="text-[11px] text-slate-400 leading-snug">
                      1 min per BCQ. Rationales revealed at end.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExamMode("mock")}
                    className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
                      examMode === "mock"
                        ? "border-rose-500/80 bg-rose-950/40 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500"
                        : "border-slate-800 bg-slate-950/50 hover:bg-slate-900/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-ink flex items-center gap-1">
                        Mock Exam
                      </span>
                      <Flame className={`w-3.5 h-3.5 ${examMode === "mock" ? "text-rose-400" : "text-slate-500"}`} />
                    </div>
                    <div className="text-[11px] text-slate-400 leading-snug">
                      Full DUHS simulation with official grading.
                    </div>
                  </button>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartQuiz}
                  className="w-full py-4 bg-primary hover:bg-primary-hover text-on-primary rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Start Examination Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Negative Marking: Disabled
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-400" /> Pass Threshold: 60%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE QUIZ SCREEN */}
        {quizStarted && !quizCompleted && currentQ && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-display text-base font-extrabold text-ink sm:text-lg">
                  Question {currentIndex + 1} <span className="font-semibold text-muted">of {questions.length}</span>
                </span>
                <span className="chip">
                  {currentQ.yearSource}
                </span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                {examMode !== "tutor" && (
                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${
                      timeLeft < 180
                        ? "bg-rose-950/70 text-rose-300 border-rose-700/60 animate-pulse"
                        : "bg-slate-950/70 text-slate-300 border-slate-800"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                )}

                <button
                  onClick={() => toggleFlag(currentIndex)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 border ${
                    flaggedQuestions[currentIndex]
                      ? "bg-amber-950/70 text-amber-300 border-amber-600/70 font-bold"
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-ink hover:bg-slate-900"
                  }`}
                  title="Flag question for review"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${flaggedQuestions[currentIndex] ? "text-amber-400 fill-amber-400" : "text-slate-400"}`} />
                  <span className="hidden sm:inline">
                    {flaggedQuestions[currentIndex] ? "Flagged" : "Flag"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to end and submit your exam?")) {
                      setQuizCompleted(true);
                    }
                  }}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-800/60 hover:bg-rose-900/60 transition"
                >
                  Submit Exam
                </button>
              </div>
            </div>

            {/* Question Stem Card */}
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 space-y-6">
              <p className="text-lg sm:text-xl font-semibold text-ink leading-relaxed">
                {currentQ.question}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;
                  const showFeedback = examMode === "tutor" && showInstantFeedback[currentIndex];

                  let btnStyle = "border-line bg-canvas hover:border-primary/50 hover:bg-soft/60 text-slate-200";
                  if (isSelected && !showFeedback) {
                    btnStyle = "border-primary bg-soft text-ink font-semibold ring-1 ring-primary";
                  }
                  if (showFeedback) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-500 bg-emerald-500/10 text-ink font-semibold ring-1 ring-emerald-500";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "border-rose-500 bg-rose-500/10 text-ink ring-1 ring-rose-500";
                    } else {
                      btnStyle = "border-line opacity-50 text-muted";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      aria-pressed={isSelected}
                      className={`w-full text-left px-4 py-3.5 min-h-[52px] rounded-xl border text-sm sm:text-[15px] transition flex items-start gap-3.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${btnStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 transition ${
                        showFeedback && isCorrect
                          ? "bg-emerald-500 text-white border-emerald-500 font-extrabold"
                          : isSelected
                          ? "bg-primary text-on-primary border-primary font-bold"
                          : "border-line bg-surface-2 text-muted"
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                      {showFeedback && isCorrect && (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-5 h-5" /> Correct
                        </span>
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                          <XCircle className="w-5 h-5" /> Your answer
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tutor Mode Immediate Feedback */}
              {examMode === "tutor" && showInstantFeedback[currentIndex] && (
                <section aria-live="polite" className="p-4 sm:p-5 bg-soft border border-primary/25 rounded-2xl text-sm space-y-2 animate-fadeIn">
                  <h3 className="font-bold text-primary flex items-center gap-2 text-sm">
                    <HelpCircle className="w-4 h-4" />
                    <span>Explanation</span>
                  </h3>
                  <p className="leading-relaxed text-slate-300">{currentQ.explanation}</p>
                </section>
              )}

              {/* Navigation Controls */}
              <div className="pt-5 border-t border-line flex items-center justify-between gap-3">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="btn-secondary"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="btn-primary"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setQuizCompleted(true)}
                    className="btn-primary"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Finish & See Result</span>
                  </button>
                )}
              </div>
            </div>

            {/* Question Quick Jump Board */}
            <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Question Matrix
                </span>
                <span className="text-slate-300 font-medium">
                  Answered: <strong className="text-ink">{Object.keys(userAnswers).length}</strong> / {questions.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {questions.map((_, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];

                  let pillStyle = "bg-slate-950/70 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-ink";
                  if (isAnswered) pillStyle = "bg-indigo-950/70 text-indigo-300 border border-indigo-700/60 font-semibold";
                  if (isFlagged) pillStyle = "bg-amber-950/70 text-amber-300 border border-amber-600/70 font-bold";
                  if (isCurrent) pillStyle = "bg-primary text-on-primary font-extrabold border-transparent ring-2 ring-primary/40";

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to question ${idx + 1}${isAnswered ? ", answered" : ""}${isFlagged ? ", flagged" : ""}`}
                      aria-current={isCurrent ? "step" : undefined}
                      className={`w-9 h-9 rounded-lg text-xs transition flex items-center justify-center cursor-pointer ${pillStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* RESULTS REPORT CARD */}
        {quizCompleted && (
          <div className="space-y-8 animate-fadeIn">
            {(() => {
              const score = calculateScore();
              return (
                <div className="bg-surface rounded-2xl border border-line p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
                  <div className="w-18 h-18 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center mx-auto text-indigo-400">
                    <Award className="w-9 h-9" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      DUHS BDS 1st Year Examination Report
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
                      {score.grade}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      DUHS official professional passing threshold is 60%.
                    </p>
                  </div>

                  {/* Score Numbers */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-ink">
                        {score.correct} / {score.total}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">Correct BCQs</div>
                    </div>
                    <div>
                      <div
                        className={`text-2xl sm:text-3xl font-extrabold ${
                          score.passed ? "text-cyan-400" : "text-rose-400"
                        }`}
                      >
                        {score.percentage}%
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">Final Score</div>
                    </div>
                    <div>
                      <div className={`text-2xl sm:text-3xl font-extrabold ${score.passed ? "text-emerald-400" : "text-amber-400"}`}>
                        {score.passed ? "Passed" : "Revise"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">Status</div>
                    </div>
                  </div>

                  {/* Subject Breakdown */}
                  <div className="max-w-lg mx-auto p-5 bg-slate-950/70 rounded-2xl border border-slate-800 text-left space-y-3 text-xs">
                    <div className="font-bold text-ink flex items-center justify-between">
                      <span>Modular Subject Performance:</span>
                      <span className="text-slate-400 font-normal">DUHS Pass: ≥ 60%</span>
                    </div>
                    {Object.entries(score.subjectStats).map(([subjId, stat]) => {
                      const subj = BDS_SUBJECTS.find((s) => s.id === subjId);
                      const subjPct = Math.round((stat.correct / (stat.total || 1)) * 100);
                      return (
                        <div key={subjId} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">{subj?.name || subjId}</span>
                            <span className={`font-semibold ${subjPct >= 60 ? "text-emerald-400" : "text-rose-400"}`}>
                              {stat.correct}/{stat.total} ({subjPct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                subjPct >= 60 ? "bg-gradient-to-r from-emerald-500 to-cyan-500" : "bg-gradient-to-r from-rose-500 to-amber-500"
                              }`}
                              style={{ width: `${subjPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={handleStartQuiz}
                      className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-on-primary text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Examination</span>
                    </button>
                    <Link
                      href="/dashboard"
                      className="px-6 py-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-ink text-xs font-semibold transition"
                    >
                      Save & Return to Dashboard
                    </Link>
                  </div>
                </div>
              );
            })()}

            {/* Detailed Question Review */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-ink tracking-tight">
                Detailed Question Review & Clinical Solutions
              </h3>
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userChoice = userAnswers[idx];
                  const isCorrect = userChoice === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-6 rounded-2xl border bg-surface shadow-xl space-y-3 ${
                        isCorrect ? "border-emerald-700/50" : "border-rose-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-400">Question {idx + 1}</span>
                          <span className="bg-slate-950 border border-slate-800 text-indigo-300 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                            {q.yearSource}
                          </span>
                        </div>
                        {isCorrect ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Incorrect
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-ink leading-relaxed">{q.question}</p>

                      <div className="text-xs space-y-1 text-slate-300">
                        <div>
                          <strong className="text-slate-400">Your Selection:</strong>{" "}
                          <span className={isCorrect ? "text-emerald-300" : "text-rose-300"}>
                            {userChoice !== undefined
                              ? `${String.fromCharCode(65 + userChoice)}. ${q.options[userChoice]}`
                              : "Unanswered"}
                          </span>
                        </div>
                        <div className="text-emerald-400 font-medium">
                          <strong>Official Correct Answer:</strong>{" "}
                          {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-950/80 rounded-xl text-xs text-slate-300 border border-slate-850 space-y-1">
                        <strong className="text-cyan-400 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          DUHS Clinical Rationale:
                        </strong>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
