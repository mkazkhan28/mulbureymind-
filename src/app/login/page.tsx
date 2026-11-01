"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  const handleDemoLogin = (role: "student" | "admin") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push(role === "admin" ? "/admin" : "/dashboard");
    }, 500);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your DUHS BDS 1st Year preparation."
      footer={
        <>
          New to HMHDental?{" "}
          <Link href="/signup" className="font-semibold text-brand-400 hover:underline">
            Create a free account
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-200">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@duhs.edu.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field pl-10"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-semibold text-brand-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field pl-10 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btn-brand group w-full !py-3">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Log in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Prototype shortcuts (kept from the original build) */}
      <div className="mt-8">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-line" />
          or try a demo account
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => handleDemoLogin("student")} className="btn-ghost !py-2.5 !text-xs">
            <UserRound className="h-4 w-4" /> Demo student
          </button>
          <button type="button" onClick={() => handleDemoLogin("admin")} className="btn-ghost !py-2.5 !text-xs">
            <ShieldCheck className="h-4 w-4" /> Demo admin
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
