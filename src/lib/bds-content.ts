export interface BDSYear {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  status: "active" | "pending";
  description: string;
}

export interface Subject {
  id: string;
  yearId: string;
  name: string;
  code: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  accentColor: string;
  mcqCount: number;
  flashcardCount: number;
  pastPapersCount: number;
  topicsCount: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  slug: string;
  description: string;
  highYield: boolean;
  mcqCount: number;
  flashcardCount: number;
}

export interface MCQ {
  id: string;
  subjectId: string;
  topicId: string;
  yearSource?: string; // e.g. "UHS 2023 Annual", "NUMS 2022"
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isPastPaper?: boolean;
}

export interface Flashcard {
  id: string;
  deckId: string;
  subjectId: string;
  front: string;
  back: string;
  clinicalNote?: string;
}

export interface FlashcardDeck {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  cardCount: number;
}

export interface StudyResource {
  id: string;
  subjectId: string;
  title: string;
  type: "PDF" | "PPTX" | "DOCX";
  fileSize: string;
  author: string;
  isPremium: boolean;
  description: string;
}

// -------------------------------------------------------------
// Academic Years (BDS 1st Year Active, Others Pending)
// -------------------------------------------------------------
export const BDS_YEARS: BDSYear[] = [
  {
    id: "bds-1",
    name: "BDS 1st Year (Active)",
    slug: "1st-year",
    isActive: true,
    status: "active",
    description: "Anatomy, Physiology, Oral Biology, Biochemistry, Pharmacology & Pathology"
  },
  {
    id: "bds-2",
    name: "BDS 2nd Year (Pending)",
    slug: "2nd-year",
    isActive: false,
    status: "pending",
    description: "Curriculum modules unlocking for the upcoming academic session."
  },
  {
    id: "bds-3",
    name: "BDS 3rd Year (Pending)",
    slug: "3rd-year",
    isActive: false,
    status: "pending",
    description: "Clinical medicine, surgery and oral pathology modules pending."
  },
  {
    id: "bds-4",
    name: "BDS Final Year (Pending)",
    slug: "final-year",
    isActive: false,
    status: "pending",
    description: "Operative dentistry, prosthodontics, orthodontics & oral surgery pending."
  }
];

// -------------------------------------------------------------
// BDS 1st Year Subjects (6 Core Subjects Specified by User)
// -------------------------------------------------------------
export const BDS_SUBJECTS: Subject[] = [
  {
    id: "anat",
    yearId: "bds-1",
    name: "General Anatomy & Histology",
    code: "ANAT-101",
    slug: "anatomy",
    icon: "💀",
    description: "Head and neck gross anatomy, cranial nerves, TMJ osteology, triangles of the neck, systemic embryology, and general histology.",
    color: "from-blue-600 to-indigo-700",
    accentColor: "blue",
    mcqCount: 680,
    flashcardCount: 190,
    pastPapersCount: 10,
    topicsCount: 5
  },
  {
    id: "phys",
    yearId: "bds-1",
    name: "Human Physiology",
    code: "PHYS-102",
    slug: "physiology",
    icon: "🫀",
    description: "Nerve & muscle action potentials, cardiovascular hemodynamics, respiratory gas exchange, renal balance, and neuro-endocrine regulation.",
    color: "from-rose-600 to-pink-700",
    accentColor: "rose",
    mcqCount: 620,
    flashcardCount: 175,
    pastPapersCount: 10,
    topicsCount: 5
  },
  {
    id: "oral-bio",
    yearId: "bds-1",
    name: "Oral Biology & Tooth Morphology",
    code: "OBIO-103",
    slug: "oral-biology",
    icon: "🦷",
    description: "Amelogenesis, dentinogenesis, dental pulp, periodontium histology, salivary gland dynamics, tooth eruption, and crown morphology.",
    color: "from-teal-600 to-cyan-700",
    accentColor: "teal",
    mcqCount: 710,
    flashcardCount: 220,
    pastPapersCount: 10,
    topicsCount: 5
  },
  {
    id: "biochem",
    yearId: "bds-1",
    name: "Biochemistry",
    code: "BIOCH-104",
    slug: "biochemistry",
    icon: "🧬",
    description: "Enzyme kinetics, carbohydrate & lipid metabolism, vitamins in oral health, calcium-phosphate regulation, and molecular genetics.",
    color: "from-purple-600 to-violet-700",
    accentColor: "purple",
    mcqCount: 540,
    flashcardCount: 160,
    pastPapersCount: 10,
    topicsCount: 5
  },
  {
    id: "pharm",
    yearId: "bds-1",
    name: "Pharmacology & Therapeutics",
    code: "PHARM-105",
    slug: "pharmacology",
    icon: "💊",
    description: "Dental therapeutics, local anesthetic formulations, autonomic drugs, analgesics, antimicrobials, and emergency resuscitation pharmacology.",
    color: "from-sky-600 to-blue-700",
    accentColor: "sky",
    mcqCount: 650,
    flashcardCount: 180,
    pastPapersCount: 10,
    topicsCount: 5
  },
  {
    id: "path",
    yearId: "bds-1",
    name: "General Pathology",
    code: "PATH-106",
    slug: "general-pathology",
    icon: "🔬",
    description: "Cellular adaptations, necrosis vs apoptosis, acute & chronic inflammation, tissue repair, thrombosis, shock, and carcinogenesis.",
    color: "from-emerald-600 to-teal-700",
    accentColor: "emerald",
    mcqCount: 580,
    flashcardCount: 150,
    pastPapersCount: 10,
    topicsCount: 5
  }
];

