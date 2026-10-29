"use client";

import Link from "next/link";
import { SUBJECT_STRUCTURES } from "@/lib/subject-structure";
import { lecturesInArea } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";
import { AreaArt } from "@/components/Illustrations";
import { AREA_STYLE, DEFAULT_AREA_STYLE } from "@/components/SubjectHub";

/** Colourful quick-launch tiles for a subject's areas (used on the home page). */
export default function AreaTiles({ subjectSlug = "anatomy" }: { subjectSlug?: string }) {
  const st = SUBJECT_STRUCTURES[subjectSlug];
  const progress = useProgress();
  if (!st) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {st.areas.map((a, i) => {
        const style = AREA_STYLE[a.slug] ?? DEFAULT_AREA_STYLE;
        const ids = lecturesInArea(subjectSlug, a.slug);
        const opened = progress ? ids.filter((id) => progress.opened[id]).length : 0;
        const pct = ids.length ? Math.round((opened / ids.length) * 100) : 0;
        return (
          <Link
            key={a.slug}
            href={`/subjects/${subjectSlug}/${a.slug}`}
            className={`group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${style.grad} p-4 text-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift animate-pop-in`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(white_1.2px,transparent_1.2px)] [background-size:14px_14px]" />
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/25 blur-xl" />
            <AreaArt slug={a.slug} className="relative ml-auto h-20 w-20 drop-shadow-[0_8px_12px_rgba(0,0,0,0.28)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
            <div className="relative">
              <div className="font-display text-lg font-bold leading-tight">{a.title}</div>
              <div className="mt-0.5 text-xs text-white/85">{ids.length} lectures</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
