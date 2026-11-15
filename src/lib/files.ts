/**
 * Study files (lecture PDFs, question-bank files and MCQ data).
 *
 * With NEXT_PUBLIC_PROTECTED_FILES=1 they live in a private Supabase Storage bucket and are
 * opened through /api/files/…, which checks that the visitor is logged in and then hands out a
 * short-lived signed link. Without it they are served from /public as before (local development).
 * Slide thumbnails (/files/thumbs/…) stay public: they are small previews of the first slide.
 */
export const PROTECTED_FILES = process.env.NEXT_PUBLIC_PROTECTED_FILES === "1";

export function isProtectedPath(p: string) {
  return (p.startsWith("/files/") && !p.startsWith("/files/thumbs/")) || p.startsWith("/data/");
}

export function fileHref<T extends string | undefined>(p: T): T {
  if (!p || !PROTECTED_FILES || !isProtectedPath(p)) return p;
  return `/api/files${p}` as T;
}