// -------------------------------------------------------------
// High-Yield Topics for BDS 1st Year Core Subjects
// -------------------------------------------------------------
export const BDS_TOPICS: Topic[] = [
  // Anatomy Topics
  {
    id: "anat-top-1",
    subjectId: "anat",
    name: "Head & Neck Anatomy & Triangles",
    slug: "head-neck-triangles",
    description: "Anterior and posterior triangles of neck, carotid sheath contents, cervical fascia, and deep facial spaces.",
    highYield: true,
    mcqCount: 150,
    flashcardCount: 45
  },
  {
    id: "anat-top-2",
    subjectId: "anat",
    name: "Cranial Nerves (Trigeminal CN V & Facial CN VII)",
    slug: "cranial-nerves",
    description: "Ophthalmic, maxillary, mandibular nerve branches, facial nerve motor branches, chorda tympani, and sensory supply to teeth.",
    highYield: true,
    mcqCount: 165,
    flashcardCount: 50
  },
  {
    id: "anat-top-3",
    subjectId: "anat",
    name: "TMJ & Muscles of Mastication",
    slug: "tmj-mastication",
    description: "Masseter, temporalis, medial and lateral pterygoid attachments, articular disc movements, and TMJ innervation.",
    highYield: true,
    mcqCount: 130,
    flashcardCount: 35
  },
  {
    id: "anat-top-4",
    subjectId: "anat",
    name: "Skull Osteology, Foramina & Mandible",
    slug: "skull-mandible",
    description: "Foramen ovale, rotundum, spinosum, lacerum, mandibular canal, mental foramen, and pterygopalatine fossa.",
    highYield: true,
    mcqCount: 125,
    flashcardCount: 35
  },
  {
    id: "anat-top-5",
    subjectId: "anat",
    name: "General Histology (Epithelium, Cartilage & Bone)",
    slug: "general-histology",
    description: "Stratified squamous epithelium, osteon structure, Haversian canals, hyaline cartilage, and ossification.",
    highYield: false,
    mcqCount: 110,
    flashcardCount: 25
  },

  // Physiology Topics
  {
    id: "phys-top-1",
    subjectId: "phys",
    name: "Action Potentials & Nerve-Muscle Transmission",
    slug: "action-potentials",
    description: "Resting membrane potential, Na+/K+ ATPase, voltage-gated channels, neuromuscular junction, and muscle contraction.",
    highYield: true,
    mcqCount: 135,
    flashcardCount: 40
  },
  {
    id: "phys-top-2",
    subjectId: "phys",
    name: "Cardiovascular Dynamics & Blood Pressure Regulation",
    slug: "cvs-dynamics",
    description: "Cardiac cycle, ECG waves, baroreceptors, renin-angiotensin-aldosterone system, and hemostatic clot formation.",
    highYield: true,
    mcqCount: 140,
    flashcardCount: 40
  },
  {
    id: "phys-top-3",
    subjectId: "phys",
    name: "Respiratory Physiology & Gas Transport",
    slug: "respiratory-physiology",
    description: "Lung volumes and capacities, oxygen-hemoglobin dissociation curve, CO2 transport, and respiratory center regulation.",
    highYield: true,
    mcqCount: 115,
    flashcardCount: 30
  },
  {
    id: "phys-top-4",
    subjectId: "phys",
    name: "Renal Function, GFR & Acid-Base Balance",
    slug: "renal-acid-base",
    description: "Nephron transport mechanisms, countercurrent multiplier, metabolic acidosis and alkalosis compensation.",
    highYield: false,
    mcqCount: 110,
    flashcardCount: 30
  },
  {
    id: "phys-top-5",
    subjectId: "phys",
    name: "Calcium Homeostasis & Endocrine Pancreas",
    slug: "calcium-endocrine",
    description: "Parathyroid hormone (PTH), Calcitonin, Vitamin D3 actions on bone and dentin, insulin vs glucagon signaling.",
    highYield: true,
    mcqCount: 120,
    flashcardCount: 35
  },

  // Oral Biology Topics
  {
    id: "oral-top-1",
    subjectId: "oral-bio",
    name: "Amelogenesis & Enamel Microstructure",
    slug: "amelogenesis",
    description: "Life cycle of ameloblasts, enamel prisms/rods, Hunter-Schreger bands, Striae of Retzius, and enamel tufts/lamellae.",
    highYield: true,
    mcqCount: 160,
    flashcardCount: 50
  },
  {
    id: "oral-top-2",
    subjectId: "oral-bio",
    name: "Dentinogenesis & Pulp-Dentin Complex",
    slug: "dentin-pulp-complex",
    description: "Primary, secondary, and tertiary dentin, dentinal tubules, hydrodynamic theory of dentin sensitivity, and dental pulp zones.",
    highYield: true,
    mcqCount: 155,
    flashcardCount: 45
  },
  {
    id: "oral-top-3",
    subjectId: "oral-bio",
    name: "Periodontal Ligament (PDL) & Alveolar Bone",
    slug: "periodontium",
    description: "Principal fiber groups (Sharpey's fibers), cementogenesis, cellular vs acellular cementum, and bundle bone.",
    highYield: true,
    mcqCount: 140,
    flashcardCount: 45
  },
  {
    id: "oral-top-4",
    subjectId: "oral-bio",
    name: "Oral Mucosa & Salivary Glands Histology",
    slug: "oral-mucosa-salivary",
    description: "Keratinized vs non-keratinized epithelium, serous vs mucous acini, salivary duct system, and secretory IgA.",
    highYield: true,
    mcqCount: 130,
    flashcardCount: 40
  },
  {
    id: "oral-top-5",
    subjectId: "oral-bio",
    name: "Permanent Tooth Morphology & Crown Anatomy",
    slug: "tooth-morphology",
    description: "Incisor, canine, premolar, and molar landmarks, Carabelli cusp, oblique ridge of maxillary molars, and root canal configurations.",
    highYield: true,
    mcqCount: 125,
    flashcardCount: 40
  },

  // Biochemistry Topics
  {
    id: "biochem-top-1",
    subjectId: "biochem",
    name: "Enzyme Kinetics & Clinical Enzymology",
    slug: "enzyme-kinetics",
    description: "Michaelis-Menten kinetics, competitive vs non-competitive inhibition, allosteric regulation, and diagnostic serum enzymes.",
    highYield: true,
    mcqCount: 120,
    flashcardCount: 35
  },
  {
    id: "biochem-top-2",
    subjectId: "biochem",
    name: "Carbohydrate Metabolism (Glycolysis & TCA)",
    slug: "carbohydrate-metabolism",
    description: "Glycolysis regulatory enzymes, pyruvate dehydrogenase complex, Krebs cycle, and lactic acid production in dental plaque.",
    highYield: true,
    mcqCount: 130,
    flashcardCount: 40
  },
  {
    id: "biochem-top-3",
    subjectId: "biochem",
    name: "Vitamins in Collagen Synthesis & Dental Health",
    slug: "vitamins-dental",
    description: "Vitamin C (ascorbic acid prolyl hydroxylase co-factor, scurvy), Vitamin D3 (rickets, osteomalacia), and Vitamin K.",
    highYield: true,
    mcqCount: 110,
    flashcardCount: 30
  },
  {
    id: "biochem-top-4",
    subjectId: "biochem",
    name: "Calcium, Phosphate & Fluoride Metabolism",
    slug: "mineral-metabolism",
    description: "Hydroxyapatite crystallization, fluorapatite substitution, remineralization dynamics, and systemic regulation.",
    highYield: true,
    mcqCount: 100,
    flashcardCount: 30
  },
  {
    id: "biochem-top-5",
    subjectId: "biochem",
    name: "Lipid & Protein Metabolism",
    slug: "lipid-protein-metabolism",
    description: "Beta-oxidation of fatty acids, urea cycle, transamination reactions, and plasma lipoproteins (HDL/LDL).",
    highYield: false,
    mcqCount: 80,
    flashcardCount: 25
  },

  // Pharmacology Topics
  {
    id: "pharm-top-1",
    subjectId: "pharm",
    name: "Local Anesthetics & Vasoconstrictors",
    slug: "local-anesthetics",
    description: "Mechanism of action, esters vs amides, maximum recommended doses, epinephrine contraindications, systemic toxicity (LAST).",
    highYield: true,
    mcqCount: 140,
    flashcardCount: 40
  },
  {
    id: "pharm-top-2",
    subjectId: "pharm",
    name: "Antimicrobial Chemotherapy & Prophylaxis",
    slug: "antimicrobials",
    description: "Penicillins, Cephalosporins, Macrolides, AHA infective endocarditis antibiotic prophylaxis guidelines in dentistry.",
    highYield: true,
    mcqCount: 135,
    flashcardCount: 35
  },
  {
    id: "pharm-top-3",
    subjectId: "pharm",
    name: "Analgesics, NSAIDs & Opioids",
    slug: "analgesics-nsaids",
    description: "COX-1 vs COX-2 inhibitors, paracetamol toxicity, tramadol, dental postoperative pain management algorithms.",
    highYield: true,
    mcqCount: 110,
    flashcardCount: 30
  },
  {
    id: "pharm-top-4",
    subjectId: "pharm",
    name: "Autonomic Nervous System (ANS)",
    slug: "ans-drugs",
    description: "Adrenergic agonists, anticholinergics (Atropine, Glycopyrrolate) for sialorrhea, beta-blocker interactions.",
    highYield: true,
    mcqCount: 135,
    flashcardCount: 35
  },
  {
    id: "pharm-top-5",
    subjectId: "pharm",
    name: "Medical Emergencies in Dental Office",
    slug: "dental-emergencies",
    description: "Anaphylaxis management, vasovagal syncope, hypoglycemic emergency, angina, emergency drug kit protocols.",
    highYield: true,
    mcqCount: 130,
    flashcardCount: 40
  },

  // Pathology Topics
  {
    id: "path-top-1",
    subjectId: "path",
    name: "Cellular Injury, Adaptations & Death",
    slug: "cell-injury",
    description: "Hypertrophy, hyperplasia, atrophy, metaplasia, coagulative vs liquefactive necrosis, mechanisms of apoptosis.",
    highYield: true,
    mcqCount: 125,
    flashcardCount: 35
  },
  {
    id: "path-top-2",
    subjectId: "path",
    name: "Acute & Chronic Inflammation",
    slug: "inflammation",
    description: "Vascular events, cellular recruitment, chemical mediators (histamine, prostaglandins), granulomatous inflammation.",
    highYield: true,
    mcqCount: 140,
    flashcardCount: 40
  },
  {
    id: "path-top-3",
    subjectId: "path",
    name: "Hemodynamics, Thrombosis & Shock",
    slug: "hemodynamics",
    description: "Virchow triad, embolism types, stages of shock, hemorrhage, disseminated intravascular coagulation (DIC).",
    highYield: true,
    mcqCount: 115,
    flashcardCount: 30
  },
  {
    id: "path-top-4",
    subjectId: "path",
    name: "Neoplasia & Carcinogenesis",
    slug: "neoplasia",
    description: "Benign vs malignant characteristics, oncogenes, tumor suppressor genes (p53, Rb), TNM staging, chemical carcinogens.",
    highYield: true,
    mcqCount: 120,
    flashcardCount: 30
  },
  {
    id: "path-top-5",
    subjectId: "path",
    name: "Tissue Repair & Wound Healing",
    slug: "tissue-repair",
    description: "Primary vs secondary intention, granulation tissue, collagen remodeling, keloids, and extraction socket healing.",
    highYield: true,
    mcqCount: 80,
    flashcardCount: 25
  }
];

