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
  /** Other areas this file is also listed in (e.g. development lectures shown in Head & Neck too) */
  alsoIn?: string[];
  /** Topic to file it under when shown in an `alsoIn` area (defaults to `topic`) */
  linkTopic?: string;
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
  /** lucide-react icon name (unused by the current UI; illustrations come from AreaArt) */
  icon?: "Sprout" | "Microscope" | "Brain" | "ScanFace" | "Bone" | "HeartPulse";
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
        { id: "anat-ga-04", title: "Classification & Histology of Bone", pdf: "/files/anatomy/general-anatomy/04-bone-classification-histology.pdf", pages: 29, type: "PPTX", area: "general-anatomy", topic: "Bones", by: "Dr. Sara Moeen", alsoIn: ["histology"], linkTopic: "Bone & Muscle" },
        { id: "anat-ga-05", title: "Bone Tissue & the Skeletal System", pdf: "/files/anatomy/general-anatomy/05-bone-tissue-skeletal-system.pdf", pages: 42, type: "PPTX", area: "general-anatomy", topic: "Bones" },
        { id: "anat-ga-06", title: "Bone Development (Ossification) & Blood Supply", pdf: "/files/anatomy/general-anatomy/06-bone-ossification-blood-supply.pdf", pages: 25, type: "PPTX", area: "general-anatomy", topic: "Bones" },
        { id: "anat-ga-07", title: "Cartilage", pdf: "/files/anatomy/general-anatomy/07-cartilage.pdf", pages: 66, type: "PPTX", area: "general-anatomy", topic: "Cartilage", alsoIn: ["histology"], linkTopic: "Connective Tissue" },
        { id: "anat-ga-08", title: "General Concepts of Joints", pdf: "/files/anatomy/general-anatomy/08-joints-general-concepts.pdf", pages: 24, type: "PPTX", area: "general-anatomy", topic: "Joints" },
        { id: "anat-ga-09", title: "General Concepts of Muscles", pdf: "/files/anatomy/general-anatomy/09-muscles-general-concepts.pdf", pages: 28, type: "PPTX", area: "general-anatomy", topic: "Muscles" },
        { id: "anat-ga-10", title: "Smooth & Cardiac Muscle", pdf: "/files/anatomy/general-anatomy/10-smooth-cardiac-muscle.pdf", pages: 36, type: "PPTX", area: "general-anatomy", topic: "Muscles" },
        { id: "anat-ga-11", title: "Physiology of Smooth Muscle", pdf: "/files/anatomy/general-anatomy/11-smooth-muscle-physiology.pdf", pages: 65, type: "PPTX", area: "general-anatomy", topic: "Muscles" },
        // Neuroanatomy — lecture slides (converted to PDF so they open in the reader)
        { id: "anat-neuro-01", title: "Nervous System: Introduction", pdf: "/files/anatomy/neuroanatomy/01-nervous-system.pdf", pages: 22, type: "PPTX", area: "neuroanatomy", topic: "Introduction & Neurons", by: "Nazia Shahab" },
        { id: "anat-neuro-02", title: "Divisions of the Nervous System: CNS & PNS — Part 1", pdf: "/files/anatomy/neuroanatomy/02-nervous-system-divisions-1.pdf", pages: 20, type: "PPTX", area: "neuroanatomy", topic: "Introduction & Neurons" },
        { id: "anat-neuro-03", title: "Divisions of the Nervous System: CNS & PNS — Part 2", pdf: "/files/anatomy/neuroanatomy/03-nervous-system-divisions-2.pdf", pages: 25, type: "PPTX", area: "neuroanatomy", topic: "Introduction & Neurons" },
        { id: "anat-neuro-04", title: "Neurobiology of the Neuron", pdf: "/files/anatomy/neuroanatomy/04-neurobiology-of-neuron.pdf", pages: 18, type: "PPTX", area: "neuroanatomy", topic: "Introduction & Neurons", by: "Nazia Shahab" },
        { id: "anat-neuro-05", title: "Histology Revisit: Neurons & Neuroglia", pdf: "/files/anatomy/neuroanatomy/05-neurons-and-neuroglia-histology.pdf", pages: 36, type: "PPTX", area: "neuroanatomy", topic: "Introduction & Neurons", alsoIn: ["histology"], linkTopic: "Nervous Tissue" },
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
        { id: "anat-neuro-16", title: "Microscopic Anatomy of the Cerebral Cortex", pdf: "/files/anatomy/neuroanatomy/16-cerebral-cortex-microscopic.pdf", pages: 9, type: "PPTX", area: "neuroanatomy", topic: "Cerebrum", alsoIn: ["histology"], linkTopic: "Nervous Tissue" },
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
        { id: "anat-hn-09", title: "Histology of the Tongue", pdf: "/files/anatomy/head-and-neck/09-tongue-histology.pdf", pages: 30, type: "PPTX", area: "head-and-neck", topic: "Tongue", by: "Dr. Sarwat Jabeen", alsoIn: ["histology"], linkTopic: "Oral Cavity & Special Senses" },
        { id: "anat-hn-10", title: "Larynx", pdf: "/files/anatomy/head-and-neck/10-larynx.pdf", pages: 35, type: "PPTX", area: "head-and-neck", topic: "Larynx & Respiratory Tract" },
        { id: "anat-hn-11", title: "Larynx, Trachea & Bronchi", pdf: "/files/anatomy/head-and-neck/11-larynx-trachea-bronchi.pdf", pages: 26, type: "PPTX", area: "head-and-neck", topic: "Larynx & Respiratory Tract" },
        { id: "anat-hn-12", title: "Histology of the Respiratory System", pdf: "/files/anatomy/head-and-neck/12-respiratory-system-histology.pdf", pages: 47, type: "PPTX", area: "head-and-neck", topic: "Larynx & Respiratory Tract", alsoIn: ["histology"], linkTopic: "Respiratory System" },
        { id: "anat-hn-13", title: "The Eye & Orbit", pdf: "/files/anatomy/head-and-neck/13-eye-and-orbit.pdf", pages: 29, type: "PPTX", area: "head-and-neck", topic: "Eye & Orbit" },
        { id: "anat-hn-14", title: "Eyelids, Lacrimal Apparatus & Ciliary Ganglion", pdf: "/files/anatomy/head-and-neck/14-eyelids-lacrimal-ciliary-ganglion.pdf", pages: 24, type: "PPTX", area: "head-and-neck", topic: "Eye & Orbit" },
        { id: "anat-hn-15", title: "Histology of Eyelids, Conjunctiva & Lacrimal Apparatus", pdf: "/files/anatomy/head-and-neck/15-eyelids-lacrimal-histology.pdf", pages: 17, type: "PPTX", area: "head-and-neck", topic: "Eye & Orbit", alsoIn: ["histology"], linkTopic: "Oral Cavity & Special Senses" },
        { id: "anat-hn-16", title: "Gross Anatomy & Histology of the Eye", pdf: "/files/anatomy/head-and-neck/16-eye-gross-and-histology.pdf", pages: 72, type: "PPTX", area: "head-and-neck", topic: "Eye & Orbit" },
        { id: "anat-hn-17", title: "Anatomy of the Ear", pdf: "/files/anatomy/head-and-neck/17-ear-anatomy.pdf", pages: 92, type: "PPTX", area: "head-and-neck", topic: "Ear" },
        { id: "anat-hn-18", title: "Internal Ear", pdf: "/files/anatomy/head-and-neck/18-internal-ear.pdf", pages: 25, type: "PPTX", area: "head-and-neck", topic: "Ear" },
        { id: "anat-hn-22", title: "Pituitary Gland: Gross Anatomy & Development", pdf: "/files/anatomy/head-and-neck/22-pituitary-gross-development.pdf", pages: 29, type: "PPTX", area: "head-and-neck", topic: "Pituitary" },
        // Embryology — lecture slides (converted to PDF so they open in the reader)
        { id: "anat-emb-01", title: "Female Reproductive System", pdf: "/files/anatomy/embryology/01-female-reproductive-system.pdf", pages: 19, type: "PPTX", area: "embryology", topic: "Reproductive System & Cycles" },
        { id: "anat-emb-02", title: "Menstrual Cycle", pdf: "/files/anatomy/embryology/02-menstrual-cycle.pdf", pages: 21, type: "PPTX", area: "embryology", topic: "Reproductive System & Cycles" },
        { id: "anat-emb-03", title: "Ovarian Cycle", pdf: "/files/anatomy/embryology/03-ovarian-cycle.pdf", pages: 17, type: "PPTX", area: "embryology", topic: "Reproductive System & Cycles" },
        { id: "anat-emb-04", title: "Gametogenesis: Spermatogenesis & Spermiogenesis", pdf: "/files/anatomy/embryology/04-spermatogenesis-spermiogenesis.pdf", pages: 23, type: "PPTX", area: "embryology", topic: "Gametogenesis & Fertilisation" },
        { id: "anat-emb-05", title: "Oogenesis & Comparison of Gametes", pdf: "/files/anatomy/embryology/05-oogenesis-comparison-of-gametes.pdf", pages: 20, type: "PPTX", area: "embryology", topic: "Gametogenesis & Fertilisation" },
        { id: "anat-emb-06", title: "Fertilisation", pdf: "/files/anatomy/embryology/06-fertilization.pdf", pages: 25, type: "PPTX", area: "embryology", topic: "Gametogenesis & Fertilisation" },
        { id: "anat-emb-07", title: "First Week of Development", pdf: "/files/anatomy/embryology/07-first-week.pdf", pages: 20, type: "PPTX", area: "embryology", topic: "Gametogenesis & Fertilisation" },
        { id: "anat-emb-08", title: "Second Week of Development", pdf: "/files/anatomy/embryology/08-second-week.pdf", pages: 26, type: "PPTX", area: "embryology", topic: "Weeks 2–4" },
        { id: "anat-emb-09", title: "Third Week I: Gastrulation & Primitive Streak", pdf: "/files/anatomy/embryology/09-third-week-gastrulation.pdf", pages: 29, type: "PPTX", area: "embryology", topic: "Weeks 2–4" },
        { id: "anat-emb-10", title: "Third Week II: Neurulation & Somites", pdf: "/files/anatomy/embryology/10-third-week-neurulation-somites.pdf", pages: 29, type: "PPTX", area: "embryology", topic: "Weeks 2–4" },
        { id: "anat-emb-11", title: "Human Embryology: Weeks 1–4", pdf: "/files/anatomy/embryology/11-weeks-1-to-4.pdf", pages: 40, type: "PPTX", area: "embryology", topic: "Weeks 2–4" },
        { id: "anat-emb-12", title: "Fetal Period (9th Week to Birth)", pdf: "/files/anatomy/embryology/12-fetal-period.pdf", pages: 29, type: "PPTX", area: "embryology", topic: "Fetal Period & Placenta" },
        { id: "anat-emb-13", title: "Placenta & Fetal Membranes", pdf: "/files/anatomy/embryology/13-placenta-fetal-membranes.pdf", pages: 54, type: "PPTX", area: "embryology", topic: "Fetal Period & Placenta", by: "Dr. Sahar Mubeen" },
        { id: "anat-emb-14", title: "Head & Neck Embryology", pdf: "/files/anatomy/embryology/14-head-and-neck-embryology.pdf", pages: 56, type: "PPTX", area: "embryology", topic: "Head & Neck Development", alsoIn: ["head-and-neck"] },
        { id: "anat-emb-15", title: "Development of the Pharyngeal Apparatus", pdf: "/files/anatomy/embryology/15-pharyngeal-apparatus.pdf", pages: 31, type: "PPTX", area: "embryology", topic: "Head & Neck Development", alsoIn: ["head-and-neck"] },
        { id: "anat-hn-19", title: "Derivatives of Pharyngeal Arches & Pouches", pdf: "/files/anatomy/head-and-neck/19-pharyngeal-arches-pouches.pdf", pages: 39, type: "PPTX", area: "embryology", topic: "Head & Neck Development", alsoIn: ["head-and-neck"] },
        { id: "anat-emb-16", title: "Development of the Face & Palate", pdf: "/files/anatomy/embryology/16-face-and-palate.pdf", pages: 23, type: "PPTX", area: "embryology", topic: "Head & Neck Development", alsoIn: ["head-and-neck"], by: "Umm-e-Ayman Akbar" },
        { id: "anat-emb-17", title: "Development of the Face, Nose & Palate", pdf: "/files/anatomy/embryology/17-face-nose-and-palate.pdf", pages: 43, type: "PPTX", area: "embryology", topic: "Head & Neck Development", alsoIn: ["head-and-neck"] },
        { id: "anat-hn-21", title: "Development of the Nose & Nasal Cavity", pdf: "/files/anatomy/head-and-neck/21-development-of-nose.pdf", pages: 26, type: "PPTX", area: "embryology", topic: "Head & Neck Development", alsoIn: ["head-and-neck"] },
        { id: "anat-hn-20", title: "Development of the Eye", pdf: "/files/anatomy/head-and-neck/20-development-of-eye.pdf", pages: 31, type: "PPTX", area: "embryology", topic: "Head & Neck Development", alsoIn: ["head-and-neck"] },
        { id: "anat-emb-18", title: "Development of the Ear", pdf: "/files/anatomy/embryology/18-development-of-ear.pdf", pages: 8, type: "PPTX", area: "embryology", topic: "Head & Neck Development", alsoIn: ["head-and-neck"] },
        { id: "anat-emb-19", title: "Development of the Thyroid & Parathyroid Glands", pdf: "/files/anatomy/embryology/19-thyroid-parathyroid.pdf", pages: 12, type: "PPTX", area: "embryology", topic: "Head & Neck Development", alsoIn: ["head-and-neck"] },
        { id: "anat-emb-20", title: "Nervous System Development", pdf: "/files/anatomy/embryology/20-nervous-system-development.pdf", pages: 15, type: "PPTX", area: "embryology", topic: "Nervous System Development" },
        { id: "anat-emb-21", title: "Clinical Correlates in Embryology", pdf: "/files/anatomy/embryology/21-clinical-correlates.pdf", pages: 15, type: "PPTX", area: "embryology", topic: "Clinical Correlates" },
        // Histology — lecture slides (converted to PDF so they open in the reader)
        { id: "anat-histo-01", title: "Microscopy", pdf: "/files/anatomy/histology/01-microscopy.pdf", pages: 20, type: "PPTX", area: "histology", topic: "Microscopy & the Cell" },
        { id: "anat-histo-02", title: "The Cell: Introduction", pdf: "/files/anatomy/histology/02-the-cell-introduction.pdf", pages: 30, type: "PPTX", area: "histology", topic: "Microscopy & the Cell" },
        { id: "anat-histo-03", title: "Cell Membrane", pdf: "/files/anatomy/histology/03-cell-membrane.pdf", pages: 28, type: "PPTX", area: "histology", topic: "Microscopy & the Cell" },
        { id: "anat-histo-04", title: "Cell Organelles", pdf: "/files/anatomy/histology/04-cell-organelles.pdf", pages: 40, type: "PPTX", area: "histology", topic: "Microscopy & the Cell" },
        { id: "anat-histo-05", title: "Nucleus", pdf: "/files/anatomy/histology/05-nucleus.pdf", pages: 18, type: "PPTX", area: "histology", topic: "Microscopy & the Cell" },
        { id: "anat-histo-06", title: "Epithelium I: Types, Location & Functions", pdf: "/files/anatomy/histology/06-epithelium-i.pdf", pages: 27, type: "PPTX", area: "histology", topic: "Epithelium & Glands" },
        { id: "anat-histo-07", title: "Epithelium II: Types, Location & Functions", pdf: "/files/anatomy/histology/07-epithelium-ii.pdf", pages: 17, type: "PPTX", area: "histology", topic: "Epithelium & Glands" },
        { id: "anat-histo-08", title: "Exocrine Glands & Their Classification", pdf: "/files/anatomy/histology/08-exocrine-glands.pdf", pages: 23, type: "PPTX", area: "histology", topic: "Epithelium & Glands" },
        { id: "anat-histo-09", title: "Histology of Salivary Glands", pdf: "/files/anatomy/histology/09-salivary-glands.pdf", pages: 6, type: "PPTX", area: "histology", topic: "Epithelium & Glands" },
        { id: "anat-histo-10", title: "Connective Tissue: Classification & Types", pdf: "/files/anatomy/histology/10-connective-tissue-classification.pdf", pages: 26, type: "PPTX", area: "histology", topic: "Connective Tissue" },
        { id: "anat-histo-11", title: "Connective Tissue Components", pdf: "/files/anatomy/histology/11-connective-tissue-components.pdf", pages: 39, type: "PPTX", area: "histology", topic: "Connective Tissue" },
        { id: "anat-histo-12", title: "Histology of Muscles", pdf: "/files/anatomy/histology/12-muscle-histology.pdf", pages: 23, type: "PPTX", area: "histology", topic: "Bone & Muscle" },
        { id: "anat-histo-13", title: "Nerve Tissue I: Neurons & Neuroglia", pdf: "/files/anatomy/histology/13-nerve-tissue-neurons-neuroglia.pdf", pages: 14, type: "PPTX", area: "histology", topic: "Nervous Tissue" },
        { id: "anat-histo-14", title: "Histology of the Spinal Cord", pdf: "/files/anatomy/histology/14-spinal-cord-histology.pdf", pages: 8, type: "PPTX", area: "histology", topic: "Nervous Tissue" },
        { id: "anat-histo-15", title: "Histology of the Cerebellar Cortex", pdf: "/files/anatomy/histology/15-cerebellar-cortex.pdf", pages: 9, type: "PPTX", area: "histology", topic: "Nervous Tissue" },
        { id: "anat-histo-16", title: "Histology of Blood Vessels", pdf: "/files/anatomy/histology/16-blood-vessels-histology.pdf", pages: 49, type: "PPTX", area: "histology", topic: "Blood Vessels" },
        { id: "anat-histo-17", title: "Blood Vessels", pdf: "/files/anatomy/histology/17-blood-vessels.pdf", pages: 27, type: "PPTX", area: "histology", topic: "Blood Vessels" },
        { id: "anat-histo-18", title: "Lymphatic System", pdf: "/files/anatomy/histology/18-lymphatic-system.pdf", pages: 32, type: "PPTX", area: "histology", topic: "Lymphoid Organs" },
        { id: "anat-histo-19", title: "Lymphoid Tissue, Lymph Node & Thymus", pdf: "/files/anatomy/histology/19-lymphoid-tissue-lymph-node-thymus.pdf", pages: 27, type: "PPTX", area: "histology", topic: "Lymphoid Organs" },
        { id: "anat-histo-20", title: "Histology of Tonsil & Spleen", pdf: "/files/anatomy/histology/20-tonsil-and-spleen.pdf", pages: 27, type: "PPTX", area: "histology", topic: "Lymphoid Organs" },
        { id: "anat-histo-21", title: "Spleen", pdf: "/files/anatomy/histology/21-spleen.pdf", pages: 13, type: "PPTX", area: "histology", topic: "Lymphoid Organs" },
        { id: "anat-histo-22", title: "Nasal Cavity: Respiratory & Olfactory Epithelium", pdf: "/files/anatomy/histology/22-respiratory-olfactory-epithelium.pdf", pages: 24, type: "PPTX", area: "histology", topic: "Respiratory System", by: "Prof. Khalida Perveen" },
        { id: "anat-histo-23", title: "Respiratory Epithelium & Histology of the Trachea", pdf: "/files/anatomy/histology/23-respiratory-epithelium-trachea.pdf", pages: 35, type: "PPTX", area: "histology", topic: "Respiratory System" },
        { id: "anat-histo-24", title: "Gross Anatomy & Histology of the Lung", pdf: "/files/anatomy/histology/24-lung.pdf", pages: 39, type: "PPTX", area: "histology", topic: "Respiratory System", alsoIn: ["thorax-and-abdomen"], linkTopic: "Pleura & Lungs" },
        { id: "anat-histo-25", title: "Histology of Thyroid & Parathyroid Glands", pdf: "/files/anatomy/histology/25-thyroid-parathyroid-histology.pdf", pages: 7, type: "PPTX", area: "histology", topic: "Endocrine Glands" },
        { id: "anat-histo-26", title: "Thyroid & Parathyroid Glands", pdf: "/files/anatomy/histology/26-thyroid-parathyroid.pdf", pages: 20, type: "PPTX", area: "histology", topic: "Endocrine Glands" },
        { id: "anat-histo-27", title: "Overview of the Urinary System", pdf: "/files/anatomy/histology/27-urinary-system.pdf", pages: 32, type: "PPTX", area: "histology", topic: "Urinary & Reproductive", by: "Dr. Muhammad Rafique" },
        { id: "anat-histo-28", title: "Introduction to the Male Reproductive System", pdf: "/files/anatomy/histology/28-male-reproductive-system.pdf", pages: 35, type: "PPTX", area: "histology", topic: "Urinary & Reproductive" },
        // Thorax & Abdomen — lecture slides (converted to PDF so they open in the reader)
        { id: "anat-ta-01", title: "Overview of the Thorax", pdf: "/files/anatomy/thorax-and-abdomen/01-overview-of-thorax.pdf", pages: 67, type: "PPTX", area: "thorax-and-abdomen", topic: "Overview & Thoracic Wall", by: "Dr. Afsheen Khan" },
        { id: "anat-ta-02", title: "Intercostal Spaces", pdf: "/files/anatomy/thorax-and-abdomen/02-intercostal-spaces.pdf", pages: 33, type: "PPTX", area: "thorax-and-abdomen", topic: "Overview & Thoracic Wall", by: "Babar Ali" },
        { id: "anat-ta-03", title: "Thoracic Wall, Intercostal Spaces & Intercostal Muscles", pdf: "/files/anatomy/thorax-and-abdomen/03-thoracic-wall-intercostal-muscles.pdf", pages: 26, type: "PPTX", area: "thorax-and-abdomen", topic: "Overview & Thoracic Wall" },
        { id: "anat-ta-04", title: "Muscles of the Thoracic Wall: Nerves & Vessels", pdf: "/files/anatomy/thorax-and-abdomen/04-thoracic-wall-nerves-vessels.pdf", pages: 32, type: "PPTX", area: "thorax-and-abdomen", topic: "Overview & Thoracic Wall" },
        { id: "anat-ta-05", title: "Blood Vessels of the Thorax: Descending Aorta & Azygos System", pdf: "/files/anatomy/thorax-and-abdomen/05-thoracic-aorta-azygos.pdf", pages: 29, type: "PPTX", area: "thorax-and-abdomen", topic: "Overview & Thoracic Wall" },
        { id: "anat-ta-06", title: "Pleura", pdf: "/files/anatomy/thorax-and-abdomen/06-pleura.pdf", pages: 36, type: "PPTX", area: "thorax-and-abdomen", topic: "Pleura & Lungs" },
        { id: "anat-ta-07", title: "Lungs & Bronchopulmonary Segments", pdf: "/files/anatomy/thorax-and-abdomen/07-lungs-bronchopulmonary-segments.pdf", pages: 26, type: "PPTX", area: "thorax-and-abdomen", topic: "Pleura & Lungs" },
        { id: "anat-ta-08", title: "Mediastinum", pdf: "/files/anatomy/thorax-and-abdomen/08-mediastinum.pdf", pages: 40, type: "PPTX", area: "thorax-and-abdomen", topic: "Mediastinum" },
        { id: "anat-ta-09", title: "Anterior & Posterior Mediastinum", pdf: "/files/anatomy/thorax-and-abdomen/09-anterior-posterior-mediastinum.pdf", pages: 33, type: "PPTX", area: "thorax-and-abdomen", topic: "Mediastinum" },
        { id: "anat-ta-10", title: "Heart: Overview (Features, Great Vessels & Conducting System)", pdf: "/files/anatomy/thorax-and-abdomen/10-heart-overview.pdf", pages: 68, type: "PPTX", area: "thorax-and-abdomen", topic: "Heart" },
        { id: "anat-ta-11", title: "Pericardium & External Features of the Heart", pdf: "/files/anatomy/thorax-and-abdomen/11-pericardium-external-features.pdf", pages: 33, type: "PPTX", area: "thorax-and-abdomen", topic: "Heart" },
        { id: "anat-ta-12", title: "Position & External Features of the Heart", pdf: "/files/anatomy/thorax-and-abdomen/12-heart-position-external-features.pdf", pages: 32, type: "PPTX", area: "thorax-and-abdomen", topic: "Heart", by: "Dr. Afsheen Khan" },
        { id: "anat-ta-13", title: "Chambers & Internal Features of the Heart", pdf: "/files/anatomy/thorax-and-abdomen/13-heart-chambers-internal-features.pdf", pages: 27, type: "PPTX", area: "thorax-and-abdomen", topic: "Heart" },
        { id: "anat-ta-14", title: "Internal Features of the Heart I", pdf: "/files/anatomy/thorax-and-abdomen/14-heart-internal-features-i.pdf", pages: 19, type: "PPTX", area: "thorax-and-abdomen", topic: "Heart" },
        { id: "anat-ta-15", title: "Internal Features of the Heart II", pdf: "/files/anatomy/thorax-and-abdomen/15-heart-internal-features-ii.pdf", pages: 19, type: "PPTX", area: "thorax-and-abdomen", topic: "Heart" },
        { id: "anat-ta-16", title: "Conducting System, Blood & Nerve Supply of the Heart", pdf: "/files/anatomy/thorax-and-abdomen/16-heart-conducting-system-supply.pdf", pages: 33, type: "PPTX", area: "thorax-and-abdomen", topic: "Heart" },
        { id: "anat-histo-29", title: "Histology of the Kidney", pdf: "/files/anatomy/histology/29-kidney.pdf", pages: 56, type: "PPTX", area: "histology", topic: "Urinary & Reproductive", alsoIn: ["thorax-and-abdomen"], linkTopic: "Abdomen & Urinary System" },
        { id: "anat-histo-30", title: "Thyroid: Gross & Microscopic Anatomy", pdf: "/files/anatomy/histology/30-thyroid-gross-microscopic.pdf", pages: 29, type: "PPTX", area: "histology", topic: "Endocrine Glands" },
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
  biochemistry: {
    subjectSlug: "biochemistry",
    shortName: "Biochemistry",
    bookSubjectId: "biochem",
    courseOutline: [],
    ppts: {
      combined: [
        // Lecture slides and notes from the DUHS colleges (converted to PDF so they open in the reader)
        // Cell, Water & pH
        { id: "bio-cell-01", title: "Biochemical Composition of the Cell", pdf: "/files/biochemistry/cell-water-and-ph/01-biochemical-composition-of-the-cell.pdf", pages: 38, type: "PDF", area: "cell-water-and-ph", topic: "The Cell", by: "Dr. Hasan (DIKIOHS)" },
        { id: "bio-cell-02", title: "The Cell in Relation to Biochemistry", pdf: "/files/biochemistry/cell-water-and-ph/02-the-cell-in-relation-to-biochemistry.pdf", pages: 19, type: "PDF", area: "cell-water-and-ph", topic: "The Cell", by: "Prof. Rukhsana Rubeen" },
        { id: "bio-cell-03", title: "Cell Biology", pdf: "/files/biochemistry/cell-water-and-ph/03-cell-biology.pdf", pages: 73, type: "PDF", area: "cell-water-and-ph", topic: "The Cell", by: "Gandham Rajeev" },
        { id: "bio-cell-04", title: "Organisation of Living Systems: The Macromolecules", pdf: "/files/biochemistry/cell-water-and-ph/04-organisation-of-living-systems-the-macromolecules.pdf", pages: 20, type: "PPTX", area: "cell-water-and-ph", topic: "The Cell" },
        { id: "bio-cell-05", title: "Structure & Properties of Water, Acids, Bases & the Henderson–Hasselbalch Equation", pdf: "/files/biochemistry/cell-water-and-ph/05-structure-and-properties-of-water-acids-bases-and-the-hender.pdf", pages: 31, type: "PPTX", area: "cell-water-and-ph", topic: "Water, pH & Buffers" },
        { id: "bio-cell-06", title: "pH & Buffers", pdf: "/files/biochemistry/cell-water-and-ph/06-ph-and-buffers.pdf", pages: 23, type: "PDF", area: "cell-water-and-ph", topic: "Water, pH & Buffers" },
        { id: "bio-cell-07", title: "Buffers: Mechanism of Action & Biological Buffers", pdf: "/files/biochemistry/cell-water-and-ph/07-buffers-mechanism-of-action-and-biological-buffers.pdf", pages: 33, type: "PPTX", area: "cell-water-and-ph", topic: "Water, pH & Buffers" },
        { id: "bio-cell-08", title: "Sodium & Water Metabolism and Homeostasis", pdf: "/files/biochemistry/cell-water-and-ph/08-sodium-and-water-metabolism-and-homeostasis.pdf", pages: 54, type: "PPTX", area: "cell-water-and-ph", topic: "Water & Electrolytes", by: "Dr. Muhammad Ahsan" },
        { id: "bio-cell-09", title: "Water Metabolism & Electrolyte Balance", pdf: "/files/biochemistry/cell-water-and-ph/09-water-metabolism-and-electrolyte-balance.pdf", pages: 110, type: "PPTX", area: "cell-water-and-ph", topic: "Water & Electrolytes" },
        { id: "bio-cell-10", title: "Solutions", pdf: "/files/biochemistry/cell-water-and-ph/10-solutions.pdf", pages: 26, type: "PPTX", area: "cell-water-and-ph", topic: "Solutions", by: "Dr. Sobia Akhtar" },
        { id: "bio-cell-11", title: "Solutions & Serial Dilutions", pdf: "/files/biochemistry/cell-water-and-ph/11-solutions-and-serial-dilutions.pdf", pages: 54, type: "PPTX", area: "cell-water-and-ph", topic: "Solutions" },
        { id: "bio-cell-12", title: "Cytoskeleton", pdf: "/files/biochemistry/cell-water-and-ph/12-cytoskeleton.pdf", pages: 27, type: "PPTX", area: "cell-water-and-ph", topic: "Cytoskeleton & Extracellular Matrix" },
        { id: "bio-cell-13", title: "Cytoskeleton, Cytoskeletal Junctions & Fibroblasts", pdf: "/files/biochemistry/cell-water-and-ph/13-cytoskeleton-cytoskeletal-junctions-and-fibroblasts.pdf", pages: 14, type: "PPTX", area: "cell-water-and-ph", topic: "Cytoskeleton & Extracellular Matrix", by: "Dr. Farzeen Shafiq" },
        { id: "bio-cell-14", title: "Extracellular Matrix", pdf: "/files/biochemistry/cell-water-and-ph/14-extracellular-matrix.pdf", pages: 34, type: "PPTX", area: "cell-water-and-ph", topic: "Cytoskeleton & Extracellular Matrix", by: "Dr. Muhammad Ahsan" },
        { id: "bio-cell-15", title: "Extracellular Matrix: Proteoglycans", pdf: "/files/biochemistry/cell-water-and-ph/15-extracellular-matrix-proteoglycans.pdf", pages: 27, type: "PPTX", area: "cell-water-and-ph", topic: "Cytoskeleton & Extracellular Matrix" },
        { id: "bio-cell-16", title: "Biochemistry of Connective Tissue: Extracellular Matrix", pdf: "/files/biochemistry/cell-water-and-ph/16-biochemistry-of-connective-tissue-extracellular-matrix.pdf", pages: 97, type: "PDF", area: "cell-water-and-ph", topic: "Cytoskeleton & Extracellular Matrix" },
        // Carbohydrates
        { id: "bio-carb-01", title: "Carbohydrates: Structure, Classification & Functions", pdf: "/files/biochemistry/carbohydrates/01-carbohydrates-structure-classification-and-functions.pdf", pages: 20, type: "PPTX", area: "carbohydrates", topic: "Introduction & Classification" },
        { id: "bio-carb-02", title: "Biochemical Importance of Carbohydrates", pdf: "/files/biochemistry/carbohydrates/02-biochemical-importance-of-carbohydrates.pdf", pages: 15, type: "PPTX", area: "carbohydrates", topic: "Introduction & Classification", by: "Dr. Humaira Aman Ali" },
        { id: "bio-carb-03", title: "Biomedical Importance of Carbohydrates", pdf: "/files/biochemistry/carbohydrates/03-biomedical-importance-of-carbohydrates.pdf", pages: 61, type: "PDF", area: "carbohydrates", topic: "Introduction & Classification" },
        { id: "bio-carb-04", title: "Chemistry of Carbohydrates", pdf: "/files/biochemistry/carbohydrates/04-chemistry-of-carbohydrates.pdf", pages: 99, type: "PDF", area: "carbohydrates", topic: "Introduction & Classification", by: "Gandham Rajeev" },
        { id: "bio-carb-05", title: "Polysaccharides", pdf: "/files/biochemistry/carbohydrates/05-polysaccharides.pdf", pages: 24, type: "PPTX", area: "carbohydrates", topic: "Introduction & Classification" },
        { id: "bio-carb-06", title: "Medicinal Uses of Carbohydrates", pdf: "/files/biochemistry/carbohydrates/06-medicinal-uses-of-carbohydrates.pdf", pages: 59, type: "PPTX", area: "carbohydrates", topic: "Introduction & Classification" },
        { id: "bio-carb-07", title: "Carbohydrates: Digestion, Absorption & Metabolism (Introduction)", pdf: "/files/biochemistry/carbohydrates/07-carbohydrates-digestion-absorption-and-metabolism-introducti.pdf", pages: 33, type: "PPTX", area: "carbohydrates", topic: "Digestion & Absorption" },
        { id: "bio-carb-08", title: "Digestion & Absorption of Carbohydrates", pdf: "/files/biochemistry/carbohydrates/08-digestion-and-absorption-of-carbohydrates.pdf", pages: 41, type: "PPTX", area: "carbohydrates", topic: "Digestion & Absorption" },
        { id: "bio-carb-09", title: "Glycolysis: The Central Pathway of Glucose Degradation", pdf: "/files/biochemistry/carbohydrates/09-glycolysis-the-central-pathway-of-glucose-degradation.pdf", pages: 20, type: "PPTX", area: "carbohydrates", topic: "Glycolysis & Pyruvate", by: "Fatima Noor" },
        { id: "bio-carb-10", title: "Metabolic Pathways: Glycolysis", pdf: "/files/biochemistry/carbohydrates/10-metabolic-pathways-glycolysis.pdf", pages: 26, type: "PPTX", area: "carbohydrates", topic: "Glycolysis & Pyruvate" },
        { id: "bio-carb-11", title: "Glycolysis: Where, Inputs & Outputs", pdf: "/files/biochemistry/carbohydrates/11-glycolysis-where-inputs-and-outputs.pdf", pages: 21, type: "PPTX", area: "carbohydrates", topic: "Glycolysis & Pyruvate" },
        { id: "bio-carb-12", title: "Glycolysis (detailed)", pdf: "/files/biochemistry/carbohydrates/12-glycolysis-detailed.pdf", pages: 53, type: "PDF", area: "carbohydrates", topic: "Glycolysis & Pyruvate", by: "Gandham Rajeev" },
        { id: "bio-carb-13", title: "Fate of Pyruvate: A Quick Review", pdf: "/files/biochemistry/carbohydrates/13-fate-of-pyruvate-a-quick-review.pdf", pages: 40, type: "PDF", area: "carbohydrates", topic: "Glycolysis & Pyruvate", by: "Namrata Chhabra" },
        { id: "bio-carb-14", title: "Citric Acid (Krebs) Cycle", pdf: "/files/biochemistry/carbohydrates/14-citric-acid-krebs-cycle.pdf", pages: 26, type: "PPTX", area: "carbohydrates", topic: "TCA Cycle & Biological Oxidation" },
        { id: "bio-carb-15", title: "TCA Cycle: Steps, Regulation & Significance", pdf: "/files/biochemistry/carbohydrates/15-tca-cycle-steps-regulation-and-significance.pdf", pages: 52, type: "PPTX", area: "carbohydrates", topic: "TCA Cycle & Biological Oxidation" },
        { id: "bio-carb-16", title: "Biological Oxidation & the Electron Transport Chain", pdf: "/files/biochemistry/carbohydrates/16-biological-oxidation-and-the-electron-transport-chain.pdf", pages: 129, type: "PPTX", area: "carbohydrates", topic: "TCA Cycle & Biological Oxidation" },
        { id: "bio-carb-17", title: "Glycogen Metabolism", pdf: "/files/biochemistry/carbohydrates/17-glycogen-metabolism.pdf", pages: 36, type: "PPTX", area: "carbohydrates", topic: "Glycogen Metabolism" },
        { id: "bio-carb-18", title: "Glycogen Synthesis (Glycogenesis)", pdf: "/files/biochemistry/carbohydrates/18-glycogen-synthesis-glycogenesis.pdf", pages: 31, type: "PPTX", area: "carbohydrates", topic: "Glycogen Metabolism" },
        { id: "bio-carb-19", title: "Glycogen Degradation (Glycogenolysis)", pdf: "/files/biochemistry/carbohydrates/19-glycogen-degradation-glycogenolysis.pdf", pages: 29, type: "PPTX", area: "carbohydrates", topic: "Glycogen Metabolism" },
        { id: "bio-carb-20", title: "Glycogen Storage Diseases", pdf: "/files/biochemistry/carbohydrates/20-glycogen-storage-diseases.pdf", pages: 10, type: "PPTX", area: "carbohydrates", topic: "Glycogen Metabolism" },
        { id: "bio-carb-21", title: "Gluconeogenesis", pdf: "/files/biochemistry/carbohydrates/21-gluconeogenesis.pdf", pages: 35, type: "PPTX", area: "carbohydrates", topic: "Gluconeogenesis" },
        { id: "bio-carb-22", title: "Gluconeogenesis & the Prevention of Hypoglycaemia", pdf: "/files/biochemistry/carbohydrates/22-gluconeogenesis-and-the-prevention-of-hypoglycaemia.pdf", pages: 36, type: "PPTX", area: "carbohydrates", topic: "Gluconeogenesis" },
        { id: "bio-carb-23", title: "Gluconeogenesis: Creating New Glucose", pdf: "/files/biochemistry/carbohydrates/23-gluconeogenesis-creating-new-glucose.pdf", pages: 20, type: "PPTX", area: "carbohydrates", topic: "Gluconeogenesis", by: "Mehnaz Gitay" },
        { id: "bio-carb-24", title: "Pentose Phosphate Pathway (HMP Shunt)", pdf: "/files/biochemistry/carbohydrates/24-pentose-phosphate-pathway-hmp-shunt.pdf", pages: 28, type: "PPTX", area: "carbohydrates", topic: "HMP Shunt", by: "Dr. Humaira Aman Ali" },
        { id: "bio-carb-25", title: "HMP Shunt", pdf: "/files/biochemistry/carbohydrates/25-hmp-shunt.pdf", pages: 24, type: "PPTX", area: "carbohydrates", topic: "HMP Shunt" },
        // Lipids
        { id: "bio-lipid-01", title: "Lipids: Classification & Biomedical Importance", pdf: "/files/biochemistry/lipids/01-lipids-classification-and-biomedical-importance.pdf", pages: 83, type: "PPTX", area: "lipids", topic: "Introduction & Fatty Acids", by: "Dr. Maha Ali" },
        { id: "bio-lipid-02", title: "Lipid Chemistry", pdf: "/files/biochemistry/lipids/02-lipid-chemistry.pdf", pages: 82, type: "PDF", area: "lipids", topic: "Introduction & Fatty Acids", by: "Gandham Rajeev" },
        { id: "bio-lipid-03", title: "Introduction & Classification of Fatty Acids & Lipids", pdf: "/files/biochemistry/lipids/03-introduction-and-classification-of-fatty-acids-and-lipids.pdf", pages: 86, type: "PDF", area: "lipids", topic: "Introduction & Fatty Acids" },
        { id: "bio-lipid-04", title: "Fatty Acids: Structure, Classification & Functions", pdf: "/files/biochemistry/lipids/04-fatty-acids-structure-classification-and-functions.pdf", pages: 81, type: "PPTX", area: "lipids", topic: "Introduction & Fatty Acids" },
        { id: "bio-lipid-05", title: "Fatty Acids: Structure, Classification & Functions (short)", pdf: "/files/biochemistry/lipids/05-fatty-acids-structure-classification-and-functions-short.pdf", pages: 18, type: "PPTX", area: "lipids", topic: "Introduction & Fatty Acids" },
        { id: "bio-lipid-06", title: "Essential Fatty Acids", pdf: "/files/biochemistry/lipids/06-essential-fatty-acids.pdf", pages: 58, type: "PPTX", area: "lipids", topic: "Introduction & Fatty Acids", by: "Dr. Muhammad Ahsan" },
        { id: "bio-lipid-07", title: "Cholesterol", pdf: "/files/biochemistry/lipids/07-cholesterol.pdf", pages: 34, type: "PPTX", area: "lipids", topic: "Cholesterol & Steroids", by: "Dr. Muhammad Ahsan" },
        { id: "bio-lipid-08", title: "Steroids: Introduction & Functions", pdf: "/files/biochemistry/lipids/08-steroids-introduction-and-functions.pdf", pages: 30, type: "PPTX", area: "lipids", topic: "Cholesterol & Steroids", by: "Dr. Muhammad Ahsan" },
        { id: "bio-lipid-09", title: "Fate of Dietary & Endogenous Cholesterol", pdf: "/files/biochemistry/lipids/09-fate-of-dietary-and-endogenous-cholesterol.pdf", pages: 16, type: "PPTX", area: "lipids", topic: "Cholesterol & Steroids" },
        { id: "bio-lipid-10", title: "Cholesterol & Sterol Metabolism", pdf: "/files/biochemistry/lipids/10-cholesterol-and-sterol-metabolism.pdf", pages: 45, type: "PPTX", area: "lipids", topic: "Cholesterol & Steroids" },
        { id: "bio-lipid-11", title: "Cholesterol Metabolism", pdf: "/files/biochemistry/lipids/11-cholesterol-metabolism.pdf", pages: 63, type: "PPTX", area: "lipids", topic: "Cholesterol & Steroids" },
        { id: "bio-lipid-12", title: "Derived Lipids & Eicosanoids", pdf: "/files/biochemistry/lipids/12-derived-lipids-and-eicosanoids.pdf", pages: 35, type: "PPTX", area: "lipids", topic: "Eicosanoids", by: "Prof. Rukhsana Rubeen" },
        { id: "bio-lipid-13", title: "Eicosanoids: Prostaglandins, Thromboxanes & Leukotrienes", pdf: "/files/biochemistry/lipids/13-eicosanoids-prostaglandins-thromboxanes-and-leukotrienes.pdf", pages: 26, type: "PPTX", area: "lipids", topic: "Eicosanoids" },
        { id: "bio-lipid-14", title: "Digestion & Absorption of Lipids", pdf: "/files/biochemistry/lipids/14-digestion-and-absorption-of-lipids.pdf", pages: 30, type: "PPTX", area: "lipids", topic: "Digestion & Transport" },
        { id: "bio-lipid-15", title: "Lipid Digestion, Absorption & Transport", pdf: "/files/biochemistry/lipids/15-lipid-digestion-absorption-and-transport.pdf", pages: 24, type: "PPTX", area: "lipids", topic: "Digestion & Transport", by: "Fatima Noor" },
        { id: "bio-lipid-16", title: "Beta-Oxidation (with Lipid Digestion)", pdf: "/files/biochemistry/lipids/16-beta-oxidation-with-lipid-digestion.pdf", pages: 33, type: "PPTX", area: "lipids", topic: "Fatty Acid Oxidation & Synthesis" },
        { id: "bio-lipid-17", title: "Beta-Oxidation of Fatty Acids", pdf: "/files/biochemistry/lipids/17-beta-oxidation-of-fatty-acids.pdf", pages: 40, type: "PPTX", area: "lipids", topic: "Fatty Acid Oxidation & Synthesis" },
        { id: "bio-lipid-18", title: "De Novo Synthesis of Fatty Acids", pdf: "/files/biochemistry/lipids/18-de-novo-synthesis-of-fatty-acids.pdf", pages: 44, type: "PPTX", area: "lipids", topic: "Fatty Acid Oxidation & Synthesis" },
        { id: "bio-lipid-19", title: "Fatty Acid Synthesis", pdf: "/files/biochemistry/lipids/19-fatty-acid-synthesis.pdf", pages: 21, type: "PPTX", area: "lipids", topic: "Fatty Acid Oxidation & Synthesis" },
        { id: "bio-lipid-20", title: "Ketogenesis", pdf: "/files/biochemistry/lipids/20-ketogenesis.pdf", pages: 36, type: "PPTX", area: "lipids", topic: "Ketone Bodies & Disorders" },
        { id: "bio-lipid-21", title: "Lipid Disorders", pdf: "/files/biochemistry/lipids/21-lipid-disorders.pdf", pages: 55, type: "PPTX", area: "lipids", topic: "Ketone Bodies & Disorders" },
        { id: "bio-lipid-22", title: "Lipid Peroxidation", pdf: "/files/biochemistry/lipids/22-lipid-peroxidation.pdf", pages: 17, type: "PPTX", area: "lipids", topic: "Ketone Bodies & Disorders" },
        // Proteins & Amino Acids
        { id: "bio-prot-01", title: "Amino Acids: The Basics", pdf: "/files/biochemistry/proteins/01-amino-acids-the-basics.pdf", pages: 39, type: "PPTX", area: "proteins", topic: "Amino Acids" },
        { id: "bio-prot-02", title: "Amino Acids", pdf: "/files/biochemistry/proteins/02-amino-acids.pdf", pages: 28, type: "PPTX", area: "proteins", topic: "Amino Acids" },
        { id: "bio-prot-03", title: "Amino Acids: Structure & Classification", pdf: "/files/biochemistry/proteins/03-amino-acids-structure-and-classification.pdf", pages: 32, type: "PPTX", area: "proteins", topic: "Amino Acids", by: "Dr. Maha Ali" },
        { id: "bio-prot-04", title: "Proteins: Structure, Classification & Function", pdf: "/files/biochemistry/proteins/04-proteins-structure-classification-and-function.pdf", pages: 76, type: "PPTX", area: "proteins", topic: "Protein Structure" },
        { id: "bio-prot-05", title: "Protein Structure", pdf: "/files/biochemistry/proteins/05-protein-structure.pdf", pages: 29, type: "PPTX", area: "proteins", topic: "Protein Structure" },
        { id: "bio-prot-06", title: "Chemistry of Amino Acids & Proteins (notes)", pdf: "/files/biochemistry/proteins/06-chemistry-of-amino-acids-and-proteins-notes.pdf", pages: 170, type: "PDF", area: "proteins", topic: "Protein Structure" },
        { id: "bio-prot-07", title: "Fibrous Proteins: Collagen", pdf: "/files/biochemistry/proteins/07-fibrous-proteins-collagen.pdf", pages: 78, type: "PPTX", area: "proteins", topic: "Collagen" },
        { id: "bio-prot-08", title: "Collagen Biosynthesis", pdf: "/files/biochemistry/proteins/08-collagen-biosynthesis.pdf", pages: 32, type: "PPTX", area: "proteins", topic: "Collagen" },
        { id: "bio-prot-09", title: "Collagen Synthesis & Degradation", pdf: "/files/biochemistry/proteins/09-collagen-synthesis-and-degradation.pdf", pages: 40, type: "PPTX", area: "proteins", topic: "Collagen" },
        { id: "bio-prot-10", title: "Disorders of Collagen", pdf: "/files/biochemistry/proteins/10-disorders-of-collagen.pdf", pages: 28, type: "PPTX", area: "proteins", topic: "Collagen", by: "Dr. Humaira Aman Ali" },
        { id: "bio-prot-11", title: "Reactions of Amino Acids", pdf: "/files/biochemistry/proteins/11-reactions-of-amino-acids.pdf", pages: 24, type: "PPTX", area: "proteins", topic: "Amino Acid Metabolism" },
        { id: "bio-prot-12", title: "Amino Acid Metabolism: Transamination, Deamination & Decarboxylation", pdf: "/files/biochemistry/proteins/12-amino-acid-metabolism-transamination-deamination-and-decarbo.pdf", pages: 18, type: "PPTX", area: "proteins", topic: "Amino Acid Metabolism" },
        { id: "bio-prot-13", title: "Glycine Metabolism", pdf: "/files/biochemistry/proteins/13-glycine-metabolism.pdf", pages: 40, type: "PDF", area: "proteins", topic: "Amino Acid Metabolism", by: "Prof. Mohammad Ibrahim" },
        { id: "bio-prot-14", title: "Methionine Metabolism", pdf: "/files/biochemistry/proteins/14-methionine-metabolism.pdf", pages: 14, type: "PDF", area: "proteins", topic: "Amino Acid Metabolism", by: "Prof. Mohammad Ibrahim" },
        { id: "bio-prot-15", title: "Tryptophan Metabolism", pdf: "/files/biochemistry/proteins/15-tryptophan-metabolism.pdf", pages: 10, type: "PDF", area: "proteins", topic: "Amino Acid Metabolism", by: "Prof. Mohammad Ibrahim" },
        { id: "bio-prot-16", title: "Nitrogen Balance & Transport", pdf: "/files/biochemistry/proteins/16-nitrogen-balance-and-transport.pdf", pages: 38, type: "PPTX", area: "proteins", topic: "Ammonia & Urea Cycle" },
        { id: "bio-prot-17", title: "Nitrogen Metabolism, Ammonia & Urea Formation", pdf: "/files/biochemistry/proteins/17-nitrogen-metabolism-ammonia-and-urea-formation.pdf", pages: 25, type: "PPTX", area: "proteins", topic: "Ammonia & Urea Cycle" },
        { id: "bio-prot-18", title: "Ammonia Metabolism & Hyperammonaemia", pdf: "/files/biochemistry/proteins/18-ammonia-metabolism-and-hyperammonaemia.pdf", pages: 40, type: "PPTX", area: "proteins", topic: "Ammonia & Urea Cycle" },
        { id: "bio-prot-19", title: "Urea Cycle", pdf: "/files/biochemistry/proteins/19-urea-cycle.pdf", pages: 42, type: "PPTX", area: "proteins", topic: "Ammonia & Urea Cycle" },
        { id: "bio-prot-20", title: "Plasma Proteins & Immunoglobulins", pdf: "/files/biochemistry/proteins/20-plasma-proteins-and-immunoglobulins.pdf", pages: 36, type: "PPTX", area: "proteins", topic: "Plasma Proteins", by: "Dr. Humaira Aman Ali" },
        { id: "bio-prot-21", title: "Plasma Proteins", pdf: "/files/biochemistry/proteins/21-plasma-proteins.pdf", pages: 44, type: "PDF", area: "proteins", topic: "Plasma Proteins" },
        // Haemoglobin, Bilirubin & Liver
        { id: "bio-hb-01", title: "Haemoglobin", pdf: "/files/biochemistry/haemoglobin-and-liver/01-haemoglobin.pdf", pages: 50, type: "PPTX", area: "haemoglobin-and-liver", topic: "Haemoglobin", by: "Dr. Muhammad Ahsan" },
        { id: "bio-hb-02", title: "Structure & Functions of Haemoglobin", pdf: "/files/biochemistry/haemoglobin-and-liver/02-structure-and-functions-of-haemoglobin.pdf", pages: 53, type: "PPTX", area: "haemoglobin-and-liver", topic: "Haemoglobin", by: "Dr. Muhammad Ahsan" },
        { id: "bio-hb-03", title: "Haemoglobin Structure & Function", pdf: "/files/biochemistry/haemoglobin-and-liver/03-haemoglobin-structure-and-function.pdf", pages: 23, type: "PPTX", area: "haemoglobin-and-liver", topic: "Haemoglobin" },
        { id: "bio-hb-04", title: "Haemoglobin: Structure, Functions & Oxygen Dissociation Curve", pdf: "/files/biochemistry/haemoglobin-and-liver/04-haemoglobin-structure-functions-and-oxygen-dissociation-curv.pdf", pages: 35, type: "PPTX", area: "haemoglobin-and-liver", topic: "Haemoglobin" },
        { id: "bio-hb-05", title: "Haemoglobin Function & Anaemia", pdf: "/files/biochemistry/haemoglobin-and-liver/05-haemoglobin-function-and-anaemia.pdf", pages: 34, type: "PPTX", area: "haemoglobin-and-liver", topic: "Haemoglobin", by: "Asma Zaib" },
        { id: "bio-hb-06", title: "Heme Chemistry & Metabolism", pdf: "/files/biochemistry/haemoglobin-and-liver/06-heme-chemistry-and-metabolism.pdf", pages: 122, type: "PDF", area: "haemoglobin-and-liver", topic: "Haemoglobin", by: "Gandham Rajeev" },
        { id: "bio-hb-07", title: "Haemoglobinopathies", pdf: "/files/biochemistry/haemoglobin-and-liver/07-haemoglobinopathies.pdf", pages: 30, type: "PPTX", area: "haemoglobin-and-liver", topic: "Haemoglobinopathies & Porphyria" },
        { id: "bio-hb-08", title: "Haemoglobinopathies", pdf: "/files/biochemistry/haemoglobin-and-liver/08-haemoglobinopathies.pdf", pages: 25, type: "PPTX", area: "haemoglobin-and-liver", topic: "Haemoglobinopathies & Porphyria", by: "Dr. Humaira Aman Ali" },
        { id: "bio-hb-09", title: "Haemoglobinopathies & Thalassaemia", pdf: "/files/biochemistry/haemoglobin-and-liver/09-haemoglobinopathies-and-thalassaemia.pdf", pages: 30, type: "PPTX", area: "haemoglobin-and-liver", topic: "Haemoglobinopathies & Porphyria" },
        { id: "bio-hb-10", title: "Abnormalities of Haemoglobin Synthesis & Porphyrias", pdf: "/files/biochemistry/haemoglobin-and-liver/10-abnormalities-of-haemoglobin-synthesis-and-porphyrias.pdf", pages: 21, type: "PPTX", area: "haemoglobin-and-liver", topic: "Haemoglobinopathies & Porphyria" },
        { id: "bio-hb-11", title: "Bilirubin Metabolism & Porphyria", pdf: "/files/biochemistry/haemoglobin-and-liver/11-bilirubin-metabolism-and-porphyria.pdf", pages: 17, type: "PPTX", area: "haemoglobin-and-liver", topic: "Heme Breakdown & Jaundice", by: "Dr. Humaira Aman Ali" },
        { id: "bio-hb-12", title: "Degradation of Heme & Bilirubin Metabolism", pdf: "/files/biochemistry/haemoglobin-and-liver/12-degradation-of-heme-and-bilirubin-metabolism.pdf", pages: 17, type: "PPTX", area: "haemoglobin-and-liver", topic: "Heme Breakdown & Jaundice", by: "Dr. Nadeem Alam" },
        { id: "bio-hb-13", title: "Heme Degradation & Related Diseases", pdf: "/files/biochemistry/haemoglobin-and-liver/13-heme-degradation-and-related-diseases.pdf", pages: 27, type: "PPTX", area: "haemoglobin-and-liver", topic: "Heme Breakdown & Jaundice", by: "Dr. Muhammad Ahsan" },
        { id: "bio-hb-14", title: "Haemolysis & Bilirubin Metabolism", pdf: "/files/biochemistry/haemoglobin-and-liver/14-haemolysis-and-bilirubin-metabolism.pdf", pages: 35, type: "PPTX", area: "haemoglobin-and-liver", topic: "Heme Breakdown & Jaundice" },
        { id: "bio-hb-15", title: "Haemoglobin Degradation & Jaundice", pdf: "/files/biochemistry/haemoglobin-and-liver/15-haemoglobin-degradation-and-jaundice.pdf", pages: 40, type: "PPTX", area: "haemoglobin-and-liver", topic: "Heme Breakdown & Jaundice", by: "Prof. Fauzia Imtiaz" },
        { id: "bio-hb-16", title: "Bilirubin & Jaundice", pdf: "/files/biochemistry/haemoglobin-and-liver/16-bilirubin-and-jaundice.pdf", pages: 23, type: "PPTX", area: "haemoglobin-and-liver", topic: "Heme Breakdown & Jaundice" },
        { id: "bio-hb-17", title: "Jaundice & Its Types", pdf: "/files/biochemistry/haemoglobin-and-liver/17-jaundice-and-its-types.pdf", pages: 28, type: "PPTX", area: "haemoglobin-and-liver", topic: "Heme Breakdown & Jaundice" },
        { id: "bio-hb-18", title: "Interpretation of Bilirubin", pdf: "/files/biochemistry/haemoglobin-and-liver/18-interpretation-of-bilirubin.pdf", pages: 22, type: "PPTX", area: "haemoglobin-and-liver", topic: "Heme Breakdown & Jaundice" },
        { id: "bio-hb-19", title: "The Liver", pdf: "/files/biochemistry/haemoglobin-and-liver/19-the-liver.pdf", pages: 13, type: "PPTX", area: "haemoglobin-and-liver", topic: "Liver & Bile" },
        { id: "bio-hb-20", title: "Bile Salts & Bile Pigments", pdf: "/files/biochemistry/haemoglobin-and-liver/20-bile-salts-and-bile-pigments.pdf", pages: 20, type: "PPTX", area: "haemoglobin-and-liver", topic: "Liver & Bile" },
        { id: "bio-hb-21", title: "Interpretation of ALP & Aminotransferases", pdf: "/files/biochemistry/haemoglobin-and-liver/21-interpretation-of-alp-and-aminotransferases.pdf", pages: 21, type: "PPTX", area: "haemoglobin-and-liver", topic: "Liver & Bile", alsoIn: ["enzymes"], linkTopic: "Clinical Enzymology" },
        // Enzymes
        { id: "bio-enz-01", title: "Enzymes", pdf: "/files/biochemistry/enzymes/01-enzymes.pdf", pages: 50, type: "PPTX", area: "enzymes", topic: "Enzymes" },
        { id: "bio-enz-02", title: "Clinical Enzymology", pdf: "/files/biochemistry/enzymes/02-clinical-enzymology.pdf", pages: 48, type: "PPTX", area: "enzymes", topic: "Clinical Enzymology" },
        // Nucleotides & Molecular Biology
        { id: "bio-gen-01", title: "Chemistry of Nucleotides", pdf: "/files/biochemistry/nucleotides-and-genetics/01-chemistry-of-nucleotides.pdf", pages: 59, type: "PPTX", area: "nucleotides-and-genetics", topic: "Nucleotides & Nucleic Acids" },
        { id: "bio-gen-02", title: "Nucleic Acids: Nucleotides & Nucleosides", pdf: "/files/biochemistry/nucleotides-and-genetics/02-nucleic-acids-nucleotides-and-nucleosides.pdf", pages: 39, type: "PPTX", area: "nucleotides-and-genetics", topic: "Nucleotides & Nucleic Acids" },
        { id: "bio-gen-03", title: "Polynucleotides", pdf: "/files/biochemistry/nucleotides-and-genetics/03-polynucleotides.pdf", pages: 41, type: "PPTX", area: "nucleotides-and-genetics", topic: "Nucleotides & Nucleic Acids" },
        { id: "bio-gen-04", title: "Structure & Function of DNA & RNA", pdf: "/files/biochemistry/nucleotides-and-genetics/04-structure-and-function-of-dna-and-rna.pdf", pages: 68, type: "PPTX", area: "nucleotides-and-genetics", topic: "Nucleotides & Nucleic Acids" },
        { id: "bio-gen-05", title: "Purine & Pyrimidine Metabolism", pdf: "/files/biochemistry/nucleotides-and-genetics/05-purine-and-pyrimidine-metabolism.pdf", pages: 45, type: "PPTX", area: "nucleotides-and-genetics", topic: "Purine & Pyrimidine Metabolism" },
        { id: "bio-gen-06", title: "Purine Synthesis", pdf: "/files/biochemistry/nucleotides-and-genetics/06-purine-synthesis.pdf", pages: 36, type: "PPTX", area: "nucleotides-and-genetics", topic: "Purine & Pyrimidine Metabolism" },
        { id: "bio-gen-07", title: "Purine Degradation", pdf: "/files/biochemistry/nucleotides-and-genetics/07-purine-degradation.pdf", pages: 35, type: "PPTX", area: "nucleotides-and-genetics", topic: "Purine & Pyrimidine Metabolism" },
        { id: "bio-gen-08", title: "Uric Acid", pdf: "/files/biochemistry/nucleotides-and-genetics/08-uric-acid.pdf", pages: 18, type: "PPTX", area: "nucleotides-and-genetics", topic: "Purine & Pyrimidine Metabolism", by: "Dr. Maha Ali" },
        { id: "bio-gen-09", title: "Pyrimidine Metabolism", pdf: "/files/biochemistry/nucleotides-and-genetics/09-pyrimidine-metabolism.pdf", pages: 25, type: "PPTX", area: "nucleotides-and-genetics", topic: "Purine & Pyrimidine Metabolism" },
        { id: "bio-gen-10", title: "DNA Replication", pdf: "/files/biochemistry/nucleotides-and-genetics/10-dna-replication.pdf", pages: 37, type: "PPTX", area: "nucleotides-and-genetics", topic: "Replication" },
        { id: "bio-gen-11", title: "DNA Replication & the Double Helix", pdf: "/files/biochemistry/nucleotides-and-genetics/11-dna-replication-and-the-double-helix.pdf", pages: 44, type: "PPTX", area: "nucleotides-and-genetics", topic: "Replication" },
        { id: "bio-gen-12", title: "DNA Transcription (Part 1)", pdf: "/files/biochemistry/nucleotides-and-genetics/12-dna-transcription-part-1.pdf", pages: 48, type: "PPTX", area: "nucleotides-and-genetics", topic: "Transcription" },
        { id: "bio-gen-13", title: "Post-Transcriptional Modifications & Inhibitors of Transcription (Part 2)", pdf: "/files/biochemistry/nucleotides-and-genetics/13-post-transcriptional-modifications-and-inhibitors-of-transcr.pdf", pages: 40, type: "PPTX", area: "nucleotides-and-genetics", topic: "Transcription" },
        { id: "bio-gen-14", title: "Translation: From RNA to Protein", pdf: "/files/biochemistry/nucleotides-and-genetics/14-translation-from-rna-to-protein.pdf", pages: 51, type: "PPTX", area: "nucleotides-and-genetics", topic: "Translation" },
        { id: "bio-gen-15", title: "Translation: An Overview", pdf: "/files/biochemistry/nucleotides-and-genetics/15-translation-an-overview.pdf", pages: 32, type: "PPTX", area: "nucleotides-and-genetics", topic: "Translation" },
        { id: "bio-gen-16", title: "Translation (Protein Synthesis)", pdf: "/files/biochemistry/nucleotides-and-genetics/16-translation-protein-synthesis.pdf", pages: 17, type: "PPTX", area: "nucleotides-and-genetics", topic: "Translation" },
        { id: "bio-gen-17", title: "Post-Translational Modification", pdf: "/files/biochemistry/nucleotides-and-genetics/17-post-translational-modification.pdf", pages: 12, type: "PPTX", area: "nucleotides-and-genetics", topic: "Translation", by: "Prof. Fauzia Imtiaz" },
        // Vitamins & Minerals
        { id: "bio-vit-01", title: "Vitamins & Minerals: Structure, Function & Classification", pdf: "/files/biochemistry/vitamins-and-minerals/01-vitamins-and-minerals-structure-function-and-classification.pdf", pages: 15, type: "PPTX", area: "vitamins-and-minerals", topic: "Vitamins: Overview" },
        { id: "bio-vit-02", title: "Water- & Fat-Soluble Vitamins: Functions & Deficiencies", pdf: "/files/biochemistry/vitamins-and-minerals/02-water-and-fat-soluble-vitamins-functions-and-deficiencies.pdf", pages: 144, type: "PDF", area: "vitamins-and-minerals", topic: "Vitamins: Overview" },
        { id: "bio-vit-03", title: "Vitamin Deficiencies: Clinical Scenarios", pdf: "/files/biochemistry/vitamins-and-minerals/03-vitamin-deficiencies-clinical-scenarios.pdf", pages: 11, type: "PPTX", area: "vitamins-and-minerals", topic: "Vitamins: Overview", by: "Dr. Humaira Aman Ali" },
        { id: "bio-vit-04", title: "Fat-Soluble Vitamins A, D, E & K", pdf: "/files/biochemistry/vitamins-and-minerals/04-fat-soluble-vitamins-a-d-e-and-k.pdf", pages: 69, type: "PPTX", area: "vitamins-and-minerals", topic: "Fat-Soluble Vitamins" },
        { id: "bio-vit-05", title: "Vitamin D", pdf: "/files/biochemistry/vitamins-and-minerals/05-vitamin-d.pdf", pages: 21, type: "PPTX", area: "vitamins-and-minerals", topic: "Fat-Soluble Vitamins", by: "Dr. Humaira Aman Ali" },
        { id: "bio-vit-06", title: "Vitamin D in Dentistry", pdf: "/files/biochemistry/vitamins-and-minerals/06-vitamin-d-in-dentistry.pdf", pages: 33, type: "PPTX", area: "vitamins-and-minerals", topic: "Fat-Soluble Vitamins" },
        { id: "bio-vit-07", title: "Water-Soluble Vitamins", pdf: "/files/biochemistry/vitamins-and-minerals/07-water-soluble-vitamins.pdf", pages: 46, type: "PPTX", area: "vitamins-and-minerals", topic: "Water-Soluble Vitamins", by: "Dr. Muhammad Ahsan" },
        { id: "bio-vit-08", title: "Ascorbic Acid (Vitamin C)", pdf: "/files/biochemistry/vitamins-and-minerals/08-ascorbic-acid-vitamin-c.pdf", pages: 21, type: "PPTX", area: "vitamins-and-minerals", topic: "Water-Soluble Vitamins" },
        { id: "bio-vit-09", title: "Nutrients & Macrominerals", pdf: "/files/biochemistry/vitamins-and-minerals/09-nutrients-and-macrominerals.pdf", pages: 24, type: "PPTX", area: "vitamins-and-minerals", topic: "Minerals" },
        { id: "bio-vit-10", title: "Minerals (Part 1)", pdf: "/files/biochemistry/vitamins-and-minerals/10-minerals-part-1.pdf", pages: 63, type: "PPTX", area: "vitamins-and-minerals", topic: "Minerals", by: "Dr. Humaira Aman Ali" },
        { id: "bio-vit-11", title: "Sodium, Potassium & Chloride (Minerals Part 2)", pdf: "/files/biochemistry/vitamins-and-minerals/11-sodium-potassium-and-chloride-minerals-part-2.pdf", pages: 26, type: "PPTX", area: "vitamins-and-minerals", topic: "Minerals", by: "Dr. Humaira Aman Ali" },
        { id: "bio-vit-12", title: "Trace Elements (Minerals Part 3)", pdf: "/files/biochemistry/vitamins-and-minerals/12-trace-elements-minerals-part-3.pdf", pages: 33, type: "PPTX", area: "vitamins-and-minerals", topic: "Minerals", by: "Dr. Humaira Aman Ali" },
        { id: "bio-vit-13", title: "Iron Metabolism", pdf: "/files/biochemistry/vitamins-and-minerals/13-iron-metabolism.pdf", pages: 25, type: "PDF", area: "vitamins-and-minerals", topic: "Minerals" },
        // Endocrinology
        { id: "bio-endo-01", title: "Hormones: Classification & Mechanism of Action", pdf: "/files/biochemistry/endocrinology/01-hormones-classification-and-mechanism-of-action.pdf", pages: 27, type: "PPTX", area: "endocrinology", topic: "Hormones", by: "Dr. Humaira Aman Ali" },
        { id: "bio-endo-02", title: "Pituitary Gland", pdf: "/files/biochemistry/endocrinology/02-pituitary-gland.pdf", pages: 66, type: "PPTX", area: "endocrinology", topic: "Endocrine Glands", by: "Dr. Humaira Aman Ali" },
        { id: "bio-endo-03", title: "Thyroid Gland & Its Hormones", pdf: "/files/biochemistry/endocrinology/03-thyroid-gland-and-its-hormones.pdf", pages: 49, type: "PPTX", area: "endocrinology", topic: "Endocrine Glands" },
        { id: "bio-endo-04", title: "Pancreatic Hormones", pdf: "/files/biochemistry/endocrinology/04-pancreatic-hormones.pdf", pages: 25, type: "PPTX", area: "endocrinology", topic: "Endocrine Glands", by: "Dr. Humaira Aman Ali" },
        { id: "bio-endo-05", title: "Adrenal Cortex: Functions of Glucocorticoids", pdf: "/files/biochemistry/endocrinology/05-adrenal-cortex-functions-of-glucocorticoids.pdf", pages: 46, type: "PPTX", area: "endocrinology", topic: "Endocrine Glands" },
        // Clinical & Applied Biochemistry
        { id: "bio-clin-01", title: "Biochemistry in Dentistry", pdf: "/files/biochemistry/clinical-topics/01-biochemistry-in-dentistry.pdf", pages: 55, type: "PPTX", area: "clinical-topics", topic: "Biochemistry in Dentistry" },
        { id: "bio-clin-02", title: "Diabetes Mellitus", pdf: "/files/biochemistry/clinical-topics/02-diabetes-mellitus.pdf", pages: 21, type: "PPTX", area: "clinical-topics", topic: "Clinical Topics", by: "Dr. Maha Ali", alsoIn: ["endocrinology"], linkTopic: "Endocrine Glands" },
        { id: "bio-clin-03", title: "Digestion & Nutrient Absorption", pdf: "/files/biochemistry/clinical-topics/03-digestion-and-nutrient-absorption.pdf", pages: 32, type: "PPTX", area: "clinical-topics", topic: "Clinical Topics" },
        { id: "bio-clin-04", title: "Immunity", pdf: "/files/biochemistry/clinical-topics/04-immunity.pdf", pages: 36, type: "PPTX", area: "clinical-topics", topic: "Clinical Topics" },
        // Practicals & Revision
        { id: "bio-prac-01", title: "Biochemistry Practical Journal (DDC)", pdf: "/files/biochemistry/practicals-and-revision/01-biochemistry-practical-journal-ddc.pdf", pages: 74, type: "DOCX", area: "practicals-and-revision", topic: "Lab Journal & Techniques" },
        { id: "bio-prac-02", title: "Sample Drawing Techniques", pdf: "/files/biochemistry/practicals-and-revision/02-sample-drawing-techniques.pdf", pages: 8, type: "PDF", area: "practicals-and-revision", topic: "Lab Journal & Techniques" },
        { id: "bio-prac-03", title: "Preparation of Solutions: Normal Solution & Normal Saline", pdf: "/files/biochemistry/practicals-and-revision/03-preparation-of-solutions-normal-solution-and-normal-saline.pdf", pages: 6, type: "PDF", area: "practicals-and-revision", topic: "Lab Journal & Techniques" },
        { id: "bio-prac-04", title: "Detection of Carbohydrates", pdf: "/files/biochemistry/practicals-and-revision/04-detection-of-carbohydrates.pdf", pages: 49, type: "PPTX", area: "practicals-and-revision", topic: "Practicals", by: "Dow Dental College", alsoIn: ["carbohydrates"], linkTopic: "Introduction & Classification" },
        { id: "bio-prac-05", title: "Techniques for Glucose Estimation & Diabetes Mellitus", pdf: "/files/biochemistry/practicals-and-revision/05-techniques-for-glucose-estimation-and-diabetes-mellitus.pdf", pages: 31, type: "PDF", area: "practicals-and-revision", topic: "Practicals", by: "Dr. Sarah Sami", alsoIn: ["carbohydrates"], linkTopic: "Glycolysis & Pyruvate" },
        { id: "bio-prac-06", title: "Estimation of Blood Glucose by Glucometer", pdf: "/files/biochemistry/practicals-and-revision/06-estimation-of-blood-glucose-by-glucometer.pdf", pages: 27, type: "PPTX", area: "practicals-and-revision", topic: "Practicals", by: "Fatima Noor", alsoIn: ["clinical-topics"], linkTopic: "Clinical Topics" },
        { id: "bio-prac-07", title: "Estimation of HbA1c (Enzymatic Method)", pdf: "/files/biochemistry/practicals-and-revision/07-estimation-of-hba1c-enzymatic-method.pdf", pages: 3, type: "DOCX", area: "practicals-and-revision", topic: "Practicals", alsoIn: ["clinical-topics"], linkTopic: "Clinical Topics" },
        { id: "bio-prac-08", title: "Amino Acid Identification & Separation (Chromatography)", pdf: "/files/biochemistry/practicals-and-revision/08-amino-acid-identification-and-separation-chromatography.pdf", pages: 17, type: "DOCX", area: "practicals-and-revision", topic: "Practicals", alsoIn: ["proteins"], linkTopic: "Amino Acids" },
        { id: "bio-prac-09", title: "Factors Affecting Enzyme Activity (Salivary Amylase)", pdf: "/files/biochemistry/practicals-and-revision/09-factors-affecting-enzyme-activity-salivary-amylase.pdf", pages: 3, type: "DOCX", area: "practicals-and-revision", topic: "Practicals", alsoIn: ["enzymes"], linkTopic: "Enzymes" },
        { id: "bio-prac-10", title: "Emulsification Test & Hay's Test", pdf: "/files/biochemistry/practicals-and-revision/10-emulsification-test-and-hay-s-test.pdf", pages: 14, type: "PPTX", area: "practicals-and-revision", topic: "Practicals", by: "Dr. Humaira Aman Ali", alsoIn: ["lipids"], linkTopic: "Digestion & Transport" },
        { id: "bio-prac-11", title: "Estimation of Serum Cholesterol", pdf: "/files/biochemistry/practicals-and-revision/11-estimation-of-serum-cholesterol.pdf", pages: 10, type: "PPTX", area: "practicals-and-revision", topic: "Practicals", alsoIn: ["lipids"], linkTopic: "Cholesterol & Steroids" },
        { id: "bio-prac-12", title: "Abnormal Constituents of Urine", pdf: "/files/biochemistry/practicals-and-revision/12-abnormal-constituents-of-urine.pdf", pages: 47, type: "PDF", area: "practicals-and-revision", topic: "Practicals", by: "Dr. Sarah Sami" },
        { id: "bio-prac-13", title: "Biochemistry One-Liners (Neuro Module 2026)", pdf: "/files/biochemistry/practicals-and-revision/13-biochemistry-one-liners-neuro-module-2026.pdf", pages: 9, type: "DOCX", area: "practicals-and-revision", topic: "Revision" },
      ],
      ddc: [],
    },
    areas: [
      {
        slug: "cell-water-and-ph",
        title: "Cell, Water & pH",
        summary: "The cell and its molecules, water and electrolytes, pH, buffers and solutions.",
        topics: ["The cell & macromolecules", "Water & electrolytes", "pH & buffers", "Solutions", "Cytoskeleton & extracellular matrix"],
      },
      {
        slug: "carbohydrates",
        title: "Carbohydrates",
        summary: "Sugars and how the body uses them: glycolysis, the TCA cycle, glycogen and gluconeogenesis.",
        topics: ["Classification & importance", "Digestion & absorption", "Glycolysis & TCA cycle", "Glycogen metabolism", "Gluconeogenesis & HMP shunt"],
      },
      {
        slug: "lipids",
        title: "Lipids",
        summary: "Fatty acids, cholesterol and eicosanoids, and how fats are digested, burned and made.",
        topics: ["Fatty acids & classification", "Cholesterol & steroids", "Eicosanoids", "Beta-oxidation & synthesis", "Ketone bodies"],
      },
      {
        slug: "proteins",
        title: "Proteins & Amino Acids",
        summary: "Amino acids, protein structure, collagen, amino acid metabolism and the urea cycle.",
        topics: ["Amino acids", "Protein structure", "Collagen", "Amino acid metabolism", "Urea cycle & ammonia"],
      },
      {
        slug: "haemoglobin-and-liver",
        title: "Haemoglobin, Bilirubin & Liver",
        summary: "Haemoglobin and its disorders, heme breakdown, jaundice and liver function tests.",
        topics: ["Haemoglobin structure & function", "Haemoglobinopathies & porphyria", "Bilirubin & jaundice", "Liver & bile"],
      },
      {
        slug: "enzymes",
        title: "Enzymes",
        summary: "How enzymes work, what affects them, and their use as diagnostic markers.",
        topics: ["Enzyme kinetics & factors", "Clinical enzymology"],
      },
      {
        slug: "nucleotides-and-genetics",
        title: "Nucleotides & Molecular Biology",
        summary: "Nucleotides and nucleic acids, purine metabolism, and DNA to protein.",
        topics: ["Nucleotides & nucleic acids", "Purine & pyrimidine metabolism", "Replication", "Transcription", "Translation"],
      },
      {
        slug: "vitamins-and-minerals",
        title: "Vitamins & Minerals",
        summary: "Fat- and water-soluble vitamins, minerals and trace elements, with deficiency diseases.",
        topics: ["Fat-soluble vitamins", "Water-soluble vitamins", "Minerals & trace elements", "Iron metabolism"],
      },
      {
        slug: "endocrinology",
        title: "Endocrinology",
        summary: "Hormones and how they act, and the pituitary, thyroid, pancreas and adrenal cortex.",
        topics: ["Hormone classification & action", "Pituitary & thyroid", "Pancreatic hormones", "Glucocorticoids"],
      },
      {
        slug: "clinical-topics",
        title: "Clinical & Applied Biochemistry",
        summary: "Biochemistry in dentistry, diabetes, digestion and immunity.",
        topics: ["Biochemistry in dentistry", "Diabetes mellitus", "Digestion", "Immunity"],
      },
      {
        slug: "practicals-and-revision",
        title: "Practicals & Revision",
        summary: "Lab journal, practical procedures and quick revision notes.",
        topics: ["Lab journal & techniques", "Carbohydrate & glucose tests", "Enzyme & lipid tests", "Urine analysis", "One-liners"],
      },
    ],
  },
  "general-education": {
    subjectSlug: "general-education",
    shortName: "General Education",
    bookSubjectId: "gen-ed",
    courseOutline: [],
    ppts: {
      combined: [
        // Lecture slides and notes from the DUHS colleges (slides converted to PDF so they open in the reader)
        // Islamic Studies
        { id: "ge-isl-01", title: "Introduction to Islam", pdf: "/files/general-education/islamic-studies/01-introduction-to-islam.pdf", pages: 26, type: "PDF", area: "islamic-studies", topic: "Foundations" },
        { id: "ge-isl-02", title: "The Holy Quran: Introduction, Revelation & Compilation", pdf: "/files/general-education/islamic-studies/02-the-holy-quran-introduction-revelation-and-compilation.pdf", pages: 22, type: "PDF", area: "islamic-studies", topic: "Sources of Islam" },
        { id: "ge-isl-03", title: "Hadith & Sunnah", pdf: "/files/general-education/islamic-studies/03-hadith-and-sunnah.pdf", pages: 32, type: "PDF", area: "islamic-studies", topic: "Sources of Islam" },
        { id: "ge-isl-04", title: "Life & Legacy of the Holy Prophet Muhammad ﷺ (Seerah)", pdf: "/files/general-education/islamic-studies/04-life-and-legacy-of-the-holy-prophet-muhammad-seerah.pdf", pages: 39, type: "PDF", area: "islamic-studies", topic: "Seerah" },
        { id: "ge-isl-05", title: "Diverse Roles of the Holy Prophet Muhammad ﷺ", pdf: "/files/general-education/islamic-studies/05-diverse-roles-of-the-holy-prophet-muhammad.pdf", pages: 8, type: "PDF", area: "islamic-studies", topic: "Seerah" },
        { id: "ge-isl-06", title: "Pillars of Islam (Islamic Jurisprudence)", pdf: "/files/general-education/islamic-studies/06-pillars-of-islam-islamic-jurisprudence.pdf", pages: 31, type: "PDF", area: "islamic-studies", topic: "Islamic Jurisprudence (Fiqh)" },
        { id: "ge-isl-07", title: "Islamic Jurisprudence (Fiqh)", pdf: "/files/general-education/islamic-studies/07-islamic-jurisprudence-fiqh.pdf", pages: 51, type: "PDF", area: "islamic-studies", topic: "Islamic Jurisprudence (Fiqh)" },
        { id: "ge-isl-08", title: "Major Schools of Islamic Jurisprudence", pdf: "/files/general-education/islamic-studies/08-major-schools-of-islamic-jurisprudence.pdf", pages: 23, type: "PDF", area: "islamic-studies", topic: "Islamic Jurisprudence (Fiqh)" },
        { id: "ge-isl-09", title: "World Before Islam", pdf: "/files/general-education/islamic-studies/09-world-before-islam.pdf", pages: 15, type: "PDF", area: "islamic-studies", topic: "Islamic History & Civilization" },
        { id: "ge-isl-10", title: "The Rashidun Caliphate", pdf: "/files/general-education/islamic-studies/10-the-rashidun-caliphate.pdf", pages: 24, type: "PDF", area: "islamic-studies", topic: "Islamic History & Civilization" },
        { id: "ge-isl-11", title: "Muslim Scientists & Philosophers: Contribution to World Civilization", pdf: "/files/general-education/islamic-studies/11-muslim-scientists-and-philosophers-contribution-to-world-civ.pdf", pages: 14, type: "PDF", area: "islamic-studies", topic: "Islamic History & Civilization" },
        { id: "ge-isl-12", title: "Family & Society in Islam (Part I)", pdf: "/files/general-education/islamic-studies/12-family-and-society-in-islam-part-i.pdf", pages: 24, type: "PPTX", area: "islamic-studies", topic: "Family & Society in Islam" },
        { id: "ge-isl-13", title: "Family & Society in Islam (Part II)", pdf: "/files/general-education/islamic-studies/13-family-and-society-in-islam-part-ii.pdf", pages: 18, type: "PPTX", area: "islamic-studies", topic: "Family & Society in Islam" },
        { id: "ge-isl-14", title: "Family & Society in Islam (Part III)", pdf: "/files/general-education/islamic-studies/14-family-and-society-in-islam-part-iii.pdf", pages: 26, type: "PPTX", area: "islamic-studies", topic: "Family & Society in Islam" },
        { id: "ge-isl-15", title: "Islamic Studies Syllabus", pdf: "/files/general-education/islamic-studies/15-islamic-studies-syllabus.pdf", pages: 1, type: "Image", area: "islamic-studies", topic: "Course Information" },
        // Pakistan Studies
        { id: "ge-pak-01", title: "Chapter 1: Introduction to Pakistan", pdf: "/files/general-education/pakistan-studies/01-chapter-1-introduction-to-pakistan.pdf", pages: 31, type: "PPTX", area: "pakistan-studies", topic: "Chapters", by: "Umer Farooque" },
        { id: "ge-pak-02", title: "Chapter 2: Political History of Pakistan", pdf: "/files/general-education/pakistan-studies/02-chapter-2-political-history-of-pakistan.pdf", pages: 72, type: "PPTX", area: "pakistan-studies", topic: "Chapters", by: "Umer Farooque" },
        { id: "ge-pak-03", title: "Chapter 3: Geography of Pakistan", pdf: "/files/general-education/pakistan-studies/03-chapter-3-geography-of-pakistan.pdf", pages: 10, type: "PPTX", area: "pakistan-studies", topic: "Chapters", by: "Umer Farooque" },
        { id: "ge-pak-04", title: "Chapter 4: Society & Culture of Pakistan", pdf: "/files/general-education/pakistan-studies/04-chapter-4-society-and-culture-of-pakistan.pdf", pages: 23, type: "PPTX", area: "pakistan-studies", topic: "Chapters", by: "Umer Farooque" },
        { id: "ge-pak-05", title: "Chapter 5: Economic Development of Pakistan", pdf: "/files/general-education/pakistan-studies/05-chapter-5-economic-development-of-pakistan.pdf", pages: 20, type: "PPTX", area: "pakistan-studies", topic: "Chapters", by: "Umer Farooque" },
        { id: "ge-pak-06", title: "Chapter 6: Contemporary Issues of Pakistan", pdf: "/files/general-education/pakistan-studies/06-chapter-6-contemporary-issues-of-pakistan.pdf", pages: 17, type: "PPTX", area: "pakistan-studies", topic: "Chapters", by: "Umer Farooque" },
        // Research Methods
        { id: "ge-res-01", title: "Introduction to Research", pdf: "/files/general-education/research-methods/01-introduction-to-research.pdf", pages: 19, type: "PPTX", area: "research-methods", topic: "Getting Started", by: "Dr. Rubaba Azim & Dr. Nooreen Adnan" },
        { id: "ge-res-02", title: "Navigating the Research Journey", pdf: "/files/general-education/research-methods/02-navigating-the-research-journey.pdf", pages: 21, type: "PPTX", area: "research-methods", topic: "Getting Started" },
        { id: "ge-res-03", title: "Research Question, Hypothesis & Objectives", pdf: "/files/general-education/research-methods/03-research-question-hypothesis-and-objectives.pdf", pages: 27, type: "PPTX", area: "research-methods", topic: "Getting Started" },
        { id: "ge-res-04", title: "Literature Search (Template)", pdf: "/files/general-education/research-methods/04-literature-search-template.pdf", pages: 12, type: "PPTX", area: "research-methods", topic: "Getting Started" },
        { id: "ge-res-05", title: "Introduction to Research Study Designs & Evidence in Dentistry", pdf: "/files/general-education/research-methods/05-introduction-to-research-study-designs-and-evidence-in-denti.pdf", pages: 15, type: "PPTX", area: "research-methods", topic: "Study Designs", by: "Dr. Faiza Siddiqui" },
        { id: "ge-res-06", title: "Introduction to Study Designs", pdf: "/files/general-education/research-methods/06-introduction-to-study-designs.pdf", pages: 24, type: "PPTX", area: "research-methods", topic: "Study Designs", by: "Syeda Rubaba Azim & Nooreen Adnan" },
        { id: "ge-res-07", title: "Qualitative Research (Part 1)", pdf: "/files/general-education/research-methods/07-qualitative-research-part-1.pdf", pages: 45, type: "PPTX", area: "research-methods", topic: "Qualitative & Quantitative Research" },
        { id: "ge-res-08", title: "Qualitative Research (Part 2)", pdf: "/files/general-education/research-methods/08-qualitative-research-part-2.pdf", pages: 29, type: "PPTX", area: "research-methods", topic: "Qualitative & Quantitative Research" },
        { id: "ge-res-09", title: "Quantitative Research (Part 1)", pdf: "/files/general-education/research-methods/09-quantitative-research-part-1.pdf", pages: 36, type: "PPTX", area: "research-methods", topic: "Qualitative & Quantitative Research" },
        { id: "ge-res-10", title: "Quantitative Research (Part 2)", pdf: "/files/general-education/research-methods/10-quantitative-research-part-2.pdf", pages: 32, type: "PPTX", area: "research-methods", topic: "Qualitative & Quantitative Research" },
        { id: "ge-res-11", title: "Ethical Considerations in Research", pdf: "/files/general-education/research-methods/11-ethical-considerations-in-research.pdf", pages: 14, type: "PPTX", area: "research-methods", topic: "Ethics & Writing" },
        { id: "ge-res-12", title: "From Data to Decisions: Writing & Analyzing Evaluation Reports", pdf: "/files/general-education/research-methods/12-from-data-to-decisions-writing-and-analyzing-evaluation-repo.pdf", pages: 21, type: "PPTX", area: "research-methods", topic: "Ethics & Writing", by: "Dr. Faiza Siddiqui" },
        { id: "ge-res-13", title: "Introduction to Writing a Research Paper", pdf: "/files/general-education/research-methods/13-introduction-to-writing-a-research-paper.pdf", pages: 27, type: "PPTX", area: "research-methods", topic: "Ethics & Writing", by: "Dr. Muneeb Ahmed Lone" },
        // Philosophy
        { id: "ge-phil-01", title: "1. Introduction to Philosophy", pdf: "/files/general-education/philosophy/01-1-introduction-to-philosophy.pdf", pages: 32, type: "PPTX", area: "philosophy", topic: "Lectures", by: "Syed Noman Ali" },
        { id: "ge-phil-02", title: "2. History of Philosophy (History of Ideas)", pdf: "/files/general-education/philosophy/02-2-history-of-philosophy-history-of-ideas.pdf", pages: 43, type: "PPTX", area: "philosophy", topic: "Lectures", by: "Syed Noman Ali" },
        { id: "ge-phil-03", title: "3. Epistemology: Pragmatism & Scientism", pdf: "/files/general-education/philosophy/03-3-epistemology-pragmatism-and-scientism.pdf", pages: 30, type: "PPTX", area: "philosophy", topic: "Lectures", by: "Syed Noman Ali" },
        { id: "ge-phil-04", title: "4. Knowing Truth", pdf: "/files/general-education/philosophy/04-4-knowing-truth.pdf", pages: 28, type: "PPTX", area: "philosophy", topic: "Lectures", by: "Syed Noman Ali" },
        { id: "ge-phil-05", title: "5. Reality", pdf: "/files/general-education/philosophy/05-5-reality.pdf", pages: 29, type: "PPTX", area: "philosophy", topic: "Lectures", by: "Syed Noman Ali" },
        { id: "ge-phil-06", title: "6. Human Nature", pdf: "/files/general-education/philosophy/06-6-human-nature.pdf", pages: 31, type: "PPTX", area: "philosophy", topic: "Lectures", by: "Syed Noman Ali" },
        { id: "ge-phil-07", title: "7. Free Will & Determinism", pdf: "/files/general-education/philosophy/07-7-free-will-and-determinism.pdf", pages: 33, type: "PPTX", area: "philosophy", topic: "Lectures", by: "Syed Noman Ali" },
        { id: "ge-phil-08", title: "8. Existentialism", pdf: "/files/general-education/philosophy/08-8-existentialism.pdf", pages: 20, type: "PPTX", area: "philosophy", topic: "Lectures", by: "Syed Noman Ali" },
        { id: "ge-phil-09", title: "9. Aesthetics", pdf: "/files/general-education/philosophy/09-9-aesthetics.pdf", pages: 29, type: "PPTX", area: "philosophy", topic: "Lectures", by: "Syed Noman Ali" },
        // Behavioural Sciences
        { id: "ge-beh-01", title: "Introduction to Behavioural Sciences", pdf: "/files/general-education/behavioural-sciences/01-introduction-to-behavioural-sciences.pdf", pages: 21, type: "PPTX", area: "behavioural-sciences", topic: "Lectures", by: "Sadia Awan" },
        { id: "ge-beh-02", title: "Understanding Behaviours", pdf: "/files/general-education/behavioural-sciences/02-understanding-behaviours.pdf", pages: 28, type: "PPTX", area: "behavioural-sciences", topic: "Lectures" },
        { id: "ge-beh-03", title: "Learning", pdf: "/files/general-education/behavioural-sciences/03-learning.pdf", pages: 27, type: "PPTX", area: "behavioural-sciences", topic: "Lectures" },
        { id: "ge-beh-04", title: "Personality Theories", pdf: "/files/general-education/behavioural-sciences/04-personality-theories.pdf", pages: 38, type: "PPTX", area: "behavioural-sciences", topic: "Lectures", by: "Sadia Awan" },
        { id: "ge-beh-05", title: "Understanding the Patient's Psychology: Fear, Anxiety & Disorders", pdf: "/files/general-education/behavioural-sciences/05-understanding-the-patient-s-psychology-fear-anxiety-and-diso.pdf", pages: 18, type: "PPTX", area: "behavioural-sciences", topic: "Lectures" },
        { id: "ge-beh-06", title: "Behavioural Psychology Quiz & Sample Paper", pdf: "/files/general-education/behavioural-sciences/06-behavioural-psychology-quiz-and-sample-paper.pdf", pages: 2, type: "DOCX", area: "behavioural-sciences", topic: "Revision", by: "Sadia Awan" },
      ],
      ddc: [],
    },
    areas: [
      {
        slug: "islamic-studies",
        title: "Islamic Studies",
        summary: "Introduction to Islam, the Quran and Hadith, Seerah, Fiqh, Islamic history and family life in Islam.",
        topics: ["Introduction to Islam", "Quran & Hadith", "Seerah", "Fiqh", "Islamic history", "Family & society"],
      },
      {
        slug: "pakistan-studies",
        title: "Pakistan Studies",
        summary: "Pakistan's history, geography, society, economy and current issues, chapter by chapter.",
        topics: ["Introduction", "Political history", "Geography", "Society & culture", "Economy", "Contemporary issues"],
      },
      {
        slug: "research-methods",
        title: "Research Methods",
        summary: "How research works: questions, literature search, study designs, qualitative and quantitative methods, ethics and writing.",
        topics: ["Research questions", "Literature search", "Study designs", "Qualitative & quantitative", "Ethics", "Writing a paper"],
      },
      {
        slug: "philosophy",
        title: "Philosophy",
        summary: "Introduction and history of philosophy, knowledge and truth, reality, human nature, free will, existentialism and aesthetics.",
        topics: ["History of ideas", "Epistemology", "Truth & reality", "Human nature", "Free will", "Existentialism", "Aesthetics"],
      },
      {
        slug: "behavioural-sciences",
        title: "Behavioural Sciences",
        summary: "Behaviour, learning, personality and the patient's psychology in dental practice.",
        topics: ["Behavioural sciences", "Learning", "Personality", "Patient psychology"],
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
