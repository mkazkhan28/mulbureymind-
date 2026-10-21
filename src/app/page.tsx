"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BDS_SUBJECTS, MEMBERSHIP_PLANS } from "@/lib/bds-content";
import {
  ArrowRight, Zap, BookOpen, FileText, Layers, Award,
  CheckCircle, Star, Users, Clock, Shield, ChevronRight,
  Sparkles, TrendingUp, Brain
} from "lucide-react";

const subjectColors: Record<string, { bg: string; border: string; text: string; glow: string; icon: string }> = {
  "anat":     { bg: "from-amber-900/40 to-amber-800/20",  border: "border-amber-500/30", text: "text-amber-400",  glow: "shadow-amber-500/20",  icon: "🦴" },
  "phys":     { bg: "from-rose-900/40 to-rose-800/20",    border: "border-rose-500/30",  text: "text-rose-400",   glow: "shadow-rose-500/20",   icon: "❤️" },
  "oral-bio": { bg: "from-cyan-900/40 to-cyan-800/20",    border: "border-cyan-500/30",  text: "text-cyan-400",   glow: "shadow-cyan-500/20",   icon: "🦷" },
  "biochem":  { bg: "from-violet-900/40 to-violet-800/20",border: "border-violet-500/30",text: "text-violet-400", glow: "shadow-violet-500/20", icon: "🧬" },
  "pharm":    { bg: "from-emerald-900/40 to-emerald-800/20",border:"border-emerald-500/30",text:"text-emerald-400",glow:"shadow-emerald-500/20",icon: "💊" },
  "path":     { bg: "from-blue-900/40 to-blue-800/20",    border: "border-blue-500/30",  text: "text-blue-400",   glow: "shadow-blue-500/20",   icon: "🔬" },
};

const planColors = [
  "from-slate-800 to-slate-900",
  "from-blue-900/60 to-indigo-900/60",
  "from-purple-900/60 to-violet-900/60",
  "from-indigo-900/60 to-blue-900/60",
];

const stats = [
  { value: "6", label: "Core Subjects", icon: BookOpen },
  { value: "3,700+", label: "Practice BCQs", icon: Zap },
  { value: "10 yrs", label: "Past Papers", icon: Award },
  { value: "PKR 399", label: "Starting Price", icon: Star },
];

