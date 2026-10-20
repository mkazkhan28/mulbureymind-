import { MCQ } from "./bds-content";

export interface CSVValidationError {
  rowNumber: number;
  field: string;
  message: string;
}

export interface CSVParseResult {
  success: boolean;
  totalRows: number;
  validCount: number;
  errorCount: number;
  questions: MCQ[];
  errors: CSVValidationError[];
}

/**
 * Sanitizes input to prevent CSV/Formula injection attacks
 * Prevents execution of formulas like =CMD(), +..., -..., @...
 */
function sanitizeCSVCell(value: string): string {
  if (!value) return "";
  let clean = value.trim();
  // Strip dangerous leading formula characters
  if (clean.startsWith("=") || clean.startsWith("+") || clean.startsWith("-") || clean.startsWith("@")) {
    clean = clean.replace(/^[=+\-@]+/, "");
  }
  // Strip any script tags
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  return clean;
}

/**
 * Simple robust CSV Line Parser handling quotes and commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((cell) => sanitizeCSVCell(cell));
}

/**
 * Validates and parses bulk MCQ CSV text
 */
export function parseAndValidateMCQCSV(csvContent: string): CSVParseResult {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const errors: CSVValidationError[] = [];
  const validQuestions: MCQ[] = [];

  if (lines.length < 2) {
    return {
      success: false,
      totalRows: lines.length,
      validCount: 0,
      errorCount: 1,
      questions: [],
      errors: [
        {
          rowNumber: 1,
          field: "Header",
          message: "CSV must contain a header row followed by at least one valid question row.",
        },
      ],
    };
  }

  // Parse header
  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  
  // Validate data rows
  for (let r = 1; r < lines.length; r++) {
    const rowNumber = r + 1;
    const cells = parseCSVLine(lines[r]);

    if (cells.length < 9) {
      errors.push({
        rowNumber,
        field: "Row Format",
        message: `Expected at least 9 columns, found ${cells.length}. Check for missing commas.`,
      });
      continue;
    }

    const subjectCode = cells[0];
    const topicSlug = cells[1] || "general";
    const yearSource = cells[2] || "University Past Paper";
    const questionText = cells[3];
    const optA = cells[4];
    const optB = cells[5];
    const optC = cells[6];
    const optD = cells[7];
    const correctLetter = cells[8]?.toUpperCase().trim();
    const explanation = cells[9] || "Standard clinical past-paper question.";
    const difficultyRaw = cells[10] || "Medium";

    let hasRowError = false;

    if (!questionText || questionText.length < 8) {
      errors.push({
        rowNumber,
        field: "QuestionText",
        message: "Question stem is too short or empty.",
      });
      hasRowError = true;
    }

    if (!optA || !optB || !optC || !optD) {
      errors.push({
        rowNumber,
        field: "Options",
        message: "All 4 options (A, B, C, D) must be filled.",
      });
      hasRowError = true;
    }

    const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, "0": 0, "1": 1, "2": 2, "3": 3 };
    if (!(correctLetter in letterMap)) {
      errors.push({
        rowNumber,
        field: "CorrectOptionLetter",
        message: `Invalid correct option '${cells[8]}'. Must be A, B, C, or D.`,
      });
      hasRowError = true;
    }

    let difficulty: "Easy" | "Medium" | "Hard" = "Medium";
    if (difficultyRaw.toLowerCase().includes("easy")) difficulty = "Easy";
    else if (difficultyRaw.toLowerCase().includes("hard")) difficulty = "Hard";

    if (!hasRowError) {
      // Determine subject ID from code
      let subjectId = "pharm";
      const codeUpper = subjectCode.toUpperCase();
      if (codeUpper.includes("PATH")) subjectId = "path";
      else if (codeUpper.includes("MICR")) subjectId = "micro";
      else if (codeUpper.includes("DMAT") || codeUpper.includes("MAT")) subjectId = "dmat";

      validQuestions.push({
        id: `csv-q-${Date.now()}-${r}`,
        subjectId,
        topicId: topicSlug,
        yearSource,
        question: questionText,
        options: [optA, optB, optC, optD],
        correctIndex: letterMap[correctLetter],
        explanation,
        difficulty,
        isPastPaper: true,
      });
    }
  }

  return {
    success: errors.length === 0,
    totalRows: lines.length - 1,
    validCount: validQuestions.length,
    errorCount: errors.length,
    questions: validQuestions,
    errors,
  };
}
