"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  RotateCw,
  GraduationCap,
  Award,
  Zap,
  Clock,
  Check,
  RefreshCw,
  FileText
} from "lucide-react";

export default function HomePage() {
  // Interactive BCQ State with multiple questions
  const demoQuestions = [
    {
      subject: "General Anatomy & Histology",
      source: "DUHS BDS Annual Exam Past Paper",
      question: "During an inferior alveolar nerve block injection for mandibular molars, which anatomical landmark on the medial surface of the mandibular ramus must the operator target just superior to the lingula?",
      options: [
        { id: 0, text: "Mental foramen", correct: false },
        { id: 1, text: "Mandibular foramen", correct: true },
        { id: 2, text: "Foramen ovale", correct: false },
        { id: 3, text: "Incisive foramen", correct: false },
      ],
      explanation: "Mandibular foramen is the correct landmark. The inferior alveolar nerve enters the mandibular canal through the mandibular foramen on the medial surface of the ramus, shielded anteriorly by the bony lingula. Depositing local anesthetic in the pterygomandibular space blocks sensation to the ipsilateral mandibular teeth."
    },
    {
      subject: "Oral Biology & Morphology",
      source: "DUHS Oral Biology Module Assessment",
      question: "Which organic matrix protein constitutes over 90% of the secretory enamel matrix produced by ameloblasts before mineralization?",
      options: [
        { id: 0, text: "Amelogenin", correct: true },
        { id: 1, text: "Enamelin", correct: false },
        { id: 2, text: "Ameloblastin", correct: false },
        { id: 3, text: "Tuftelin", correct: false },
      ],
      explanation: "Amelogenins are hydrophobic proteins that make up >90% of developing enamel matrix. They self-assemble into nanospheres to guide hydroxyapatite crystal orientation and spacing before being degraded by enamelysin (MMP-20)."
    }
  ];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // 3D Flip Flashcards Demo State
  const flashcardDecks = [
    {
      subject: "Oral Biology (OBIO-103)",
      topic: "Enamel Microstructure",
      question: "What optical phenomenon seen in ground enamel sections is caused by alternating directional changes in adjacent groups of enamel rod prisms?",
      answer: "Hunter-Schreger Bands (HSB)",
      detail: "Alternating light (diazones) and dark (parazones) bands visible under reflected polarized light. They strengthen enamel architecture, preventing catastrophic longitudinal fracture during mastication."
    },
    {
      subject: "General Anatomy (ANAT-101)",
      topic: "Cranial Nerves & Triangles",
      question: "Which cranial nerve traverses the posterior triangle of the neck, vulnerable to injury during lymph node biopsy?",
      answer: "Spinal Accessory Nerve (CN XI)",
      detail: "CN XI runs obliquely across the roof of the posterior triangle on the levator scapulae muscle to innervate the trapezius. Injury causes shoulder drop and weakness in arm abduction above 90°."
    },
    {
      subject: "Pharmacology (PHARM-105)",
      topic: "Dental Local Anesthesia",
      question: "Why is epinephrine (adrenaline) added in a 1:100,000 ratio to 2% lidocaine in dental carpules?",
      answer: "Local Vasoconstriction (Alpha-1)",
      detail: "Vasoconstriction delays systemic absorption, prolongs duration of local anesthesia, reduces systemic toxicity, and provides localized hemostasis in the surgical field."
    }
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // 6 Core BDS 1st Year Subjects (DUHS Karachi Syllabus with Jewel Tones)
  const subjects = [
    {
      id: "anat",
      name: "General Anatomy & Histology",
      code: "ANAT-101",
      icon: "💀",
      colorGradient: "from-amber-500/15 via-[#0e1628] to-[#090d18]",
      borderColor: "border-amber-500/30 hover:border-amber-400/80",
      accentText: "text-amber-400",
      badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      glowColor: "shadow-amber-500/10",
      description: "Head & neck osteology, cranial nerves (CN V & VII), TMJ mechanics, cervical triangles, systemic embryology & histology.",
      mcqCount: "680+ DUHS BCQs",
      flashcardsCount: "190 Cards",
      highYieldTopics: ["Trigeminal & Facial Nerve", "TMJ Mechanics", "Carotid Sheath & Triangles"]
    },
    {
      id: "phys",
      name: "Human Physiology",
      code: "PHYS-102",
      icon: "🫀",
      colorGradient: "from-rose-500/15 via-[#0e1628] to-[#090d18]",
      borderColor: "border-rose-500/30 hover:border-rose-400/80",
      accentText: "text-rose-400",
      badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      glowColor: "shadow-rose-500/10",
      description: "Nerve action potentials, neuromuscular junction, cardiac cycle & ECG, respiratory gas exchange, blood clotting, renal balance.",
      mcqCount: "620+ DUHS BCQs",
      flashcardsCount: "175 Cards",
      highYieldTopics: ["Action Potential Phases", "Cardiac Cycle & ECG", "Clotting Cascades"]
    },
    {
      id: "oral-bio",
      name: "Oral Biology & Morphology",
      code: "OBIO-103",
      icon: "🦷",
      colorGradient: "from-cyan-500/15 via-[#0e1628] to-[#090d18]",
      borderColor: "border-cyan-500/30 hover:border-cyan-400/80",
      accentText: "text-cyan-400",
      badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      glowColor: "shadow-cyan-500/10",
      description: "Amelogenesis, dentinogenesis, pulp-dentin complex, periodontium histology, and permanent tooth crown morphology.",
      mcqCount: "710+ DUHS BCQs",
      flashcardsCount: "220 Cards",
      highYieldTopics: ["Amelogenesis & Enamel Rods", "Dentin Sensitivity", "Molar Cusp Morphology"]
    },
    {
      id: "biochem",
      name: "Biochemistry & Genetics",
      code: "BIOCH-104",
      icon: "🧬",
      colorGradient: "from-violet-500/15 via-[#0e1628] to-[#090d18]",
      borderColor: "border-violet-500/30 hover:border-violet-400/80",
      accentText: "text-violet-400",
      badgeColor: "bg-violet-500/15 text-violet-300 border-violet-500/30",
      glowColor: "shadow-violet-500/10",
      description: "Enzyme kinetics, carbohydrate & lipid metabolism, vitamins in oral health, collagen synthesis, calcium & fluoride kinetics.",
      mcqCount: "540+ DUHS BCQs",
      flashcardsCount: "160 Cards",
      highYieldTopics: ["Michaelis-Menten Kinetics", "Vitamin C & Scurvy", "Fluoride Hydroxyapatite"]
    },
    {
      id: "pharm",
      name: "Pharmacology & Therapeutics",
      code: "PHARM-105",
      icon: "💊",
      colorGradient: "from-emerald-500/15 via-[#0e1628] to-[#090d18]",
      borderColor: "border-emerald-500/30 hover:border-emerald-400/80",
      accentText: "text-emerald-400",
      badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      glowColor: "shadow-emerald-500/10",
      description: "Dental therapeutics, lidocaine/articaine carpules, vasoconstrictor ratios, dental analgesics (NSAIDs), and antibiotics.",
      mcqCount: "650+ DUHS BCQs",
      flashcardsCount: "180 Cards",
      highYieldTopics: ["Local Anesthetics (Epi Ratios)", "Amoxicillin & Clavulanate", "NSAIDs in Dentistry"]
    },
    {
      id: "path",
      name: "General Pathology & Micro",
      code: "PATH-106",
      icon: "🔬",
      colorGradient: "from-blue-500/15 via-[#0e1628] to-[#090d18]",
      borderColor: "border-blue-500/30 hover:border-blue-400/80",
      accentText: "text-sky-400",
      badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      glowColor: "shadow-blue-500/10",
      description: "Cellular adaptations, acute/chronic inflammation, granulomatous diseases (TB), hemodynamic shock, and wound repair.",
      mcqCount: "580+ DUHS BCQs",
      flashcardsCount: "150 Cards",
      highYieldTopics: ["Granulomatous Inflammation", "Apoptosis vs Necrosis", "Primary Wound Healing"]
    }
  ];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentQIndex((prev) => (prev + 1) % demoQuestions.length);
  };

  const currentQ = demoQuestions[currentQIndex];
  const currentCard = flashcardDecks[currentCardIndex];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* ============================================================== */}
      {/* 1. HERO SECTION WITH VIBRANT LUMINOUS ORBS & DUHS 1ST YEAR     */}
      {/* ============================================================== */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-24 px-4 sm:px-6 lg:px-8">
        {/* Floating Multi-color Glow Mesh */}
        <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[120px] animate-float pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[130px] animate-float-slow pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-10 w-[380px] h-[380px] bg-cyan-500/15 rounded-full blur-[110px] animate-pulse-glow pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headlines & DUHS Focus */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Live Dow Modular Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-lg shadow-indigo-950/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>DUHS Modular Curriculum 2024–2025 • Karachi</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  DIKIOHS • DDC • DIDC
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] text-white">
                Score Distinction in Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
                  DUHS BDS 1st Year
                </span>{" "}
                Professional Exams
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Pakistan&apos;s digital study hub custom-tailored for Dow University dental surgeons. Master all 6 core subjects with verified modular BCQs, high-yield clinical explanations, and active recall flashcards.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/practice"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Start Free BCQ Practice</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/subjects"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Browse 1st Year Subjects (6)</span>
                </Link>
              </div>

              {/* Trust & Institution Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800/80">
                  <div className="text-2xl font-extrabold text-white">3,700+</div>
                  <div className="text-xs text-slate-400">Verified BCQs</div>
                </div>
                <div className="p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-indigo-500/20">
                  <div className="text-2xl font-extrabold text-indigo-400">6 Core</div>
                  <div className="text-xs text-slate-400">DUHS Subjects</div>
                </div>
                <div className="p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800/80">
                  <div className="text-2xl font-extrabold text-cyan-400">DIKIOHS</div>
                  <div className="text-xs text-slate-400">DDC & DIDC Aligned</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive BCQ Card with Jewel Lighting */}
            <div className="lg:col-span-5">
              <div className="bg-[#0d1424]/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
                {/* Card Header */}
                <div className="bg-slate-950/80 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Live DUHS BCQ Simulator
                    </span>
                  </div>
                  <button
                    onClick={handleNextQuestion}
                    className="text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 transition"
                    title="Load next question"
                  >
                    <RefreshCw className="w-3 h-3 text-indigo-400" />
                    <span>Next Sample</span>
                  </button>
                </div>

                {/* Card Subhead */}
                <div className="bg-indigo-950/40 px-5 py-2.5 border-b border-indigo-900/40 flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    {currentQ.subject}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {currentQ.source}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                    {currentQ.question}
                  </p>

                  {/* Options List */}
                  <div className="space-y-2 pt-1">
                    {currentQ.options.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      const isCorrect = opt.correct;
                      let btnStyle = "border-slate-800 bg-slate-900/80 hover:border-indigo-500/60 hover:bg-slate-800/80 text-slate-200";

                      if (showExplanation) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-500/80 bg-emerald-950/50 text-emerald-300 font-semibold ring-1 ring-emerald-500/60";
                        } else if (isSelected && !isCorrect) {
                          btnStyle = "border-rose-500/80 bg-rose-950/50 text-rose-300";
                        } else {
                          btnStyle = "border-slate-800/50 opacity-40 text-slate-500";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(opt.id)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-start gap-3 ${btnStyle}`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5 ${
                            showExplanation && isCorrect
                              ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold"
                              : "border-slate-700 text-slate-400"
                          }`}>
                            {String.fromCharCode(65 + opt.id)}
                          </span>
                          <span className="flex-1 leading-snug">{opt.text}</span>
                          {showExplanation && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          {showExplanation && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Clinical Explanation */}
                  {showExplanation ? (
                    <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-indigo-500/30 text-xs space-y-1.5 animate-fadeIn shadow-lg">
                      <div className="font-semibold text-indigo-400 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-indigo-400" />
                        <span>DUHS High-Yield Rationale:</span>
                      </div>
                      <p className="leading-relaxed text-slate-300">{currentQ.explanation}</p>
                    </div>
                  ) : (
                    <p className="text-center text-xs text-slate-400 pt-1 italic">
                      Tap any option above to test your recall & reveal the clinical rationale.
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. 6 CORE DUHS 1ST YEAR SUBJECTS IN VIBRANT JEWEL TONES        */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/30 shadow-sm">
            DUHS BDS 1st Year Syllabus
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            6 Core First Year Dental Modules
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Every subject includes high-yield chapter breakdowns, verified past-paper question banks, and active recall flashcard decks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              className={`group rounded-2xl border p-6 bg-gradient-to-br ${subj.colorGradient} ${subj.borderColor} shadow-xl ${subj.glowColor} hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow">
                    {subj.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${subj.badgeColor}`}>
                    {subj.code}
                  </span>
                </div>

                <div>
                  <h3 className={`font-bold text-lg text-white leading-snug group-hover:${subj.accentText} transition`}>
                    {subj.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {subj.description}
                  </p>
                </div>

                {/* High yield tags */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                    DUHS High-Yield Focus:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {subj.highYieldTopics.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2 py-0.5 bg-slate-900/80 border border-slate-700/80 rounded-md text-slate-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats & Action */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div className={`text-xs font-bold px-2.5 py-1 rounded-md border ${subj.badgeColor}`}>
                  {subj.mcqCount}
                </div>
                <Link
                  href={`/subjects/${subj.id === "anat" ? "anatomy" : subj.id === "phys" ? "physiology" : subj.id === "oral-bio" ? "oral-biology" : subj.id === "biochem" ? "biochemistry" : subj.id === "pharm" ? "pharmacology" : "general-pathology"}`}
                  className={`text-xs font-semibold ${subj.accentText} hover:underline flex items-center gap-1 transition`}
                >
                  <span>Explore Modules</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Notice for Other Years (Pending) */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-white">BDS 2nd, 3rd & Final Year Modules:</strong> Currently in preparation and marked as pending to ensure 100% focus and accuracy on 1st Year DUHS exams.
            </span>
          </div>
          <Link
            href="/subjects"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 shrink-0"
          >
            View Roadmap &rarr;
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. 3D INTERACTIVE FLASHCARD DEMO                               */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-b from-[#090e1a] to-[#0d1424] py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Why Active Recall */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Active Recall & Spaced Repetition</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Master Anatomy & Oral Biology Faster with 3D Flashcards
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Memorizing cranial nerve skull exits, tooth crown morphology, histological layers, and enzyme co-factors is notoriously challenging. Our digital flashcards let you test recall anytime from your mobile or laptop.
              </p>

              <div className="space-y-3 pt-2 text-sm text-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                  <span>Instant 3D card flip with high-yield clinical fact on the back</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                  <span>Filter by DUHS 1st Year subjects & difficult modules</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 text-xs font-bold">✓</div>
                  <span>Spaced repetition algorithm to reinforce high-yield weak areas</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <Link
                  href="/flashcards"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white transition text-sm shadow-lg shadow-indigo-600/30"
                >
                  <Layers className="w-4 h-4" />
                  <span>Open Full Flashcard Deck</span>
                </Link>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((prev) => (prev + 1) % flashcardDecks.length);
                  }}
                  className="px-4 py-3 rounded-xl font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-sm border border-slate-700 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Next Card Sample</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive 3D Flip Card */}
            <div className="lg:col-span-6 flex justify-center perspective-1000">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full max-w-md h-80 rounded-2xl cursor-pointer select-none transition-transform duration-700 transform-style-3d shadow-2xl hover:shadow-indigo-500/10 ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* FRONT FACE (Question) */}
                <div className="absolute inset-0 backface-hidden bg-[#0e1628] border-2 border-slate-800 hover:border-cyan-500/60 rounded-2xl p-6 flex flex-col justify-between transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300 bg-cyan-500/15 px-2.5 py-1 rounded-md border border-cyan-500/30">
                      {currentCard.subject}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition font-medium">
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Click to Flip Card</span>
                    </div>
                  </div>

                  <div className="text-center my-auto px-4 space-y-3">
                    <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-bold block">
                      {currentCard.topic}
                    </span>
                    <p className="text-lg font-bold text-white leading-snug">
                      &ldquo;{currentCard.question}&rdquo;
                    </p>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Card {currentCardIndex + 1} of {flashcardDecks.length}</span>
                    <span className="px-2.5 py-0.5 bg-slate-900 text-slate-300 rounded font-semibold border border-slate-800">
                      Question Face
                    </span>
                  </div>
                </div>

                {/* BACK FACE (Answer & Rationale) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-950 via-[#0e1628] to-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between border-2 border-indigo-500 shadow-2xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/40">
                      Answer & High-Yield Concept
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 hover:text-white transition font-medium">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click to Flip Back</span>
                    </div>
                  </div>

                  <div className="text-center my-auto px-4 space-y-3">
                    <span className="text-[11px] uppercase tracking-wider text-purple-300 font-bold block">
                      Correct Dental Rationale
                    </span>
                    <p className="text-xl font-extrabold text-white text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-200">
                      {currentCard.answer}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                      {currentCard.detail}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-indigo-300 font-medium">DUHS High-Yield Concept</span>
                    <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded font-semibold">
                      Answer Face
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. WHY DUHS STUDENTS PREFER BDS STUDY HUB                     */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 shadow-sm">
            Designed for Dow Dental Colleges
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Built Specifically for DUHS Examination Pattern
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Every feature is crafted to match the exact modular assessments, semester exams, and annual professional requirements of Dow University of Health Sciences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0e1628]/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl hover:border-amber-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">DUHS Past Paper Archive</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Access real BCQs from 2015 to 2024 with question tags indicating DIKIOHS, DDC, and DIDC modular assessments.
            </p>
          </div>

          <div className="bg-[#0e1628]/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl hover:border-violet-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Table Viva & OSPE Prep</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Detailed slide references for histology, bone markings for head & neck anatomy, and wax carving tooth guides for oral biology.
            </p>
          </div>

          <div className="bg-[#0e1628]/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl hover:border-emerald-500/40 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Distinction-Level Explanations</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every single option is clinically dissected so you understand why the distractor is incorrect and why the key is correct.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PRICING & STUDENT PASSES                                    */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-violet-300 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/30 shadow-sm">
            Fair Student Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Accessible Access Built for Pakistani Dental Students
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Start immediately for 100% free. No foreign credit cards needed—convenient Pakistani payment methods supported.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Starter */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1628]/80 p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Free Student Starter
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">PKR 0</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>
              <p className="text-xs text-slate-300">
                Start preparing immediately with sample BCQs across all 6 DUHS first-year subjects.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>50 Sample DUHS BCQs across all 6 subjects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Interactive 3D flashcards sample</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Basic quiz score summary</span>
                </li>
              </ul>
            </div>
            <Link
              href="/practice"
              className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-semibold border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition"
            >
              Start Free Practice
            </Link>
          </div>

          {/* Full Academic Year Pass (Highlighted) */}
          <div className="rounded-2xl border-2 border-indigo-500 bg-gradient-to-b from-[#131c36] to-[#0e1628] p-6 shadow-2xl shadow-indigo-600/20 flex flex-col justify-between relative hover:border-indigo-400 transition">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-indigo-600/30">
              DUHS 1st Year Recommended
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Full 1st Year Academic Pass
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">PKR 1,999</span>
                <span className="text-xs text-slate-400">/ full session</span>
              </div>
              <p className="text-xs text-slate-300">
                Complete unrestricted access to all 6 DUHS subjects until your final professional examinations.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-indigo-900/40">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">Complete 3,700+ DUHS past paper & modular BCQs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Comprehensive clinical explanations for every question</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All digital flashcard decks across all 6 subjects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Timed exam simulation matching DUHS format</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Personalized weak-topic analysis & progress saving</span>
                </li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white transition shadow-lg shadow-indigo-600/30"
            >
              Get Full Academic Access
            </Link>
          </div>

          {/* 6-Month Semester Pass */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1628]/80 p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Semester / Send-Up Pass
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">PKR 1,299</span>
                <span className="text-xs text-slate-400">/ 6 months</span>
              </div>
              <p className="text-xs text-slate-300">
                Targeted prep for mid-terms, send-up tests, or supplementary revision.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Full access to all 6 subjects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Timed modular examination simulator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>All digital flashcard decks</span>
                </li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="mt-6 w-full py-2.5 rounded-xl text-center text-xs font-semibold border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition"
            >
              Select Semester Pass
            </Link>
          </div>
        </div>

        {/* Local Pakistan Payment Gateways */}
        <div className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Pakistani Payment Gateways Supported:
          </span>
          <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-slate-300">
            JazzCash
          </span>
          <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-slate-300">
            Easypaisa
          </span>
          <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-slate-300">
            Debit / Credit Card
          </span>
          <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-slate-300">
            Raast & Direct Bank Transfer (IBFT)
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. FINAL CALL TO ACTION                                        */}
      {/* ============================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-indigo-900/40 relative overflow-hidden border border-indigo-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight relative z-10">
            Ready to Ace Your DUHS BDS 1st Year Exams?
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base max-w-xl mx-auto relative z-10">
            Join hundreds of Dow dental students across DIKIOHS, DDC, and DIDC preparing with the highest-yield BCQ simulator.
          </p>
          <div className="pt-2 relative z-10">
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-white text-indigo-900 hover:bg-slate-100 transition shadow-lg text-sm"
            >
              <span>Launch Free Practice Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