// -------------------------------------------------------------
// Sample High-Yield Past-Paper & Practice MCQs (Covering All 6 BDS 1st Year Subjects)
// -------------------------------------------------------------
export const BDS_MCQS: MCQ[] = [
  // ANATOMY MCQs
  {
    id: "mcq-anat-1",
    subjectId: "anat",
    topicId: "anat-top-2",
    yearSource: "UHS BDS Annual 2023",
    question: "During an inferior alveolar nerve block injection, which anatomic foramen on the medial surface of the mandibular ramus must the needle target just above the lingula?",
    options: [
      "Mental foramen",
      "Mandibular foramen",
      "Foramen ovale",
      "Incisive foramen"
    ],
    correctIndex: 1,
    explanation: "Correct answer is B: Mandibular foramen. The inferior alveolar nerve enters the mandibular canal through the mandibular foramen, guarded by the bony projection lingula. Deposition of local anesthetic solution here numbs the ipsilateral mandibular teeth.",
    difficulty: "Easy",
    isPastPaper: true
  },
  {
    id: "mcq-anat-2",
    subjectId: "anat",
    topicId: "anat-top-3",
    yearSource: "NUMS BDS 2022",
    question: "Which of the following muscles of mastication is primarily responsible for depressing the mandible to open the mouth as well as protruding it forward?",
    options: [
      "Masseter muscle",
      "Temporalis muscle",
      "Lateral pterygoid muscle",
      "Medial pterygoid muscle"
    ],
    correctIndex: 2,
    explanation: "Correct answer is C: Lateral pterygoid muscle. Unlike the temporalis, masseter, and medial pterygoid which elevate the mandible to close the jaw, the lateral pterygoid muscle depresses the mandible to open the mouth and assists in protrusion.",
    difficulty: "Medium",
    isPastPaper: true
  },

  // PHYSIOLOGY MCQs
  {
    id: "mcq-phys-1",
    subjectId: "phys",
    topicId: "phys-top-1",
    yearSource: "KMU BDS 2023",
    question: "The rapid depolarizing upstroke of the neuronal action potential is primarily caused by which membrane event?",
    options: [
      "Efflux of potassium ions through voltage-gated K+ channels",
      "Influx of sodium ions through voltage-gated Na+ channels",
      "Active transport of chloride ions into the axon",
      "Activation of the electrogenic sodium-potassium ATPase pump"
    ],
    correctIndex: 1,
    explanation: "Correct answer is B: Influx of sodium ions through voltage-gated Na+ channels. Depolarization beyond threshold opens activation (m) gates of voltage-gated Na+ channels, driving Na+ into the cell down its electrochemical gradient.",
    difficulty: "Easy",
    isPastPaper: true
  },
  {
    id: "mcq-phys-2",
    subjectId: "phys",
    topicId: "phys-top-5",
    yearSource: "UHS BDS Annual 2022",
    question: "Which hormone is the primary acute regulator that increases serum ionized calcium levels by stimulating osteoclastic bone resorption and renal tubular calcium reabsorption?",
    options: [
      "Calcitonin",
      "Parathyroid Hormone (PTH)",
      "Thyroxine",
      "Aldosterone"
    ],
    correctIndex: 1,
    explanation: "Correct answer is B: Parathyroid Hormone (PTH). Secreted by parathyroid chief cells in response to hypocalcemia, PTH stimulates osteoclasts, increases renal distal tubule Ca2+ reabsorption, and activates 1-alpha-hydroxylase to produce active Vitamin D3.",
    difficulty: "Easy",
    isPastPaper: true
  },

  // ORAL BIOLOGY MCQs
  {
    id: "mcq-oral-1",
    subjectId: "oral-bio",
    topicId: "oral-top-1",
    yearSource: "UHS BDS Annual 2023",
    question: "During tooth development, incremental growth lines representing rhythmic periodic apposition of enamel matrix in longitudinal sections of ground enamel are known as:",
    options: [
      "Lines of von Ebner",
      "Striae of Retzius",
      "Contour lines of Owen",
      "Hunter-Schreger bands"
    ],
    correctIndex: 1,
    explanation: "Correct answer is B: Striae of Retzius. The incremental growth lines of enamel are called Striae of Retzius. (Lines of von Ebner and Contour lines of Owen are incremental growth lines of dentin).",
    difficulty: "Medium",
    isPastPaper: true
  },
  {
    id: "mcq-oral-2",
    subjectId: "oral-bio",
    topicId: "oral-top-2",
    yearSource: "NUMS BDS 2023",
    question: "According to Brännström's Hydrodynamic Theory of dentin sensitivity, cold stimuli applied to exposed root dentin evoke sharp transient pain primarily by:",
    options: [
      "Direct electrical stimulation of nerve fibers running through the enamel surface",
      "Rapid fluid displacement within dentinal tubules exciting pulpal mechanoreceptor nerve endings",
      "Thermal expansion of hydroxyapatite crystals compressing ameloblasts",
      "Release of substance P directly into the periodontal ligament space"
    ],
    correctIndex: 1,
    explanation: "Correct answer is B: Rapid fluid displacement within dentinal tubules. Cold triggers rapid outward movement of dentinal fluid, which deforms and fires myelinated A-delta nerve endings at the pulp-dentin junction.",
    difficulty: "Medium",
    isPastPaper: true
  },

  // BIOCHEMISTRY MCQs
  {
    id: "mcq-biochem-1",
    subjectId: "biochem",
    topicId: "biochem-top-3",
    yearSource: "UHS BDS Annual 2021",
    question: "A dental patient presents with bleeding spongy gums, loose teeth, and poor wound healing after extraction. Deficient activity of which enzyme requiring Vitamin C as a co-factor causes defective collagen cross-linking in this condition?",
    options: [
      "Lysyl oxidase",
      "Prolyl and Lysyl hydroxylase",
      "Alkaline phosphatase",
      "Carbonic anhydrase"
    ],
    correctIndex: 1,
    explanation: "Correct answer is B: Prolyl and Lysyl hydroxylase. Ascorbic acid (Vitamin C) maintains iron in its active ferrous (Fe2+) state for prolyl and lysyl hydroxylase. Without hydroxyproline, tropocollagen triple helices cannot cross-link, causing scurvy.",
    difficulty: "Easy",
    isPastPaper: true
  },
  {
    id: "mcq-biochem-2",
    subjectId: "biochem",
    topicId: "biochem-top-1",
    yearSource: "KMU BDS 2022",
    question: "In enzyme kinetics, what happens to the Michaelis constant (Km) and maximum velocity (Vmax) in the presence of a competitive reversible inhibitor?",
    options: [
      "Km increases, Vmax remains unchanged",
      "Km decreases, Vmax decreases",
      "Km remains unchanged, Vmax decreases",
      "Both Km and Vmax decrease proportionally"
    ],
    correctIndex: 0,
    explanation: "Correct answer is A: Km increases, Vmax remains unchanged. A competitive inhibitor binds reversibly to the active site; increasing substrate concentration can outcompete the inhibitor, so Vmax can still be reached, while apparent affinity decreases (Km rises).",
    difficulty: "Medium",
    isPastPaper: true
  },

  // PHARMACOLOGY MCQs
  {
    id: "mcq-pharm-1",
    subjectId: "pharm",
    topicId: "pharm-top-1",
    yearSource: "UHS BDS Annual 2023",
    question: "A 45-year-old cardiac patient requiring dental extraction is taking non-selective beta-blockers (Propranolol). Which local anesthetic formulation is safest to avoid severe hypertensive crisis?",
    options: [
      "Lignocaine 2% with 1:80,000 Epinephrine",
      "Mepivacaine 3% plain (without vasoconstrictor)",
      "Articaine 4% with 1:100,000 Epinephrine",
      "Lignocaine 2% with 1:100,000 Norepinephrine"
    ],
    correctIndex: 1,
    explanation: "Correct answer is B: Mepivacaine 3% plain. Administration of epinephrine or norepinephrine in a patient taking non-selective beta-blockers leads to unopposed alpha-1 receptor stimulation, triggering dangerous acute vasoconstriction, malignant hypertension, and reflex bradycardia.",
    difficulty: "Medium",
    isPastPaper: true
  },
  {
    id: "mcq-pharm-2",
    subjectId: "pharm",
    topicId: "pharm-top-2",
    yearSource: "NUMS BDS 2022",
    question: "According to the American Heart Association (AHA) guidelines for the prevention of infective endocarditis in high-risk dental procedures, what is the standard first-line oral prophylactic regimen?",
    options: [
      "Amoxicillin 2.0 grams orally 30 to 60 minutes before the procedure",
      "Clindamycin 600 mg orally 2 hours before the procedure",
      "Azithromycin 500 mg orally 12 hours before the procedure",
      "Cephalexin 1.0 gram orally after the dental extraction"
    ],
    correctIndex: 0,
    explanation: "Correct answer is A: Amoxicillin 2.0 grams orally 30 to 60 minutes prior to procedure. This provides high bactericidal peak blood levels during the anticipated transient bacteremia.",
    difficulty: "Easy",
    isPastPaper: true
  },

  // PATHOLOGY MCQs
  {
    id: "mcq-path-1",
    subjectId: "path",
    topicId: "path-top-1",
    yearSource: "KMU BDS 2023",
    question: "Which of the following cellular changes is considered a reversible adaptation rather than irreversible cell death?",
    options: [
      "Karyorrhexis of the nucleus",
      "Squamous metaplasia of respiratory bronchial epithelium",
      "Rupture of lysosomal membranes",
      "Pyknosis of nuclear chromatin"
    ],
    correctIndex: 1,
    explanation: "Correct answer is B: Squamous metaplasia. Metaplasia is a reversible adaptive change where one adult cell type is replaced by another in response to chronic irritation. Karyorrhexis, pyknosis, and karyolysis signify irreversible necrotic cell death.",
    difficulty: "Easy",
    isPastPaper: true
  },
  {
    id: "mcq-path-2",
    subjectId: "path",
    topicId: "path-top-2",
    yearSource: "UHS BDS Annual 2022",
    question: "In the microscopic examination of a tuberculous granuloma from a patient with scrofula, which multinucleated giant cell pattern is classically characterized by nuclei arranged in a horseshoe configuration along the periphery?",
    options: [
      "Foreign body giant cells",
      "Langhans giant cells",
      "Touton giant cells",
      "Reed-Sternberg cells"
    ],
    correctIndex: 1,
    explanation: "Correct answer is B: Langhans giant cells. Characteristically found in caseating granulomas of tuberculosis, their peripheral horseshoe nuclear arrangement distinguishes them from haphazardly clustered foreign-body giant cells.",
    difficulty: "Easy",
    isPastPaper: true
  }
];

