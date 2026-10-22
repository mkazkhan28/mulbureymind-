"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl">
        
        {/* Back Link */}
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-blue-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-slate-400">
            Enter your registered email address and we will send you a secure link to reset your account password.
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@duhs.edu.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-900 text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? "Generating Link..." : "Send Password Reset Link"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-ink">Reset Email Sent</h2>
              <p className="text-xs text-slate-300">
                We have dispatched password recovery instructions to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              Return to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
