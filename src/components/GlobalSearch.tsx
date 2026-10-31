"use client";

/**
 * Global search — subjects, chapters, lectures, textbooks and pages in one box.
 * Runs entirely in the browser over data the site already has (no extra requests),
 * and is keyboard accessible (ARIA combobox: ↑ ↓ Enter Esc).
 */
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Award, BookOpen, CreditCard, Layers, Library, ListChecks, Presentation, Search, ShieldCheck, X } from "lucide-react";
import { BDS_SUBJECTS, BDS_TOPICS } from "@/lib/bds-content";
import { SUBJECT_STRUCTURES } from "@/lib/subject-structure";
import { CATALOG } from "@/lib/catalog";
import { SubjectArt, AreaArt } from "@/components/Illustrations";

type Hit = {
  key: string;
  title: string;
  sub: string;
  href: string;
  group: "Subjects" | "Chapters" | "Lectures & books" | "Pages";
  icon: React.ReactNode;
};

const firstYear = BDS_SUBJECTS.filter((s) => s.yearId === "bds-1");

const PAGES: { title: string; sub: string; href: string; icon: React.ElementType; words: string }[] = [
  { title: "MCQ practice", sub: "Tutor, timed and mock exam modes", href: "/practice", icon: ListChecks, words: "mcq quiz test exam practice bcq" },
  { title: "Past papers", sub: "DUHS past-paper questions", href: "/past-papers", icon: Award, words: "past papers annual previous" },
  { title: "Flashcards", sub: "Active-recall decks", href: "/flashcards", icon: Layers, words: "flashcards cards revise recall" },
  { title: "Resources", sub: "Notes and lecture slides", href: "/resources", icon: Presentation, words: "notes ppt slides pdf resources handouts" },
  { title: "Textbooks", sub: "Recommended books", href: "/books", icon: Library, words: "books textbooks reference" },
  { title: "Bookmarks", sub: "Your saved lectures and books", href: "/bookmarks", icon: BookOpen, words: "bookmarks saved later" },
  { title: "Pricing", sub: "Plans and membership", href: "/pricing", icon: CreditCard, words: "pricing plans membership buy pay" },
  { title: "Plan status", sub: "Your membership and receipts", href: "/subscription", icon: ShieldCheck, words: "status subscription plan receipt" },
];

/** Chapters = Anatomy areas + topics of the other subjects */
const CHAPTERS = [
  ...Object.values(SUBJECT_STRUCTURES).flatMap((st) =>
    st.areas.map((a) => ({ id: `${st.subjectSlug}-${a.slug}`, title: a.title, sub: `${st.shortName} · ${a.topics.slice(0, 3).join(", ")}`, href: `/subjects/${st.subjectSlug}/${a.slug}`, words: `${a.title} ${a.topics.join(" ")}`, area: a.slug, subjectId: "" }))
  ),
  ...BDS_TOPICS.filter((t) => !SUBJECT_STRUCTURES[firstYear.find((s) => s.id === t.subjectId)?.slug ?? ""]).flatMap((t) => {
    const s = firstYear.find((x) => x.id === t.subjectId);
    return s ? [{ id: t.id, title: t.name, sub: s.name, href: `/subjects/${s.slug}/${t.slug}`, words: `${t.name} ${t.description}`, area: "", subjectId: s.id }] : [];
  }),
];

/** Plain-data search index (also used by the static preview) */
export type IndexEntry = { key: string; title: string; sub: string; href: string; group: Hit["group"]; words: string; thumb?: string; subjectId?: string; area?: string; page?: string };
export const SEARCH_INDEX: IndexEntry[] = [
  ...firstYear.map((s) => ({ key: s.id, title: s.name, sub: s.code, href: `/subjects/${s.slug}`, group: "Subjects" as const, words: `${s.name} ${s.code} ${s.description}`, subjectId: s.id })),
  ...CHAPTERS.map((c) => ({ key: c.id, title: c.title, sub: c.sub, href: c.href, group: "Chapters" as const, words: c.words, area: c.area || undefined, subjectId: c.subjectId || undefined })),
  ...CATALOG.map((h) => ({
    key: h.id,
    title: h.title,
    sub: [h.kind === "book" ? "Textbook" : h.areaTitle, h.topic, h.pages ? `${h.pages} slides` : ""].filter(Boolean).join(" · "),
    href: h.href,
    group: "Lectures & books" as const,
    words: `${h.title} ${h.topic ?? ""} ${h.areaTitle ?? ""} ${h.by ?? ""}`,
    thumb: h.thumb,
  })),
  ...PAGES.map((p) => ({ key: p.href, title: p.title, sub: p.sub, href: p.href, group: "Pages" as const, words: `${p.title} ${p.sub} ${p.words}`, page: p.href })),
];
const PAGE_ICON = Object.fromEntries(PAGES.map((p) => [p.href, p.icon]));
const LIMIT: Record<Hit["group"], number> = { Subjects: 3, Chapters: 4, "Lectures & books": 6, Pages: 3 };

