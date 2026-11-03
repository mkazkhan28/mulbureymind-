"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Award, FileStack, Layers, Library, ListChecks, Presentation, Stethoscope } from "lucide-react";
import { BDS_MCQS } from "@/lib/bds-content";
import { lecturesInArea } from "@/lib/catalog";
import { siteStats, count } from "@/lib/stats";
import { Stagger, StaggerItem } from "@/components/motion";

/**
 * The study-material categories as a short, scannable list.
 * Used on the dashboard and the Resources page: a gateway to each library, never the libraries themselves.
 * Every count is computed from content that exists in the site.
 */
export function resourceCategories() {
  const s = siteStats();
  const pastPaperMcqs = BDS_MCQS.filter((q) => q.yearSource).length;
  const clinical = lecturesInArea("biochemistry", "clinical-topics").length;
  return [
    { href: "/resources#slides", icon: Presentation, title: "Lecture slides", text: "Every lecture as a PDF, by subject and chapter", meta: count(s.lectures, "file") },
    { href: "/practice", icon: ListChecks, title: "MCQ practice", text: "Tutor, timed and mock-exam modes", meta: count(s.mcqs, "question") },
    { href: "/past-papers", icon: Award, title: "Past papers", text: "DUHS questions with explanations", meta: count(pastPaperMcqs, "question") },
    { href: "/flashcards", icon: Layers, title: "Flashcards", text: "Active-recall decks", meta: count(s.decks, "deck") },
    { href: "/books", icon: Library, title: "Textbooks", text: "Recommended reference books", meta: count(s.books, "book") },
    { href: "/subjects/biochemistry/clinical-topics", icon: Stethoscope, title: "Clinical topics", text: "Biochemistry in dentistry and clinical cases", meta: count(clinical, "lecture") },
    { href: "/content", icon: FileStack, title: "Papers & question sets", text: "Annual papers and topic-wise sets", meta: "" },
  ];
}

export default function ResourceGateway({ columns = 2, exclude = [] as string[] }: { columns?: 2 | 3 | 4; exclude?: string[] }) {
  const items = resourceCategories().filter((c) => !exclude.includes(c.href));
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <Stagger as="ul" className={`grid gap-2.5 ${cols}`} gap={0.04}>
      {items.map((c) => (
        <StaggerItem as="li" key={c.href}>
          <Link
            href={c.href}
            className="group flex h-full items-center gap-3.5 rounded-xl border border-line bg-surface px-3.5 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-soft text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
              <c.icon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2">
                <span className="truncate font-display text-[15px] font-semibold text-ink">{c.title}</span>
                {c.meta && <span className="shrink-0 text-xs tabular-nums text-muted">{c.meta}</span>}
              </span>
              <span className="block truncate text-[13px] text-muted">{c.text}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
