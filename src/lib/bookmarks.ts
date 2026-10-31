"use client";

/**
 * Bookmarks ("saved for later") — stored on this device, like reading progress.
 * Anything with an id from the catalog (lectures, textbooks) can be saved.
 * When real accounts are connected, this is the one place to swap for a Supabase table.
 */
import { useEffect, useState } from "react";
import { catalogById } from "@/lib/catalog";

const KEY = "hmh-bookmarks";
const EVENT = "hmh-bookmarks";

export interface Bookmark {
  id: string;
  at: number;
}

function read(): Bookmark[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Bookmark[]) : [];
    return Array.isArray(list) ? list.filter((b) => b && typeof b.id === "string") : [];
  } catch {
    return [];
  }
}

function write(list: Bookmark[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — bookmarks last for this visit only */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function isBookmarked(id: string) {
  return read().some((b) => b.id === id);
}

export function toggleBookmark(id: string) {
  const list = read();
  const next = list.some((b) => b.id === id) ? list.filter((b) => b.id !== id) : [{ id, at: Date.now() }, ...list];
  write(next);
  return next.some((b) => b.id === id);
}

/** Saved items, newest first, resolved against the catalog (unknown ids are skipped). */
export function useBookmarks() {
  const [list, setList] = useState<Bookmark[] | null>(null);
  useEffect(() => {
    const sync = () => setList(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const items = (list ?? [])
    .map((b) => ({ ...b, item: catalogById.get(b.id) }))
    .filter((b): b is Bookmark & { item: NonNullable<ReturnType<typeof catalogById.get>> } => !!b.item);
  return { ready: list !== null, items, has: (id: string) => !!list?.some((b) => b.id === id) };
}