function iconFor(e: IndexEntry): React.ReactNode {
  if (e.group === "Subjects" && e.subjectId) return <SubjectArt id={e.subjectId} className="h-7 w-7" />;
  if (e.group === "Chapters") return e.area ? <AreaArt slug={e.area} className="h-7 w-7" /> : e.subjectId ? <SubjectArt id={e.subjectId} className="h-7 w-7" /> : <BookOpen className="h-4 w-4" />;
  if (e.group === "Lectures & books")
    return e.thumb ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={e.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
    ) : (
      <BookOpen className="h-4 w-4" />
    );
  const I = (e.page && PAGE_ICON[e.page]) || BookOpen;
  return <I className="h-4 w-4" />;
}

const has = (hay: string, words: string[]) => words.every((w) => hay.includes(w));

function search(q: string): Hit[] {
  const ql = q.toLowerCase();
  const words = ql.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const score = (e: IndexEntry) => {
    const t = e.title.toLowerCase();
    return (t.startsWith(words[0]) ? 2 : 0) + (t.includes(ql) ? 2 : 0) + (words.every((w) => t.includes(w)) ? 1 : 0);
  };
  const groups: Hit["group"][] = ["Subjects", "Chapters", "Lectures & books", "Pages"];
  return groups.flatMap((g) =>
    SEARCH_INDEX.filter((e) => e.group === g && has(e.words.toLowerCase(), words))
      .map((e) => ({ e, s: score(e) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, LIMIT[g])
      .map(({ e }) => ({ key: e.key, title: e.title, sub: e.sub, href: e.href, group: e.group, icon: iconFor(e) }))
  );
}

export default function GlobalSearch({
  size = "md",
  autoFocus = false,
  onNavigate,
  placeholder = "Search subjects, chapters, lectures…",
  className = "",
  inputRef: outerRef,
}: {
  size?: "md" | "lg";
  autoFocus?: boolean;
  onNavigate?: () => void;
  placeholder?: string;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const innerRef = useRef<HTMLInputElement>(null);
  const ref = outerRef ?? innerRef;
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const hits = useMemo(() => (q.trim().length >= 2 ? search(q.trim()) : []), [q]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    onNavigate?.();
    router.push(href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(hits.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && hits[active]) {
      e.preventDefault();
      go(hits[active].href);
    } else if (e.key === "Escape") {
      setOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  const lg = size === "lg";
  const showList = open && q.trim().length >= 2;
  let lastGroup = "";

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2.5 rounded-xl border border-line bg-surface transition focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10 ${
          lg ? "h-14 px-4 shadow-soft" : "h-10 px-3"
        }`}
      >
        <Search className={`shrink-0 text-muted ${lg ? "h-5 w-5" : "h-4 w-4"}`} aria-hidden />
        <input
          ref={ref}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && hits[active] ? `${listId}-${active}` : undefined}
          aria-label="Search subjects, chapters, lectures and books"
          autoFocus={autoFocus}
          value={q}
          placeholder={placeholder}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          className={`min-w-0 flex-1 bg-transparent text-ink placeholder:text-muted/80 focus:outline-none [&::-webkit-search-cancel-button]:hidden ${lg ? "text-base" : "text-sm"}`}
        />
        {q ? (
          <button type="button" onClick={() => setQ("")} className="rounded-md p-1 text-muted hover:text-ink" aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        ) : (
          !lg && <kbd className="hidden rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted xl:block">Ctrl K</kbd>
        )}
      </div>

      {showList && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-[70] mt-2 max-h-[min(70vh,520px)] overflow-y-auto rounded-2xl border border-line bg-surface p-2 shadow-lift animate-fadeIn"
        >
          {hits.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">
              No results for “{q.trim()}”. Try a chapter name like <span className="font-semibold text-ink">thalamus</span> or <span className="font-semibold text-ink">enamel</span>.
            </p>
          ) : (
            hits.map((h, i) => {
              const header = h.group !== lastGroup ? h.group : null;
              lastGroup = h.group;
              return (
                <React.Fragment key={h.group + h.key}>
                  {header && <div className="px-2.5 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-muted">{header}</div>}
                  <Link
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    href={h.href}
                    onClick={() => {
                      setOpen(false);
                      setQ("");
                      onNavigate?.();
                    }}
                    onMouseEnter={() => setActive(i)}
                    className={`group flex items-center gap-3 rounded-xl p-2 transition-colors ${i === active ? "bg-soft" : ""}`}
                  >
                    <span
                      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-2 text-primary ${
                        h.group === "Lectures & books" ? "h-10 w-16" : "h-10 w-10"
                      }`}
                    >
                      {h.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{h.title}</span>
                      {h.sub && <span className="block truncate text-xs text-muted">{h.sub}</span>}
                    </span>
                    <ArrowRight className={`h-4 w-4 shrink-0 text-primary transition-opacity ${i === active ? "opacity-100" : "opacity-0"}`} />
                  </Link>
                </React.Fragment>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