// -------------------------------------------------------------
// Digital Flashcards Decks & Cards for BDS 1st Year Core Subjects
// -------------------------------------------------------------
export const BDS_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: "deck-anat-cranial",
    subjectId: "anat",
    title: "Cranial Nerves (CN V & VII) & Foramina",
    description: "Trigeminal divisions, branches, skull exits, and sensory supply to dental pulp.",
    cardCount: 28
  },
  {
    id: "deck-phys-action",
    subjectId: "phys",
    title: "Action Potentials & Hemostasis",
    description: "Ion channel conductance, refractory periods, and platelet clotting cascade.",
    cardCount: 24
  },
  {
    id: "deck-oral-amelogenesis",
    subjectId: "oral-bio",
    title: "Amelogenesis & Dentin Histology",
    description: "Tomes processes, enamel rod directions, and dentinal tubule fluid dynamics.",
    cardCount: 30
  },
  {
    id: "deck-biochem-enzymes",
    subjectId: "biochem",
    title: "Enzymes & Dental Vitamin Deficiencies",
    description: "Km, Vmax, competitive inhibition, and scurvy collagen defects.",
    cardCount: 22
  },
  {
    id: "deck-pharm-la",
    subjectId: "pharm",
    title: "Local Anesthetics & Dosages",
    description: "Maximum safe doses, vasoconstrictor limits, and toxicity antidotes.",
    cardCount: 25
  },
  {
    id: "deck-path-necrosis",
    subjectId: "path",
    title: "Cell Injury, Necrosis & Inflammation",
    description: "Coagulative, liquefactive, caseous necrosis, and acute inflammatory mediators.",
    cardCount: 20
  }
];

