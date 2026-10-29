"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  ListChecks,
  Presentation,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { BDS_SUBJECTS, BDS_MCQS, MEMBERSHIP_PLANS } from "@/lib/bds-content";
import { Reveal, CountUp } from "@/components/Reveal";
import { StudyPanel, ContinueReading } from "@/components/Motivation";
import AreaTiles from "@/components/AreaTiles";
import { SubjectArt } from "@/components/Illustrations";

const SUBJECT_TONE: Record<string, { text: string; bg: string; glow: string; bar: string }> = {
  anat: { text: "text-amber-400", bg: "bg-amber-500/10", glow: "group-hover:shadow-amber-500/20", bar: "from-amber-400 to-amber-600" },
  phys: { text: "text-rose-400", bg: "bg-rose-500/10", glow: "group-hover:shadow-rose-500/20", bar: "from-rose-400 to-rose-600" },
  "oral-bio": { text: "text-cyan-400", bg: "bg-cyan-500/10", glow: "group-hover:shadow-cyan-500/20", bar: "from-cyan-400 to-cyan-600" },
  biochem: { text: "text-violet-400", bg: "bg-violet-500/10", glow: "group-hover:shadow-violet-500/20", bar: "from-violet-400 to-violet-600" },
  pharm: { text: "text-emerald-400", bg: "bg-emerald-500/10", glow: "group-hover:shadow-emerald-500/20", bar: "from-emerald-400 to-emerald-600" },
  path: { text: "text-sky-400", bg: "bg-sky-500/10", glow: "group-hover:shadow-sky-500/20", bar: "from-sky-400 to-sky-600" },
};

const TESTIMONIALS = [
  { quote: "Best DUHS-specific resource I found in Karachi. The past papers are spot on.", who: "Hira, DIKIOHS" },
  { quote: "Explanations cite the textbook, so I actually understand the answer.", who: "Usman, DDC" },
  { quote: "The timed mock mode made my send-ups feel easy.", who: "Fatima, DIDC" },
  { quote: "Flashcards for cranial nerves saved my viva.", who: "Ali, DIKIOHS" },
  { quote: "Everything for Oral Biology in one place — notes, PPTs and MCQs.", who: "Sana, DDC" },
  { quote: "Clean, fast and works great on my phone.", who: "Bilal, DIDC" },
];

const FEATURES = [
  { icon: ListChecks, title: "MCQ practice with explanations", text: "Tutor mode, timed exams and full mock papers — every answer explained with textbook references." },
  { icon: Award, title: "10 years of DUHS past papers", text: "DIKIOHS, DDC & DIDC annual and supplementary questions, sorted by topic." },
  { icon: Layers, title: "Active-recall flashcards", text: "Flip-card decks for histology, cranial nerves, enzymes and dental pharmacology." },
  { icon: Presentation, title: "Notes & lecture PPTs", text: "High-yield summaries and slide decks for every subject, ready to revise from." },
];

