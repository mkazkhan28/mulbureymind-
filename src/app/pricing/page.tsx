"use client";

import React from "react";
import Link from "next/link";
import {
  MEMBERSHIP_PLANS
} from "@/lib/bds-content";
import {
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Check
} from "lucide-react";

export default function PricingPage() {
  const faqs = [
    {
      q: "Which payment methods are accepted in Pakistan?",
      a: "We support JazzCash, Easypaisa, local debit/credit cards (Visa, Mastercard, PayPak), and direct online bank transfer (Raast / IBFT). You can pay from any mobile account in less than 2 minutes."
    },
    {
      q: "Does the DUHS 1st Year pass include all 6 subjects?",
      a: "Yes! Both the Semester Pass and the Full Annual Pass grant 100% full access to all 6 BDS 1st Year subjects: General Anatomy & Histology, Human Physiology, Oral Biology & Tooth Morphology, Biochemistry, Pharmacology & Therapeutics, and General Pathology. There are zero per-subject charges."
    },
    {
      q: "What about BDS 2nd, 3rd, and Final year content?",
      a: "BDS 2nd, 3rd, and Final year modules are currently pending and scheduled to unlock in upcoming sessions. Our current launch focus is 100% dedicated to BDS 1st Year DUHS professional examination mastery."
    },
    {
      q: "Can I use BDS Study Hub on my smartphone?",
      a: "Yes! The platform is 100% mobile-friendly and optimized for Android, iPhone, iPad, tablets, and Windows/Mac laptops with fast load times."
    },
    {
      q: "Are the questions verified for Dow University of Health Sciences?",
      a: "Yes. Our BCQ repository contains verified past papers and modular assessments from 2015 to 2024 from DUHS Karachi (DIKIOHS, DDC & DIDC) with referenced textbook rationales."
    },
    {
      q: "Can I upgrade from Free Starter to the Annual Pass later?",
      a: "Yes, you can upgrade your account at any time without losing any of your saved progress, quiz attempts, or bookmarked questions."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8 sm:py-14 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/60 text-indigo-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Transparent Student Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Invest in Your DUHS BDS 1st Year Success
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Affordable PKR pricing tailored for 1st Year dental students in Karachi & Pakistan. Instant activation with zero hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isAnnual = plan.id === "plan-annual";
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative bg-slate-900/80 backdrop-blur-xl shadow-2xl ${
                  isAnnual
                    ? "border-2 border-indigo-500 shadow-indigo-500/20 hover:shadow-indigo-500/30 ring-1 ring-indigo-400/50"
                    : "border border-slate-800 hover:border-slate-700 hover:shadow-slate-800/50"
                }`}
              >
                {isAnnual && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-indigo-600/40 border border-indigo-400/40">
                    DUHS 1st Year Recommended
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      {plan.name}
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-3">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white">
                        PKR {plan.pricePKR.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        / {plan.periodText}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-5 border-t border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-300">
                      What&apos;s included:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 mt-6">
                  <Link
                    href={`/checkout?plan=${plan.id}`}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg ${
                      isAnnual
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-indigo-600/30"
                        : "bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700"
                    }`}
                  >
                    <span>{plan.pricePKR === 0 ? "Get Started Free" : `Choose ${plan.name}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Local Payment Methods Banner */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">
                100% Secure Local Pakistani Payment Gateways
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                Activate your account via JazzCash Mobile Account, Easypaisa, Raast, or direct bank transfer. All payments include our full satisfaction guarantee.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap justify-center shrink-0">
            <span className="px-3.5 py-1.5 bg-slate-950 border border-rose-800/60 rounded-xl text-xs font-bold text-rose-300">
              JazzCash
            </span>
            <span className="px-3.5 py-1.5 bg-slate-950 border border-emerald-800/60 rounded-xl text-xs font-bold text-emerald-300">
              Easypaisa
            </span>
            <span className="px-3.5 py-1.5 bg-slate-950 border border-cyan-800/60 rounded-xl text-xs font-bold text-cyan-300">
              Raast / IBFT
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-400">
              Everything you need to know about DUHS BDS subscriptions and instant activation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-2"
              >
                <div className="font-semibold text-white text-xs sm:text-sm flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-6.5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