export const BDS_FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    deckId: "deck-anat-cranial",
    subjectId: "anat",
    front: "Through which cranial foramen does the mandibular division of the Trigeminal nerve (CN V3) exit the skull base?",
    back: "Foramen Ovale. (Mnemonic MALE: Mandibular nerve, Accessory meningeal artery, Lesser petrosal nerve, Emissary vein).",
    clinicalNote: "Carries both sensory fibers to lower jaw and motor fibers to muscles of mastication."
  },
  {
    id: "fc-2",
    deckId: "deck-phys-action",
    subjectId: "phys",
    front: "What is the physiological role of the absolute refractory period in cardiac and neuronal action potentials?",
    back: "Prevents tetanic contractions and ensures unidirectional propagation of nerve impulses down the axon.",
    clinicalNote: "Caused by the closed inactivation (h) gates of voltage-gated Na+ channels."
  },
  {
    id: "fc-3",
    deckId: "deck-oral-amelogenesis",
    subjectId: "oral-bio",
    front: "What are the Hunter-Schreger bands seen in longitudinal sections of tooth enamel under polarized light?",
    back: "An optical phenomenon caused by alternating changes in the orientation of adjacent groups of enamel rod prisms (diazones and parazones).",
    clinicalNote: "Increases enamel resistance to cleavage and fracture under masticatory stress."
  },
  {
    id: "fc-4",
    deckId: "deck-biochem-enzymes",
    subjectId: "biochem",
    front: "What specific amino acid residues in the pro-alpha collagen chain undergo post-translational hydroxylation requiring Vitamin C?",
    back: "Proline and Lysine residues, forming Hydroxyproline and Hydroxylysine.",
    clinicalNote: "Hydroxyproline provides interchain hydrogen bonds essential for triple-helix thermal stability."
  },
  {
    id: "fc-5",
    deckId: "deck-pharm-la",
    subjectId: "pharm",
    front: "What is the maximum recommended dose (MRD) of 2% Lignocaine with 1:100,000 Epinephrine for a healthy adult?",
    back: "7.0 mg/kg (up to an absolute maximum limit of 500 mg, approximately 13-14 dental cartridges). For plain Lignocaine without epinephrine, MRD is 4.4 mg/kg (max 300 mg).",
    clinicalNote: "Remember: 1 cartridge of 1.8 mL 2% lignocaine contains 36 mg of lignocaine."
  },
  {
    id: "fc-6",
    deckId: "deck-path-necrosis",
    subjectId: "path",
    front: "What type of necrosis is uniquely characteristic of ischemic infarction of brain tissue?",
    back: "Liquefactive Necrosis (due to high lipid content and rapid release of powerful hydrolytic enzymes from microglia and neutrophils).",
    clinicalNote: "In all other solid organs (heart, kidney, spleen), ischemia causes coagulative necrosis."
  }
];

