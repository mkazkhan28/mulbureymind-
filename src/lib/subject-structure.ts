/**
 * Subject hub structure
 * ---------------------
 * Defines how a subject's page is organised:
 *   Textbooks · Course Outline · PPTs (Combined – all colleges | DDC) · sub-subjects (areas)
 *
 * To add content, fill in the arrays below. Every file is a Google Drive file shared as
 * "Anyone with the link → Viewer"; paste the link or just its ID into `drive`.
 * `area` (optional) tags a PPT with one of the subject's areas so it also appears on that area's page.
 */

export type CollegeGroup = "combined" | "ddc";

export interface StudyFile {
  id: string;
  title: string;
  /** Google Drive link or file ID */
  drive?: string;
  type?: "PPTX" | "PDF" | "DOCX";
  /** Slug of the area this file belongs to (e.g. "embryology") */
  area?: string;
  /** Lecturer / source, shown under the title */
  by?: string;
  isPremium?: boolean;
}

export interface SubjectArea {
  slug: string;
  title: string;
  /** lucide-react icon name, mapped in the UI */
  icon: "Sprout" | "Microscope" | "Brain" | "ScanFace" | "Bone" | "HeartPulse";
  summary: string;
  topics: string[];
}

export interface SubjectStructure {
  subjectSlug: string;
  /** Short label used in breadcrumbs and headings, e.g. "Anatomy" */
  shortName: string;
  /** Subject id used by the textbook library (lib/books.ts) */
  bookSubjectId: string;
  courseOutline: StudyFile[];
  ppts: Record<CollegeGroup, StudyFile[]>;
  areas: SubjectArea[];
}

export const PPT_GROUPS: { key: CollegeGroup; slug: string; title: string; short: string; description: string }[] = [
  {
    key: "combined",
    slug: "ppts-combined",
    title: "Combined PPTs — all colleges",
    short: "Combined (all colleges)",
    description: "Lecture slides collected from DIKIOHS, DDC, DIDC and other DUHS-affiliated colleges, merged into one set.",
  },
  {
    key: "ddc",
    slug: "ppts-ddc",
    title: "DDC PPTs",
    short: "DDC only",
    description: "Lecture slides taught at Dow Dental College (DDC), kept separately in the order they are taught.",
  },
];

export const SUBJECT_STRUCTURES: Record<string, SubjectStructure> = {
  anatomy: {
    subjectSlug: "anatomy",
    shortName: "Anatomy",
    bookSubjectId: "anat",
    courseOutline: [
      // { id: "anat-outline-1", title: "DUHS BDS 1st Year Anatomy Course Outline 2025–26", drive: "<drive link>", type: "PDF" },
    ],
    ppts: {
      combined: [
        // { id: "anat-c-1", title: "Development of the Face", drive: "<drive link>", type: "PPTX", area: "embryology" },
      ],
      ddc: [
        // { id: "anat-d-1", title: "Epithelium", drive: "<drive link>", type: "PPTX", area: "histology", by: "DDC Anatomy Dept." },
      ],
    },
    areas: [
      {
        slug: "embryology",
        title: "Embryology",
        icon: "Sprout",
        summary: "How the body and the face develop, from fertilisation to the pharyngeal arches.",
        topics: ["Gametogenesis & fertilisation", "Germ layers & folding", "Pharyngeal arches & pouches", "Development of face & palate", "Development of tongue & thyroid"],
      },
      {
        slug: "histology",
        title: "Histology",
        icon: "Microscope",
        summary: "The basic tissues of the body as seen under the microscope.",
        topics: ["Epithelium & glands", "Connective tissue", "Cartilage & bone", "Muscle tissue", "Nervous tissue", "Lymphoid organs"],
      },
      {
        slug: "neuroanatomy",
        title: "Neuroanatomy",
        icon: "Brain",
        summary: "The brain, spinal cord and cranial nerves — structure, tracts and blood supply.",
        topics: ["Spinal cord & tracts", "Brainstem", "Cranial nerve nuclei", "Cerebellum", "Cerebrum & ventricles", "Blood supply of brain"],
      },
      {
        slug: "head-and-neck",
        title: "Head & Neck",
        icon: "ScanFace",
        summary: "The core of dental anatomy: skull, face, neck, TMJ and the oral region.",
        topics: ["Skull & mandible", "Scalp & face", "Triangles of the neck", "TMJ & muscles of mastication", "Oral cavity, pharynx & larynx", "Cranial nerves V & VII"],
      },
      {
        slug: "general-anatomy",
        title: "General Anatomy",
        icon: "Bone",
        summary: "Terminology and the building blocks: bones, joints, muscles, vessels and skin.",
        topics: ["Anatomical terminology", "Bones & joints", "Muscles", "Cardiovascular & lymphatic system", "Skin & fascia"],
      },
      {
        slug: "thorax-and-abdomen",
        title: "Thorax & Abdomen",
        icon: "HeartPulse",
        summary: "Thoracic wall, heart and lungs, and the abdominal wall and viscera.",
        topics: ["Thoracic wall & diaphragm", "Lungs & pleura", "Heart & mediastinum", "Abdominal wall", "GI tract & viscera"],
      },
    ],
  },
};

export const getSubjectStructure = (slug?: string) => (slug ? SUBJECT_STRUCTURES[slug] : undefined);

/** Fixed sections every structured subject has (besides its areas). */
export const CORE_SECTIONS = [
  { slug: "textbooks", title: "Textbooks" },
  { slug: "course-outline", title: "Course Outline" },
  ...PPT_GROUPS.map((g) => ({ slug: g.slug, title: g.title })),
];
