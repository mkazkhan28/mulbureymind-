import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a1424] text-slate-200 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            Legal & Compliance
          </span>
          <h1 className="text-3xl font-extrabold text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last updated: October 2026 • Governed by data protection guidelines in Pakistan
          </p>
        </div>

        <div className="bg-[#132238] rounded-3xl border border-[#1e3452] p-8 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-base text-white">1. Information We Collect</h2>
            <p>
              When you create an account on BDS Study Hub, we collect standard registration information including your name, email address, dental college, academic year, and phone number.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-white">2. How Your Information is Used</h2>
            <p>
              Your information is used strictly to provide access to study content, track personal quiz scores, manage active memberships, and communicate critical platform updates. We do not sell or rent your personal data to any external advertising agencies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-white">3. Payment & Financial Data Security</h2>
            <p>
              We do not store your debit/credit card numbers or mobile account MPINs on our servers. All financial transactions are processed securely through licensed payment gateway providers (such as JazzCash, Easypaisa, or 3D-Secure merchant acquirers).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-white">4. Account Security</h2>
            <p>
              Passwords are cryptographically hashed and managed via secure Supabase Authentication infrastructure. Access tokens and session keys are secured using industry-standard HTTPS protocols.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-white">5. Contact Regarding Privacy</h2>
            <p>
              If you have any questions or wish to delete your account data, please reach out to our privacy officer at{" "}
              <Link href="/contact" className="text-sky-400 hover:text-sky-300 font-semibold underline">
                support@bdsstudyhub.pk
              </Link>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