// -------------------------------------------------------------
// Downloadable Study Notes & Slide Resources (BDS 1st Year)
// -------------------------------------------------------------
export const BDS_RESOURCES: StudyResource[] = [
  {
    id: "res-1",
    subjectId: "anat",
    title: "Head & Neck Anatomy & Nerve Blocks Handbook",
    type: "PDF",
    fileSize: "6.4 MB",
    author: "Dept. of Anatomy & Maxillofacial Surgery",
    isPremium: true,
    description: "Detailed dissection diagrams of mandibular, maxillary, and infraorbital nerve pathways."
  },
  {
    id: "res-2",
    subjectId: "phys",
    title: "Guyton Physiology Dental High-Yield Revision Tables",
    type: "PDF",
    fileSize: "4.8 MB",
    author: "Mulberry Mind Academic Team",
    isPremium: false,
    description: "Fast review sheets for cardiovascular loops, neuromuscular physiology, and acid-base disorders."
  },
  {
    id: "res-3",
    subjectId: "oral-bio",
    title: "Oral Histology & Tooth Morphology Slide Atlas",
    type: "PPTX",
    fileSize: "22.5 MB",
    author: "Oral Biology Research Faculty",
    isPremium: true,
    description: "High-resolution microscope micrographs of ground enamel, dentinal tubules, and Sharpey's fibers."
  },
  {
    id: "res-4",
    subjectId: "biochem",
    title: "Medical Biochemistry Summary for Dental Students",
    type: "PDF",
    fileSize: "3.9 MB",
    author: "Biochemistry Exam Board",
    isPremium: true,
    description: "Enzyme kinetics graphs, metabolic pathway maps, and calcium-fluoride mineralization charts."
  },
  {
    id: "res-5",
    subjectId: "pharm",
    title: "High-Yield Dental Pharmacology Master Summary",
    type: "PDF",
    fileSize: "4.8 MB",
    author: "Mulberry Mind Academic Team",
    isPremium: true,
    description: "Tabular comparisons of autonomic drugs, emergency kits, local anesthetic calculations, and antimicrobials."
  },
  {
    id: "res-6",
    subjectId: "path",
    title: "Robbins General Pathology 1st Year High-Yield Notes",
    type: "PDF",
    fileSize: "5.5 MB",
    author: "Prof. Pathology Reviewers",
    isPremium: false,
    description: "Condensed exam-oriented notes covering cellular adaptation, acute inflammation mediators, and neoplasia genetics."
  }
];

