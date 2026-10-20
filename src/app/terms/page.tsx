import React from "react";
import { AlertCircle } from "lucide-react";

export default function TermsAndRefundPage() {
  return (
    <div className="min-h-screen bg-[#0a1424] text-slate-200 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Legal & Compliance
          </span>
          <h1 className="text-3xl font-extrabold text-white">
            Terms of Service & Refund Policy
          </h1>
          <p className="text-xs text-slate-400">
            Please read these terms carefully before subscribing to any BDS Study Hub membership.
          </p>
        </div>

        <div className="bg-[#132238] rounded-3xl border border-[#1e3452] p-8 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          {/* Medical Disclaimer Banner */}
          <div className="p-4 bg-[#0c182a] border border-blue-900/60 rounded-2xl text-xs text-slate-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-sky-300">
              <AlertCircle className="w-4 h-4 text-sky-400" />
              <span>Medical & Educational Disclaimer</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              BDS Study Hub is an educational revision aid designed to prepare students for theoretical dental examinations. The content does not constitute clinical dental advice or replace hospital patient treatment protocols.
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-white">1. User Account & Single-User License</h2>
            <p>
              Your subscription grants a single-user personal license. Sharing account login credentials with third parties or bulk-scraping our question bank is strictly prohibited and may result in immediate account termination without refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-white">2. Intellectual Property</h2>
            <p>
              All proprietary study notes, digital flashcard structures, and clinical explanations are protected by copyright. Reproduction or redistribution for unauthorized commercial purposes is prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-white">3. Fair 7-Day Refund Policy</h2>
            <p>
              We want every dental student to be completely satisfied with their purchase. If you experience technical access issues or find that the platform does not meet your expectations, you may request a refund within <strong className="text-white">7 days of purchase</strong> by emailing support@bdsstudyhub.pk with your transaction reference.
            </p>
            <p>
              Refunds are processed back to the original funding source (JazzCash, Easypaisa, or bank account) within 3 to 5 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-white">4. Modifications & Syllabus Updates</h2>
            <p>
              We periodically update questions, answers, and clinical explanations in accordance with latest Pakistan Medical and Dental Council (PMDC) and university curricular revisions.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