export default function HomePage() {
  const subjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");
  const totalMcqs = subjects.reduce((n, s) => n + s.mcqCount, 0);

  return (
    <div className="relative overflow-hidden">
      {/* ============================ HERO ============================ */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-brand-500/20 blur-[110px] animate-drift" />
        <div className="pointer-events-none absolute -right-20 top-20 h-[380px] w-[380px] rounded-full bg-accent-500/20 blur-[110px] animate-drift [animation-delay:-6s]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pb-24 lg:pt-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-surface/70 px-3 py-1.5 text-xs font-semibold text-brand-400 shadow-soft backdrop-blur animate-rise">
              <Sparkles className="h-3.5 w-3.5" />
              DUHS BDS 1st Year · 2025–26 session
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl animate-rise [animation-delay:80ms]">
              Study smarter for your <span className="text-gradient animate-gradient-pan">BDS professionals</span>.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg animate-rise [animation-delay:160ms]">
              MCQs, past papers, flashcards, notes and PPTs for all six 1st-year subjects — organised exactly like the
              DIKIOHS, DDC &amp; DIDC syllabus.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 animate-rise [animation-delay:240ms]">
              <Link href="/signup" className="btn-brand group !px-6 !py-3 !text-base">
                Start practising free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/pricing" className="btn-ghost !px-6 !py-3 !text-base">
                See pricing
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4 animate-rise [animation-delay:320ms]">
              <div className="flex -space-x-2">
                {["H", "U", "F", "A", "S"].map((l, i) => (
                  <span
                    key={l}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-canvas bg-gradient-to-br from-brand-500 to-accent-600 text-xs font-bold text-white"
                    style={{ opacity: 1 - i * 0.12 }}
                  >
                    {l}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-slate-400">
                  <strong className="text-ink">500+ students</strong> across DIKIOHS, DDC &amp; DIDC
                </span>
              </div>
            </div>
          </div>

          <div className="animate-slide-in-right [animation-delay:200ms]">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ============================ YOUR STUDY TODAY ============================ */}
      <section className="relative mx-auto max-w-7xl space-y-10 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Your study today</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Keep your streak alive</h2>
            </div>
            <Link href="/subjects/anatomy" className="btn-ghost !py-2 !text-sm">
              All Anatomy lectures <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <StudyPanel />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ink">Continue where you left off</h3>
          <ContinueReading />
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <h3 className="text-lg font-semibold text-ink">Jump into Anatomy</h3>
            <span className="text-sm text-slate-400">Tap an area to see its lectures</span>
          </div>
          <AreaTiles />
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section className="border-y border-line bg-surface/60 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { n: totalMcqs, s: "+", label: "Practice MCQs" },
            { n: 10, s: " yrs", label: "DUHS past papers" },
            { n: subjects.reduce((n, s) => n + s.flashcardCount, 0), s: "+", label: "Flashcards" },
            { n: 500, s: "+", label: "Active students" },
          ].map((st, i) => (
            <Reveal key={st.label} delay={i * 90} className="text-center md:text-left">
              <div className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                <CountUp to={st.n} suffix={st.s} />
              </div>
              <div className="mt-1 text-sm text-slate-400">{st.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================ SUBJECTS ============================ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">6 subjects · one platform</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Everything for each subject, in one place</h2>
          <p className="mt-3 text-slate-400">Pick a subject to jump straight into its MCQs, notes &amp; PPTs, flashcards and topics.</p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s, i) => {
            const tone = SUBJECT_TONE[s.id] ?? SUBJECT_TONE.anat;
            return (
              <Reveal key={s.id} delay={(i % 3) * 100}>
                <div className={`group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${tone.glow}`}>
                  <div className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${tone.bar} transition-transform duration-500 group-hover:scale-x-100`} />
                  <div className="flex items-start justify-between">
                    <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${tone.bg} transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}>
                      <SubjectArt id={s.id} className="h-14 w-14" />
                    </span>
                    <span className={`rounded-full ${tone.bg} px-2.5 py-1 text-[11px] font-semibold ${tone.text}`}>{s.code}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink">{s.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-400">{s.description}</p>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    {[
                      { v: s.mcqCount, l: "MCQs" },
                      { v: s.flashcardCount, l: "Cards" },
                      { v: s.topicsCount, l: "Topics" },
                    ].map((m) => (
                      <div key={m.l} className="rounded-xl bg-slate-850 py-2">
                        <div className="text-sm font-bold text-ink">{m.v.toLocaleString()}</div>
                        <div className="text-[11px] text-slate-500">{m.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                    <Link href={`/practice?subject=${s.id}`} className={`rounded-lg ${tone.bg} px-3 py-1.5 ${tone.text} transition hover:opacity-80`}>
                      MCQs
                    </Link>
                    <Link href={`/resources?subject=${s.id}`} className="rounded-lg bg-slate-850 px-3 py-1.5 text-slate-300 transition hover:text-ink">
                      Notes &amp; PPTs
                    </Link>
                    <Link href={`/subjects/${s.slug}`} className="ml-auto inline-flex items-center gap-1 px-1 py-1.5 text-brand-400">
                      Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <section className="relative bg-surface/60 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Why HMHDental</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Built for DUHS exams — not a generic study app</h2>
            <p className="mt-4 text-slate-400">
              Every question, deck and slide is mapped to the DUHS modular syllabus, so you revise exactly what will be examined.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Track weak topics and progress", "Works on phone, tablet and laptop", "Light & dark themes for day or night study"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="group h-full rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-400 ring-1 ring-brand-500/20 transition-transform duration-300 group-hover:scale-110">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-bold text-ink">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ PRICING TEASER ============================ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">Pricing</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Simple plans in PKR</h2>
          <p className="mt-3 text-slate-400">Start free. Upgrade with JazzCash, Easypaisa or bank transfer when you&apos;re ready.</p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MEMBERSHIP_PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  p.isPopular
                    ? "border-brand-500/50 bg-surface shadow-lift ring-1 ring-brand-500/30"
                    : "border-line bg-surface shadow-soft"
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                    {p.badge}
                  </span>
                )}
                <h3 className="font-bold text-ink">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold tracking-tight text-ink">{p.pricePKR === 0 ? "Free" : `Rs ${p.pricePKR.toLocaleString()}`}</span>
                  <span className="text-xs text-slate-400">{p.periodText}</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {p.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex gap-2 text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.pricePKR === 0 ? "/signup" : `/checkout?plan=${p.id}`}
                  className={`mt-6 ${p.isPopular ? "btn-brand" : "btn-ghost"} w-full`}
                >
                  {p.pricePKR === 0 ? "Start free" : "Choose plan"}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="border-y border-line bg-surface/60 py-12">
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <figure key={i} className="w-80 shrink-0 rounded-2xl border border-line bg-surface p-5 shadow-soft">
                <blockquote className="text-sm leading-relaxed text-slate-300">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-3 text-xs font-semibold text-brand-400">— {t.who}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CTA ============================ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 px-6 py-14 text-center shadow-lift sm:px-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl animate-drift" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl animate-drift [animation-delay:-8s]" />
            <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Your professionals are closer than you think.</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/80">Join hundreds of BDS students already studying smarter. Free forever starter plan — no card needed.</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/signup" className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#1b1530] shadow-lg transition hover:-translate-y-0.5">
                Create free account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/practice" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                Try a quiz
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/* Animated "app preview" in the hero: an MCQ that answers itself on a loop */
function HeroPreview() {
  const mcq = BDS_MCQS[0];
  const [step, setStep] = useState(0); // 0 thinking, 1 picked, 2 explained

  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => (s + 1) % 3), 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      {/* Floating chips */}
      <div className="absolute -left-6 -top-8 z-10 hidden items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2 shadow-lift animate-float sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
          <Flame className="h-4 w-4" />
        </span>
        <div className="text-xs">
          <div className="font-bold text-ink">7-day streak</div>
          <div className="text-slate-400">Keep it going!</div>
        </div>
      </div>
      <div className="absolute -bottom-12 right-6 z-10 hidden items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2 shadow-lift animate-float-slow sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
          <TrendingUp className="h-4 w-4" />
        </span>
        <div className="text-xs">
          <div className="font-bold text-ink">Score +18%</div>
          <div className="text-slate-400">this week</div>
        </div>
      </div>

      <div className="relative rounded-3xl border border-line bg-surface p-5 shadow-lift sm:p-6">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 font-semibold text-amber-400">
            <SubjectArt id="anat" className="h-4 w-4" /> Anatomy · Q 12 / 40
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Clock className="h-3.5 w-3.5" /> 08:42
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
        </div>

        <p className="mt-5 text-[15px] font-semibold leading-snug text-ink">{mcq.question}</p>

        <div className="mt-4 space-y-2">
          {mcq.options.map((o, i) => {
            const correct = i === mcq.correctIndex;
            const picked = step >= 1 && correct;
            return (
              <div
                key={o}
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-500 ${
                  picked ? "border-emerald-500/50 bg-emerald-500/10 text-ink" : "border-line bg-canvas/50 text-slate-300"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all duration-500 ${
                    picked ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {picked ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
                </span>
                {o}
              </div>
            );
          })}
        </div>

        <div className={`grid transition-all duration-500 ${step === 2 ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className="flex gap-2.5 rounded-xl border border-brand-500/25 bg-brand-500/5 p-3 text-xs leading-relaxed text-slate-300">
              <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span>The inferior alveolar nerve enters the mandibular canal through the mandibular foramen, guarded by the lingula.</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs">
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <Target className="h-3.5 w-3.5 text-brand-400" /> UHS BDS Annual 2023
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified answer
          </span>
        </div>
      </div>
    </div>
  );
}
