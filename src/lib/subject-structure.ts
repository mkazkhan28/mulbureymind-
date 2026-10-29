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
  /** PDF hosted with the site (e.g. "/files/anatomy/...pdf"). Opens in the in-site reader with highlights & notes. */
  pdf?: string;
  /** Number of slides/pages, shown in lists */
  pages?: number;
  /** Topic heading inside an area, e.g. "Bones" */
  topic?: string;
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
        // General Anatomy — DUHS lecture slides (converted to PDF so they open in the reader)
        { id: "anat-ga-01", title: "Terminologies: Anatomical Positions, Planes & Terms of Position", pdf: "/files/anatomy/general-anatomy/01-terminologies-positions-planes.pdf", pages: 25, type: "PPTX", area: "general-anatomy", topic: "Introduction" },
        { id: "anat-ga-02", title: "Terms of Movement", pdf: "/files/anatomy/general-anatomy/02-terms-of-movement.pdf", pages: 24, type: "PPTX", area: "general-anatomy", topic: "Introduction" },
        { id: "anat-ga-03", title: "Bones: Divisions & Functions of the Skeletal System", pdf: "/files/anatomy/general-anatomy/03-bones-divisions-functions.pdf", pages: 27, type: "PPTX", area: "general-anatomy", topic: "Bones" },
        { id: "anat-ga-04", title: "Classification & Histology of Bone", pdf: "/files/anatomy/general-anatomy/04-bone-classification-histology.pdf", pages: 29, type: "PPTX", area: "general-anatomy", topic: "Bones", by: "Dr. Sara Moeen" },
        { id: "anat-ga-05", title: "Bone Tissue & the Skeletal System", pdf: "/files/anatomy/general-anatomy/05-bone-tissue-skeletal-system.pdf", pages: 42, type: "PPTX", area: "general-anatomy", topic: "Bones" },
        { id: "anat-ga-06", title: "Bone Development (Ossification) & Blood Supply", pdf: "/files/anatomy/general-anatomy/06-bone-ossification-blood-supply.pdf", pages: 25, type: "PPTX", area: "general-anatomy", topic: "Bones" },
        { id: "anat-ga-07", title: "Cartilage", pdf: "/files/anatomy/general-anatomy/07-cartilage.pdf", pages: 66, type: "PPTX", area: "general-anatomy", topic: "Cartilage" },
        { id: "anat-ga-08", title: "General Concepts of Joints", pdf: "/files/anatomy/general-anatomy/08-joints-general-concepts.pdf", pages: 24, type: "PPTX", area: "general-anatomy", topic: "Joints" },
        { id: "anat-ga-09", title: "General Concepts of Muscles", pdf: "/files/anatomy/general-anatomy/09-muscles-general-concepts.pdf", pages: 28, type: "PPTX", area: "general-anatomy", topic: "Muscles" },
        { id: "anat-ga-10", title: "Smooth & Cardiac Muscle", pdf: "/files/anatomy/general-anatomy/10-smooth-cardiac-muscle.pdf", pages: 36, type: "PPTX", area: "general-anatomy", topic: "Muscles" },
        { id: "anat-ga-11", title: "Physiology of Smooth Muscle", pdf: "/files/anatomy/general-anatomy/11-smooth-muscle-physiology.pdf", pages: 65, type: "PPTX", area: "general-anatomy", topic: "Muscles" },
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

/** Finds a study file (lecture, outline) by id across all subjects — used by the reader. */
export function findStudyFile(id: string): { file: StudyFile; subjectSlug: string } | undefined {
  for (const st of Object.values(SUBJECT_STRUCTURES)) {
    for (const f of [...st.courseOutline, ...st.ppts.combined, ...st.ppts.ddc]) if (f.id === id) return { file: f, subjectSlug: st.subjectSlug };
  }
  return undefined;
}

export const getSubjectStructure = (slug?: string) => (slug ? SUBJECT_STRUCTURES[slug] : undefined);

/** Fixed sections every structured subject has (besides its areas). */
export const CORE_SECTIONS = [
  { slug: "textbooks", title: "Textbooks" },
  { slug: "course-outline", title: "Course Outline" },
  ...PPT_GROUPS.map((g) => ({ slug: g.slug, title: g.title })),
];
