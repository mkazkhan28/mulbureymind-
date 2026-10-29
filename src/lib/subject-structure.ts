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
        { id: "anat-histo-24", title: "Gross Anatomy & Histology of the Lung", pdf: "/files/anatomy/histology/24-lung.pdf", pages: 39, type: "PPTX", area: "histology", topic: "Respiratory System" },
        { id: "anat-histo-25", title: "Histology of Thyroid & Parathyroid Glands", pdf: "/files/anatomy/histology/25-thyroid-parathyroid-histology.pdf", pages: 7, type: "PPTX", area: "histology", topic: "Endocrine Glands" },
        { id: "anat-histo-26", title: "Thyroid & Parathyroid Glands", pdf: "/files/anatomy/histology/26-thyroid-parathyroid.pdf", pages: 20, type: "PPTX", area: "histology", topic: "Endocrine Glands" },
        { id: "anat-histo-27", title: "Overview of the Urinary System", pdf: "/files/anatomy/histology/27-urinary-system.pdf", pages: 32, type: "PPTX", area: "histology", topic: "Urinary & Reproductive", by: "Dr. Muhammad Rafique" },
        { id: "anat-histo-28", title: "Introduction to the Male Reproductive System", pdf: "/files/anatomy/histology/28-male-reproductive-system.pdf", pages: 35, type: "PPTX", area: "histology", topic: "Urinary & Reproductive" },
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
