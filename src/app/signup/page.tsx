"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Building, Check, Eye, EyeOff, GraduationCap, Loader2, Lock, Mail, User } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-rose-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-500"];
  return { score, label: labels[score], color: colors[score] };
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("DIKIOHS (Dow University)");
  const [year, setYear] = useState("bds-1");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = passwordStrength(password);
  const mismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <AuthLayout
      title="Create your free account"
      subtitle="Join DUHS BDS students studying smarter. No card needed."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-400 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <Field id="name" label="Full name" icon={User}>
          <input id="name" type="text" required autoComplete="name" placeholder="Ayesha Khan" value={fullName} onChange={(e) => setFullName(e.target.value)} className="field pl-10" />
        </Field>

        <Field id="email" label="Email address" icon={Mail}>
          <input id="email" type="email" required autoComplete="email" placeholder="you@duhs.edu.pk" value={email} onChange={(e) => setEmail(e.target.value)} className="field pl-10" />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="college" label="College" icon={Building}>
            <select id="college" value={college} onChange={(e) => setCollege(e.target.value)} className="field appearance-none pl-10">
              <option>DIKIOHS (Dow University)</option>
              <option>Dow Dental College (DDC)</option>
              <option>DIDC</option>
              <option>Other</option>
            </select>
          </Field>
          <Field id="year" label="Year" icon={GraduationCap}>
            <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className="field appearance-none pl-10">
              <option value="bds-1">BDS 1st Year</option>
              <option disabled>BDS 2nd (soon)</option>
              <option disabled>BDS 3rd (soon)</option>
              <option disabled>Final Year (soon)</option>
            </select>
          </Field>
        </div>

        <Field id="password" label="Password" icon={Lock}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field pl-10 pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-ink"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </Field>
        {password && (
          <div className="-mt-1 flex items-center gap-3 animate-fadeIn">
            <div className="flex flex-1 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full transition duration-500 ${i < strength.score ? strength.color : "bg-slate-800"}`} />
              ))}
            </div>
            <span className="w-16 text-right text-xs font-medium text-slate-400">{strength.label}</span>
          </div>
        )}

        <Field id="confirm" label="Confirm password" icon={Lock}>
          <input
            id="confirm"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`field pl-10 pr-11 ${mismatch ? "!border-rose-500 focus:!ring-rose-500/15" : ""}`}
          />
          {confirmPassword && !mismatch && <Check className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400 animate-fadeIn" />}
        </Field>

        {(error || mismatch) && (
          <p className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400 animate-fadeIn">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error ?? "Passwords do not match."}
          </p>
        )}

        <button type="submit" disabled={isLoading} className="btn-brand group w-full !py-3">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
            </>
          ) : (
            <>
              Create free account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline hover:text-ink">Terms</Link> and{" "}
          <Link href="/privacy" className="underline hover:text-ink">Privacy Policy</Link>.
        </p>
      </form>
    </AuthLayout>
  );
}

function Field({ id, label, icon: Icon, children }: { id: string; label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-500" />
        {children}
      </div>
    </div>
  );
}
