"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BDS_SUBJECTS, BDS_TOPICS, BDS_MCQS, BDS_RESOURCES, BDS_FLASHCARD_DECKS, MEMBERSHIP_PLANS, MCQ, Subject, Topic } from "@/lib/bds-content";
import { parseAndValidateMCQCSV, CSVParseResult } from "@/lib/csv-parser";
import { CATALOG } from "@/lib/catalog";
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  Layers,
  BookOpen,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Download,
  Pencil,
  Search,
  Check,
  X,
  Info,
  ArrowLeft,
  Database,
  FileUp,
  Library,
  Presentation,
} from "lucide-react";
import { SubjectArt } from "@/components/Illustrations";
import { m, AnimatePresence, EASE, ProgressBar } from "@/components/motion";

type Tab = "overview" | "mcqs" | "csv" | "subjects" | "resources" | "members";
type Confirm = { title: string; text: string; action: string; onConfirm: () => void } | null;

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Editable lists in local state
  const [mcqList, setMcqList] = useState<MCQ[]>(BDS_MCQS);
  const [subjectsList, setSubjectsList] = useState<Subject[]>(BDS_SUBJECTS);
  const [topicsList, setTopicsList] = useState<Topic[]>(BDS_TOPICS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  // State for creating or editing an MCQ
  const [showMCQModal, setShowMCQModal] = useState(false);
  const [editingMCQId, setEditingMCQId] = useState<string | null>(null);
  const [mcqFormQuestion, setMcqFormQuestion] = useState("");
  const [mcqFormSubject, setMcqFormSubject] = useState("pharm");
  const [mcqFormYear, setMcqFormYear] = useState("UHS BDS Annual 2024");
  const [mcqFormOptions, setMcqFormOptions] = useState(["", "", "", ""]);
  const [mcqFormCorrect, setMcqFormCorrect] = useState(0);
  const [mcqFormExplanation, setMcqFormExplanation] = useState("");
  const [mcqFormDifficulty, setMcqFormDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  // State for adding a Subject
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjName, setNewSubjName] = useState("");
  const [newSubjCode, setNewSubjCode] = useState("");
  const [newSubjIcon, setNewSubjIcon] = useState("🦷");
  const [newSubjDesc, setNewSubjDesc] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // State for adding a Topic
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [topicSubjId, setTopicSubjId] = useState("pharm");
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicHighYield, setNewTopicHighYield] = useState(true);

  // CSV bulk import state
  const [csvInput, setCsvInput] = useState("");
  const [csvResult, setCsvResult] = useState<CSVParseResult | null>(null);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);

  // Files tab
  const [fileQuery, setFileQuery] = useState("");
  const [fileKind, setFileKind] = useState<"all" | "lecture" | "book" | "drive">("all");

  // UI feedback
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 3500);
  };

  // Open modal for editing
  const handleEditMCQ = (q: MCQ) => {
    setEditingMCQId(q.id);
    setMcqFormQuestion(q.question);
    setMcqFormSubject(q.subjectId);
    setMcqFormYear(q.yearSource || "");
    setMcqFormOptions([...q.options]);
    setMcqFormCorrect(q.correctIndex);
    setMcqFormExplanation(q.explanation);
    setMcqFormDifficulty(q.difficulty);
    setShowMCQModal(true);
  };

  // Open modal for new MCQ
  const handleNewMCQ = () => {
    setEditingMCQId(null);
    setMcqFormQuestion("");
    setMcqFormSubject("pharm");
    setMcqFormYear("UHS BDS Annual 2024");
    setMcqFormOptions(["", "", "", ""]);
    setMcqFormCorrect(0);
    setMcqFormExplanation("");
    setMcqFormDifficulty("Medium");
    setShowMCQModal(true);
  };

  // Save MCQ (Create or Update)
  const handleSaveMCQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcqFormQuestion.trim()) return;

    if (editingMCQId) {
      setMcqList((prev) =>
        prev.map((q) =>
          q.id === editingMCQId
            ? {
                ...q,
                question: mcqFormQuestion,
                subjectId: mcqFormSubject,
                yearSource: mcqFormYear,
                options: mcqFormOptions,
                correctIndex: mcqFormCorrect,
                explanation: mcqFormExplanation,
                difficulty: mcqFormDifficulty,
              }
            : q
        )
      );
      flash("Question updated.");
    } else {
      const newMCQ: MCQ = {
        id: `mcq-manual-${Date.now()}`,
        subjectId: mcqFormSubject,
        topicId: "pharm-top-1",
        yearSource: mcqFormYear,
        question: mcqFormQuestion,
        options: mcqFormOptions,
        correctIndex: mcqFormCorrect,
        explanation: mcqFormExplanation,
        difficulty: mcqFormDifficulty,
        isPastPaper: true,
      };
      setMcqList([newMCQ, ...mcqList]);
      flash("Question added.");
    }

    setShowMCQModal(false);
  };

  const handleDeleteMCQ = (q: MCQ) =>
    setConfirm({
      title: "Delete this question?",
      text: q.question,
      action: "Delete question",
      onConfirm: () => {
        setMcqList((list) => list.filter((x) => x.id !== q.id));
        flash("Question deleted.");
      },
    });

  // Handle adding new subject
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName.trim() || !newSubjCode.trim()) return;

    const newSubject: Subject = {
      id: `subj-${Date.now()}`,
      yearId: "bds-1",
      name: newSubjName,
      slug: newSubjName.toLowerCase().replace(/\s+/g, "-"),
      code: newSubjCode,
      icon: newSubjIcon || "🦷",
      description: newSubjDesc || "BDS 1st Year curriculum course.",
      color: "from-blue-600 to-indigo-700",
      accentColor: "blue",
      mcqCount: 0,
      flashcardCount: 0,
      pastPapersCount: 0,
      topicsCount: 0,
    };

    setSubjectsList([...subjectsList, newSubject]);
    setNewSubjName("");
    setNewSubjCode("");
    setNewSubjDesc("");
    setShowAddSubject(false);
    flash(`Subject “${newSubject.name}” added.`);
  };

  const saveRename = (id: string) => {
    const name = renameValue.trim();
    if (name) setSubjectsList((list) => list.map((s) => (s.id === id ? { ...s, name } : s)));
    setRenamingId(null);
  };

  // Handle adding new topic
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const newTopic: Topic = {
      id: `topic-${Date.now()}`,
      subjectId: topicSubjId,
      name: newTopicName,
      slug: newTopicName.toLowerCase().replace(/\s+/g, "-"),
      mcqCount: 0,
      flashcardCount: 0,
      highYield: newTopicHighYield,
      description: `Comprehensive review topic for ${newTopicName}.`,
    };

    setTopicsList([...topicsList, newTopic]);
    setNewTopicName("");
    setShowAddTopic(false);
    flash(`Topic “${newTopic.name}” added.`);
  };

  // Run validation on CSV input
  const handleValidateCSV = () => {
    if (!csvInput.trim()) return;
    setCsvResult(parseAndValidateMCQCSV(csvInput));
  };

  const handleCsvFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      setCsvInput(text);
      setCsvFileName(file.name);
      setCsvResult(parseAndValidateMCQCSV(text));
    };
    reader.readAsText(file);
  };

  // Commit parsed questions to main list
  const handleCommitCSVQuestions = () => {
    if (!csvResult || csvResult.questions.length === 0) return;
    setMcqList([...csvResult.questions, ...mcqList]);
    flash(`Added ${csvResult.questions.length} questions to the question bank.`);
    setCsvInput("");
    setCsvResult(null);
    setCsvFileName(null);
  };

  // Preload sample CSV for testing
  const handleLoadSampleCSV = () => {
    const sample = `SubjectCode,TopicSlug,YearSource,QuestionText,OptionA,OptionB,OptionC,OptionD,CorrectOptionLetter,Explanation,Difficulty
PHARM-201,local-anesthetics,UHS BDS Annual 2023,Which local anesthetic agent is metabolized predominantly by plasma pseudocholinesterase rather than hepatic CYP450 microsomal enzymes?,Lignocaine,Procaine,Bupivacaine,Mepivacaine,B,Procaine is an ester-type local anesthetic hydrolyzed rapidly in plasma by pseudocholinesterase,Easy
PATH-202,cell-injury,KMU BDS 2023,Which microscopic pattern of tissue necrosis is classically associated with tuberculosis of cervical lymph nodes (scrofula)?,Coagulative necrosis,Caseous necrosis,Liquefactive necrosis,Fat necrosis,B,Caseous necrosis is characteristic of tuberculous granulomas with central amorphous debris,Easy
DMAT-204,impression-materials,NUMS BDS 2022,Which component of irreversible hydrocolloid alginate powder functions as the chemical reactor?,Potassium alginate,Calcium sulfate dihydrate,Trisodium phosphate,Diatomaceous earth,B,Calcium sulfate dihydrate provides calcium ions to react with soluble potassium alginate,Medium`;
    setCsvInput(sample);
    setCsvFileName(null);
    setCsvResult(parseAndValidateMCQCSV(sample));
  };

  const filteredMCQs = mcqList.filter((q) => {
    const t = searchTerm.toLowerCase();
    const matchesSubj = filterSubject === "all" || q.subjectId === filterSubject;
    const matchesDiff = filterDifficulty === "all" || q.difficulty === filterDifficulty;
    const matchesSearch = q.question.toLowerCase().includes(t) || (q.yearSource && q.yearSource.toLowerCase().includes(t));
    return matchesSubj && matchesDiff && matchesSearch;
  });

  // Real numbers only, computed from the content in the app
  const lectures = CATALOG.filter((c) => c.kind === "lecture");
  const books = CATALOG.filter((c) => c.kind === "book");
  const missingExplanation = mcqList.filter((q) => !q.explanation?.trim());
  const perSubject = subjectsList.map((s) => ({ s, n: mcqList.filter((q) => q.subjectId === s.id).length }));
  const maxPerSubject = Math.max(1, ...perSubject.map((x) => x.n));
  const emptySubjects = perSubject.filter((x) => x.n === 0);

  const files = useMemo(() => {
    const t = fileQuery.trim().toLowerCase();
    const rows = [
      ...CATALOG.map((c) => ({ id: c.id, title: c.title, kind: c.kind as "lecture" | "book", sub: [c.areaTitle, c.topic || c.by].filter(Boolean).join(" · "), meta: c.pages ? `${c.pages} pages` : "", href: c.href })),
      ...BDS_RESOURCES.map((r) => ({ id: r.id, title: r.title, kind: "drive" as const, sub: `${r.type} · ${r.author}`, meta: r.fileSize, href: "/resources" })),
    ];
    return rows.filter((r) => (fileKind === "all" || r.kind === fileKind) && (!t || `${r.title} ${r.sub}`.toLowerCase().includes(t)));
  }, [fileQuery, fileKind]);

  const NAV: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "mcqs", label: "Questions", icon: FileText, count: mcqList.length },
    { id: "csv", label: "Bulk import", icon: UploadCloud },
    { id: "subjects", label: "Subjects & topics", icon: BookOpen, count: subjectsList.length },
    { id: "resources", label: "Study files", icon: Layers, count: CATALOG.length + BDS_RESOURCES.length },
    { id: "members", label: "Members & payments", icon: Users },
  ];

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="page-title mt-2">Content &amp; members</h1>
          <p className="page-lead">Manage questions, subjects and study files.</p>
        </div>
        <Link href="/dashboard" className="btn-secondary self-start sm:self-auto">
          <ArrowLeft className="h-4 w-4" /> View as student
        </Link>
      </div>

      <div className="mt-6 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-ink" role="note">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p>
          <strong>Not connected to the database yet.</strong> <span className="text-muted">Changes made here stay in this browser tab and are lost when you reload. Once Supabase is connected they will be saved for everyone.</span>
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Section navigation */}
        <nav aria-label="Admin sections" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ul role="tablist" aria-orientation="vertical" className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {NAV.map((n) => {
              const on = activeTab === n.id;
              return (
                <li key={n.id} className="shrink-0">
                  <button
                    role="tab"
                    aria-selected={on}
                    aria-controls={`panel-${n.id}`}
                    onClick={() => setActiveTab(n.id)}
                    className={`relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${on ? "text-primary" : "text-muted hover:bg-surface-2 hover:text-ink"}`}
                  >
                    {on && <m.span layoutId="admin-tab" className="absolute inset-0 rounded-xl bg-soft ring-1 ring-primary/20" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                    <n.icon className="relative h-4 w-4" />
                    <span className="relative whitespace-nowrap">{n.label}</span>
                    {n.count !== undefined && <span className="relative ml-auto rounded-full bg-surface-2 px-2 text-[11px] text-muted">{n.count}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0" id={`panel-${activeTab}`} role="tabpanel">
          {/* ============================ OVERVIEW ============================ */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {[
                  { l: "MCQs", v: mcqList.length },
                  { l: "Subjects", v: subjectsList.length },
                  { l: "Topics", v: topicsList.length },
                  { l: "Lecture PDFs", v: lectures.length },
                  { l: "Textbooks", v: books.length },
                  { l: "Flashcard decks", v: BDS_FLASHCARD_DECKS.length },
                ].map((x) => (
                  <div key={x.l} className="rounded-2xl border border-line bg-surface p-4">
                    <dt className="text-xs text-muted">{x.l}</dt>
                    <dd className="mt-1 font-display text-2xl font-extrabold text-ink">{x.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-labelledby="per-subject">
                  <h2 id="per-subject" className="card-title">Questions per subject</h2>
                  <ul className="mt-4 space-y-3">
                    {perSubject.map(({ s, n }) => (
                      <li key={s.id}>
                        <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                          <span className="flex min-w-0 items-center gap-2 text-ink">
                            <SubjectArt id={s.id} className="h-5 w-5 shrink-0" /> <span className="truncate">{s.name}</span>
                          </span>
                          <span className={`shrink-0 tabular-nums ${n ? "text-muted" : "font-semibold text-amber-600 dark:text-amber-400"}`}>{n}</span>
                        </div>
                        <ProgressBar pct={(n / maxPerSubject) * 100} />
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-labelledby="health">
                  <h2 id="health" className="card-title">Content checks</h2>
                  <ul className="mt-4 space-y-3 text-sm">
                    <Check2 ok={missingExplanation.length === 0} text={missingExplanation.length ? `${missingExplanation.length} question(s) have no explanation` : "Every question has an explanation"} />
                    <Check2 ok={emptySubjects.length === 0} text={emptySubjects.length ? `${emptySubjects.length} subject(s) have no questions: ${emptySubjects.map((x) => x.s.name).join(", ")}` : "Every subject has questions"} />
                    <Check2 ok={mcqList.length >= 20} text={mcqList.length >= 20 ? "Enough questions for a 20-question mock exam" : `Mock exams need 20 questions — the bank has ${mcqList.length}`} />
                  </ul>
                  <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-muted">Quick actions</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setActiveTab("mcqs");
                        handleNewMCQ();
                      }}
                      className="btn-secondary !min-h-[40px] !px-3.5 !py-2"
                    >
                      <Plus className="h-4 w-4" /> Add MCQ
                    </button>
                    <button onClick={() => setActiveTab("csv")} className="btn-secondary !min-h-[40px] !px-3.5 !py-2">
                      <UploadCloud className="h-4 w-4" /> Import CSV
                    </button>
                    <button onClick={() => setActiveTab("subjects")} className="btn-secondary !min-h-[40px] !px-3.5 !py-2">
                      <BookOpen className="h-4 w-4" /> Subjects
                    </button>
                  </div>
                </section>
              </div>

              <section className="flex flex-col gap-4 rounded-2xl border border-dashed border-line bg-surface/60 p-5 sm:flex-row sm:items-center sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted">
                  <Database className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h2 className="card-title">Students, payments and revenue</h2>
                  <p className="mt-0.5 text-sm text-muted">These numbers come from the database, so they appear once Supabase is connected. Nothing is estimated here.</p>
                </div>
                <button onClick={() => setActiveTab("members")} className="btn-ghost">
                  Details
                </button>
              </section>
            </div>
          )}

          {/* ============================ QUESTIONS ============================ */}
          {activeTab === "mcqs" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <label className="relative flex-1">
                  <span className="sr-only">Search questions</span>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input type="search" placeholder="Search by keyword or exam source…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="field !py-2.5 pl-10" />
                </label>
                <div className="flex flex-wrap gap-2">
                  <select aria-label="Filter by subject" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="field !w-auto !py-2.5">
                    <option value="all">All subjects</option>
                    {subjectsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <select aria-label="Filter by difficulty" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="field !w-auto !py-2.5">
                    <option value="all">Any difficulty</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                  <button onClick={handleNewMCQ} className="btn-primary">
                    <Plus className="h-4 w-4" /> Add MCQ
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="border-b border-line px-5 py-3 text-xs text-muted">
                  Showing {filteredMCQs.length} of {mcqList.length} questions
                </div>
                {filteredMCQs.length === 0 ? (
                  <p className="p-10 text-center text-sm text-muted">No questions match these filters.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {filteredMCQs.map((q) => {
                      const subj = subjectsList.find((s) => s.id === q.subjectId);
                      return (
                        <li key={q.id} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-2/60">
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                              {subj && (
                                <span className="chip">
                                  <SubjectArt id={subj.id} className="h-3.5 w-3.5" /> {subj.name}
                                </span>
                              )}
                              {q.yearSource && <span className="chip">{q.yearSource}</span>}
                              <span className={`chip ${q.difficulty === "Hard" ? "!text-rose-600 dark:!text-rose-400" : q.difficulty === "Easy" ? "!text-emerald-600 dark:!text-emerald-400" : ""}`}>{q.difficulty}</span>
                              <span className="chip">Answer {String.fromCharCode(65 + q.correctIndex)}</span>
                              {!q.explanation?.trim() && <span className="chip !text-amber-600 dark:!text-amber-400">No explanation</span>}
                            </div>
                            <p className="text-sm font-medium leading-snug text-ink">{q.question}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <button onClick={() => handleEditMCQ(q)} className="rounded-lg p-2 text-muted transition hover:bg-soft hover:text-primary" aria-label="Edit question">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteMCQ(q)} className="rounded-lg p-2 text-muted transition hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400" aria-label="Delete question">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ============================ CSV IMPORT ============================ */}
          {activeTab === "csv" && (
            <div className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="card-title">Bulk import MCQs</h2>
                  <p className="mt-1 max-w-xl text-sm text-muted">Fill in the template in Excel or Google Sheets, save it as CSV, then upload or paste it here. Every row is checked before anything is added.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleLoadSampleCSV} className="btn-secondary">
                    Load sample
                  </button>
                  <a href="/templates/bds_mcq_import_template.csv" download="bds_mcq_import_template.csv" className="btn-secondary">
                    <Download className="h-4 w-4" /> Template
                  </a>
                </div>
              </div>

              <label
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-canvas px-4 py-6 text-center text-sm text-muted transition hover:border-primary/50"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleCsvFile(e.dataTransfer.files?.[0]);
                }}
              >
                <FileUp className="h-6 w-6 text-primary" />
                <span>
                  <span className="font-semibold text-primary">Choose a .csv file</span> or drop it here
                </span>
                {csvFileName && <span className="chip">{csvFileName}</span>}
                <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => handleCsvFile(e.target.files?.[0])} />
              </label>

              <div>
                <label htmlFor="csv-text" className="mb-1.5 block text-sm font-semibold text-ink">
                  Or paste CSV rows
                </label>
                <textarea
                  id="csv-text"
                  rows={7}
                  placeholder="SubjectCode,TopicSlug,YearSource,QuestionText,OptionA,OptionB,OptionC,OptionD,CorrectOptionLetter,Explanation,Difficulty"
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="field font-mono !text-xs"
                />
              </div>

              <button onClick={handleValidateCSV} disabled={!csvInput.trim()} className="btn-primary">
                <Check className="h-4 w-4" /> Check rows
              </button>

              {csvResult && (
                <div className="space-y-4 border-t border-line pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-semibold text-emerald-700 dark:text-emerald-300">{csvResult.validCount} ready</span>
                      {csvResult.errorCount > 0 && <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 font-semibold text-rose-700 dark:text-rose-300">{csvResult.errorCount} with errors</span>}
                    </div>
                    {csvResult.validCount > 0 && (
                      <button onClick={handleCommitCSVQuestions} className="btn-primary">
                        <Plus className="h-4 w-4" /> Add {csvResult.validCount} question{csvResult.validCount === 1 ? "" : "s"}
                      </button>
                    )}
                  </div>

                  {csvResult.errors.length > 0 && (
                    <div className="space-y-2 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm">
                      <p className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-300">
                        <AlertCircle className="h-4 w-4" /> These rows won&apos;t be added until fixed:
                      </p>
                      <ul className="space-y-1 text-muted">
                        {csvResult.errors.map((err, i) => (
                          <li key={i}>
                            <strong className="text-ink">
                              Row {err.rowNumber} · {err.field}:
                            </strong>{" "}
                            {err.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {csvResult.questions.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-semibold text-ink">Preview</p>
                      <ul className="max-h-72 divide-y divide-line overflow-y-auto rounded-xl border border-line">
                        {csvResult.questions.map((q, idx) => (
                          <li key={idx} className="space-y-1 p-3">
                            <div className="flex flex-wrap gap-1.5 text-[11px]">
                              <span className="chip">{q.yearSource}</span>
                              <span className="chip">Answer {String.fromCharCode(65 + q.correctIndex)}</span>
                            </div>
                            <p className="text-sm text-ink">{q.question}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================ SUBJECTS & TOPICS ============================ */}
          {activeTab === "subjects" && (
            <div className="space-y-6">
              <section className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="card-title">Subjects</h2>
                    <p className="mt-0.5 text-sm text-muted">Add or rename curriculum subjects.</p>
                  </div>
                  <button onClick={() => setShowAddSubject(!showAddSubject)} className={showAddSubject ? "btn-secondary" : "btn-primary"}>
                    {showAddSubject ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {showAddSubject ? "Close" : "Add subject"}
                  </button>
                </div>

                {showAddSubject && (
                  <form onSubmit={handleCreateSubject} className="grid gap-3 rounded-xl border border-line bg-canvas p-4 sm:grid-cols-2">
                    <Field label="Subject name *">
                      <input required placeholder="e.g. Oral Pathology" value={newSubjName} onChange={(e) => setNewSubjName(e.target.value)} className="field" />
                    </Field>
                    <Field label="Code *">
                      <input required placeholder="e.g. OPATH-301" value={newSubjCode} onChange={(e) => setNewSubjCode(e.target.value)} className="field" />
                    </Field>
                    <Field label="Short description" className="sm:col-span-2">
                      <input placeholder="What the subject covers" value={newSubjDesc} onChange={(e) => setNewSubjDesc(e.target.value)} className="field" />
                    </Field>
                    <Field label="Icon (emoji)">
                      <input value={newSubjIcon} onChange={(e) => setNewSubjIcon(e.target.value)} className="field" />
                    </Field>
                    <div className="flex items-end">
                      <button type="submit" className="btn-primary">
                        Save subject
                      </button>
                    </div>
                  </form>
                )}

                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {subjectsList.map((s) => {
                    const n = mcqList.filter((q) => q.subjectId === s.id).length;
                    const t = topicsList.filter((x) => x.subjectId === s.id).length;
                    return (
                      <li key={s.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-line bg-canvas p-3.5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2">
                          <SubjectArt id={s.id} className="h-8 w-8" />
                        </span>
                        <div className="min-w-0 flex-1">
                          {renamingId === s.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                saveRename(s.id);
                              }}
                              className="flex gap-1.5"
                            >
                              <input autoFocus aria-label="New subject name" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setRenamingId(null)} className="field !py-1.5" />
                              <button type="submit" className="rounded-lg p-2 text-primary hover:bg-soft" aria-label="Save name">
                                <Check className="h-4 w-4" />
                              </button>
                            </form>
                          ) : (
                            <>
                              <div className="truncate text-sm font-semibold text-ink">{s.name}</div>
                              <div className="text-xs text-muted">
                                {s.code} · {n} MCQ{n === 1 ? "" : "s"} · {t} topic{t === 1 ? "" : "s"}
                              </div>
                            </>
                          )}
                        </div>
                        {renamingId !== s.id && (
                          <div className="flex shrink-0 gap-1">
                            <button
                              onClick={() => {
                                setRenamingId(s.id);
                                setRenameValue(s.name);
                              }}
                              className="rounded-lg p-2 text-muted hover:bg-soft hover:text-primary"
                              aria-label={`Rename ${s.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setConfirm({
                                  title: `Delete “${s.name}”?`,
                                  text: n ? `It has ${n} question(s). They stay in the bank but won't belong to a subject.` : "This subject has no questions.",
                                  action: "Delete subject",
                                  onConfirm: () => {
                                    setSubjectsList((list) => list.filter((x) => x.id !== s.id));
                                    flash(`Subject “${s.name}” deleted.`);
                                  },
                                })
                              }
                              className="rounded-lg p-2 text-muted hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
                              aria-label={`Delete ${s.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="card-title">Topics</h2>
                    <p className="mt-0.5 text-sm text-muted">Topics group questions for practice tests.</p>
                  </div>
                  <button onClick={() => setShowAddTopic(!showAddTopic)} className={showAddTopic ? "btn-secondary" : "btn-primary"}>
                    {showAddTopic ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />} {showAddTopic ? "Close" : "Add topic"}
                  </button>
                </div>

                {showAddTopic && (
                  <form onSubmit={handleCreateTopic} className="grid gap-3 rounded-xl border border-line bg-canvas p-4 sm:grid-cols-2">
                    <Field label="Subject">
                      <select value={topicSubjId} onChange={(e) => setTopicSubjId(e.target.value)} className="field">
                        {subjectsList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Topic name *">
                      <input required placeholder="e.g. Salivary glands" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} className="field" />
                    </Field>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                      <input type="checkbox" checked={newTopicHighYield} onChange={(e) => setNewTopicHighYield(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--c-primary))]" />
                      Mark as high-yield
                    </label>
                    <div className="sm:text-right">
                      <button type="submit" className="btn-primary">
                        Save topic
                      </button>
                    </div>
                  </form>
                )}

                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {topicsList.map((t) => {
                    const parent = subjectsList.find((s) => s.id === t.subjectId);
                    return (
                      <li key={t.id} className="flex items-start justify-between gap-2 rounded-xl border border-line bg-canvas p-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-ink">{t.name}</div>
                          <div className="text-xs text-muted">{parent?.name || "No subject"}</div>
                        </div>
                        {t.highYield && <span className="chip shrink-0 !text-amber-600 dark:!text-amber-400">High-yield</span>}
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          )}

          {/* ============================ STUDY FILES ============================ */}
          {activeTab === "resources" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <label className="relative flex-1">
                  <span className="sr-only">Search files</span>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input type="search" placeholder="Search lectures, textbooks and notes…" value={fileQuery} onChange={(e) => setFileQuery(e.target.value)} className="field !py-2.5 pl-10" />
                </label>
                <div role="tablist" aria-label="File type" className="inline-flex flex-wrap gap-1 rounded-xl border border-line bg-surface-2 p-1">
                  {(
                    [
                      ["all", "All"],
                      ["lecture", `Lectures ${lectures.length}`],
                      ["book", `Textbooks ${books.length}`],
                      ["drive", `Notes ${BDS_RESOURCES.length}`],
                    ] as const
                  ).map(([k, l]) => (
                    <button key={k} role="tab" aria-selected={fileKind === k} onClick={() => setFileKind(k)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${fileKind === k ? "bg-surface text-ink shadow-soft" : "text-muted hover:text-ink"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm text-muted">
                <UploadCloud className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  Uploading new files needs Supabase Storage connected. Until then, new lectures are added to the project&apos;s files and appear here automatically.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="border-b border-line px-5 py-3 text-xs text-muted">{files.length} files</div>
                <ul className="max-h-[640px] divide-y divide-line overflow-y-auto">
                  {files.slice(0, 300).map((f) => (
                    <li key={f.kind + f.id} className="flex items-center gap-3 px-5 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-soft text-primary">
                        {f.kind === "lecture" ? <Presentation className="h-4 w-4" /> : f.kind === "book" ? <Library className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-ink">{f.title}</div>
                        <div className="truncate text-xs text-muted">{[f.sub, f.meta].filter(Boolean).join(" · ")}</div>
                      </div>
                      <Link href={f.href} className="link shrink-0 text-xs">
                        Open
                      </Link>
                    </li>
                  ))}
                  {files.length === 0 && <li className="p-10 text-center text-sm text-muted">No files match.</li>}
                </ul>
              </div>
            </div>
          )}

          {/* ============================ MEMBERS & PAYMENTS ============================ */}
          {activeTab === "members" && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-muted">
                  <Users className="h-6 w-6" />
                </span>
                <h2 className="card-title mt-4">No member data yet</h2>
                <p className="mx-auto mt-1 max-w-lg text-sm text-muted">
                  Student accounts and payments are stored in the database (the <code className="rounded bg-surface-2 px-1">profiles</code>, <code className="rounded bg-surface-2 px-1">memberships</code> and{" "}
                  <code className="rounded bg-surface-2 px-1">payments</code> tables). Once Supabase is connected, this page will list them, and bank-transfer submissions will wait here for you to approve or reject.
                </p>
              </section>

              <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6" aria-labelledby="plans">
                <h2 id="plans" className="card-title">Plans students can buy</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead className="border-b border-line text-xs text-muted">
                      <tr>
                        <th className="pb-2 font-semibold">Plan</th>
                        <th className="pb-2 font-semibold">Price</th>
                        <th className="pb-2 font-semibold">Length</th>
                        <th className="pb-2 font-semibold">Features</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {MEMBERSHIP_PLANS.map((p) => (
                        <tr key={p.id}>
                          <td className="py-3 font-semibold text-ink">{p.name}</td>
                          <td className="py-3 tabular-nums text-ink">{p.pricePKR ? `Rs ${p.pricePKR.toLocaleString()}` : "Free"}</td>
                          <td className="py-3 text-muted">{p.durationMonths ? `${p.durationMonths} month${p.durationMonths === 1 ? "" : "s"}` : "No limit"}</td>
                          <td className="py-3 text-muted">{p.features.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-muted">Payment methods: JazzCash, Easypaisa and bank transfer.</p>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* ============================ MCQ EDITOR ============================ */}
      <Modal open={showMCQModal} onClose={() => setShowMCQModal(false)} title={editingMCQId ? "Edit question" : "Add a question"}>
        <form onSubmit={handleSaveMCQ} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Subject">
              <select value={mcqFormSubject} onChange={(e) => setMcqFormSubject(e.target.value)} className="field">
                {subjectsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Exam source">
              <input placeholder="e.g. UHS BDS 2024" value={mcqFormYear} onChange={(e) => setMcqFormYear(e.target.value)} className="field" />
            </Field>
            <Field label="Difficulty">
              <select value={mcqFormDifficulty} onChange={(e) => setMcqFormDifficulty(e.target.value as "Easy" | "Medium" | "Hard")} className="field">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </Field>
          </div>

          <Field label="Question *">
            <textarea required rows={3} placeholder="Enter the full question…" value={mcqFormQuestion} onChange={(e) => setMcqFormQuestion(e.target.value)} className="field" />
          </Field>

          <fieldset className="space-y-2">
            <legend className="mb-1.5 text-sm font-semibold text-ink">Options — tick the correct one</legend>
            {mcqFormOptions.map((opt, i) => (
              <div key={i} className={`flex items-center gap-2 rounded-xl border p-1.5 pl-3 ${mcqFormCorrect === i ? "border-emerald-500/60 bg-emerald-500/5" : "border-line"}`}>
                <input
                  type="radio"
                  name="modalCorrectOpt"
                  checked={mcqFormCorrect === i}
                  onChange={() => setMcqFormCorrect(i)}
                  aria-label={`Option ${String.fromCharCode(65 + i)} is correct`}
                  className="h-4 w-4 accent-emerald-600"
                />
                <span className="w-4 text-sm font-bold text-muted">{String.fromCharCode(65 + i)}</span>
                <input
                  required
                  aria-label={`Option ${String.fromCharCode(65 + i)}`}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  value={opt}
                  onChange={(e) => {
                    const updated = [...mcqFormOptions];
                    updated[i] = e.target.value;
                    setMcqFormOptions(updated);
                  }}
                  className="field !border-0 !bg-transparent !py-1.5 !shadow-none"
                />
              </div>
            ))}
          </fieldset>

          <Field label="Explanation">
            <textarea rows={3} placeholder="Why this answer is correct (cite the textbook if you can)…" value={mcqFormExplanation} onChange={(e) => setMcqFormExplanation(e.target.value)} className="field" />
          </Field>

          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <button type="button" onClick={() => setShowMCQModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingMCQId ? "Save changes" : "Add question"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================ CONFIRM ============================ */}
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.title ?? ""} size="sm">
        <p className="line-clamp-4 text-sm text-muted">{confirm?.text}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button autoFocus onClick={() => setConfirm(null)} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => {
              confirm?.onConfirm();
              setConfirm(null);
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-500"
          >
            <Trash2 className="h-4 w-4" /> {confirm?.action}
          </button>
        </div>
      </Modal>

      {/* ============================ TOAST ============================ */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex justify-center px-4 lg:bottom-8">
        <AnimatePresence>
          {toast && (
            <m.div
              key={toast}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex items-center gap-2 rounded-xl border border-line bg-elevated px-4 py-3 text-sm font-medium text-ink shadow-lift"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {toast}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Check2({ ok, text }: { ok: boolean; text: string }) {
  return (
    <li className="flex gap-2.5">
      {ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
      <span className={ok ? "text-muted" : "text-ink"}>{text}</span>
    </li>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

/** Accessible in-page dialog: Escape closes, focus moves in and returns, page behind is inert to clicks. */
function Modal({ open, onClose, title, children, size = "lg" }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: "sm" | "lg" }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      if (!ref.current?.contains(document.activeElement)) (ref.current?.querySelector<HTMLElement>("input, textarea, select, [autofocus]") ?? ref.current?.querySelector<HTMLElement>("button"))?.focus();
    }, 30);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      prev?.focus?.();
    };
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <m.div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <m.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 24, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 shadow-lift sm:rounded-2xl sm:p-6 ${size === "sm" ? "sm:max-w-md" : "sm:max-w-2xl"}`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-ink" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
