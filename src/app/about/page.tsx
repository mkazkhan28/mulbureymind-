"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  ArrowRight,
  GraduationCap
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <PageHeader
          eyebrow="About"
          title="About Molar Hub"
          lead="A study platform for BDS 1st Year students."
          intro="Molar Hub brings lecture slides, textbooks, practice questions and revision tools for BDS students into one organised place."
        />

        {/* Story Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 sm:p-10 shadow-sm space-y-6 text-slate-200">
          <h2 className="text-xl font-bold text-ink">
            Our Mission & Origin
          </h2>
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <p>
              Preparing for BDS modular assessments and annual examinations has traditionally involved searching through blurry past-paper photocopies, conflicting answer keys, and unorganized WhatsApp groups.
            </p>
            <p>
              <strong className="text-ink">Molar Hub</strong> was founded specifically to provide a high-yield, verified, and organized digital platform for BDS 1st Year dental students.
            </p>
            <p>
              Every BCQ and concept is verified against standard dental textbooks, including <em className="text-primary">BD Chaurasia & Snell Clinical Anatomy</em>, <em className="text-primary">Guyton & Hall Physiology</em>, <em className="text-primary">Ten Cate&apos;s Oral Histology & Wheeler&apos;s Tooth Morphology</em>, <em className="text-primary">Lippincott Biochemistry</em>, <em className="text-primary">Katzung Pharmacology</em>, and <em className="text-primary">Robbins General Pathology</em>.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-850 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="font-bold text-base text-ink">BDS 1st Year Specific</div>
              <div className="text-xs text-slate-400 mt-1">Dedicated specifically to all 6 core subjects of the BDS 1st Year modular curriculum.</div>
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

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-primary hover:bg-primary-hover text-on-primary transition text-sm"
          >
            <span>Launch Free Practice</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