const features = [
  { icon: Shield, title: "Verified DUHS Content", desc: "Every BCQ traced back to DUHS past papers (2015–2024) with textbook rationales.", color: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20" },
  { icon: Brain, title: "3D Flip Flashcards", desc: "Active-recall cards with clinical pearls for all 6 subjects. Study smarter, not harder.", color: "text-violet-400 bg-violet-400/10 border-violet-500/20" },
  { icon: Zap, title: "BCQ Simulator", desc: "Timed mock exams, tutor mode, and topic-wise practice with instant feedback.", color: "text-amber-400 bg-amber-400/10 border-amber-500/20" },
  { icon: FileText, title: "Lecture Slides & Notes", desc: "High-yield PDF summaries and lecture slides organized by topic and subject.", color: "text-cyan-400 bg-cyan-400/10 border-cyan-500/20" },
];

export default function HomePage() {
  const [count, setCount] = useState(0);
  const firstYearSubjects = BDS_SUBJECTS.filter(s => s.yearId === "bds-1");

  useEffect(() => {
    const timer = setInterval(() => setCount(c => (c < 3700 ? c + 47 : 3700)), 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 overflow-x-hidden">

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-16 pb-24 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

        {/* Floating subject pills in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {["Anatomy", "Physiology", "Oral Biology", "Biochemistry", "Pharmacology", "Pathology"].map((sub, i) => (
            <div
              key={sub}
              className="absolute text-xs font-semibold px-3 py-1.5 rounded-full border opacity-20"
              style={{
                top: `${15 + i * 13}%`,
                left: i % 2 === 0 ? `${5 + i * 3}%` : `${72 - i * 2}%`,
                borderColor: ["#f59e0b","#f43f5e","#06b6d4","#8b5cf6","#10b981","#3b82f6"][i] + "60",
                color: ["#f59e0b","#f43f5e","#06b6d4","#8b5cf6","#10b981","#3b82f6"][i],
                animation: `float${i % 3} ${4 + i}s ease-in-out infinite`,
              }}
            >
              {sub}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-wide shadow-lg shadow-indigo-500/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            DUHS Karachi &bull; DIKIOHS &bull; DDC &bull; DIDC
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <span className="block text-white">Master DUHS</span>
            <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              BDS 1st Year
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Pakistan&apos;s most focused dental exam prep platform — built exclusively for Dow University students with verified past papers, BCQ simulator, and 3D flashcards.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-base shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50"
            >
              <Sparkles className="w-4 h-4" />
              Start Free Today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/subjects"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-600 text-slate-200 font-semibold text-base hover:border-slate-400 hover:bg-slate-800/50 transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              View All Subjects
            </Link>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-2xl mx-auto">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <Icon className="w-4 h-4 text-indigo-400 mb-1" />
                <span className="text-xl font-extrabold text-white">{label === "Practice BCQs" ? count.toLocaleString() + "+" : value}</span>
                <span className="text-[10px] text-slate-400 font-medium text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SUBJECTS GRID ─────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/50 border border-amber-700/40 text-amber-300 text-xs font-bold mb-4">
            <BookOpen className="w-3.5 h-3.5" /> DUHS BDS 1st Year Core Subjects
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">6 Subjects. One Platform.</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">Every topic, every chapter, organized exactly as per the DUHS BDS 1st Year professional syllabus.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {firstYearSubjects.map(subject => {
            const colors = subjectColors[subject.id] || subjectColors["anat"];
            return (
              <Link
                key={subject.id}
                href={`/subjects/${subject.slug}`}
                className={`group relative p-6 rounded-3xl bg-gradient-to-br ${colors.bg} border ${colors.border} hover:shadow-xl ${colors.glow} transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{colors.icon}</span>
                  <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg bg-slate-900/50 ${colors.text}`}>
                    {subject.code}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg leading-tight mb-2">{subject.name}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{subject.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span>{subject.topicsCount} topics</span>
                    <span>•</span>
                    <span>{subject.mcqCount} MCQs</span>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${colors.text} group-hover:gap-2 transition-all`}>
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── PLANS STRIP ───────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e] border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-700/40 text-violet-300 text-xs font-bold mb-4">
              <TrendingUp className="w-3.5 h-3.5" /> Transparent PKR Pricing — No Hidden Fees
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Choose Your Study Plan</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MEMBERSHIP_PLANS.map((plan, i) => (
              <div
                key={plan.id}
                className={`relative p-6 rounded-3xl bg-gradient-to-br ${planColors[i]} border ${plan.isPopular ? "border-violet-500 shadow-xl shadow-violet-500/20 ring-1 ring-violet-500/30" : "border-slate-800"} flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[10px] font-extrabold whitespace-nowrap shadow-lg">
                    {plan.badge}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-sm">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    {plan.pricePKR === 0 ? (
                      <span className="text-3xl font-extrabold text-emerald-400">Free</span>
                    ) : (
                      <>
                        <span className="text-slate-400 text-sm">PKR</span>
                        <span className="text-3xl font-extrabold text-white">{plan.pricePKR.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{plan.periodText}</p>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.slice(0, 3).map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.pricePKR === 0 ? "/signup" : `/checkout?plan=${plan.slug}`}
                  className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all ${plan.isPopular ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 shadow-lg" : "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"}`}
                >
                  {plan.pricePKR === 0 ? "Get Started Free" : "Choose Plan →"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why Mulberry Mind?</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">Purpose-built for DUHS professional examinations — not a generic study app.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 group">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SOCIAL PROOF ──────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0a0f1e] border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div className="flex items-center gap-1 justify-center sm:justify-start mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-slate-300 text-sm font-medium">"Best DUHS-specific resource I found in Karachi."</p>
            <p className="text-slate-500 text-xs mt-1">— BDS 1st Year student, DIKIOHS</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["A","B","C","D"].map((l,i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 border-2 border-[#0a0f1e] flex items-center justify-center text-white text-xs font-bold">{l}</div>
              ))}
            </div>
            <div>
              <p className="text-white font-bold text-sm">500+ Students</p>
              <p className="text-slate-400 text-xs">across DIKIOHS, DDC & DIDC</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
            Ready to ace your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              DUHS exams?
            </span>
          </h2>
          <p className="text-slate-400 text-lg">Join hundreds of BDS students already studying smarter with Mulberry Mind.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg shadow-2xl shadow-purple-500/30 transition-all hover:scale-105"
          >
            <Users className="w-5 h-5" />
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-500 text-sm">No credit card required &bull; Free forever starter plan</p>
        </div>
      </section>

      <style jsx>{`
        @keyframes float0 { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-12px) } }
        @keyframes float1 { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-18px) } }
        @keyframes float2 { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-8px) } }
      `}</style>
    </div>
  );
}
