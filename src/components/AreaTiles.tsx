"use client";

import Link from "next/link";
import { SUBJECT_STRUCTURES } from "@/lib/subject-structure";
import { lecturesInArea } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";
import { AreaArt } from "@/components/Illustrations";
import { ProgressBar, Stagger, StaggerItem } from "@/components/motion";
import { AREA_STYLE, DEFAULT_AREA_STYLE } from "@/components/SubjectHub";

/** Quick-launch tiles for a subject's areas (used on the home page). */
export default function AreaTiles({ subjectSlug = "anatomy" }: { subjectSlug?: string }) {
  const st = SUBJECT_STRUCTURES[subjectSlug];
  const progress = useProgress();
  if (!st) return null;
  return (
    <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" gap={0.05}>
      {st.areas.map((a) => {
        const style = AREA_STYLE[a.slug] ?? DEFAULT_AREA_STYLE;
        const ids = lecturesInArea(subjectSlug, a.slug);
        const opened = progress ? ids.filter((id) => progress.opened[id]).length : 0;
        const pct = ids.length ? Math.round((opened / ids.length) * 100) : 0;
        return (
          <StaggerItem key={a.slug} className="h-full">
          <Link
            href={`/subjects/${subjectSlug}/${a.slug}`}
            className={`card-glow group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-line bg-gradient-to-br ${style.grad} bg-surface p-4 text-ink transition-transform duration-300 hover:-translate-y-1`}
          >
            <AreaArt slug={a.slug} className="relative h-16 w-16 drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105" />
            <div className="relative">
              <div className="card-title">{a.title}</div>
              <div className="mt-0.5 text-xs text-muted">{ids.length} lectures{opened ? ` · ${opened} opened` : ""}</div>
              <ProgressBar pct={pct} className="mt-2.5 !h-1" />
            </div>
          </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
