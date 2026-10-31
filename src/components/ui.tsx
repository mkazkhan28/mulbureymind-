"use client";

/** Small shared UI pieces used across the student pages. */
import React from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { m } from "@/components/motion";
import { toggleBookmark, useBookmarks } from "@/lib/bookmarks";

/** Save / unsave an item for later. Sits above a card's full-card link (z-20). */
export function BookmarkButton({ id, title, className = "", label = false }: { id: string; title: string; className?: string; label?: boolean }) {
  const { has, ready } = useBookmarks();
  const saved = ready && has(id);
  return (
    <m.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(id);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from bookmarks` : `Bookmark ${title}`}
      title={saved ? "Saved — click to remove" : "Save for later"}
      className={`relative z-20 inline-flex items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition-colors ${
        saved ? "border-primary/40 bg-soft text-primary" : "border-line bg-surface/90 text-muted hover:border-primary/40 hover:text-primary"
      } ${label ? "h-9 px-3" : "h-8 w-8"} ${className}`}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {label && <span>{saved ? "Saved" : "Save"}</span>}
    </m.button>
  );
}

/** Loading placeholder with a soft shimmer (transform-only). */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton rounded-xl bg-surface-2 ${className}`} />;
}

/** Friendly empty state with one clear next step. */
export function EmptyState({
  icon: Icon,
  title,
  text,
  href,
  action,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="card-title mt-4">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>
      {href && action && (
        <Link href={href} className="btn-secondary mt-5">
          {action}
        </Link>
      )}
    </div>
  );
}