// -------------------------------------------------------------
// Membership Plans
// -------------------------------------------------------------
export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  pricePKR: number;
  periodText: string;
  durationMonths: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "plan-free",
    name: "Free Student Starter",
    slug: "starter",
    pricePKR: 0,
    periodText: "Forever Free",
    durationMonths: 0,
    description: "Try out the platform and practice with initial high-yield questions for BDS 1st Year.",
    features: [
      "Access to sample MCQs across all 6 first-year subjects",
      "Basic past-paper overview (DUHS)",
      "Sample digital flashcard decks",
      "Instant quiz scoring & rationale",
      "Community discussion preview"
    ]
  },
  {
    id: "plan-monthly",
    name: "Monthly Pass",
    slug: "monthly",
    pricePKR: 399,
    periodText: "per Month",
    durationMonths: 1,
    description: "Perfect for month-by-month exam prep.",
    features: [
      "Full access to all 6 BDS 1st Year subjects",
      "Over 3,700+ past paper & practice MCQs",
      "Timed examination mock mode",
      "Complete textbook-cited clinical explanations",
      "All active recall digital flashcard decks",
      "Quiz score tracking and weak-topic analytics"
    ]
  },
  {
    id: "plan-sixmonth",
    name: "6-Month Semester Pass",
    slug: "six-month",
    badge: "Best Value",
    isPopular: true,
    pricePKR: 1499,
    periodText: "for 6 Months",
    durationMonths: 6,
    description: "Ideal for mid-term tests, send-ups, and targeted semester examination revision.",
    features: [
      "Everything in Monthly Pass",
      "6 months uninterrupted access",
      "Timed examination mock mode",
      "Detailed weak-topic analytics",
      "All active recall digital flashcard decks",
      "Priority support via WhatsApp"
    ]
  },
  {
    id: "plan-annual",
    name: "Full Year Pass",
    slug: "annual",
    pricePKR: 2999,
    periodText: "for 12 Months",
    durationMonths: 12,
    description: "Complete, unrestricted access until your final university professional examination.",
    features: [
      "Everything in 6-Month Pass",
      "10+ Years of verified past papers (UHS, NUMS, KMU, DUHS)",
      "Downloadable high-yield PDF summaries & slide atlases",
      "Bookmark difficult questions for revision",
      "Detailed weak-topic analytics across all 6 subjects",
      "Priority WhatsApp & email academic helpline",
      "Free future updates when new university past papers arrive"
    ]
  }
];

// -------------------------------------------------------------
// Subject Topics Structure (DUHS BDS 1st Year Curriculum)
// -------------------------------------------------------------
export interface SubjectTopic {
  id: string;
  title: string;
  subsections: {
    type: "ppt" | "papers" | "notes" | "mcqs";
    label: string;
    count: number;
    locked?: boolean;
  }[];
}

