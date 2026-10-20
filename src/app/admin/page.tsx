"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BDS_SUBJECTS,
  BDS_TOPICS,
  BDS_MCQS,
  BDS_RESOURCES,
  MCQ,
  Subject,
  Topic
} from "@/lib/bds-content";
import {
  parseAndValidateMCQCSV,
  CSVParseResult
} from "@/lib/csv-parser";
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
  Download,
  Edit,
  Search,
  Check,
  X
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "mcqs" | "csv" | "subjects" | "resources" | "members"
  >("overview");

  // Editable lists in local state
  const [mcqList, setMcqList] = useState<MCQ[]>(BDS_MCQS);
  const [subjectsList, setSubjectsList] = useState<Subject[]>(BDS_SUBJECTS);
  const [topicsList, setTopicsList] = useState<Topic[]>(BDS_TOPICS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");

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

  // State for adding a Topic
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [topicSubjId, setTopicSubjId] = useState("pharm");
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicHighYield, setNewTopicHighYield] = useState(true);

  // CSV bulk import state
  const [csvInput, setCsvInput] = useState("");
  const [csvResult, setCsvResult] = useState<CSVParseResult | null>(null);
  const [importSuccessAlert, setImportSuccessAlert] = useState<string | null>(null);

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
      // Update existing
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
    } else {
      // Create new
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
    }

    setShowMCQModal(false);
  };

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
  };

  // Run validation on CSV input
  const handleValidateCSV = () => {
    if (!csvInput.trim()) return;
    const res = parseAndValidateMCQCSV(csvInput);
    setCsvResult(res);
  };

  // Commit parsed questions to main list
  const handleCommitCSVQuestions = () => {
    if (!csvResult || csvResult.questions.length === 0) return;
    setMcqList([...csvResult.questions, ...mcqList]);
    setImportSuccessAlert(`Successfully committed ${csvResult.questions.length} questions into the live question bank!`);
    setCsvInput("");
    setCsvResult(null);
    setTimeout(() => setImportSuccessAlert(null), 4000);
  };

  // Preload sample CSV for testing
  const handleLoadSampleCSV = () => {
    const sample = `SubjectCode,TopicSlug,YearSource,QuestionText,OptionA,OptionB,OptionC,OptionD,CorrectOptionLetter,Explanation,Difficulty
PHARM-201,local-anesthetics,UHS BDS Annual 2023,Which local anesthetic agent is metabolized predominantly by plasma pseudocholinesterase rather than hepatic CYP450 microsomal enzymes?,Lignocaine,Procaine,Bupivacaine,Mepivacaine,B,Procaine is an ester-type local anesthetic hydrolyzed rapidly in plasma by pseudocholinesterase,Easy
PATH-202,cell-injury,KMU BDS 2023,Which microscopic pattern of tissue necrosis is classically associated with tuberculosis of cervical lymph nodes (scrofula)?,Coagulative necrosis,Caseous necrosis,Liquefactive necrosis,Fat necrosis,B,Caseous necrosis is characteristic of tuberculous granulomas with central amorphous debris,Easy
DMAT-204,impression-materials,NUMS BDS 2022,Which component of irreversible hydrocolloid alginate powder functions as the chemical reactor?,Potassium alginate,Calcium sulfate dihydrate,Trisodium phosphate,Diatomaceous earth,B,Calcium sulfate dihydrate provides calcium ions to react with soluble potassium alginate,Medium`;
    setCsvInput(sample);
    const res = parseAndValidateMCQCSV(sample);
    setCsvResult(res);
  };

  const filteredMCQs = mcqList.filter((q) => {
    const matchesSubj = filterSubject === "all" || q.subjectId === filterSubject;
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.yearSource && q.yearSource.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSubj && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-widest bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-800/60">
                Staff Control Center
              </span>
              <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded shadow-sm shadow-blue-900/40">
                Admin Mode
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              BDS Content & Student Management
            </h1>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 bg-[#0c182a] border border-[#1e3452] rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#182c48] transition"
          >
            ← View as Student
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1e3452]">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow-md shadow-blue-950/50"
                : "bg-[#0c182a] text-slate-300 border border-[#1e3452] hover:bg-[#162740] hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("mcqs")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === "mcqs"
                ? "bg-blue-600 text-white shadow-md shadow-blue-950/50"
                : "bg-[#0c182a] text-slate-300 border border-[#1e3452] hover:bg-[#162740] hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Manage MCQs ({mcqList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("csv")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === "csv"
                ? "bg-blue-600 text-white shadow-md shadow-blue-950/50"
                : "bg-[#0c182a] text-slate-300 border border-[#1e3452] hover:bg-[#162740] hover:text-white"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>CSV Bulk Importer</span>
          </button>

          <button
            onClick={() => setActiveTab("subjects")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === "subjects"
                ? "bg-blue-600 text-white shadow-md shadow-blue-950/50"
                : "bg-[#0c182a] text-slate-300 border border-[#1e3452] hover:bg-[#162740] hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subjects & Topics ({subjectsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("resources")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === "resources"
                ? "bg-blue-600 text-white shadow-md shadow-blue-950/50"
                : "bg-[#0c182a] text-slate-300 border border-[#1e3452] hover:bg-[#162740] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PDFs & Slides ({BDS_RESOURCES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 ${
              activeTab === "members"
                ? "bg-blue-600 text-white shadow-md shadow-blue-950/50"
                : "bg-[#0c182a] text-slate-300 border border-[#1e3452] hover:bg-[#162740] hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Members & Payments</span>
          </button>
        </div>

        {importSuccessAlert && (
          <div className="p-4 bg-emerald-950/50 border border-emerald-800 rounded-2xl text-xs font-semibold text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{importSuccessAlert}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#132238] p-6 rounded-2xl border border-[#1e3452] shadow-sm space-y-1">
                <div className="text-xs text-slate-400 font-medium">Registered Students</div>
                <div className="text-3xl font-extrabold text-white">428</div>
                <div className="text-[11px] text-emerald-400 font-semibold">+34 this week</div>
              </div>

              <div className="bg-[#132238] p-6 rounded-2xl border border-[#1e3452] shadow-sm space-y-1">
                <div className="text-xs text-slate-400 font-medium">Published MCQs</div>
                <div className="text-3xl font-extrabold text-sky-400">{mcqList.length}</div>
                <div className="text-[11px] text-slate-400 font-semibold">Across {subjectsList.length} subjects</div>
              </div>

              <div className="bg-[#132238] p-6 rounded-2xl border border-[#1e3452] shadow-sm space-y-1">
                <div className="text-xs text-slate-400 font-medium">Paid Subscriptions</div>
                <div className="text-3xl font-extrabold text-white">184</div>
                <div className="text-[11px] text-teal-400 font-semibold">Annual & Semester</div>
              </div>

              <div className="bg-[#132238] p-6 rounded-2xl border border-[#1e3452] shadow-sm space-y-1">
                <div className="text-xs text-slate-400 font-medium">Platform Revenue</div>
                <div className="text-3xl font-extrabold text-emerald-400">PKR 342K</div>
                <div className="text-[11px] text-slate-400 font-semibold">Processed in Pakistan</div>
              </div>
            </div>

            <div className="bg-[#132238] rounded-3xl border border-[#1e3452] p-6 sm:p-8 shadow-sm space-y-4 text-slate-200">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Common Administrative Tasks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setActiveTab("mcqs");
                    handleNewMCQ();
                  }}
                  className="p-4 rounded-xl border border-dashed border-[#1e3452] hover:border-blue-500 bg-[#0c182a] hover:bg-[#162740] text-left transition space-y-1"
                >
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-sky-400" />
                    <span>Create Individual MCQ</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Add question stem, 4 choices, and clinical rationale.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("csv")}
                  className="p-4 rounded-xl border border-dashed border-[#1e3452] hover:border-blue-500 bg-[#0c182a] hover:bg-[#162740] text-left transition space-y-1"
                >
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-teal-400" />
                    <span>Upload CSV Question Bank</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Import 100+ past paper questions in seconds.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("subjects")}
                  className="p-4 rounded-xl border border-dashed border-[#1e3452] hover:border-blue-500 bg-[#0c182a] hover:bg-[#162740] text-left transition space-y-1"
                >
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>Add / Rename Subjects</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Organize BDS 1st Year core subjects and future curriculum.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: MANAGE MCQS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "mcqs" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search questions by keyword or past paper..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#1e3452] bg-[#0c182a] text-slate-100 placeholder-slate-500 focus:bg-[#0c182a] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#1e3452] bg-[#0c182a] font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="all" className="bg-[#0c182a] text-slate-200">All Subjects</option>
                  {subjectsList.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0c182a] text-slate-200">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleNewMCQ}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-950/50 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Single MCQ</span>
              </button>
            </div>

            {/* Questions Table */}
            <div className="bg-[#132238] rounded-3xl border border-[#1e3452] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#1e3452] flex items-center justify-between text-xs text-slate-400">
                <span>Showing {filteredMCQs.length} questions in bank</span>
                <span className="font-semibold text-emerald-400">100% Validated</span>
              </div>

              <div className="divide-y divide-[#1e3452] text-xs">
                {filteredMCQs.map((q, idx) => {
                  const subj = subjectsList.find((s) => s.id === q.subjectId);
                  return (
                    <div key={q.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-[#162740] transition">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-400">#{idx + 1}</span>
                          <span className="font-semibold text-sky-300 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded text-[10px]">
                            {q.yearSource || "Past Paper"}
                          </span>
                          {subj && (
                            <span className="text-[10px] text-slate-400">
                              • {subj.name}
                            </span>
                          )}
                          <span className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-bold px-1.5 py-0.5 rounded">
                            Correct: Option {String.fromCharCode(65 + q.correctIndex)}
                          </span>
                        </div>
                        <p className="font-medium text-white leading-snug">
                          {q.question}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditMCQ(q)}
                          className="p-2 text-slate-400 hover:text-sky-300 hover:bg-[#0c182a] rounded-lg transition"
                          title="Edit question"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Remove this question from database?")) {
                              setMcqList(mcqList.filter((m) => m.id !== q.id));
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: CSV BULK IMPORTER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "csv" && (
          <div className="bg-[#132238] rounded-3xl border border-[#1e3452] p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn text-xs text-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1e3452] pb-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  Bulk MCQ Importer (Validated & Protected)
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Import past paper questions from Excel / Google Sheets without writing code. Formula injection protection is built-in.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadSampleCSV}
                  className="px-3.5 py-2 bg-[#0c182a] hover:bg-[#182c48] border border-[#1e3452] text-slate-200 rounded-xl font-semibold transition"
                >
                  Load Sample Data
                </button>
                <a
                  href="/templates/bds_mcq_import_template.csv"
                  download="bds_mcq_import_template.csv"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow-md shadow-blue-950/50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template (.csv)</span>
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-300">
                Paste CSV Rows or Upload:
              </label>
              <textarea
                rows={7}
                placeholder="SubjectCode,TopicSlug,YearSource,QuestionText,OptionA,OptionB,OptionC,OptionD,CorrectOptionLetter,Explanation,Difficulty"
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                className="w-full p-3 font-mono text-[11px] rounded-xl border border-[#1e3452] bg-[#0c182a] text-slate-100 placeholder-slate-500 focus:bg-[#0c182a] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleValidateCSV}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-md shadow-blue-950/50"
              >
                <Check className="w-4 h-4" />
                <span>Validate CSV Content</span>
              </button>
            </div>

            {/* Validation Results Display */}
            {csvResult && (
              <div className="space-y-4 pt-4 border-t border-[#1e3452] animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Validation Summary:</span>
                    <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-bold rounded">
                      {csvResult.validCount} Valid Questions
                    </span>
                    {csvResult.errorCount > 0 && (
                      <span className="px-2 py-0.5 bg-rose-950/60 text-rose-300 border border-rose-800/60 font-bold rounded">
                        {csvResult.errorCount} Errors Detected
                      </span>
                    )}
                  </div>

                  {csvResult.validCount > 0 && (
                    <button
                      onClick={handleCommitCSVQuestions}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-950/50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Commit {csvResult.validCount} MCQs to Database</span>
                    </button>
                  )}
                </div>

                {/* Error Table if any */}
                {csvResult.errors.length > 0 && (
                  <div className="p-4 bg-rose-950/50 border border-rose-800 rounded-2xl space-y-2">
                    <div className="font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>Errors detected in CSV (Rows will not be imported until fixed):</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-rose-200">
                      {csvResult.errors.map((err, i) => (
                        <li key={i}>
                          <strong className="text-white">Row {err.rowNumber} [{err.field}]:</strong> {err.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Live Preview of Valid Questions */}
                {csvResult.questions.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-300">Preview of parsed questions:</span>
                    <div className="max-h-60 overflow-y-auto border border-[#1e3452] rounded-xl divide-y divide-[#1e3452]">
                      {csvResult.questions.map((q, idx) => (
                        <div key={idx} className="p-3 bg-[#0c182a] space-y-1">
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                            <span>#{idx + 1}</span>
                            <span className="bg-sky-950/60 text-sky-300 border border-sky-800/60 px-1.5 py-0.5 rounded">{q.yearSource}</span>
                            <span className="text-emerald-400">Correct: Option {String.fromCharCode(65 + q.correctIndex)}</span>
                          </div>
                          <p className="text-xs font-medium text-white">{q.question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: SUBJECTS & TOPICS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "subjects" && (
          <div className="space-y-8 animate-fadeIn text-xs">
            {/* Subjects Header & Form */}
            <div className="bg-[#132238] rounded-3xl border border-[#1e3452] p-6 sm:p-8 shadow-sm space-y-6 text-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">
                    BDS Academic Subjects
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Add, rename, or reorder curriculum subjects.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddSubject(!showAddSubject)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-950/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddSubject ? "Close" : "Add Subject"}</span>
                </button>
              </div>

              {showAddSubject && (
                <form onSubmit={handleCreateSubject} className="p-5 bg-[#0c182a] border border-[#1e3452] rounded-2xl space-y-3 animate-fadeIn">
                  <h3 className="font-bold text-white">New Subject Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Subject Name (e.g. Oral Pathology)"
                      value={newSubjName}
                      onChange={(e) => setNewSubjName(e.target.value)}
                      className="p-2.5 rounded-xl border border-[#1e3452] bg-[#132238] text-slate-100 placeholder-slate-500 focus:bg-[#132238] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Code (e.g. OPATH-301)"
                      value={newSubjCode}
                      onChange={(e) => setNewSubjCode(e.target.value)}
                      className="p-2.5 rounded-xl border border-[#1e3452] bg-[#132238] text-slate-100 placeholder-slate-500 focus:bg-[#132238] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                    <input
                      type="text"
                      placeholder="Emoji Icon (e.g. 🦷, 🔬)"
                      value={newSubjIcon}
                      onChange={(e) => setNewSubjIcon(e.target.value)}
                      className="p-2.5 rounded-xl border border-[#1e3452] bg-[#132238] text-slate-100 placeholder-slate-500 focus:bg-[#132238] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-950/50 transition"
                  >
                    Save Subject
                  </button>
                </form>
              )}

              {/* Subjects Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectsList.map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl border border-[#1e3452] flex items-center justify-between gap-4 bg-[#0c182a] shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-[#132238] border border-[#1e3452] rounded-xl">{s.icon}</span>
                      <div>
                        <div className="font-bold text-white text-sm">{s.name}</div>
                        <div className="text-[11px] text-slate-400">{s.code} • {s.description.slice(0, 50)}...</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const newName = prompt("Enter new subject name:", s.name);
                          if (newName) {
                            setSubjectsList(subjectsList.map((sub) => sub.id === s.id ? { ...sub, name: newName } : sub));
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-sky-300 hover:bg-[#132238] rounded-lg transition"
                        title="Rename"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete subject "${s.name}"?`)) {
                            setSubjectsList(subjectsList.filter((sub) => sub.id !== s.id));
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics Section */}
            <div className="bg-[#132238] rounded-3xl border border-[#1e3452] p-6 sm:p-8 shadow-sm space-y-6 text-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">
                    High-Yield Curriculum Topics
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Topics group questions together for students during practice tests.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddTopic(!showAddTopic)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-950/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddTopic ? "Close" : "Add Topic"}</span>
                </button>
              </div>

              {showAddTopic && (
                <form onSubmit={handleCreateTopic} className="p-5 bg-[#0c182a] border border-[#1e3452] rounded-2xl space-y-3 animate-fadeIn">
                  <h3 className="font-bold text-white">New Topic Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={topicSubjId}
                      onChange={(e) => setTopicSubjId(e.target.value)}
                      className="p-2.5 rounded-xl border border-[#1e3452] bg-[#132238] text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      {subjectsList.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#132238] text-slate-200">
                          {s.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      required
                      placeholder="Topic Name (e.g. Sialolithiasis & Salivary Glands)"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      className="p-2.5 rounded-xl border border-[#1e3452] bg-[#132238] text-slate-100 placeholder-slate-500 focus:bg-[#132238] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={newTopicHighYield}
                      onChange={(e) => setNewTopicHighYield(e.target.checked)}
                      className="rounded text-blue-600 bg-[#132238] border-[#1e3452]"
                    />
                    <span className="font-medium text-slate-300">Flag as High-Yield Exam Topic</span>
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-950/50 transition"
                  >
                    Save Topic
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topicsList.map((t) => {
                  const parentSubj = subjectsList.find((s) => s.id === t.subjectId);
                  return (
                    <div key={t.id} className="p-3.5 rounded-xl border border-[#1e3452] bg-[#0c182a] flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="font-bold text-white text-xs">{t.name}</div>
                        <div className="text-[10px] text-slate-400">{parentSubj?.name || "BDS Subject"}</div>
                      </div>
                      {t.highYield && (
                        <span className="text-[9px] bg-amber-950/60 border border-amber-800/80 text-amber-300 font-bold px-1.5 py-0.5 rounded shrink-0">
                          High Yield
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: RESOURCES */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "resources" && (
          <div className="bg-[#132238] rounded-3xl border border-[#1e3452] p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn text-xs text-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">
                  Study Guides & Lecture Presentations
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Authenticated downloads hosted securely via Supabase Storage.
                </p>
              </div>
              <button
                onClick={() => alert("Upload dialog: In production, files upload directly to protected Supabase Storage buckets.")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-blue-950/50 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload New PDF/PPTX</span>
              </button>
            </div>

            <div className="divide-y divide-[#1e3452]">
              {BDS_RESOURCES.map((res) => (
                <div key={res.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-[#0c182a] border border-[#1e3452] text-slate-300 font-bold text-[10px]">
                      {res.type}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{res.title}</div>
                      <div className="text-[11px] text-slate-400">{res.fileSize} • {res.author}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: MEMBERS & PAYMENTS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "members" && (
          <div className="bg-[#132238] rounded-3xl border border-[#1e3452] p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn text-xs text-slate-200">
            <h2 className="text-base font-bold text-white">
              Student Accounts & Payment Verifications
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#1e3452] text-slate-400 text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="pb-2">Student Name</th>
                    <th className="pb-2">Dental College</th>
                    <th className="pb-2">Plan</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3452] text-slate-300">
                  <tr className="hover:bg-[#162740] transition">
                    <td className="py-3 font-semibold text-white">Dr. Ayesha Khan</td>
                    <td className="py-3 text-slate-300">de&apos;Montmorency Lahore</td>
                    <td className="py-3 text-slate-200">Annual Pass (PKR 1,999)</td>
                    <td className="py-3 text-slate-300">JazzCash</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-bold text-[10px]">
                        Active
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => alert("Membership renewed for Ayesha Khan")} className="text-sky-400 hover:text-sky-300 font-semibold underline">Manage</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#162740] transition">
                    <td className="py-3 font-semibold text-white">Dr. Usman Malik</td>
                    <td className="py-3 text-slate-300">Nishtar Institute of Dentistry</td>
                    <td className="py-3 text-slate-200">Semester Pass (PKR 1,299)</td>
                    <td className="py-3 text-slate-300">Easypaisa</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-bold text-[10px]">
                        Active
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => alert("Membership renewed for Usman Malik")} className="text-sky-400 hover:text-sky-300 font-semibold underline">Manage</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODAL: CREATE OR EDIT SINGLE MCQ */}
        {/* ------------------------------------------------------------- */}
        {showMCQModal && (
          <div className="fixed inset-0 z-50 bg-[#060d18]/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#132238] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs animate-fadeIn border border-[#1e3452] text-slate-200">
              <div className="flex items-center justify-between border-b border-[#1e3452] pb-3">
                <h3 className="font-bold text-sm text-white">
                  {editingMCQId ? "Edit Examination MCQ" : "Add New Examination MCQ"}
                </h3>
                <button
                  onClick={() => setShowMCQModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMCQ} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      value={mcqFormSubject}
                      onChange={(e) => setMcqFormSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#1e3452] bg-[#0c182a] text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      {subjectsList.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#0c182a] text-slate-200">
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Exam Source
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UHS BDS 2024"
                      value={mcqFormYear}
                      onChange={(e) => setMcqFormYear(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#1e3452] bg-[#0c182a] text-slate-100 placeholder-slate-500 focus:bg-[#0c182a] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={mcqFormDifficulty}
                      onChange={(e) => setMcqFormDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                      className="w-full p-2.5 rounded-xl border border-[#1e3452] bg-[#0c182a] text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      <option value="Easy" className="bg-[#0c182a] text-slate-200">Easy</option>
                      <option value="Medium" className="bg-[#0c182a] text-slate-200">Medium</option>
                      <option value="Hard" className="bg-[#0c182a] text-slate-200">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Question Stem *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter the full question text..."
                    value={mcqFormQuestion}
                    onChange={(e) => setMcqFormQuestion(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#1e3452] bg-[#0c182a] text-slate-100 placeholder-slate-500 focus:bg-[#0c182a] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-slate-300">
                    Answer Options (Select the correct radio option)
                  </label>
                  {mcqFormOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="modalCorrectOpt"
                        checked={mcqFormCorrect === i}
                        onChange={() => setMcqFormCorrect(i)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 bg-[#0c182a] border-[#1e3452]"
                      />
                      <span className="font-bold text-slate-400 w-4">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${String.fromCharCode(65 + i)} text`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...mcqFormOptions];
                          updated[i] = e.target.value;
                          setMcqFormOptions(updated);
                        }}
                        className="flex-1 p-2 rounded-lg border border-[#1e3452] bg-[#0c182a] text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Detailed Clinical Rationale / Textbook Citation
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Explain why this answer is correct..."
                    value={mcqFormExplanation}
                    onChange={(e) => setMcqFormExplanation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#1e3452] bg-[#0c182a] text-slate-100 placeholder-slate-500 focus:bg-[#0c182a] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMCQModal(false)}
                    className="px-4 py-2 border border-[#1e3452] bg-[#0c182a] hover:bg-[#162740] rounded-xl text-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-950/50 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
