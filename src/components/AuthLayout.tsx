"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Award, Layers, ListChecks, Moon, Presentation, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { SubjectArt } from "@/components/Illustrations";

const SLIDES = [
  { icon: ListChecks, title: "MCQs with explanations", text: "Tutor mode, timed exams and full mock papers for all six subjects." },
  { icon: Award, title: "10 years of DUHS past papers", text: "DIKIOHS, DDC & DIDC questions sorted by topic, with solutions." },
  { icon: Layers, title: "Flashcards that stick", text: "Active-recall decks for histology, cranial nerves and pharmacology." },
  { icon: Presentation, title: "Notes & lecture PPTs", text: "High-yield summaries and slide decks, ready for last-minute revision." },
];

/** Split-screen layout for login / signup with an animated brand panel. */
export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 3800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* ----------------------------- form side ----------------------------- */}
      <div className="relative flex w-full flex-col px-5 py-6 sm:px-10 lg:w-1/2 xl:px-16">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_60%)]" />
        <div className="relative flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <img src="/logo-icon.svg" alt="HMHDental logo" className="h-11 w-11 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105" />
            <span className="font-display text-2xl font-bold tracking-[-0.04em] text-ink">
              HMH<span className="text-primary">Dental</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:text-ink sm:inline-flex">
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-line bg-surface text-slate-300 transition hover:text-brand-400"
            >
              <Sun className={`absolute h-4 w-4 transition duration-500 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
              <Moon className={`absolute h-4 w-4 transition duration-500 ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
            </button>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-[2.25rem] font-bold leading-[1.05] tracking-[-0.04em] text-ink animate-rise">{title}</h1>
          <p className="mt-2 text-sm text-slate-400 animate-rise [animation-delay:80ms]">{subtitle}</p>
          <div className="mt-8 animate-rise [animation-delay:160ms]">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-slate-400 animate-rise [animation-delay:240ms]">{footer}</div>}
        </div>
      </div>

      {/* --------------------------- brand panel --------------------------- */}
      <div className="relative hidden overflow-hidden bg-deep lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        {/* deep-navy clinical panel: fine grid + soft teal and electric-blue light */}
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-glow/20 blur-3xl animate-drift" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-glow-2/25 blur-3xl animate-drift [animation-delay:-7s]" />

        {/* orbiting rings with tooth / molecule glyphs */}
        <div className="pointer-events-none absolute right-[-120px] top-1/2 h-[520px] w-[520px] -translate-y-1/2">
          <div className="absolute inset-0 rounded-full border border-white/15 animate-spin-slow">
            <span className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-2xl bg-white/90 shadow-md backdrop-blur"><SubjectArt id="oral-bio" className="h-8 w-8" /></span>
            <span className="absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-2xl bg-white/90 shadow-md backdrop-blur"><SubjectArt id="biochem" className="h-8 w-8" /></span>
          </div>
          <div className="absolute inset-16 rounded-full border border-dashed border-white/20 animate-spin-slow [animation-direction:reverse] [animation-duration:32s]">
            <span className="absolute -left-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/90 shadow-md backdrop-blur"><SubjectArt id="pharm" className="h-8 w-8" /></span>
            <span className="absolute -right-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/90 shadow-md backdrop-blur"><SubjectArt id="path" className="h-8 w-8" /></span>
          </div>
          <div className="absolute inset-32 rounded-full border border-white/10" />
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-cta" /> DUHS BDS 1st Year
          </span>
          <h2 className="mt-6 max-w-md font-display text-[2.75rem] font-bold leading-[1.05] tracking-[-0.04em] text-white">
            Your whole first year, organised in one calm place.
          </h2>
        </div>

        {/* rotating feature card */}
        <div className="relative max-w-md">
          <div className="relative h-36">
            {SLIDES.map((s, i) => (
              <div
                key={s.title}
                className={`absolute inset-0 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md transition duration-700 ${
                  i === slide ? "translate-y-0 opacity-100" : i === (slide + SLIDES.length - 1) % SLIDES.length ? "-translate-y-4 opacity-0" : "translate-y-4 opacity-0"
                }`}
                aria-hidden={i !== slide}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-bold text-white">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Show ${s.title}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
