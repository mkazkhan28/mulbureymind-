"use client";

import React, { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* PRE-QUIZ SETUP SCREEN */}
        {!quizStarted && !quizCompleted && (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-widest bg-cyan-950/60 px-3.5 py-1 rounded-full border border-cyan-800/60 shadow-sm">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                DUHS Modular BCQ Simulator
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                BDS 1st Year Examination Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Practice verified high-yield past paper questions tailored for Dow University dental students (DIKIOHS, DDC & DIDC) with textbook rationales.
              </p>
            </div>

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
                    className="w-full p-3.5 rounded-xl border border-slate-700/80 bg-slate-950/80 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition cursor-pointer appearance-none"
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
                      <span className="font-bold text-xs text-white">Tutor Mode</span>
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
                        ? "border-indigo-500/80 bg-indigo-950/40 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500"
                        : "border-slate-800 bg-slate-950/50 hover:bg-slate-900/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">Timed Test</span>
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
                      <span className="font-bold text-xs text-white flex items-center gap-1">
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
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 group cursor-pointer"
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
            <div className="bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold text-white">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-700/60 font-semibold shadow-sm">
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
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900"
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
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl space-y-6">
              <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                {currentQ.question}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;
                  const showFeedback = examMode === "tutor" && showInstantFeedback[currentIndex];

                  let btnStyle = "border-slate-800 bg-slate-950/50 hover:border-indigo-500/50 hover:bg-slate-900/70 text-slate-200";
                  if (isSelected && !showFeedback) {
                    btnStyle = "border-indigo-500 bg-indigo-950/40 text-white font-semibold ring-1 ring-indigo-500 shadow-md shadow-indigo-500/10";
                  }
                  if (showFeedback) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-semibold ring-1 ring-emerald-500 shadow-md shadow-emerald-500/10";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "border-rose-500/80 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500";
                    } else {
                      btnStyle = "border-slate-850 opacity-40 text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition flex items-start gap-3.5 cursor-pointer ${btnStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 transition ${
                        showFeedback && isCorrect
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold"
                          : isSelected
                          ? "bg-indigo-600 text-white border-indigo-500 font-bold"
                          : "border-slate-700 bg-slate-900 text-slate-400"
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                      {showFeedback && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tutor Mode Immediate Feedback */}
              {examMode === "tutor" && showInstantFeedback[currentIndex] && (
                <div className="p-4 sm:p-5 bg-slate-950/90 border border-cyan-800/60 rounded-2xl text-xs sm:text-sm space-y-2 animate-fadeIn shadow-lg">
                  <div className="font-bold text-cyan-300 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>DUHS Clinical Rationale & Reference:</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">{currentQ.explanation}</p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-800 bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-slate-950/70 flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setQuizCompleted(true)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition flex items-center gap-1.5 shadow-lg shadow-violet-600/25"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Finish & See Result</span>
                  </button>
                )}
              </div>
            </div>

            {/* Question Quick Jump Board */}
            <div className="bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Question Matrix
                </span>
                <span className="text-slate-300 font-medium">
                  Answered: <strong className="text-white">{Object.keys(userAnswers).length}</strong> / {questions.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {questions.map((_, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];

                  let pillStyle = "bg-slate-950/70 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white";
                  if (isAnswered) pillStyle = "bg-indigo-950/70 text-indigo-300 border border-indigo-700/60 font-semibold";
                  if (isFlagged) pillStyle = "bg-amber-950/70 text-amber-300 border border-amber-600/70 font-bold";
                  if (isCurrent) pillStyle = "bg-gradient-to-r from-blue-600 to-violet-600 text-white font-extrabold shadow-md shadow-indigo-600/30 border-transparent ring-2 ring-indigo-400";

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-8 h-8 rounded-lg text-xs transition flex items-center justify-center cursor-pointer ${pillStyle}`}
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
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 sm:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden">
                  <div className="w-18 h-18 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center mx-auto text-indigo-400 shadow-xl shadow-indigo-600/20">
                    <Award className="w-9 h-9" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      DUHS BDS 1st Year Examination Report
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {score.grade}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400">
                      DUHS official professional passing threshold is 60%.
                    </p>
                  </div>

                  {/* Score Numbers */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white">
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
                    <div className="font-bold text-white flex items-center justify-between">
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
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Examination</span>
                    </button>
                    <Link
                      href="/dashboard"
                      className="px-6 py-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold transition"
                    >
                      Save & Return to Dashboard
                    </Link>
                  </div>
                </div>
              );
            })()}

            {/* Detailed Question Review */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Detailed Question Review & Clinical Solutions
              </h3>
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userChoice = userAnswers[idx];
                  const isCorrect = userChoice === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-6 rounded-2xl border bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-3 ${
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

                      <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>

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
