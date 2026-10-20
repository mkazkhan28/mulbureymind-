"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Award, FileText, Layers, Menu, X, Sparkles, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Top announcement banner focused on DUHS in crisp clean blue/grey */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 text-slate-700 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-blue-100">
        <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-xs">
          DUHS Karachi
        </span>
        <span className="text-slate-700">
          🎯 Dedicated to Dow University of Health Sciences (DIKIOHS • DDC • DIDC) BDS 1st Year Modular BCQs
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C7.5 2 4 4.5 4 8c0 2.2 1.4 4.2 3.5 5.2.3.1.5.4.5.7v4.6c0 1.9 1.6 3.5 3.5 3.5.8 0 1.5-.3 2.1-.8.2-.2.5-.2.7 0 .6.5 1.3.8 2.1.8 1.9 0 3.5-1.6 3.5-3.5v-4.6c0-.3.2-.6.5-.7C22.6 12.2 24 10.2 24 8c0-3.5-3.5-6-8-6h-4zm0 2c3.9 0 6.5 2 6.5 4 0 1.5-1.1 2.8-2.6 3.4-.9.4-1.4 1.3-1.4 2.3v4.3c0 .8-.7 1.5-1.5 1.5-.5 0-.9-.2-1.2-.6-.9-1.2-2.7-1.2-3.6 0-.3.4-.7.6-1.2.6-.8 0-1.5-.7-1.5-1.5V13.7c0-1-.5-1.9-1.4-2.3C6.1 10.8 5 9.5 5 8c0-2 2.6-4 6.5-4h.5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-tight">
                Mulberry Mind
              </span>
              <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                DUHS Dental Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/subjects"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 rounded-lg transition"
            >
              Subjects (6)
            </Link>
            <Link
              href="/past-papers"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 rounded-lg transition"
            >
              DUHS Past Papers
            </Link>
            <Link
              href="/practice"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 rounded-lg transition"
            >
              BCQ Simulator
            </Link>
            <Link
              href="/flashcards"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 rounded-lg transition"
            >
              Flashcards
            </Link>
            <Link
              href="/resources"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 rounded-lg transition"
            >
              Slides & Notes
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 rounded-lg transition"
            >
              Plans
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/25 transition flex items-center gap-1.5 hover:shadow-lg"
            >
              <span>Get Started</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <Link
            href="/subjects"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Subjects (6)</span>
          </Link>
          <Link
            href="/past-papers"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600"
          >
            <Award className="w-4 h-4 text-blue-600" />
            <span>DUHS Past Papers</span>
          </Link>
          <Link
            href="/practice"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>BCQ Simulator</span>
          </Link>
          <Link
            href="/flashcards"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Digital Flashcards</span>
          </Link>
          <Link
            href="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Notes & Slides</span>
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Membership Plans</span>
          </Link>
          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
            >
              Create Student Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
