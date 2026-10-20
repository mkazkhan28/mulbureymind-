import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, BookOpen, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/25">
                BDS
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-slate-900 tracking-tight">
                  BDS Study Hub
                </span>
                <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                  DUHS BDS 1st Year Edition
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Dedicated high-yield digital study platform built for Dow University of Health Sciences (DUHS Karachi) BDS 1st Year students across DIKIOHS, DDC, and DIDC.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50/80 px-3 py-1.5 rounded-lg border border-blue-200/60 w-fit">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium">Tailored for DUHS Modular Dental Curriculum</span>
            </div>
          </div>

          {/* Educational Content */}
          <div>
            <h3 className="text-slate-900 font-semibold text-xs tracking-wider uppercase mb-4">
              Study Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/subjects" className="text-slate-600 hover:text-blue-600 transition flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>DUHS 1st Year (6 Subjects)</span>
                </Link>
              </li>
              <li>
                <Link href="/past-papers" className="text-slate-600 hover:text-blue-600 transition">
                  DUHS Past Papers (2015–2024)
                </Link>
              </li>
              <li>
                <Link href="/practice" className="text-slate-600 hover:text-blue-600 transition">
                  Modular BCQ Simulator
                </Link>
              </li>
              <li>
                <Link href="/flashcards" className="text-slate-600 hover:text-blue-600 transition">
                  High-Yield Flashcards
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-600 hover:text-blue-600 transition">
                  OSPE & Table Viva Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* BDS 1st Year Subjects */}
          <div>
            <h3 className="text-slate-900 font-semibold text-xs tracking-wider uppercase mb-4">
              DUHS 1st Year Subjects
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/subjects/anatomy" className="text-slate-600 hover:text-blue-600 transition">
                  General Anatomy & Histology
                </Link>
              </li>
              <li>
                <Link href="/subjects/physiology" className="text-slate-600 hover:text-blue-600 transition">
                  Human Physiology
                </Link>
              </li>
              <li>
                <Link href="/subjects/oral-biology" className="text-slate-600 hover:text-blue-600 transition">
                  Oral Biology & Tooth Morphology
                </Link>
              </li>
              <li>
                <Link href="/subjects/biochemistry" className="text-slate-600 hover:text-blue-600 transition">
                  Biochemistry & Genetics
                </Link>
              </li>
              <li>
                <Link href="/subjects/pharmacology" className="text-slate-600 hover:text-blue-600 transition">
                  Pharmacology & Therapeutics
                </Link>
              </li>
              <li>
                <Link href="/subjects/general-pathology" className="text-slate-600 hover:text-blue-600 transition">
                  General Pathology & Microbiology
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-slate-400 text-xs">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>BDS 2nd, 3rd & Final Year (Pending)</span>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-slate-900 font-semibold text-xs tracking-wider uppercase mb-4">
              Support & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/pricing" className="text-slate-600 hover:text-blue-600 transition">
                  Free Student Access
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-blue-600 transition">
                  About DUHS Platform
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition">
                  Help & Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-blue-600 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BDS Study Hub. Specially customized for Dow University of Health Sciences (DUHS) Karachi.</p>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for future dental surgeons</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