export const SUBJECT_TOPICS: Record<string, SubjectTopic[]> = {
  "anatomy": [
    {
      id: "anat-t1",
      title: "Introduction to Anatomy & Anatomical Terminologies",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 3, locked: false },
        { type: "papers", label: "Past Paper Questions", count: 18, locked: false },
        { type: "mcqs", label: "Practice MCQs", count: 40, locked: false },
        { type: "notes", label: "Topic Notes", count: 2, locked: false }
      ]
    },
    {
      id: "anat-t2",
      title: "Thorax & Mediastinum",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 22, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 55, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "anat-t3",
      title: "Head & Neck Anatomy & Triangles",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 7, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 35, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 80, locked: true },
        { type: "notes", label: "Topic Notes", count: 4, locked: true }
      ]
    },
    {
      id: "anat-t4",
      title: "Cranial Nerves (Trigeminal CN V & Facial CN VII)",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 6, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 40, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 90, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "anat-t5",
      title: "TMJ & Muscles of Mastication",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 28, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 60, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "anat-t6",
      title: "Skull Osteology, Foramina & Mandible",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 30, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 65, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "anat-t7",
      title: "Parotid & Submandibular Salivary Gland Anatomy",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 3, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 20, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 45, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "anat-t8",
      title: "General Histology — Epithelium, Cartilage & Bone",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 25, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 50, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "anat-t9",
      title: "Upper & Lower Limb Anatomy (General Principles)",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 18, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 35, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "anat-t10",
      title: "Systemic Embryology — Head & Neck Development",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 20, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 40, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    }
  ],

  "physiology": [
    {
      id: "phys-t1",
      title: "Introduction to Physiology & Homeostasis",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 2, locked: false },
        { type: "papers", label: "Past Paper Questions", count: 12, locked: false },
        { type: "mcqs", label: "Practice MCQs", count: 30, locked: false },
        { type: "notes", label: "Topic Notes", count: 1, locked: false }
      ]
    },
    {
      id: "phys-t2",
      title: "Action Potentials & Nerve-Muscle Transmission",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 6, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 35, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 75, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "phys-t3",
      title: "Cardiovascular Dynamics & Blood Pressure Regulation",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 7, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 38, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 80, locked: true },
        { type: "notes", label: "Topic Notes", count: 4, locked: true }
      ]
    },
    {
      id: "phys-t4",
      title: "Respiratory Physiology & Gas Transport",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 28, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 60, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "phys-t5",
      title: "Renal Function, GFR & Acid-Base Balance",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 25, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 55, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "phys-t6",
      title: "Calcium Homeostasis & Endocrine Pancreas",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 30, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 60, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "phys-t7",
      title: "Gastrointestinal Physiology & Salivary Secretion",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 22, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 48, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "phys-t8",
      title: "Blood — Composition, Coagulation & Hemostasis",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 30, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 65, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "phys-t9",
      title: "Sensory Physiology — Pain & Referred Dental Pain",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 20, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 45, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    }
  ],

  "oral-biology": [
    {
      id: "oral-t1",
      title: "Amelogenesis & Enamel Microstructure",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: false },
        { type: "papers", label: "Past Paper Questions", count: 38, locked: false },
        { type: "mcqs", label: "Practice MCQs", count: 85, locked: false },
        { type: "notes", label: "Topic Notes", count: 3, locked: false }
      ]
    },
    {
      id: "oral-t2",
      title: "Dentinogenesis & Pulp-Dentin Complex",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 35, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 80, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "oral-t3",
      title: "Periodontal Ligament (PDL) & Alveolar Bone",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 30, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 70, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "oral-t4",
      title: "Oral Mucosa & Salivary Glands Histology",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 28, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 60, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "oral-t5",
      title: "Permanent Tooth Morphology & Crown Anatomy",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 6, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 32, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 70, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "oral-t6",
      title: "Cementogenesis & Cementum Histology",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 3, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 20, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 45, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "oral-t7",
      title: "Tooth Eruption, Shedding & Chronology",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 3, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 22, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 50, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "oral-t8",
      title: "Deciduous (Primary) Tooth Morphology",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 3, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 18, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 40, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "oral-t9",
      title: "Tooth Development — Bud, Cap & Bell Stages",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 25, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 55, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    }
  ],

  "biochemistry": [
    {
      id: "biochem-t1",
      title: "Introduction to Biochemistry & Cell Chemistry",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 3, locked: false },
        { type: "papers", label: "Past Paper Questions", count: 15, locked: false },
        { type: "mcqs", label: "Practice MCQs", count: 35, locked: false },
        { type: "notes", label: "Topic Notes", count: 2, locked: false }
      ]
    },
    {
      id: "biochem-t2",
      title: "Enzyme Kinetics & Clinical Enzymology",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 30, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 65, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "biochem-t3",
      title: "Carbohydrate Metabolism — Glycolysis & TCA Cycle",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 6, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 32, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 70, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "biochem-t4",
      title: "Vitamins in Collagen Synthesis & Dental Health",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 28, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 55, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "biochem-t5",
      title: "Calcium, Phosphate & Fluoride Metabolism",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 25, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 50, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "biochem-t6",
      title: "Lipid & Protein Metabolism",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 22, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 45, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "biochem-t7",
      title: "Nucleic Acids, DNA Replication & Molecular Genetics",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 20, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 42, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "biochem-t8",
      title: "Plasma Proteins, Hemoglobin & Iron Metabolism",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 3, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 18, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 38, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    }
  ],

  "pharmacology": [
    {
      id: "pharm-t1",
      title: "General Pharmacology & Pharmacokinetics",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: false },
        { type: "papers", label: "Past Paper Questions", count: 20, locked: false },
        { type: "mcqs", label: "Practice MCQs", count: 45, locked: false },
        { type: "notes", label: "Topic Notes", count: 2, locked: false }
      ]
    },
    {
      id: "pharm-t2",
      title: "Local Anesthetics & Vasoconstrictors",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 6, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 38, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 80, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "pharm-t3",
      title: "Antimicrobial Chemotherapy & Prophylaxis",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 6, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 35, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 75, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "pharm-t4",
      title: "Analgesics, NSAIDs & Opioids",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 28, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 60, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "pharm-t5",
      title: "Autonomic Nervous System (ANS) Drugs",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 30, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 65, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "pharm-t6",
      title: "Medical Emergencies in the Dental Office",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 32, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 68, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "pharm-t7",
      title: "Antifungals, Antivirals & Oral Candidiasis",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 22, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 48, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "pharm-t8",
      title: "Corticosteroids & Immunosuppressants in Dentistry",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 3, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 20, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 42, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    }
  ],

  "general-pathology": [
    {
      id: "path-t1",
      title: "Introduction to Pathology & Cellular Homeostasis",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 3, locked: false },
        { type: "papers", label: "Past Paper Questions", count: 15, locked: false },
        { type: "mcqs", label: "Practice MCQs", count: 35, locked: false },
        { type: "notes", label: "Topic Notes", count: 2, locked: false }
      ]
    },
    {
      id: "path-t2",
      title: "Cellular Injury, Adaptations & Death",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 6, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 32, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 70, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "path-t3",
      title: "Acute & Chronic Inflammation",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 7, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 38, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 80, locked: true },
        { type: "notes", label: "Topic Notes", count: 4, locked: true }
      ]
    },
    {
      id: "path-t4",
      title: "Granulomatous Inflammation — TB & Sarcoidosis",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 28, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 55, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "path-t5",
      title: "Hemodynamics, Thrombosis & Shock",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 30, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 60, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "path-t6",
      title: "Neoplasia & Carcinogenesis",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 6, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 35, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 70, locked: true },
        { type: "notes", label: "Topic Notes", count: 3, locked: true }
      ]
    },
    {
      id: "path-t7",
      title: "Tissue Repair & Wound Healing",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 4, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 22, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 48, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "path-t8",
      title: "Immunopathology — Hypersensitivity & Autoimmunity",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 5, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 25, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 50, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    },
    {
      id: "path-t9",
      title: "Genetic & Congenital Disorders",
      subsections: [
        { type: "ppt", label: "Lecture Slides (PPT)", count: 3, locked: true },
        { type: "papers", label: "Past Paper Questions", count: 18, locked: true },
        { type: "mcqs", label: "Practice MCQs", count: 38, locked: true },
        { type: "notes", label: "Topic Notes", count: 2, locked: true }
      ]
    }
  ]
};
