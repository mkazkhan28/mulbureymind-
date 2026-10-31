"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Bookmark } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useBookmarks } from "@/lib/bookmarks";
import { useProgress } from "@/lib/progress";
import { BookmarkButton, EmptyState, Skeleton } from "@/components/ui";
import { Stagger, StaggerItem, ProgressBar } from "@/components/motion";

export default function BookmarksPage() {
  const { ready, items } = useBookmarks();
  const progress = useProgress();

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <PageHeader
        eyebrow="Bookmarks"
        title="Saved for later"
        intro="Lectures and textbooks you've saved. Tap the bookmark icon on any lecture card or inside the reader to add it here."
      />

      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading bookmarks">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing saved yet"
          text="Save the lectures you want to revise the night before the exam, and they'll wait for you here."
          href="/subjects/anatomy"
          action="Browse Anatomy lectures"
        />
      ) : (
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ id, item }) => {
            const seen = progress?.opened[id];
            const pct = seen && item.pages ? Math.min(100, Math.round((seen.page / item.pages) * 100)) : 0;
            return (
              <StaggerItem key={id} as="article" className="card-glow group relative flex overflow-hidden rounded-2xl border border-line bg-surface transition-transform duration-300 hover:-translate-y-0.5">
                <Link href={item.href} className="absolute inset-0 z-10" aria-label={`Open ${item.title}`} />
                <div className="relative w-28 shrink-0 overflow-hidden bg-surface-2">
                  {item.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-primary">
                      <BookOpen className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-3.5">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink group-hover:text-primary">{item.title}</h3>
                      <p className="mt-0.5 truncate text-xs text-muted">{item.kind === "book" ? `Textbook · ${item.topic ?? ""}` : [item.areaTitle, item.topic].filter(Boolean).join(" · ")}</p>
                    </div>
                    <BookmarkButton id={id} title={item.title} />
                  </div>
                  <div className="mt-auto pt-3">
                    {seen ? (
                      <>
                        <div className="mb-1 text-[11px] text-muted">Page {seen.page}{item.pages ? ` of ${item.pages}` : ""}</div>
                        <ProgressBar pct={pct} />
                      </>
                    ) : (
                      <span className="text-[11px] font-semibold text-primary">Not started</span>
                    )}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
