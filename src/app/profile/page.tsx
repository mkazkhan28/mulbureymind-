"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { User, Mail, Building, GraduationCap, Phone, CheckCircle2, Save, ArrowRight, Flame, BookOpen, Trophy, Lock, Smartphone } from "lucide-react";
import { BDS_YEARS } from "@/lib/bds-content";
import { SUBJECT_STRUCTURES } from "@/lib/subject-structure";
import { lecturesInArea } from "@/lib/catalog";
import { useProgress, streakOf, badgesFor } from "@/lib/progress";
import { m, AnimatePresence, AnimatedNumber, Stagger, StaggerItem, EASE } from "@/components/motion";

const KEY = "hmh-profile";
type Profile = { name: string; college: string; phone: string; year: string };
const EMPTY: Profile = { name: "", college: "", phone: "", year: "bds-1" };

const COLLEGES = ["DIKIOHS (Dow University)", "Dr. Ishrat-ul-Ebad Khan Institute (DIDC)", "Dow Dental College (DDC)"];

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

export default function ProfilePage() {
  const [p, setP] = useState<Profile>(EMPTY);
  const [savedProfile, setSavedProfile] = useState<Profile>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [storageBlocked, setStorageBlocked] = useState(false);
  const progress = useProgress();

  // No accounts yet: the profile lives in this browser, like progress and bookmarks
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const v = { ...EMPTY, ...JSON.parse(raw) };
        setP(v);
        setSavedProfile(v);
      }
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
      setSavedProfile(p);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3500);
    } catch {
      setStorageBlocked(true);
    }
  };

  const dirty = loaded && JSON.stringify(p) !== JSON.stringify(savedProfile);
  const yearName = (BDS_YEARS.find((y) => y.id === savedProfile.year)?.name ?? "BDS 1st Year").replace(/\s*\((Active|Pending)\)/, "");

  const totals = useMemo(() => {
    const ids = [...new Set(Object.values(SUBJECT_STRUCTURES).flatMap((st) => st.areas.flatMap((a) => lecturesInArea(st.subjectSlug, a.slug))))];
    if (!progress) return null;
    const badges = badgesFor(progress);
    return {
      opened: ids.filter((id) => progress.opened[id]).length,
      total: ids.length,
      streak: streakOf(progress.days),
      days: new Set(progress.days).size,
      badges,
      earned: badges.filter((b) => b.earned).length,
    };
  }, [progress]);

  const initials = initialsOf(savedProfile.name);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* ===================== HEADER ===================== */}
      <m.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative overflow-hidden rounded-3xl border border-line bg-surface"
        aria-labelledby="profile-name"
      >
        <div aria-hidden className="h-24 bg-gradient-to-r from-brand-500/20 via-soft to-accent-500/15 sm:h-28" />
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-glow/15 blur-3xl" />
        <div className="relative -mt-12 flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:px-8">
          <span className="group flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-surface bg-primary font-display text-3xl font-bold text-on-primary shadow-lift transition-transform duration-300 hover:-rotate-3 hover:scale-105">
            {initials || <User className="h-10 w-10" />}
          </span>
          <div className="min-w-0 flex-1 pb-1">
            <h1 id="profile-name" className="truncate font-display text-[1.75rem] font-bold tracking-[-0.035em] text-ink sm:text-[2rem]">
              {savedProfile.name || "Your profile"}
            </h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="chip-pro !py-1">
                <GraduationCap className="h-3.5 w-3.5" /> {yearName}
              </span>
              {savedProfile.college && (
                <span className="chip !py-1">
                  <Building className="h-3.5 w-3.5" /> {savedProfile.college}
                </span>
              )}
              <span className="chip !py-1" title="Student accounts aren't connected yet, so these details stay in this browser">
                <Smartphone className="h-3.5 w-3.5" /> Saved on this device
              </span>
            </div>
          </div>
        </div>

        {/* Progress rings */}
        <dl className="grid grid-cols-3 border-t border-line">
          <RingStat icon={BookOpen} label="Lectures opened" value={totals?.opened} max={totals?.total} />
          <RingStat icon={Flame} label="Day streak" value={totals?.streak} max={Math.max(7, totals?.streak ?? 0)} sub={totals ? `${totals.days} study day${totals.days === 1 ? "" : "s"} in total` : undefined} />
          <RingStat icon={Trophy} label="Badges earned" value={totals?.earned} max={totals?.badges.length} />
        </dl>
      </m.section>

      {/* ===================== BADGES ===================== */}
      {totals && (
        <section className="mt-8" aria-labelledby="badges">
          <h2 id="badges" className="font-display text-lg font-semibold text-ink">
            Badges
          </h2>
          <Stagger as="ul" className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3" gap={0.05}>
            {totals.badges.map((b) => (
              <StaggerItem
                as="li"
                key={b.key}
                className={`group flex items-center gap-3 rounded-xl border px-3.5 py-3 transition duration-200 hover:-translate-y-0.5 ${
                  b.earned ? "border-primary/30 bg-soft" : "border-line bg-surface"
                }`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${b.earned ? "bg-primary text-on-primary" : "bg-surface-2 text-muted"}`}>
                  {b.earned ? <Trophy className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                </span>
                <span className="min-w-0">
                  <span className={`block truncate text-sm font-semibold ${b.earned ? "text-ink" : "text-slate-300"}`}>{b.title}</span>
                  <span className="block truncate text-xs text-muted">{b.earned ? "Earned" : b.hint}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* ===================== DETAILS FORM ===================== */}
      <form onSubmit={handleSave} className="mt-8 rounded-2xl border border-line bg-surface" aria-busy={!loaded}>
        <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[200px_1fr]">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Personal details</h2>
            <p className="mt-1 text-sm text-muted">How you appear on your dashboard.</p>
          </div>
          <div className="space-y-5">
            <Field id="name" label="Full name" icon={User}>
              <input id="name" type="text" autoComplete="name" placeholder="Your name" value={p.name} onChange={set("name")} className="field pl-10" />
            </Field>
            <Field id="email" label="Email" icon={Mail} hint="Shown here once you log in with a student account.">
              <input id="email" type="email" value="" placeholder="Not logged in" disabled className="field cursor-not-allowed pl-10 opacity-70" />
            </Field>
            <Field id="phone" label="WhatsApp number" icon={Phone} hint="Optional. Used for payment confirmations.">
              <input id="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="03xx-xxxxxxx" value={p.phone} onChange={set("phone")} className="field pl-10" />
            </Field>
          </div>
        </div>

        <div className="grid gap-8 border-t border-line p-5 sm:p-8 md:grid-cols-[200px_1fr]">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Study details</h2>
            <p className="mt-1 text-sm text-muted">We use your year to show the right subjects.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="college" label="Dental college" icon={Building}>
              <input id="college" list="colleges" placeholder="e.g. DIKIOHS (Dow University)" value={p.college} onChange={set("college")} className="field pl-10" />
              <datalist id="colleges">
                {COLLEGES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
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
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 rounded-b-2xl border-t border-line bg-surface-2/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
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
            {dirty && !saved && <span className="text-xs text-muted">Unsaved changes</span>}
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" /> Save changes
            </button>
          </div>
        </div>
        {storageBlocked && <p className="px-5 pb-4 text-sm text-rose-600 dark:text-rose-400 sm:px-8">This browser is blocking storage, so your details can&apos;t be saved here.</p>}
      </form>
    </div>
  );
}

/** A stat with an animated ring that fills to value/max. */
function RingStat({ icon: Icon, label, value, max, sub }: { icon: React.ElementType; label: string; value?: number; max?: number; sub?: string }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const pct = value !== undefined && max ? Math.min(1, value / max) : 0;
  return (
    <div className="group flex flex-col items-center gap-3 px-2 py-5 text-center transition-colors hover:bg-surface-2/60 sm:flex-row sm:px-6 sm:text-left [&:not(:first-child)]:border-l [&:not(:first-child)]:border-line">
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
        <svg width="56" height="56" viewBox="0 0 56 56" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="28" cy="28" r={r} fill="none" strokeWidth="5" className="stroke-slate-800" />
          <m.circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - pct) }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="stroke-primary"
          />
        </svg>
        <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
      </span>
      <div className="flex min-w-0 flex-col">
        <dt className="mt-1 text-[13px] text-muted">{label}</dt>
        <dd className="-order-1 font-display text-2xl font-bold leading-none tracking-[-0.03em] text-ink">
          {value === undefined ? "–" : <AnimatedNumber value={value} />}
          {max && label !== "Day streak" ? <span className="text-sm font-medium text-muted"> / {max}</span> : null}
        </dd>
        {sub && <dd className="mt-0.5 hidden text-xs text-muted sm:block">{sub}</dd>}
      </div>
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
