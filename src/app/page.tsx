"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Check,
  Clock,
  FileText,
  Flame,
  Highlighter,
  Layers,
  Library,
  ListChecks,
  Presentation,
  Target,
  Timer,
  GraduationCap,
} from "lucide-react";
import { BDS_SUBJECTS, BDS_MCQS, MEMBERSHIP_PLANS } from "@/lib/bds-content";
import { Reveal } from "@/components/Reveal";
import { StudyPanel, ContinueReading } from "@/components/Motivation";
import AreaTiles from "@/components/AreaTiles";
import { SubjectArt } from "@/components/Illustrations";
import { SectionHeader } from "@/components/PageHeader";
import { siteStats, subjectStats, count } from "@/lib/stats";


export default function HomePage() {
  const subjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");
  const stats = siteStats();

  return (
    <div className="relative">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-content items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:py-20">
          <div>
            <p className="eyebrow animate-rise">DUHS · BDS 1st Year · 2025–26</p>
            <h1 className="mt-4 font-display text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink sm:text-6xl animate-rise [animation-delay:60ms]">
              Study smarter.
              <br />
              <span className="text-primary">Score higher.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted animate-rise [animation-delay:120ms]">
              Your BDS resources, practice questions, and revision tools — organized in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 animate-rise [animation-delay:180ms]">
              <Link href="/resources" className="btn-primary group !px-6 !text-[15px]">
                Explore Study Resources
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/practice" className="btn-secondary !px-6 !text-[15px]">
                <ListChecks className="h-4 w-4" />
                Start MCQ Practice
              </Link>
            </div>

            {/* Real content counts only */}
            <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface/80 backdrop-blur animate-rise [animation-delay:240ms]">
              {[
                { v: stats.lectures, l: "Lecture PDFs" },
                { v: stats.books, l: "Textbooks" },
                { v: stats.subjects, l: "Subjects" },
              ].map((s) => (
                <div key={s.l} className="px-4 py-3.5">
                  <dt className="text-xs text-muted">{s.l}</dt>
                  <dd className="mt-0.5 font-display text-2xl font-extrabold tracking-tight text-ink">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-slide-in-right [animation-delay:150ms]">
            <HeroPreview />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content space-y-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* ============================ CONTINUE ============================ */}
        <section aria-labelledby="continue">
          <SectionHeader
            id="continue"
            title="Pick up where you left off"
            intro="Your streak, today's goal and the lectures you opened most recently."
          />
          <div className="space-y-5">
            <StudyPanel />
            <ContinueReading />
          </div>
        </section>

        {/* ============================ 1. FEATURED RESOURCES ============================ */}
        <section aria-labelledby="featured">
          <SectionHeader
            id="featured"
            title="Featured study resources"
            intro={`The complete Anatomy lecture library — ${stats.lectures} lecture PDFs arranged by area, readable right in your browser.`}
            action={
              <Link href="/subjects/anatomy" className="btn-secondary !min-h-[40px] !py-2">
                Open Anatomy <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <AreaTiles />
        </section>

        {/* ============================ 2. SUBJECTS ============================ */}
        <section aria-labelledby="subjects">
          <SectionHeader
            id="subjects"
            title="Explore BDS subjects"
            intro="All six first-year subjects, following the DIKIOHS, DDC and DIDC syllabus."
            action={
              <Link href="/subjects" className="link inline-flex items-center gap-1 text-sm">
                All subjects <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s, i) => {
              const st = subjectStats(s.id);
              const meta = [count(st.lectures, "lecture"), count(st.books, "textbook"), count(st.mcqs, "MCQ")].filter(Boolean);
              return (
                <Reveal key={s.id} delay={(i % 3) * 70}>
                  <article className="resource-card group">
                    <div className="flex items-start gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-soft">
                        <SubjectArt id={s.id} className="h-11 w-11" />
                      </span>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold tracking-wide text-primary">{s.code}</span>
                        <h3 className="card-title mt-0.5">{s.name}</h3>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{s.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {meta.length ? meta.map((m) => <span key={m} className="chip">{m}</span>) : <span className="chip">Content being added</span>}
                    </div>
                    <div className="mt-auto flex items-center gap-4 border-t border-line pt-4 text-sm">
                      <Link href={`/subjects/${s.slug}`} className="link inline-flex items-center gap-1 after:absolute after:inset-0 after:content-['']">
                        Open subject <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link href={`/practice?subject=${s.id}`} className="relative z-10 ml-auto text-xs font-semibold text-muted hover:text-primary">
                        Practice MCQs
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ============================ 3. MCQ PRACTICE ============================ */}
        <section aria-labelledby="mcq" className="grid gap-10 rounded-2xl border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">MCQ practice</p>
            <h2 id="mcq" className="section-title mt-3">Test your knowledge. Strengthen your concepts.</h2>
            <p className="section-intro">
              Choose a subject, practice exam-style questions, and review the explanation for every answer.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/practice" className="btn-primary">
                Start MCQ Practice <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/past-papers" className="btn-secondary">
                Browse past papers
              </Link>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: BookOpenCheck, t: "Tutor mode", d: "See the answer and explanation straight after each question." },
              { icon: Timer, t: "Timed test", d: "Practise under time pressure with a running clock." },
              { icon: Target, t: "Mock exam", d: "Sit a full simulated paper and review your score at the end." },
            ].map((m) => (
              <li key={m.t} className="flex gap-3.5 rounded-xl border border-line bg-canvas p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft text-primary">
                  <m.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="card-title">{m.t}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{m.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ============================ 4. REVISION TOOLS ============================ */}
        <section aria-labelledby="revision">
          <SectionHeader id="revision" title="Flashcards and revision tools" intro="Small tools that make daily revision easier to start and easier to keep up." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ToolCard
              icon={Layers}
              title="Flashcards"
              text="Flip-card decks for active recall — cranial nerves, histology, enzymes and dental pharmacology."
              meta={count(stats.decks, "deck")}
              href="/flashcards"
              action="View Flashcards"
            />
            <ToolCard
              icon={Highlighter}
              title="Reader with highlights & notes"
              text="Open any lecture or textbook in the site, highlight in four colours, add notes and export them."
              meta="Lectures & textbooks"
              href="/subjects/anatomy/ppts-combined"
              action="Open a lecture"
            />
            <ToolCard
              icon={Flame}
              title="Streak, goal & exam countdown"
              text="Set a daily lecture goal, keep your streak and see how many days are left before your exam."
              meta="Saved on this device"
              href="/dashboard"
              action="Go to dashboard"
            />
          </div>
        </section>

        {/* ============================ 5. PAPERS & MATERIALS ============================ */}
        <section aria-labelledby="materials">
          <SectionHeader id="materials" title="Past papers and lecture materials" intro="Everything you revise from, sorted by type." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ToolCard icon={Award} title="Past papers" text="DUHS past-paper questions with explanations, filterable by subject." href="/past-papers" action="Browse papers" />
            <ToolCard icon={Presentation} title="Notes & PPTs" text="Lecture slides and PDF notes for each subject." meta={count(stats.lectures + stats.notes, "file")} href="/resources" action="Open resources" />
            <ToolCard icon={Library} title="Textbooks" text="Recommended textbooks, readable inside the site." meta={count(stats.books, "book")} href="/books" action="View textbooks" />
            <ToolCard icon={FileText} title="Content library" text="Every paper and question set in one place." href="/content" action="Open library" />
          </div>
        </section>

        {/* ============================ 6. PRICING ============================ */}
        <section aria-labelledby="pricing">
          <SectionHeader
            id="pricing"
            title="Membership and pricing"
            intro="Start free. Upgrade with JazzCash, Easypaisa or bank transfer when you're ready."
            action={
              <Link href="/pricing" className="link inline-flex items-center gap-1 text-sm">
                Compare plans <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MEMBERSHIP_PLANS.map((p) => (
              <div
                key={p.id}
                className={`relative flex h-full flex-col rounded-2xl border bg-surface p-6 ${
                  p.isPopular ? "border-primary/60 ring-1 ring-primary/30" : "border-line"
                }`}
              >
                {p.badge && <span className="chip-pro absolute -top-2.5 left-6 border border-primary/30 bg-surface">{p.badge}</span>}
                <h3 className="card-title">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-extrabold tracking-tight text-ink">
                    {p.pricePKR === 0 ? "Free" : `Rs ${p.pricePKR.toLocaleString()}`}
                  </span>
                  <span className="text-xs text-muted">{p.periodText}</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {p.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex gap-2 text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={p.pricePKR === 0 ? "/signup" : `/checkout?plan=${p.id}`} className={`mt-6 w-full ${p.isPopular ? "btn-primary" : "btn-secondary"}`}>
                  {p.pricePKR === 0 ? "Start free" : "Choose plan"}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ============================ CTA ============================ */}
        <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-soft via-surface to-surface px-6 py-12 text-center sm:px-12">
          <GraduationCap className="mx-auto h-10 w-10 text-primary" />
          <h2 className="section-title mt-4">Ready for your next study session?</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted">Create a free account to save your plan, then pick up any lecture or question set.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-primary !px-6">
              Create free account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/subjects" className="btn-secondary !px-6">
              Browse subjects
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function ToolCard({
  icon: Icon,
  title,
  text,
  meta,
  href,
  action,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  meta?: string;
  href: string;
  action: string;
}) {
  return (
    <article className="resource-card group">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft text-primary">
          <Icon className="h-5 w-5" />
        </span>
        {meta && <span className="chip">{meta}</span>}
      </div>
      <h3 className="card-title mt-4">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{text}</p>
      <Link href={href} className="link mt-4 inline-flex items-center gap-1 text-sm after:absolute after:inset-0 after:content-['']">
        {action} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}

/* Hero preview: a real sample question from the question bank that answers itself on a loop */
function HeroPreview() {
  const mcq = BDS_MCQS[0];
  const [step, setStep] = useState(0); // 0 reading, 1 answered, 2 explained

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setStep(2);
      return;
    }
    const id = window.setInterval(() => setStep((s) => (s + 1) % 3), 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative rounded-2xl border border-line bg-surface p-5 shadow-lift sm:p-6">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-2.5 py-1 font-semibold text-primary">
            <SubjectArt id="anat" className="h-4 w-4" /> Sample question · Anatomy
          </span>
          <span className="inline-flex items-center gap-1 text-muted">
            <Clock className="h-3.5 w-3.5" /> Tutor mode
          </span>
        </div>

        <p className="mt-5 text-[15px] font-semibold leading-snug text-ink">{mcq.question}</p>

        <div className="mt-4 space-y-2" role="list">
          {mcq.options.map((o, i) => {
            const correct = i === mcq.correctIndex;
            const picked = step >= 1 && correct;
            return (
              <div
                role="listitem"
                key={o}
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-500 ${
                  picked ? "border-emerald-500/50 bg-emerald-500/10 text-ink" : "border-line bg-canvas text-slate-300"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all duration-500 ${
                    picked ? "bg-emerald-500 text-white" : "bg-surface-2 text-muted"
                  }`}
                >
                  {picked ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
                </span>
                {o}
                {picked && <span className="sr-only">(correct answer)</span>}
              </div>
            );
          })}
        </div>

        <div className={`grid transition-all duration-500 ${step === 2 ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className="flex gap-2.5 rounded-xl border border-primary/25 bg-soft p-3 text-xs leading-relaxed text-slate-300">
              <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="line-clamp-3">{mcq.explanation}</span>
            </div>
          </div>
        </div>

        {mcq.yearSource && (
          <div className="mt-5 flex items-center gap-1.5 border-t border-line pt-4 text-xs text-muted">
            <Target className="h-3.5 w-3.5 text-primary" /> Source: {mcq.yearSource}
          </div>
        )}
      </div>
    </div>
  );
}
