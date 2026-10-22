"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  ArrowRight,
  GraduationCap
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>Built by Dental Students for Dow Dental Colleges</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            About BDS Study Hub
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Pakistan&apos;s premier educational platform dedicated to helping Dow University of Health Sciences (DUHS Karachi) BDS 1st Year dental students excel in their modular and professional examinations.
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 sm:p-10 shadow-sm space-y-6 text-slate-200">
          <h2 className="text-xl font-bold text-ink">
            Our Mission & Origin
          </h2>
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Preparing for BDS modular assessments and annual examinations at Dow University traditionally involved searching through blurry past-paper photocopies, conflicting answer keys, and unorganized WhatsApp groups.
            </p>
            <p>
              <strong className="text-ink">BDS Study Hub</strong> was founded specifically to provide a high-yield, verified, and organized digital platform for BDS 1st Year students across DIKIOHS (Dr. Ishrat-ul-Ebad Khan Institute of Oral Health Sciences), Dow Dental College (DDC), and Dow International Dental College (DIDC).
            </p>
            <p>
              Every BCQ and concept is verified against standard dental textbooks, including <em className="text-blue-400">BD Chaurasia & Snell Clinical Anatomy</em>, <em className="text-blue-400">Guyton & Hall Physiology</em>, <em className="text-blue-400">Ten Cate&apos;s Oral Histology & Wheeler&apos;s Tooth Morphology</em>, <em className="text-blue-400">Lippincott Biochemistry</em>, <em className="text-blue-400">Katzung Pharmacology</em>, and <em className="text-blue-400">Robbins General Pathology</em>.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-850 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="font-bold text-base text-ink">DUHS 1st Year Specific</div>
              <div className="text-xs text-slate-400 mt-1">Dedicated specifically to all 6 core subjects of the Dow modular curriculum.</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="font-bold text-base text-ink">Evidence-Based Rationales</div>
              <div className="text-xs text-slate-400 mt-1">Answers verified with standard medical and dental textbook citations.</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="font-bold text-base text-ink">Zero Cost Entry</div>
              <div className="text-xs text-slate-400 mt-1">Free student starter tier with full access to sample BCQs and flashcards.</div>
            </div>
          </div>
        </div>

        {/* Colleges Covered */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-sm space-y-4 text-slate-200">
          <h2 className="text-xl font-bold text-ink">
            Dow University Dental Institutes
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Aligned with the integrated modular dental curriculum across all constituent colleges of Dow University of Health Sciences:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              <GraduationCap className="w-6 h-6 text-blue-400 mx-auto mb-1.5" />
              <div className="font-bold text-sm text-ink">DIKIOHS</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Ojha Campus, Karachi</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              <GraduationCap className="w-6 h-6 text-blue-400 mx-auto mb-1.5" />
              <div className="font-bold text-sm text-ink">Dow Dental College</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Mission Road Campus</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              <GraduationCap className="w-6 h-6 text-blue-400 mx-auto mb-1.5" />
              <div className="font-bold text-sm text-ink">Dow International (DIDC)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Ojha Campus, Karachi</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 transition text-sm"
          >
            <span>Launch Free DUHS Practice</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
