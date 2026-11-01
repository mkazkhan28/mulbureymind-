"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, Building, GraduationCap, Phone, CheckCircle2, Save, Info, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { BDS_YEARS } from "@/lib/bds-content";
import { m, AnimatePresence, EASE } from "@/components/motion";

const KEY = "hmh-profile";
type Profile = { name: string; college: string; phone: string; year: string };
const EMPTY: Profile = { name: "", college: "", phone: "", year: "bds-1" };

const COLLEGES = ["DIKIOHS (Dow University)", "Dr. Ishrat-ul-Ebad Khan Institute (DIDC)", "Dow Dental College (DDC)"];

export default function ProfilePage() {
  const [p, setP] = useState<Profile>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  // No accounts yet: the profile lives in this browser, like progress and bookmarks
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setP({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setP((x) => ({ ...x, [k]: e.target.value }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3500);
    } catch {
      alertFallback();
    }
  };
  const [storageBlocked, setStorageBlocked] = useState(false);
  const alertFallback = () => setStorageBlocked(true);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader eyebrow="Account" title="Profile and settings" intro="Your name, college and year. We use your year to show the right subjects." />

      <div className="mb-6 flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm" role="note">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-muted">
          <strong className="text-ink">Saved on this device.</strong> Student accounts aren&apos;t connected yet, so these details stay in this browser — like your progress and bookmarks.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-line bg-surface p-5 sm:p-8" aria-busy={!loaded}>
        <h2 className="card-title">Your details</h2>

        <Field id="name" label="Full name" icon={User}>
          <input id="name" type="text" autoComplete="name" placeholder="Your name" value={p.name} onChange={set("name")} className="field pl-10" />
        </Field>

        <Field id="email" label="Email" icon={Mail} hint="Shown here once you log in with a student account.">
          <input id="email" type="email" value="" placeholder="Not logged in" disabled className="field cursor-not-allowed pl-10 opacity-70" />
        </Field>

        <Field id="college" label="Dental college" icon={Building}>
          <input id="college" list="colleges" placeholder="e.g. DIKIOHS (Dow University)" value={p.college} onChange={set("college")} className="field pl-10" />
          <datalist id="colleges">
            {COLLEGES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field id="year" label="Year" icon={GraduationCap}>
            <select id="year" value={p.year} onChange={set("year")} className="field cursor-pointer pl-10">
              {BDS_YEARS.map((y) => (
                <option key={y.id} value={y.id} disabled={!y.isActive}>
                  {y.name.replace(/\s*\((Active|Pending)\)/, "")}
                  {y.isActive ? "" : " (coming soon)"}
                </option>
              ))}
            </select>
          </Field>
          <Field id="phone" label="WhatsApp number" icon={Phone} hint="Optional. Used for payment confirmations.">
            <input id="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="03xx-xxxxxxx" value={p.phone} onChange={set("phone")} className="field pl-10" />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/subscription" className="link inline-flex items-center gap-1 text-sm">
            Plan &amp; billing <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saved && (
                <m.span
                  role="status"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-400"
                >
                  <CheckCircle2 className="h-4 w-4" /> Saved
                </m.span>
              )}
            </AnimatePresence>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> Save changes
            </button>
          </div>
        </div>
        {storageBlocked && <p className="text-sm text-rose-600 dark:text-rose-400">This browser is blocking storage, so your details can&apos;t be saved here.</p>}
      </form>
    </div>
  );
}

function Field({ id, label, icon: Icon, hint, children }: { id: string; label: string; icon: React.ElementType; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        {children}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
