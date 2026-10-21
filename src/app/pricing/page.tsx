"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MEMBERSHIP_PLANS } from "@/lib/bds-content";
import { Sparkles, ShieldCheck, Check, HelpCircle, Zap, Crown, Clock, Infinity } from "lucide-react";

const planGradients = [
  { card: "from-slate-900 to-slate-900/80", button: "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200", border: "border-slate-800", icon: <Clock className="w-5 h-5 text-slate-400" /> },
  { card: "from-blue-950/80 to-indigo-950/60", button: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20", border: "border-blue-800/60", icon: <Zap className="w-5 h-5 text-blue-400" /> },
  { card: "from-violet-950/80 to-purple-950/60", button: "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/30", border: "border-violet-600/60 ring-2 ring-violet-500/20", icon: <Crown className="w-5 h-5 text-violet-400" /> },
  { card: "from-indigo-950/80 to-blue-950/60", button: "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/20", border: "border-indigo-700/60", icon: <Infinity className="w-5 h-5 text-indigo-400" /> },
];

const faqs = [
  { q: "Which payment methods are accepted?", a: "JazzCash, Easypaisa, local debit/credit cards (Visa, Mastercard, PayPak), and direct bank transfer (Raast / IBFT). Instant activation on payment." },
  { q: "Does the plan include all 6 subjects?", a: "Yes! All paid plans grant 100% access to all 6 BDS 1st Year subjects: Anatomy, Physiology, Oral Biology, Biochemistry, Pharmacology & Pathology." },
  { q: "What about BDS 2nd, 3rd, and Final Year?", a: "Those modules are pending and will unlock in upcoming sessions. Current focus is 100% dedicated to DUHS BDS 1st Year professional exam mastery." },
  { q: "Can I use Mulberry Mind on my smartphone?", a: "Yes! 100% mobile-friendly for Android, iPhone, iPad, and laptops with fast load times." },
  { q: "Are questions verified for DUHS Karachi?", a: "Yes. BCQs are verified from DUHS past papers 2015–2024 (DIKIOHS, DDC & DIDC) with referenced textbook rationales." },
  { q: "Can I upgrade my plan later?", a: "Yes — upgrade at any time without losing saved progress, quiz attempts, or bookmarked questions." },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-10 sm:py-16 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/60 border border-violet-700/50 text-violet-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Transparent PKR Pricing — No Hidden Fees
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Choose Your Study Plan
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Affordable pricing for DUHS Karachi dental students. Instant activation with JazzCash, Easypaisa, or bank transfer.
          </p>
        </div>

        {/* ── Pricing Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {MEMBERSHIP_PLANS.map((plan, i) => {
            const style = planGradients[i] || planGradients[0];
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl p-7 bg-gradient-to-br ${style.card} border ${style.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-extrabold tracking-wide whitespace-nowrap shadow-lg shadow-violet-500/40">
                    {plan.badge}
                  </div>
                )}

                {/* Icon + Plan name */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                    {style.icon}
                  </div>
                  <h3 className="font-bold text-white text-sm leading-tight">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-2">
                  {plan.pricePKR === 0 ? (
                    <div className="text-4xl font-extrabold text-emerald-400">Free</div>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-slate-400 text-sm font-semibold">PKR</span>
                      <span className="text-4xl font-extrabold text-white">{plan.pricePKR.toLocaleString()}</span>
                    </div>
                  )}
                  <p className="text-slate-500 text-xs mt-1 font-medium">{plan.periodText}</p>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed mb-5 border-t border-slate-800 pt-4">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.pricePKR === 0 ? "/signup" : `/checkout?plan=${plan.slug}`}
                  className={`w-full py-3 rounded-xl text-center text-xs font-bold transition-all duration-300 ${style.button}`}
                >
                  {plan.pricePKR === 0 ? "Get Started Free →" : `Choose ${plan.name} →`}
                </Link>
              </div>
            );
          })}
        </div>

        {/* ── Trust badges ── */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-2">
          {[
            { icon: ShieldCheck, label: "Instant Activation" },
            { icon: ShieldCheck, label: "JazzCash & Easypaisa" },
            { icon: ShieldCheck, label: "Cancel Anytime" },
            { icon: ShieldCheck, label: "DUHS Verified Content" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-400">
              <Icon className="w-4 h-4 text-emerald-400" />
              {label}
            </div>
          ))}
        </div>

        {/* ── Comparison Table ── */}
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-slate-400 font-semibold">Feature</th>
                {MEMBERSHIP_PLANS.map(p => (
                  <th key={p.id} className="px-4 py-4 text-center text-white font-bold text-xs">
                    {p.name}
                    <div className="text-slate-500 font-normal text-[10px] mt-0.5">
                      {p.pricePKR === 0 ? "Free" : `PKR ${p.pricePKR.toLocaleString()}`}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                ["Sample MCQs (all 6 subjects)", true, true, true, true],
                ["Full BCQ practice library (3,700+)", false, true, true, true],
                ["Timed mock examination mode", false, true, true, true],
                ["3D Flashcard decks", "Sample", true, true, true],
                ["DUHS Past papers 2015–2024", false, true, true, true],
                ["Weak-topic analytics", false, true, true, true],
                ["Lecture slides & PDF notes", false, false, true, true],
                ["Priority WhatsApp support", false, false, true, true],
                ["Bookmark & review later", false, false, true, true],
                ["Future content updates free", false, false, false, true],
              ].map(([feature, ...vals]) => (
                <tr key={feature as string} className="hover:bg-slate-800/30 transition">
                  <td className="px-6 py-3.5 text-slate-300 text-xs font-medium">{feature as string}</td>
                  {vals.map((v, vi) => (
                    <td key={vi} className="px-4 py-3.5 text-center">
                      {v === true ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : v === false ? (
                        <span className="text-slate-700 text-lg">—</span>
                      ) : (
                        <span className="text-xs text-amber-400 font-semibold">{v as string}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── FAQs ── */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-extrabold text-white text-center mb-8">
            <HelpCircle className="w-6 h-6 inline mr-2 text-indigo-400" />
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-slate-200 text-sm">{faq.q}</span>
                <span className={`text-indigo-400 text-lg font-bold transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
