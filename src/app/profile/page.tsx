"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Building,
  GraduationCap,
  Phone,
  CheckCircle2,
  Save
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function ProfilePage() {
  const [name, setName] = useState("Dr. Ayesha Khan");
  const [email] = useState("ayesha.bds@gmail.com");
  const [college, setCollege] = useState("DIKIOHS (Dow University of Health Sciences)");
  const [phone, setPhone] = useState("0301-2345678");
  const [year, setYear] = useState("bds-1");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-100 py-8 sm:py-14 relative overflow-hidden">
      {/* Decorative ambient background glows */}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Header */}
        <PageHeader
          eyebrow="Account"
          title="Profile and settings"
          intro="Manage your personal details, college and contact information."
          className="!pb-2"
        />

        {savedSuccess && (
          <div className="p-4 bg-emerald-950/70 border border-emerald-700/60 rounded-2xl text-xs font-semibold text-emerald-200 flex items-center gap-2 animate-fadeIn shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile information saved successfully!</span>
          </div>
        )}

        {/* Profile Card */}
        <form onSubmit={handleSave} className="bg-surface p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Academic Identification
            </h2>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950/80 text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-slate-500 text-xs cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Contact DUHS support if you need to update your primary student login email.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Dental College / Institute
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950/80 text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Active Academic Year
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-ink font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
                  >
                    <option value="bds-1">DUHS BDS 1st Year (Active Curriculum)</option>
                    <option value="bds-2">BDS 2nd Year (Pending)</option>
                    <option value="bds-3">BDS 3rd Year (Pending)</option>
                    <option value="bds-4">BDS Final Year (Pending)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  WhatsApp Contact
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950/80 text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-800 flex items-center justify-between">
            <Link
              href="/pricing"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              View Billing & Passes →
            </Link>

            <button
              type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
