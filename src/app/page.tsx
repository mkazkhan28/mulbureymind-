"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Flame,
  Highlighter,
  Layers,
  Library,
  ListChecks,
  PlayCircle,
  Presentation,
  Smartphone,
  Sparkles,
  Target,
  UserPlus,
  GraduationCap,
  X,
} from "lucide-react";
import { BDS_SUBJECTS, BDS_MCQS, MEMBERSHIP_PLANS } from "@/lib/bds-content";
import { Reveal, Stagger, StaggerItem, m, AnimatePresence, EASE } from "@/components/motion";
import AreaTiles from "@/components/AreaTiles";
import { SubjectArt } from "@/components/Illustrations";
import { SectionHeader } from "@/components/PageHeader";
import { siteStats, subjectStats, count } from "@/lib/stats";
import { useProgress } from "@/lib/progress";
import { catalogById } from "@/lib/catalog";

const FREE_PLAN = MEMBERSHIP_PLANS.find((p) => p.pricePKR === 0);

export default function HomePage() {
  const heroRef = React.useRef<HTMLElement>(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-offscreen", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const subjects = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");
  const stats = siteStats();

  const faqs: { q: string; a: React.ReactNode }[] = [
    {
      q: "Is HMHDental free?",
      a: (
        <>
          Yes, there is a free plan and you don&apos;t need a card to sign up.
          {FREE_PLAN && (
            <>
              {" "}
              It includes:
              <ul className="mt-2 space-y-1">
                {FREE_PLAN.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ),
    },
    {
      q: "Which syllabus does it follow?",
      a: "It is built for DUHS BDS 1st Year and follows the DIKIOHS, DDC and DIDC teaching. Lectures are grouped by subject and chapter the way they are taught.",
    },
    {
      q: "How do I pay for a plan?",
      a: "Plans can be paid with JazzCash, Easypaisa or bank transfer from the checkout page. Your plan activates once the payment is confirmed.",
    },
    {
      q: "Can I use it on my phone?",
      a: "Yes. The site works in your phone's browser — lectures and textbooks open in the built-in reader, and MCQs and flashcards are designed for small screens.",
    },
    {
      q: "Where are my progress, bookmarks and notes saved?",
      a: "On this device, in your browser. Your reading position, streak, bookmarks, highlights and notes stay here between visits. Clearing your browser data removes them.",
    },
  ];

  return (
    <div className="relative">
      {/* ============================ HERO ============================ */}
      <section ref={heroRef} className="relative overflow-hidden border-b border-line">
        <HeroBackdrop />

        <div className="relative mx-auto grid max-w-content items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:py-20">
          <div>
            <p className="eyebrow hero-in" style={{ "--i": 0 } as React.CSSProperties}>
              DUHS · BDS 1st Year · 2025–26
            </p>
            {/* Staggered word reveal — CSS keyframes, so it plays before JavaScript loads (no hidden LCP text) */}
            <h1 className="mt-4 font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink sm:text-6xl">
              <span className="hero-line">
                <HeroWord i={1}>Study</HeroWord> <HeroWord i={2}>smarter.</HeroWord>
              </span>
              <span className="hero-line">
                <HeroWord i={3} className="text-shimmer">Score</HeroWord> <HeroWord i={4} className="text-shimmer">higher.</HeroWord>
              </span>
            </h1>
            <p className="hero-in mt-5 max-w-xl text-lg leading-relaxed text-muted" style={{ "--i": 5 } as React.CSSProperties}>
              Your BDS lectures, textbooks, practice questions and revision tools — organised by subject and chapter, in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary btn-sheen hero-in group !px-6 !text-[15px]" style={{ "--i": 6 } as React.CSSProperties}>
                Start free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/subjects" className="btn-secondary hero-in !px-6 !text-[15px]" style={{ "--i": 7 } as React.CSSProperties}>
                Browse subjects
              </Link>
            </div>
            <ul className="hero-in mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted" style={{ "--i": 7 } as React.CSSProperties}>
              <li className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" /> Free plan, no card needed
              </li>
              <li className="flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-primary" /> Works on your phone
              </li>
            </ul>

            {/* Real content counts only */}
            <dl className="hero-in mt-9 grid max-w-lg grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface/80 backdrop-blur" style={{ "--i": 8 } as React.CSSProperties}>
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

          <div className="hero-in-right">
            <HeroPreview />
          </div>
        </div>
      </section>

      <WelcomeBack />

      <div className="mx-auto max-w-content space-y-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* ============================ HOW IT WORKS ============================ */}
        <section aria-labelledby="how">
          <SectionHeader id="how" title="How it works" intro="From sign-up to your first revision session in a couple of minutes." />
          <Stagger as="ol" className="grid gap-4 md:grid-cols-3">
            {[
              { icon: UserPlus, t: "Create a free account", d: "Pick your college and year. No card, no payment details." },
              { icon: Presentation, t: "Open a chapter", d: "Each chapter puts its lectures, textbook and MCQs on one page. We remember the page you stopped on." },
              { icon: ListChecks, t: "Practise and revise", d: "Answer MCQs with explanations, flip flashcards and keep a daily streak going." },
            ].map((s, i) => (
              <StaggerItem key={s.t} as="li" className="relative rounded-2xl border border-line bg-surface p-6">
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-primary/10" aria-hidden>
                  {i + 1}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="card-title mt-4">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.t}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* ============================ FEATURED RESOURCES ============================ */}
        <section aria-labelledby="featured">
          <SectionHeader
            id="featured"
            title="Featured: the Anatomy lecture library"
            intro={`${stats.lectures} lecture PDFs arranged by area, readable right in your browser with highlights and notes.`}
            action={
              <Link href="/subjects/anatomy" className="btn-secondary !min-h-[40px] !py-2">
                Open Anatomy <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <AreaTiles />
        </section>

        {/* ============================ SUBJECTS ============================ */}
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
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => {
              const st = subjectStats(s.id);
              const meta = [count(st.lectures, "lecture"), count(st.books, "textbook"), count(st.mcqs, "MCQ")].filter(Boolean);
              return (
                <StaggerItem key={s.id}>
                  <article className="resource-card card-glow group">
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
                      {meta.length ? meta.map((x) => <span key={x} className="chip">{x}</span>) : <span className="chip">Content being added</span>}
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
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        {/* ============================ MCQ PRACTICE ============================ */}
        <Reveal as="section" className="card-glow relative grid gap-10 overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
          <div>
            <p className="eyebrow">MCQ practice</p>
            <h2 id="mcq" className="section-title mt-3">Test your knowledge. Strengthen your concepts.</h2>
            <p className="section-intro">Choose a subject, answer exam-style questions from past papers, and read the explanation for every answer.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/practice" className="btn-primary">
                Try a practice set <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/past-papers" className="btn-secondary">
                Browse past papers
              </Link>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: BookOpenCheck, t: "Tutor mode", d: "See the answer and explanation straight after each question." },
              { icon: Clock, t: "Timed test", d: "One minute per question, with a running clock and mark-for-review." },
              { icon: Target, t: "Mock exam", d: "A 20-question paper, then a full review of every answer." },
            ].map((x) => (
              <li key={x.t} className="flex gap-3.5 rounded-xl border border-line bg-canvas p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft text-primary">
                  <x.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="card-title">{x.t}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ============================ WHAT'S INSIDE ============================ */}
        <section aria-labelledby="inside">
          <SectionHeader id="inside" title="Everything else you revise from" intro="Revision tools and study materials, sorted by type." />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ToolCard icon={Layers} title="Flashcards" text="Flip-card decks for active recall, with a ‘revise the missed cards’ round." meta={count(stats.decks, "deck")} href="/flashcards" action="View flashcards" />
            <ToolCard
              icon={Highlighter}
              title="Reader with highlights & notes"
              text="Open any lecture or textbook in the site, highlight in four colours, add notes and export them."
              meta="Lectures & textbooks"
              href="/subjects/anatomy"
              action="Open a lecture"
            />
            <ToolCard icon={Flame} title="Streak, goal & exam countdown" text="Set a daily lecture goal, keep your streak and see the days left before your exam." meta="Saved on this device" href="/dashboard" action="Go to dashboard" />
            <ToolCard icon={Award} title="Past papers" text="DUHS past-paper questions with explanations, filterable by subject." href="/past-papers" action="Browse papers" />
            <ToolCard icon={Presentation} title="Notes & PPTs" text="Lecture slides and PDF notes for each subject." meta={count(stats.lectures + stats.notes, "file")} href="/resources" action="Open resources" />
            <ToolCard icon={Library} title="Textbooks" text="Recommended textbooks, readable inside the site." meta={count(stats.books, "book")} href="/books" action="View textbooks" />
          </Stagger>
        </section>

        {/* ============================ PRICING ============================ */}
        <section aria-labelledby="pricing">
          <SectionHeader
            id="pricing"
            title="Start free. Upgrade when you're ready."
            intro="Pay with JazzCash, Easypaisa or bank transfer. Your plan activates once the payment is confirmed."
            action={
              <Link href="/pricing" className="link inline-flex items-center gap-1 text-sm">
                Compare all features <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MEMBERSHIP_PLANS.map((p) => {
              const perMonth = p.durationMonths > 1 ? Math.round(p.pricePKR / p.durationMonths) : 0;
              return (
                <StaggerItem
                  key={p.id}
                  className={`relative flex h-full flex-col rounded-2xl border bg-surface p-6 transition-transform duration-300 hover:-translate-y-0.5 ${
                    p.isPopular ? "card-glow border-primary/60 ring-1 ring-primary/30" : "border-line"
                  }`}
                >
                  {p.badge && <span className="chip-pro absolute -top-2.5 left-6 border border-primary/30 bg-surface">{p.badge}</span>}
                  <h3 className="card-title">{p.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="font-display text-3xl font-extrabold tracking-tight text-ink">{p.pricePKR === 0 ? "Free" : `Rs ${p.pricePKR.toLocaleString()}`}</span>
                    <span className="text-xs text-muted">{p.periodText}</span>
                  </div>
                  <p className="mt-1 h-4 text-xs text-muted">{perMonth ? `About Rs ${perMonth.toLocaleString()} a month` : ""}</p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm">
                    {p.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex gap-2 text-slate-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={p.pricePKR === 0 ? "/signup" : `/checkout?plan=${p.id}`} className={`mt-6 w-full ${p.isPopular ? "btn-primary" : "btn-secondary"}`}>
                    {p.pricePKR === 0 ? "Start free" : "Choose plan"}
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted">
            <CreditCard className="h-3.5 w-3.5" /> JazzCash · Easypaisa · Bank transfer
          </p>
        </section>

        {/* ============================ FAQ ============================ */}
        <section aria-labelledby="faq" className="mx-auto max-w-3xl">
          <SectionHeader id="faq" title="Questions students ask" />
          <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {faqs.map((f, i) => (
              <Faq key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            Something else?{" "}
            <Link href="/contact" className="link">
              Contact us
            </Link>
          </p>
        </section>

        {/* ============================ CTA ============================ */}
        <Reveal as="section" className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-soft via-surface to-surface px-6 py-12 text-center sm:px-12">
          <GraduationCap className="mx-auto h-10 w-10 text-primary" />
          <h2 className="section-title mt-4">Ready for your next study session?</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted">Create a free account, open a chapter, and we&apos;ll keep your place for next time.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-primary !px-6">
              Create free account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/subjects" className="btn-secondary !px-6">
              Browse subjects
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* For returning students: a small floating card to jump back into the last lecture.
   It floats over the page instead of being inserted into it, so nothing below moves. */
function WelcomeBack() {
  const progress = useProgress();
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    try {
      setHidden(sessionStorage.getItem("hmh-welcome-dismissed") === "1");
    } catch {
      setHidden(false);
    }
  }, []);
  const last = progress
    ? Object.entries(progress.opened)
        .sort((a, b) => b[1].at - a[1].at)
        .map(([id, o]) => ({ item: catalogById.get(id), o }))
        .find((x) => x.item)
    : undefined;
  const dismiss = () => {
    setHidden(true);
    try {
      sessionStorage.setItem("hmh-welcome-dismissed", "1");
    } catch {}
  };
  return (
    <AnimatePresence>
      {!hidden && last?.item && (
        <m.aside
          aria-label="Continue where you left off"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE, delay: 0.6 } }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.2, ease: EASE } }}
          className="fixed inset-x-4 bottom-20 z-40 rounded-2xl border border-line bg-elevated p-4 shadow-lift sm:inset-x-auto sm:right-6 sm:w-[22rem] lg:bottom-6"
        >
          <button onClick={dismiss} aria-label="Dismiss" className="absolute right-2 top-2 rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-ink">
            <X className="h-4 w-4" />
          </button>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Welcome back
          </p>
          <p className="mt-1 pr-6 text-sm text-ink">
            <span className="font-semibold">{last.item.title}</span>
            <span className="text-muted"> · page {last.o.page}</span>
          </p>
          <div className="mt-3 flex gap-2">
            <Link href={last.item.href} className="btn-primary !min-h-[36px] flex-1 !py-1.5 text-sm">
              <PlayCircle className="h-4 w-4" /> Resume
            </Link>
            <Link href="/dashboard" className="btn-secondary !min-h-[36px] !px-4 !py-1.5 text-sm">
              Dashboard
            </Link>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  );
}

function Faq({ q, a, defaultOpen = false }: { q: string; a: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = "faq-" + q.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink transition-colors hover:text-primary sm:px-6"
        >
          {q}
          <ChevronDown className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">{a}</div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeroWord({ i, children, className = "" }: { i: number; children: React.ReactNode; className?: string }) {
  return (
    <span className={`hero-word ${className}`} style={{ "--i": i } as React.CSSProperties}>
      {children}
    </span>
  );
}

/* Soft, slow-moving glow orbs and a faint grid behind the hero (transform-only CSS animation) */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]" />
      <div className="orb left-1/2 top-[-12rem] h-[26rem] w-[44rem] -translate-x-1/2 bg-brand-500/15" />
      <div className="orb orb-a -left-24 top-24 h-72 w-72 bg-brand-400/15" />
      <div className="orb orb-b right-[-6rem] top-40 h-80 w-80 bg-accent-500/10" />
      <span className="float-dot left-[12%] top-[22%] h-2 w-2 [animation-delay:-2s]" />
      <span className="float-dot left-[46%] top-[78%] h-1.5 w-1.5 [animation-delay:-5s]" />
      <span className="float-dot right-[8%] top-[14%] h-2.5 w-2.5 [animation-delay:-8s]" />
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
    <StaggerItem as="article" className="resource-card card-glow group">
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
    </StaggerItem>
  );
}

/* Hero preview: a real sample question from the question bank that answers itself on a loop */
function HeroPreview() {
  const mcq = BDS_MCQS[0];
  const [step, setStep] = useState(0); // 0 reading, 1 answered, 2 explained

  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setStep(2);
      return;
    }
    // Only loop while the card is on screen and the tab is visible
    let visible = true;
    let id = 0;
    const sync = () => {
      window.clearInterval(id);
      if (visible && document.visibilityState === "visible") id = window.setInterval(() => setStep((s) => (s + 1) % 3), 2400);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    if (cardRef.current) io.observe(cardRef.current);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      window.clearInterval(id);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={cardRef} className="relative mx-auto w-full max-w-md lg:max-w-none">
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
                className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition duration-500 ${
                  picked ? "border-emerald-500/50 bg-emerald-500/10 text-ink" : "border-line bg-canvas text-slate-300"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition duration-500 ${
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

        {/* space is always reserved; only opacity/transform animate, so the card never changes height */}
        <div className={`mt-4 transition-[opacity,transform] duration-500 ${step === 2 ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`} aria-hidden={step !== 2}>
          <div>
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
