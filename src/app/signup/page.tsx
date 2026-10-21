"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock, Mail, User, GraduationCap, Building, ArrowRight,
  CheckCircle, Eye, EyeOff, Sparkles
} from "lucide-react";

const benefits = [
  "Free forever starter — no credit card needed",
  "All 6 DUHS BDS 1st Year subjects covered",
  "Past papers verified from 2015 to 2024",
  "BCQ Simulator with instant rationale",
  "3D flashcards for active recall",
  "Start at PKR 399/month when ready",
];

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("DIKIOHS (Dow University)");
  const [year, setYear] = useState("bds-1");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex">

      {/* ─── LEFT PANEL (desktop only) ───────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#0d0621] via-[#0a0d1f] to-[#060b14]">
        {/* Animated background orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full bg-blue-600/15 blur-[90px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

        {/* Border glow on right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />

        <div className="relative z-10 space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-purple-500/30 bg-purple-900/30 flex items-center justify-center">
              <img src="/logo-icon.svg" alt="Mulberry Mind" className="w-8 h-8" />
            </div>
            <div>
              <div className="font-extrabold text-white text-lg leading-tight">Mulberry Mind</div>
              <div className="text-[11px] text-purple-400 font-semibold tracking-wider">DUHS BDS 1st Year Portal</div>
            </div>
          </div>

          {/* Hero text */}
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Your DUHS exam{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                success starts here
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Pakistan&apos;s most focused BDS prep platform — built exclusively for Dow University dental students across DIKIOHS, DDC, and DIDC.
            </p>
          </div>

          {/* Benefits list */}
          <ul className="space-y-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <p className="text-slate-300 text-sm italic leading-relaxed">
            &ldquo;Best DUHS-specific study resource in Karachi. The past papers and BCQ simulator are exactly what I needed.&rdquo;
          </p>
          <p className="text-slate-500 text-xs mt-2 font-medium">— BDS 1st Year student, DIKIOHS 2024</p>
        </div>
      </div>

      {/* ─── RIGHT PANEL (form) ───────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-8 lg:px-12">
        <div className="w-full max-w-md space-y-7">

          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-purple-500/30 bg-purple-900/30 flex items-center justify-center">
              <img src="/logo-icon.svg" alt="Mulberry Mind" className="w-7 h-7" />
            </div>
            <div className="font-extrabold text-white text-base">Mulberry Mind</div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-700/40 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Join Mulberry Mind — It&apos;s Free
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Create your account</h1>
            <p className="text-slate-400 text-sm">For DUHS BDS 1st Year dental students at DIKIOHS, DDC &amp; DIDC.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Ahmed Moaz Khan"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition"
                />
              </div>
            </div>

            {/* College + Year row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">College</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <select
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    className="w-full pl-9 pr-3 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-xs transition appearance-none"
                  >
                    <option>DIKIOHS (Dow University)</option>
                    <option>Dow Dental College (DDC)</option>
                    <option>DIDC</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Year</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full pl-9 pr-3 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-xs transition appearance-none"
                  >
                    <option value="bds-1">BDS 1st Year ✓</option>
                    <option disabled>BDS 2nd (Soon)</option>
                    <option disabled>BDS 3rd (Soon)</option>
                    <option disabled>Final Year (Soon)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-11 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-slate-500 leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">Privacy Policy</Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating Account…
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition">
              Log in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
