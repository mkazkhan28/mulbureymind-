-- =============================================================================
-- BDS Study Hub: Seed Data Script
-- Initializes academic years, BDS 2nd Year subjects, topics, and plans
-- =============================================================================

-- 1. Academic Years
INSERT INTO public.academic_years (id, name, slug, is_active, description, display_order)
VALUES
  ('bds-1', 'BDS 1st Year', '1st-year', false, 'Anatomy, Physiology, Biochemistry & Oral Biology', 1),
  ('bds-2', 'BDS 2nd Year (Active)', '2nd-year', true, 'Pharmacology, General Pathology, Microbiology & Dental Materials', 2),
  ('bds-3', 'BDS 3rd Year', '3rd-year', false, 'General Medicine, General Surgery & Oral Pathology', 3),
  ('bds-4', 'BDS Final Year', 'final-year', false, 'Operative Dentistry, Prosthodontics, Orthodontics & Oral Surgery', 4)
ON CONFLICT (id) DO NOTHING;

-- 2. BDS 2nd Year Subjects
INSERT INTO public.subjects (id, year_id, name, code, slug, icon, description, display_order)
VALUES
  ('pharm', 'bds-2', 'Pharmacology & Therapeutics', 'PHARM-201', 'pharmacology', '💊', 'High-yield dental therapeutics, local anesthetics, autonomic drugs, and emergency pharmacology.', 1),
  ('path', 'bds-2', 'General Pathology', 'PATH-202', 'general-pathology', '🔬', 'Cell injury, necrosis, inflammation, wound healing, hemodynamics, and neoplasia principles.', 2),
  ('micro', 'bds-2', 'Microbiology & Parasitology', 'MICR-203', 'microbiology', '🧫', 'Oral bacterial biofilm, cross-infection control, viral hepatitis, and sterilization standards.', 3),
  ('dmat', 'bds-2', 'Science of Dental Materials', 'DMAT-204', 'dental-materials', '🦷', 'Gypsum chemistry, elastomeric impressions, resin composites, dental cements, and casting alloys.', 4)
ON CONFLICT (id) DO NOTHING;

-- 3. High-Yield Topics
INSERT INTO public.topics (id, subject_id, name, slug, description, high_yield, display_order)
VALUES
  ('pharm-top-1', 'pharm', 'Local Anesthetics & Vasoconstrictors', 'local-anesthetics', 'Esters vs amides, maximum recommended doses, epinephrine contraindications, LAST toxicity.', true, 1),
  ('pharm-top-2', 'pharm', 'Antimicrobial Chemotherapy & Prophylaxis', 'antimicrobials', 'Penicillins, Cephalosporins, AHA infective endocarditis antibiotic prophylaxis in dental procedures.', true, 2),
  ('pharm-top-3', 'pharm', 'Analgesics, NSAIDs & Opioids', 'analgesics-nsaids', 'COX-1 vs COX-2, paracetamol hepatotoxicity, tramadol, dental postoperative pain protocols.', true, 3),
  ('path-top-1', 'path', 'Cellular Injury, Adaptations & Death', 'cell-injury', 'Hypertrophy, hyperplasia, metaplasia, coagulative vs liquefactive necrosis, apoptosis.', true, 1),
  ('path-top-2', 'path', 'Acute & Chronic Inflammation', 'inflammation', 'Vascular changes, chemical mediators, granulomatous inflammation, Langhans cells.', true, 2),
  ('path-top-3', 'path', 'Hemodynamics, Thrombosis & Shock', 'hemodynamics', 'Virchow triad, embolism types, stages of shock, hemorrhage classification.', true, 3),
  ('micro-top-1', 'micro', 'Sterilization, Disinfection & Autoclaving', 'sterilization', 'Steam autoclave parameters, biological indicators (G. stearothermophilus), barrier techniques.', true, 1),
  ('micro-top-2', 'micro', 'Oral Flora, Plaque Biofilm & Caries Microbiology', 'oral-microflora', 'Streptococcus mutans glucosyltransferase, Lactobacillus, periodontal pathogens.', true, 2),
  ('dmat-top-1', 'dmat', 'Impression Materials (Hydrocolloids & Elastomers)', 'impression-materials', 'Alginate syneresis and imbibition, polyvinyl siloxanes, polyethers, accuracy.', true, 1),
  ('dmat-top-2', 'dmat', 'Composite Resins & Dental Adhesives', 'composite-resins', 'Bis-GMA, silane coupling agents, C-factor, etch-and-rinse vs self-etch bonding.', true, 2),
  ('dmat-top-3', 'dmat', 'Dental Cements & Glass Ionomers (GIC)', 'dental-cements', 'Acid-base setting reaction of GIC, zinc phosphate, polycarboxylate, ZOE paste.', true, 3)
ON CONFLICT (id) DO NOTHING;

-- 4. Membership Plans
INSERT INTO public.membership_plans (id, name, slug, price_pkr, duration_months, description, is_active)
VALUES
  ('plan-free', 'Free Student Starter', 'starter', 0, 120, 'Try out the platform with sample questions and test scoring.', true),
  ('plan-semester', 'Semester Revision Pass', 'semester', 1299, 6, 'Complete access for mid-terms, send-up examinations, or supplementary revision.', true),
  ('plan-annual', 'Full Academic Year Pass', 'annual', 1999, 12, 'Unrestricted access to all 4 subjects until your university professional exam.', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Flashcard Decks
INSERT INTO public.flashcard_decks (id, subject_id, title, description)
VALUES
  ('deck-pharm-la', 'pharm', 'Local Anesthetics & Dosages', 'Maximum safe doses, vasoconstrictor limits, and toxicity antidotes.'),
  ('deck-pharm-abx', 'pharm', 'Antibiotics & Prophylaxis Rules', 'Surgical dental prophylaxis and penicillin allergy guidelines.'),
  ('deck-path-necrosis', 'path', 'Types of Necrosis & Examples', 'Coagulative, liquefactive, caseous, gangrenous, and fat necrosis.'),
  ('deck-dmat-cements', 'dmat', 'Dental Cements & Setting Chemistry', 'GIC, Zinc Phosphate, and ZOE reactions.')
ON CONFLICT (id) DO NOTHING;
