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
        // Neuroanatomy — lecture slides (converted to PDF so they open in the reader)
        { id: "anat-neuro-01", title: "Nervous System: Introduction", pdf: "/files/anatomy/neuroanatomy/01-nervous-system.pdf", pages: 22, type: "PPTX", area: "neuroanatomy", topic: "Introduction & Neurons", by: "Nazia Shahab" },
        { id: "anat-neuro-02", title: "Divisions of the Nervous System: CNS & PNS — Part 1", pdf: "/files/anatomy/neuroanatomy/02-nervous-system-divisions-1.pdf", pages: 20, type: "PPTX", area: "neuroanatomy", topic: "Introduction & Neurons" },
        { id: "anat-neuro-03", title: "Divisions of the Nervous System: CNS & PNS — Part 2", pdf: "/files/anatomy/neuroanatomy/03-nervous-system-divisions-2.pdf", pages: 25, type: "PPTX", area: "neuroanatomy", topic: "Introduction & Neurons" },
        { id: "anat-neuro-04", title: "Neurobiology of the Neuron", pdf: "/files/anatomy/neuroanatomy/04-neurobiology-of-neuron.pdf", pages: 18, type: "PPTX", area: "neuroanatomy", topic: "Introduction & Neurons", by: "Nazia Shahab" },
        { id: "anat-neuro-05", title: "Histology Revisit: Neurons & Neuroglia", pdf: "/files/anatomy/neuroanatomy/05-neurons-and-neuroglia-histology.pdf", pages: 36, type: "PPTX", area: "neuroanatomy", topic: "Introduction & Neurons" },
        { id: "anat-neuro-06", title: "Spinal Cord II", pdf: "/files/anatomy/neuroanatomy/06-spinal-cord-ii.pdf", pages: 43, type: "PPTX", area: "neuroanatomy", topic: "Spinal Cord" },
        { id: "anat-neuro-07", title: "Ascending Spinal Tracts", pdf: "/files/anatomy/neuroanatomy/07-ascending-spinal-tracts.pdf", pages: 29, type: "PPTX", area: "neuroanatomy", topic: "Spinal Cord" },
        { id: "anat-neuro-08", title: "Sensory & Motor Tracts of the Spinal Cord", pdf: "/files/anatomy/neuroanatomy/08-spinal-cord-sensory-motor-tracts.pdf", pages: 38, type: "PPTX", area: "neuroanatomy", topic: "Spinal Cord" },
        { id: "anat-neuro-09", title: "Brainstem & Associated Lesions: Pons", pdf: "/files/anatomy/neuroanatomy/09-brainstem-pons.pdf", pages: 23, type: "PPTX", area: "neuroanatomy", topic: "Brainstem & Cerebellum" },
        { id: "anat-neuro-10", title: "Cerebellum", pdf: "/files/anatomy/neuroanatomy/10-cerebellum.pdf", pages: 35, type: "PPTX", area: "neuroanatomy", topic: "Brainstem & Cerebellum" },
        { id: "anat-neuro-11", title: "Cerebellum (alternate slides)", pdf: "/files/anatomy/neuroanatomy/11-cerebellum-alt.pdf", pages: 34, type: "PPTX", area: "neuroanatomy", topic: "Brainstem & Cerebellum" },
        { id: "anat-neuro-12", title: "The Diencephalon", pdf: "/files/anatomy/neuroanatomy/12-diencephalon.pdf", pages: 66, type: "PPTX", area: "neuroanatomy", topic: "Diencephalon" },
        { id: "anat-neuro-13", title: "Diencephalon I: Thalamus", pdf: "/files/anatomy/neuroanatomy/13-diencephalon-i-thalamus.pdf", pages: 33, type: "PPTX", area: "neuroanatomy", topic: "Diencephalon" },
        { id: "anat-neuro-14", title: "Diencephalon II: Epithalamus, Subthalamus & Third Ventricle", pdf: "/files/anatomy/neuroanatomy/14-diencephalon-ii-epithalamus-subthalamus.pdf", pages: 18, type: "PPTX", area: "neuroanatomy", topic: "Diencephalon" },
        { id: "anat-neuro-15", title: "Cerebral Hemispheres: Surfaces, Lobes, Sulci & Gyri", pdf: "/files/anatomy/neuroanatomy/15-cerebral-hemispheres-surfaces-lobes.pdf", pages: 24, type: "PPTX", area: "neuroanatomy", topic: "Cerebrum" },
        { id: "anat-neuro-16", title: "Microscopic Anatomy of the Cerebral Cortex", pdf: "/files/anatomy/neuroanatomy/16-cerebral-cortex-microscopic.pdf", pages: 9, type: "PPTX", area: "neuroanatomy", topic: "Cerebrum" },
        { id: "anat-neuro-17", title: "Basal Ganglia (tutorial)", pdf: "/files/anatomy/neuroanatomy/17-basal-ganglia.pdf", pages: 43, type: "PPTX", area: "neuroanatomy", topic: "Cerebrum" },
        { id: "anat-neuro-18", title: "Limbic System", pdf: "/files/anatomy/neuroanatomy/18-limbic-system.pdf", pages: 15, type: "PPTX", area: "neuroanatomy", topic: "Cerebrum" },
        { id: "anat-neuro-19", title: "Ventricular System", pdf: "/files/anatomy/neuroanatomy/19-ventricular-system.pdf", pages: 21, type: "PPTX", area: "neuroanatomy", topic: "Ventricles & Meninges" },
        { id: "anat-neuro-20", title: "Lateral & Third Ventricles", pdf: "/files/anatomy/neuroanatomy/20-lateral-and-third-ventricles.pdf", pages: 18, type: "PPTX", area: "neuroanatomy", topic: "Ventricles & Meninges", by: "Prof. Saeed Abuel Makarem" },
        { id: "anat-neuro-21", title: "Meninges & Dural Venous Sinuses", pdf: "/files/anatomy/neuroanatomy/21-meninges-dural-sinuses.pdf", pages: 40, type: "PPTX", area: "neuroanatomy", topic: "Ventricles & Meninges" },
        { id: "anat-neuro-22", title: "Cranial Nerves I, III, IV & VI", pdf: "/files/anatomy/neuroanatomy/22-cranial-nerves-1-3-4-6.pdf", pages: 11, type: "PPTX", area: "neuroanatomy", topic: "Cranial Nerves" },
        { id: "anat-neuro-23", title: "Trigeminal Nerve (CN V)", pdf: "/files/anatomy/neuroanatomy/23-trigeminal-nerve.pdf", pages: 18, type: "PPTX", area: "neuroanatomy", topic: "Cranial Nerves" },
        { id: "anat-neuro-24", title: "Facial Nerve (CN VII)", pdf: "/files/anatomy/neuroanatomy/24-facial-nerve.pdf", pages: 14, type: "PPTX", area: "neuroanatomy", topic: "Cranial Nerves" },
        { id: "anat-neuro-25", title: "The Cranial Nerves: Overview", pdf: "/files/anatomy/neuroanatomy/25-cranial-nerves-overview.pdf", pages: 66, type: "PPTX", area: "neuroanatomy", topic: "Cranial Nerves" },
        { id: "anat-neuro-26", title: "Vagus Nerve (CN X)", pdf: "/files/anatomy/neuroanatomy/26-vagus-nerve.pdf", pages: 26, type: "PPTX", area: "neuroanatomy", topic: "Cranial Nerves" },
        // Head & Neck — lecture slides (converted to PDF so they open in the reader)
        { id: "anat-hn-01", title: "Scalp", pdf: "/files/anatomy/head-and-neck/01-scalp.pdf", pages: 29, type: "PPTX", area: "head-and-neck", topic: "Scalp, Neck & Vessels" },
        { id: "anat-hn-02", title: "Cervical Vertebrae", pdf: "/files/anatomy/head-and-neck/02-cervical-vertebrae.pdf", pages: 28, type: "PPTX", area: "head-and-neck", topic: "Scalp, Neck & Vessels" },
        { id: "anat-hn-03", title: "Veins & Lymphatics of the Head & Neck", pdf: "/files/anatomy/head-and-neck/03-veins-and-lymphatics.pdf", pages: 33, type: "PPTX", area: "head-and-neck", topic: "Scalp, Neck & Vessels" },
        { id: "anat-hn-04", title: "External Nose & Bony Boundaries of the Nasal Cavity", pdf: "/files/anatomy/head-and-neck/04-external-nose-nasal-cavity.pdf", pages: 22, type: "PPTX", area: "head-and-neck", topic: "Nose, Sinuses & Pterygopalatine Fossa" },
        { id: "anat-hn-05", title: "Paranasal Sinuses", pdf: "/files/anatomy/head-and-neck/05-paranasal-sinuses.pdf", pages: 23, type: "PPTX", area: "head-and-neck", topic: "Nose, Sinuses & Pterygopalatine Fossa" },
        { id: "anat-hn-06", title: "Pterygopalatine Fossa & Ganglion", pdf: "/files/anatomy/head-and-neck/06-pterygopalatine-fossa-ganglion.pdf", pages: 36, type: "PPTX", area: "head-and-neck", topic: "Nose, Sinuses & Pterygopalatine Fossa" },
        { id: "anat-hn-07", title: "Pterygopalatine Fossa (alternate slides)", pdf: "/files/anatomy/head-and-neck/07-pterygopalatine-fossa-alt.pdf", pages: 43, type: "PPTX", area: "head-and-neck", topic: "Nose, Sinuses & Pterygopalatine Fossa" },
        { id: "anat-hn-08", title: "Gross Anatomy of the Tongue", pdf: "/files/anatomy/head-and-neck/08-tongue-gross.pdf", pages: 11, type: "PPTX", area: "head-and-neck", topic: "Tongue" },
        { id: "anat-hn-09", title: "Histology of the Tongue", pdf: "/files/anatomy/head-and-neck/09-tongue-histology.pdf", pages: 30, type: "PPTX", area: "head-and-neck", topic: "Tongue", by: "Dr. Sarwat Jabeen" },
        { id: "anat-hn-10", title: "Larynx", pdf: "/files/anatomy/head-and-neck/10-larynx.pdf", pages: 35, type: "PPTX", area: "head-and-neck", topic: "Larynx & Respiratory Tract" },
        { id: "anat-hn-11", title: "Larynx, Trachea & Bronchi", pdf: "/files/anatomy/head-and-neck/11-larynx-trachea-bronchi.pdf", pages: 26, type: "PPTX", area: "head-and-neck", topic: "Larynx & Respiratory Tract" },
        { id: "anat-hn-12", title: "Histology of the Respiratory System", pdf: "/files/anatomy/head-and-neck/12-respiratory-system-histology.pdf", pages: 47, type: "PPTX", area: "head-and-neck", topic: "Larynx & Respiratory Tract" },
        { id: "anat-hn-13", title: "The Eye & Orbit", pdf: "/files/anatomy/head-and-neck/13-eye-and-orbit.pdf", pages: 29, type: "PPTX", area: "head-and-neck", topic: "Eye & Orbit" },
        { id: "anat-hn-14", title: "Eyelids, Lacrimal Apparatus & Ciliary Ganglion", pdf: "/files/anatomy/head-and-neck/14-eyelids-lacrimal-ciliary-ganglion.pdf", pages: 24, type: "PPTX", area: "head-and-neck", topic: "Eye & Orbit" },
        { id: "anat-hn-15", title: "Histology of Eyelids, Conjunctiva & Lacrimal Apparatus", pdf: "/files/anatomy/head-and-neck/15-eyelids-lacrimal-histology.pdf", pages: 17, type: "PPTX", area: "head-and-neck", topic: "Eye & Orbit" },
        { id: "anat-hn-16", title: "Gross Anatomy & Histology of the Eye", pdf: "/files/anatomy/head-and-neck/16-eye-gross-and-histology.pdf", pages: 72, type: "PPTX", area: "head-and-neck", topic: "Eye & Orbit" },
        { id: "anat-hn-17", title: "Anatomy of the Ear", pdf: "/files/anatomy/head-and-neck/17-ear-anatomy.pdf", pages: 92, type: "PPTX", area: "head-and-neck", topic: "Ear" },
        { id: "anat-hn-18", title: "Internal Ear", pdf: "/files/anatomy/head-and-neck/18-internal-ear.pdf", pages: 25, type: "PPTX", area: "head-and-neck", topic: "Ear" },
        { id: "anat-hn-19", title: "Derivatives of Pharyngeal Arches & Pouches", pdf: "/files/anatomy/head-and-neck/19-pharyngeal-arches-pouches.pdf", pages: 39, type: "PPTX", area: "head-and-neck", topic: "Development" },
        { id: "anat-hn-20", title: "Development of the Eye", pdf: "/files/anatomy/head-and-neck/20-development-of-eye.pdf", pages: 31, type: "PPTX", area: "head-and-neck", topic: "Development" },
        { id: "anat-hn-21", title: "Development of the Nose & Nasal Cavity", pdf: "/files/anatomy/head-and-neck/21-development-of-nose.pdf", pages: 26, type: "PPTX", area: "head-and-neck", topic: "Development" },
        { id: "anat-hn-22", title: "Pituitary Gland: Gross Anatomy & Development", pdf: "/files/anatomy/head-and-neck/22-pituitary-gross-development.pdf", pages: 29, type: "PPTX", area: "head-and-neck", topic: "Pituitary" },
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
