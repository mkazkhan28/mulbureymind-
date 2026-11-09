"use client";

/**
 * Original HMHDental illustrations (drawn for this site, no third-party artwork).
 * Soft, shaded "medical illustration" style using the brand palette:
 * blue · pink · yellow · warm grey · brown.
 *
 * Usage: <SubjectArt id="oral-bio" className="h-12 w-12" />  ·  <AreaArt slug="neuroanatomy" />
 */

import React, { useId } from "react";

type ArtProps = { className?: string; title?: string };

function Svg({ children, className, title, viewBox = "0 0 120 120" }: ArtProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/* Unique gradient ids per instance so many copies can share a page */
function useIds<T extends string>(...names: T[]): Record<T, string> {
  const base = useId().replace(/:/g, "");
  return Object.fromEntries(names.map((n) => [n, `${base}-${n}`])) as Record<T, string>;
}
const url = (id: string) => `url(#${id})`;

/* ------------------------------------------------------------------ */
/* Tooth (molar) — Oral Biology, also used in the logo                 */
/* ------------------------------------------------------------------ */
export function ToothArt(p: ArtProps) {
  const g = useIds("enamel", "root", "shade", "shadow");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.enamel} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#eef3fb" />
          <stop offset="1" stopColor="#d6e1f1" />
        </linearGradient>
        <linearGradient id={g.root} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe2d2" />
          <stop offset="1" stopColor="#c9a988" />
        </linearGradient>
        <linearGradient id={g.shade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.55" stopColor="#3b6fb6" stopOpacity="0" />
          <stop offset="1" stopColor="#3b6fb6" stopOpacity="0.28" />
        </linearGradient>
        <radialGradient id={g.shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2522" stopOpacity="0.25" />
          <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="110" rx="30" ry="5" fill={url(g.shadow)} />
      {/* roots */}
      <path d="M38 66 C40 80 42 96 47 104 C51 109 56 105 57 97 C58 89 59 81 60 78 C61 81 62 89 63 97 C64 105 69 109 73 104 C78 96 80 80 82 66 Z" fill={url(g.root)} />
      {/* crown */}
      <path
        d="M27 42 C26 26 39 19 48 25 C53 20 67 20 72 25 C81 19 94 26 93 42 C92 54 88 60 84 68 C76 72 44 72 36 68 C32 60 28 54 27 42 Z"
        fill={url(g.enamel)}
        stroke="#b6ceef"
        strokeWidth="1"
      />
      <path d="M27 42 C26 26 39 19 48 25 C53 20 67 20 72 25 C81 19 94 26 93 42 C92 54 88 60 84 68 C76 72 44 72 36 68 C32 60 28 54 27 42 Z" fill={url(g.shade)} />
      {/* cusp grooves */}
      <path d="M48 25 C52 31 53 37 52 42 M72 25 C68 31 67 37 68 42 M52 42 C57 45 63 45 68 42" fill="none" stroke="#c8d6ec" strokeWidth="2" strokeLinecap="round" />
      {/* cemento-enamel junction */}
      <path d="M36 68 C46 73 74 73 84 68" fill="none" stroke="#d9c0a5" strokeWidth="2" />
      {/* highlights */}
      <path d="M34 36 C34 29 40 26 45 28" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
      <ellipse cx="40" cy="48" rx="3" ry="7" fill="#fff" opacity="0.7" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Skull — Anatomy subject, Head & Neck area                           */
/* ------------------------------------------------------------------ */
export function SkullArt(p: ArtProps) {
  const g = useIds("bone", "shade", "socket", "shadow");
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.bone} cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fffdf9" />
          <stop offset="0.6" stopColor="#efe4d4" />
          <stop offset="1" stopColor="#cfb79a" />
        </radialGradient>
        <linearGradient id={g.shade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.6" stopColor="#6c4836" stopOpacity="0" />
          <stop offset="1" stopColor="#6c4836" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id={g.socket} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#281a15" />
          <stop offset="1" stopColor="#583b2f" />
        </radialGradient>
        <radialGradient id={g.shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2522" stopOpacity="0.25" />
          <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="28" ry="4.5" fill={url(g.shadow)} />
      {/* cranium + face */}
      <path
        d="M60 12 C34 12 20 32 21 54 C22 66 28 74 33 78 C34 84 36 88 41 89 L79 89 C84 88 86 84 87 78 C92 74 98 66 99 54 C100 32 86 12 60 12 Z"
        fill={url(g.bone)}
        stroke="#cfb79a"
        strokeWidth="1"
      />
      <path d="M60 12 C34 12 20 32 21 54 C22 66 28 74 33 78 C34 84 36 88 41 89 L79 89 C84 88 86 84 87 78 C92 74 98 66 99 54 C100 32 86 12 60 12 Z" fill={url(g.shade)} />
      {/* mandible */}
      <path d="M38 88 C38 99 46 107 60 107 C74 107 82 99 82 88 L76 90 C74 98 68 101 60 101 C52 101 46 98 44 90 Z" fill={url(g.bone)} stroke="#cfb79a" strokeWidth="1" />
      {/* orbits */}
      <path d="M33 54 C33 45 40 41 47 42 C54 43 56 49 55 55 C54 61 48 64 42 63 C36 62 33 59 33 54 Z" fill={url(g.socket)} />
      <path d="M87 54 C87 45 80 41 73 42 C66 43 64 49 65 55 C66 61 72 64 78 63 C84 62 87 59 87 54 Z" fill={url(g.socket)} />
      {/* nasal aperture */}
      <path d="M60 62 C56 68 54 74 56 78 C58 79 62 79 64 78 C66 74 64 68 60 62 Z" fill={url(g.socket)} />
      {/* teeth */}
      <g fill="#fffdf8" stroke="#cfb79a" strokeWidth="0.8">
        {[44, 50, 56, 62, 68, 74].map((x) => (
          <rect key={x} x={x - 0.5} y="84" width="6" height="8" rx="2" />
        ))}
      </g>
      {/* cheekbone + temporal lines */}
      <path d="M28 64 C31 70 36 72 41 71 M92 64 C89 70 84 72 79 71" fill="none" stroke="#bfa181" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M38 22 C46 18 58 17 66 19" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Heart — Physiology                                                  */
/* ------------------------------------------------------------------ */
export function HeartArt(p: ArtProps) {
  const g = useIds("muscle", "artery", "vein", "shadow", "gloss");
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.muscle} cx="0.35" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#f7a3bd" />
          <stop offset="0.55" stopColor="#e05d84" />
          <stop offset="1" stopColor="#9c2850" />
        </radialGradient>
        <linearGradient id={g.artery} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f195b7" />
          <stop offset="1" stopColor="#bd3461" />
        </linearGradient>
        <linearGradient id={g.vein} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#88aee3" />
          <stop offset="1" stopColor="#2e5a99" />
        </linearGradient>
        <radialGradient id={g.shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2522" stopOpacity="0.25" />
          <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={g.gloss} cx="0.3" cy="0.25" r="0.35">
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="62" cy="112" rx="26" ry="4.5" fill={url(g.shadow)} />
      {/* great vessels behind */}
      <path d="M44 50 C42 38 41 28 42 16" stroke={url(g.vein)} strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M60 52 C58 34 62 22 74 20 C86 18 90 28 88 40" stroke={url(g.artery)} strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M66 22 L64 10 M75 20 L77 8 M83 23 L88 13" stroke={url(g.artery)} strokeWidth="5" strokeLinecap="round" />
      <path d="M52 56 C50 44 54 36 64 34" stroke={url(g.vein)} strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* heart body */}
      <path
        d="M46 46 C33 45 25 57 28 72 C32 88 48 100 64 108 C76 100 92 88 95 70 C98 54 88 43 75 46 C69 47 65 51 62 56 C58 51 53 47 46 46 Z"
        fill={url(g.muscle)}
      />
      <path d="M46 46 C33 45 25 57 28 72 C32 88 48 100 64 108 C76 100 92 88 95 70 C98 54 88 43 75 46 C69 47 65 51 62 56 C58 51 53 47 46 46 Z" fill={url(g.gloss)} />
      {/* coronary vessels */}
      <path d="M62 58 C60 72 62 88 66 102" stroke="#fbe0ea" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M62 66 C70 68 78 74 84 82 M61 78 C54 80 46 84 40 82" stroke="#fbe0ea" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M60 60 C56 70 50 76 42 78" stroke="#5b8bd3" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* DNA — Biochemistry                                                  */
/* ------------------------------------------------------------------ */
export function DnaArt(p: ArtProps) {
  const g = useIds("a", "b", "shadow");
  const rungs = [22, 32, 42, 52, 62, 72, 82, 92];
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.a} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b8bd3" />
          <stop offset="1" stopColor="#26497c" />
        </linearGradient>
        <linearGradient id={g.b} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f195b7" />
          <stop offset="1" stopColor="#bd3461" />
        </linearGradient>
        <radialGradient id={g.shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2522" stopOpacity="0.22" />
          <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="24" ry="4" fill={url(g.shadow)} />
      {rungs.map((y, i) => {
        const w = Math.abs(Math.cos((y - 12) / 15.9)) * 20;
        return <line key={y} x1={60 - w} y1={y} x2={60 + w} y2={y} stroke={i % 2 ? "#f2b63d" : "#a69c94"} strokeWidth="4" strokeLinecap="round" />;
      })}
      <path d="M40 12 C40 28 80 34 80 50 C80 66 40 70 40 86 C40 98 56 104 60 108" stroke={url(g.a)} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M80 12 C80 28 40 34 40 50 C40 66 80 70 80 86 C80 98 64 104 60 108" stroke={url(g.b)} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M43 16 C45 22 52 26 58 29" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Capsule & tablet — Pharmacology                                     */
/* ------------------------------------------------------------------ */
export function CapsuleArt(p: ArtProps) {
  const g = useIds("a", "b", "tab", "shadow");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.a} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#88aee3" />
          <stop offset="1" stopColor="#2e5a99" />
        </linearGradient>
        <linearGradient id={g.b} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#e09a1c" />
        </linearGradient>
        <radialGradient id={g.tab} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9cfc6" />
        </radialGradient>
        <radialGradient id={g.shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2522" stopOpacity="0.25" />
          <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="58" cy="108" rx="34" ry="5" fill={url(g.shadow)} />
      <g transform="rotate(-38 56 58)">
        <rect x="18" y="44" width="40" height="28" rx="14" fill={url(g.a)} />
        <rect x="56" y="44" width="40" height="28" rx="14" fill={url(g.b)} />
        <rect x="54" y="44" width="6" height="28" fill="#2a2522" opacity="0.12" />
        <rect x="24" y="48" width="66" height="6" rx="3" fill="#fff" opacity="0.55" />
      </g>
      <ellipse cx="92" cy="94" rx="14" ry="9" fill="#bdb2a8" />
      <ellipse cx="92" cy="91" rx="14" ry="9" fill={url(g.tab)} />
      <line x1="84" y1="91" x2="100" y2="91" stroke="#cfc5bb" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Microscope — Pathology                                              */
/* ------------------------------------------------------------------ */
export function MicroscopeArt(p: ArtProps) {
  const g = useIds("metal", "dark", "arm", "glass", "shadow");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.metal} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d4dbe6" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#9aa9bf" />
        </linearGradient>
        <linearGradient id={g.dark} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b6fb6" />
          <stop offset="1" stopColor="#1e3454" />
        </linearGradient>
        <linearGradient id={g.arm} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b8bd3" />
          <stop offset="1" stopColor="#213d66" />
        </linearGradient>
        <radialGradient id={g.glass} cx="0.4" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fbe0ea" />
          <stop offset="1" stopColor="#d94a78" />
        </radialGradient>
        <radialGradient id={g.shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2522" stopOpacity="0.25" />
          <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="62" cy="111" rx="36" ry="5" fill={url(g.shadow)} />
      {/* base */}
      <path d="M30 98 C30 94 34 92 38 92 L88 92 C92 92 96 94 96 98 L96 102 C96 105 94 106 91 106 L35 106 C32 106 30 105 30 102 Z" fill={url(g.dark)} />
      {/* arm */}
      <path d="M74 92 C84 80 88 64 84 50 C81 40 74 34 66 32 L62 40 C68 43 73 48 74 56 C76 68 70 80 62 88 Z" fill={url(g.arm)} />
      {/* stage */}
      <rect x="36" y="70" width="40" height="6" rx="2" fill={url(g.metal)} />
      <rect x="44" y="66" width="22" height="4" rx="1" fill="#f7c1d5" opacity="0.9" />
      {/* tube */}
      <g transform="rotate(-24 56 40)">
        <rect x="49" y="14" width="14" height="46" rx="3" fill={url(g.metal)} />
        <rect x="47" y="8" width="18" height="8" rx="2" fill={url(g.dark)} />
        <rect x="51" y="58" width="10" height="8" rx="2" fill={url(g.dark)} />
      </g>
      {/* focus knob */}
      <circle cx="80" cy="60" r="7" fill={url(g.metal)} stroke="#9aa9bf" />
      <circle cx="80" cy="60" r="2.5" fill="#3b6fb6" />
      {/* light */}
      <circle cx="56" cy="86" r="5" fill={url(g.glass)} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Embryo — Embryology                                                 */
/* ------------------------------------------------------------------ */
export function EmbryoArt(p: ArtProps) {
  const g = useIds("sac", "body", "shadow");
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.sac} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.7" stopColor="#fbe0ea" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f195b7" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id={g.body} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fde4d3" />
          <stop offset="0.6" stopColor="#f4b6a0" />
          <stop offset="1" stopColor="#d98a74" />
        </radialGradient>
        <radialGradient id={g.shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2522" stopOpacity="0.22" />
          <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="30" ry="4.5" fill={url(g.shadow)} />
      <circle cx="60" cy="60" r="46" fill={url(g.sac)} stroke="#f195b7" strokeWidth="2" />
      {/* umbilical cord */}
      <path d="M58 76 C66 84 80 84 86 92 C90 97 94 100 98 101" stroke="#e86a92" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* curled body */}
      <path
        d="M70 30 C84 30 92 42 88 54 C86 62 78 64 74 70 C70 78 72 86 64 90 C52 96 38 88 38 74 C38 64 46 58 52 52 C56 48 56 38 70 30 Z"
        fill={url(g.body)}
      />
      {/* head */}
      <circle cx="72" cy="44" r="16" fill={url(g.body)} />
      <circle cx="78" cy="42" r="2.2" fill="#6c4836" />
      <path d="M84 50 C82 53 79 54 76 53" stroke="#c97a65" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* limb buds */}
      <path d="M62 62 C66 66 66 72 62 74" stroke="#e8a28c" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M48 80 C52 82 56 82 58 80" stroke="#e8a28c" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="44" cy="40" rx="8" ry="14" fill="#fff" opacity="0.45" transform="rotate(30 44 40)" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Tissue cells (H&E style) — Histology                                */
/* ------------------------------------------------------------------ */
export function CellsArt(p: ArtProps) {
  const g = useIds("field", "cyto", "nuc", "rim");
  const cells: [number, number, number][] = [
    [40, 38, 15], [70, 34, 14], [95, 46, 12], [30, 66, 13], [56, 62, 16], [84, 70, 14], [44, 92, 13], [72, 96, 14], [98, 92, 10],
  ];
  return (
    <Svg {...p}>
      <defs>
        <clipPath id={g.rim}>
          <circle cx="60" cy="62" r="50" />
        </clipPath>
        <radialGradient id={g.field} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#fdf0f5" />
          <stop offset="1" stopColor="#f7c1d5" />
        </radialGradient>
        <radialGradient id={g.cyto} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#f7c1d5" />
          <stop offset="1" stopColor="#e86a92" />
        </radialGradient>
        <radialGradient id={g.nuc} cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#5b8bd3" />
          <stop offset="1" stopColor="#1e3a6e" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="62" r="52" fill="#2a2522" opacity="0.85" />
      <g clipPath={`url(#${g.rim})`}>
        <rect x="0" y="0" width="120" height="120" fill={url(g.field)} />
        {cells.map(([x, y, r], i) => (
          <g key={i}>
            <path
              d={`M${x - r} ${y} C${x - r} ${y - r * 0.9} ${x - r * 0.3} ${y - r} ${x + r * 0.2} ${y - r} C${x + r} ${y - r * 0.8} ${x + r} ${y + r * 0.2} ${x + r * 0.7} ${y + r * 0.7} C${x + r * 0.3} ${y + r} ${x - r * 0.6} ${y + r} ${x - r} ${y} Z`}
              fill={url(g.cyto)}
              stroke="#c2385f"
              strokeWidth="0.8"
              opacity="0.92"
            />
            <ellipse cx={x + (i % 3) - 1} cy={y + (i % 2)} rx={r * 0.38} ry={r * 0.3} fill={url(g.nuc)} />
            <circle cx={x + (i % 3) - 2} cy={y - 1} r="1.1" fill="#cfe0f5" opacity="0.8" />
          </g>
        ))}
      </g>
      <circle cx="60" cy="62" r="50" fill="none" stroke="#a69c94" strokeWidth="3" />
      <path d="M26 40 C32 28 44 20 56 18" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Brain — Neuroanatomy                                                */
/* ------------------------------------------------------------------ */
export function BrainArt(p: ArtProps) {
  const g = useIds("cortex", "cere", "stem", "shadow");
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.cortex} cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#fbe0ea" />
          <stop offset="0.55" stopColor="#f195b7" />
          <stop offset="1" stopColor="#c2557c" />
        </radialGradient>
        <radialGradient id={g.cere} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#c9ece9" />
          <stop offset="1" stopColor="#2f9e98" />
        </radialGradient>
        <linearGradient id={g.stem} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#efe2d2" />
          <stop offset="1" stopColor="#c9a988" />
        </linearGradient>
        <radialGradient id={g.shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2522" stopOpacity="0.22" />
          <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="32" ry="4.5" fill={url(g.shadow)} />
      <path d="M66 82 C66 92 64 100 60 106 L70 106 C74 100 76 92 76 82 Z" fill={url(g.stem)} />
      <path d="M70 74 C80 72 92 74 96 82 C98 90 90 96 80 94 C72 92 68 86 70 74 Z" fill={url(g.cere)} />
      <path d="M74 82 C80 80 88 81 93 84 M73 87 C79 86 86 88 90 90" stroke="#1f7a75" strokeWidth="1.2" fill="none" opacity="0.7" />
      <path
        d="M20 60 C17 42 30 26 48 25 C56 16 76 16 86 25 C101 27 109 42 104 56 C109 66 102 78 90 78 C84 84 70 84 64 80 C56 86 40 86 33 78 C24 76 19 70 20 60 Z"
        fill={url(g.cortex)}
      />
      {/* gyri & sulci */}
      <g stroke="#b04670" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65">
        <path d="M60 22 C58 34 64 40 60 52 C57 60 60 68 64 78" />
        <path d="M36 34 C42 38 40 46 46 50 C52 54 50 60 54 64" />
        <path d="M80 30 C76 38 82 44 78 52 C75 58 80 64 86 66" />
        <path d="M26 56 C32 54 36 58 40 62 C44 66 40 72 44 76" />
        <path d="M92 40 C96 46 94 52 98 58" />
        <path d="M46 28 C50 32 48 36 52 40" />
        <path d="M70 58 C76 60 80 56 88 58" />
      </g>
      <path d="M32 40 C36 32 44 28 52 28" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Long bone — General Anatomy                                         */
/* ------------------------------------------------------------------ */
export function BoneArt(p: ArtProps) {
  const g = useIds("bone", "shade", "shadow");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.bone} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf9" />
          <stop offset="0.6" stopColor="#efe4d4" />
          <stop offset="1" stopColor="#cfb79a" />
        </linearGradient>
        <linearGradient id={g.shade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.5" stopColor="#6c4836" stopOpacity="0" />
          <stop offset="1" stopColor="#6c4836" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={g.shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2522" stopOpacity="0.22" />
          <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="62" cy="110" rx="34" ry="5" fill={url(g.shadow)} />
      <g transform="rotate(-40 60 60)">
        <path
          d="M52 14 C44 6 30 12 34 24 C26 26 26 40 36 40 C42 41 46 38 50 34 L50 86 C46 82 42 79 36 80 C26 80 26 94 34 96 C30 108 44 114 52 106 C56 112 66 112 70 106 C78 114 92 108 88 96 C96 94 96 80 86 80 C80 79 76 82 72 86 L72 34 C76 38 80 41 86 40 C96 40 96 26 88 24 C92 12 78 6 70 14 C66 8 56 8 52 14 Z"
          fill={url(g.bone)}
          stroke="#cfb79a"
          strokeWidth="1"
        />
        <path d="M52 14 C44 6 30 12 34 24 C26 26 26 40 36 40 C42 41 46 38 50 34 L50 86 C46 82 42 79 36 80 C26 80 26 94 34 96 C30 108 44 114 52 106 C56 112 66 112 70 106 C78 114 92 108 88 96 C96 94 96 80 86 80 C80 79 76 82 72 86 L72 34 C76 38 80 41 86 40 C96 40 96 26 88 24 C92 12 78 6 70 14 C66 8 56 8 52 14 Z" fill={url(g.shade)} />
        <path d="M56 38 L56 82" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
        <path d="M38 18 C40 14 45 13 48 15" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
      </g>
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Lungs with trachea — Thorax & Abdomen                               */
/* ------------------------------------------------------------------ */
export function LungsArt(p: ArtProps) {
  const g = useIds("lung", "trachea", "shadow", "gloss");
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.lung} cx="0.4" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#fbe0ea" />
          <stop offset="0.55" stopColor="#f195b7" />
          <stop offset="1" stopColor="#c2557c" />
        </radialGradient>
        <linearGradient id={g.trachea} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b6ceef" />
          <stop offset="0.5" stopColor="#eef4fc" />
          <stop offset="1" stopColor="#88aee3" />
        </linearGradient>
        <radialGradient id={g.shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a2522" stopOpacity="0.22" />
          <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={g.gloss} cx="0.3" cy="0.2" r="0.4">
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="112" rx="38" ry="4.5" fill={url(g.shadow)} />
      {/* left (viewer's right) lung */}
      <path d="M66 36 C76 26 94 30 100 50 C106 70 104 94 96 102 C88 108 74 104 68 98 C64 90 66 76 66 62 Z" fill={url(g.lung)} />
      <path d="M66 36 C76 26 94 30 100 50 C106 70 104 94 96 102 C88 108 74 104 68 98 C64 90 66 76 66 62 Z" fill={url(g.gloss)} />
      {/* right lung */}
      <path d="M54 36 C44 26 26 30 20 50 C14 70 16 94 24 102 C32 108 46 104 52 98 C56 90 54 76 54 62 Z" fill={url(g.lung)} />
      <path d="M54 36 C44 26 26 30 20 50 C14 70 16 94 24 102 C32 108 46 104 52 98 C56 90 54 76 54 62 Z" fill={url(g.gloss)} />
      {/* fissures */}
      <path d="M22 66 C32 64 44 70 54 66 M24 84 C34 80 44 84 52 82" stroke="#b04670" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M98 64 C88 66 78 72 68 70" stroke="#b04670" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* trachea & bronchi */}
      <rect x="54" y="8" width="12" height="40" rx="5" fill={url(g.trachea)} />
      <g stroke="#88aee3" strokeWidth="1.4" opacity="0.8">
        {[14, 20, 26, 32, 38].map((y) => (
          <line key={y} x1="55" y1={y} x2="65" y2={y} />
        ))}
      </g>
      <path d="M58 46 C54 54 46 58 40 64 M62 46 C66 54 74 58 80 64" stroke={url(g.trachea)} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M40 64 C36 70 34 76 34 82 M80 64 C84 70 86 76 86 82" stroke="#b6ceef" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Svg>
  );
}


/* ------------------------------------------------------------------ */
/* Biochemistry chapter art                                            */
/* ------------------------------------------------------------------ */
const Shadow = ({ id, cx = 60, cy = 110, rx = 28 }: { id: string; cx?: number; cy?: number; rx?: number }) => (
  <>
    <defs>
      <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#2a2522" stopOpacity="0.24" />
        <stop offset="1" stopColor="#2a2522" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={cx} cy={cy} rx={rx} ry="4.5" fill={url(id)} />
  </>
);

/** Water drop — cell, water, pH & buffers */
export function WaterArt(p: ArtProps) {
  const g = useIds("drop", "sh");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.drop} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#a9c8f0" />
          <stop offset="1" stopColor="#2e5a99" />
        </linearGradient>
      </defs>
      <Shadow id={g.sh} rx={24} />
      <path d="M60 12 C60 12 28 52 28 74 C28 92 42 104 60 104 C78 104 92 92 92 74 C92 52 60 12 60 12 Z" fill={url(g.drop)} />
      <path d="M44 70 C44 60 50 50 54 44" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.6" />
      <circle cx="94" cy="30" r="6" fill="#a9c8f0" opacity="0.9" />
      <circle cx="102" cy="48" r="3.5" fill="#a9c8f0" opacity="0.8" />
      <circle cx="20" cy="40" r="4" fill="#a9c8f0" opacity="0.8" />
    </Svg>
  );
}

/** Glucose ring — carbohydrates */
export function SugarArt(p: ArtProps) {
  const g = useIds("ring", "sh");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.ring} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#e09a1c" />
        </linearGradient>
      </defs>
      <Shadow id={g.sh} rx={34} />
      <path d="M30 60 L46 36 L78 36 L94 60 L78 84 L46 84 Z" fill={url(g.ring)} stroke="#b7790f" strokeWidth="3" strokeLinejoin="round" />
      <path d="M46 36 L78 36" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <circle cx="78" cy="36" r="8" fill="#e8577d" stroke="#bd3461" strokeWidth="2" />
      <text x="78" y="40" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="sans-serif">O</text>
      {[[30, 60, 14, 52], [46, 84, 38, 100], [94, 60, 108, 68], [46, 36, 36, 22]].map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a69c94" strokeWidth="3" strokeLinecap="round" />
          <circle cx={x2} cy={y2} r="5" fill="#5b8bd3" />
        </g>
      ))}
    </Svg>
  );
}

/** Phospholipid pair — lipids */
export function LipidArt(p: ArtProps) {
  const g = useIds("head", "sh");
  const Mol = ({ x }: { x: number }) => (
    <g>
      <path d={`M${x - 5} 44 C${x - 9} 56 ${x - 1} 64 ${x - 5} 76 C${x - 9} 88 ${x - 1} 94 ${x - 5} 104`} stroke="#e09a1c" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d={`M${x + 5} 44 C${x + 1} 56 ${x + 9} 64 ${x + 5} 76 C${x + 1} 88 ${x + 9} 94 ${x + 5} 104`} stroke="#f2b63d" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <circle cx={x} cy="30" r="15" fill={url(g.head)} />
      <circle cx={x - 5} cy="25" r="4" fill="#fff" opacity="0.6" />
    </g>
  );
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.head} cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f7c1d5" />
          <stop offset="1" stopColor="#bd3461" />
        </radialGradient>
      </defs>
      <Shadow id={g.sh} cy={112} rx={34} />
      <Mol x={40} />
      <Mol x={80} />
    </Svg>
  );
}

/** Bead chain folding into a helix — proteins & amino acids */
export function ProteinArt(p: ArtProps) {
  const g = useIds("a", "b", "sh");
  const pts: [number, number][] = [[18, 92], [30, 84], [40, 72], [36, 58], [46, 46], [60, 44], [70, 54], [66, 68], [76, 78], [90, 74], [98, 60], [94, 46], [100, 32], [88, 22]];
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.a} cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#c6d9f5" />
          <stop offset="1" stopColor="#2e5a99" />
        </radialGradient>
        <radialGradient id={g.b} cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f7c1d5" />
          <stop offset="1" stopColor="#bd3461" />
        </radialGradient>
      </defs>
      <Shadow id={g.sh} rx={38} />
      <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke="#a69c94" strokeWidth="3" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 8 : 7} fill={i % 3 === 0 ? url(g.b) : url(g.a)} />
      ))}
    </Svg>
  );
}

/** Red blood cells — haemoglobin, bilirubin & liver */
export function BloodArt(p: ArtProps) {
  const g = useIds("rbc", "in", "sh");
  const Cell = ({ x, y, r, rot }: { x: number; y: number; r: number; rot: number }) => (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.72} fill={url(g.rbc)} />
      <ellipse cx={x} cy={y + 1} rx={r * 0.5} ry={r * 0.32} fill={url(g.in)} />
      <path d={`M${x - r * 0.7} ${y - r * 0.35} C${x - r * 0.4} ${y - r * 0.62} ${x + r * 0.2} ${y - r * 0.66} ${x + r * 0.5} ${y - r * 0.5}`} stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55" />
    </g>
  );
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.rbc} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f58a8a" />
          <stop offset="1" stopColor="#b3203a" />
        </radialGradient>
        <radialGradient id={g.in} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#9c1830" />
          <stop offset="1" stopColor="#c8364f" />
        </radialGradient>
      </defs>
      <Shadow id={g.sh} rx={38} />
      <Cell x={44} y={74} r={30} rot={-12} />
      <Cell x={82} y={42} r={24} rot={18} />
    </Svg>
  );
}

/** Lock-and-key enzyme — enzymes */
export function EnzymeArt(p: ArtProps) {
  const g = useIds("e", "s", "m", "sh");
  const notch = "52,30 72,30 62,50";
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.e} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#a9c8f0" />
          <stop offset="1" stopColor="#26497c" />
        </radialGradient>
        <linearGradient id={g.s} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#e09a1c" />
        </linearGradient>
        <mask id={g.m}>
          <rect width="120" height="120" fill="#fff" />
          <polygon points={notch} fill="#000" />
        </mask>
      </defs>
      <Shadow id={g.sh} rx={36} />
      <ellipse cx="62" cy="70" rx="42" ry="36" fill={url(g.e)} mask={`url(#${g.m})`} />
      <path d="M30 78 C34 88 44 96 56 98" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.45" />
      <polygon points={notch} transform="translate(0 -20)" fill={url(g.s)} stroke="#b7790f" strokeWidth="2" strokeLinejoin="round" />
      <path d="M62 22 V26" stroke="#a69c94" strokeWidth="2" strokeDasharray="2 2" />
    </Svg>
  );
}

/** Citrus slice — vitamins & minerals */
export function VitaminArt(p: ArtProps) {
  const g = useIds("rind", "pulp", "sh");
  const seg = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.rind} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc35a" />
          <stop offset="1" stopColor="#e07a12" />
        </linearGradient>
        <radialGradient id={g.pulp} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="1" stopColor="#f6b73c" />
        </radialGradient>
      </defs>
      <Shadow id={g.sh} rx={36} />
      <circle cx="60" cy="60" r="44" fill={url(g.rind)} />
      <circle cx="60" cy="60" r="37" fill="#fff7e0" />
      {seg.map((a, i) => {
        const a1 = a + 0.1, a2 = a + Math.PI / 4 - 0.1;
        return <path key={i} d={`M${60 + 4 * Math.cos(a + 0.39)} ${60 + 4 * Math.sin(a + 0.39)} L${60 + 33 * Math.cos(a1)} ${60 + 33 * Math.sin(a1)} A33 33 0 0 1 ${60 + 33 * Math.cos(a2)} ${60 + 33 * Math.sin(a2)} Z`} fill={url(g.pulp)} />;
      })}
      <path d="M28 40 C34 30 44 22 56 20" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.65" />
    </Svg>
  );
}

/** Thyroid gland — endocrinology */
export function GlandArt(p: ArtProps) {
  const g = useIds("lobe", "sh");
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.lobe} cx="0.4" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#f7c1d5" />
          <stop offset="1" stopColor="#bd3461" />
        </radialGradient>
      </defs>
      <Shadow id={g.sh} rx={36} />
      <rect x="54" y="14" width="12" height="94" rx="6" fill="#a69c94" opacity="0.55" />
      <path d="M58 64 C50 84 34 100 24 92 C14 84 18 54 26 38 C32 26 44 26 48 40 C52 52 54 58 58 64 Z" fill={url(g.lobe)} />
      <path d="M62 64 C70 84 86 100 96 92 C106 84 102 54 94 38 C88 26 76 26 72 40 C68 52 66 58 62 64 Z" fill={url(g.lobe)} />
      <rect x="48" y="58" width="24" height="14" rx="7" fill="#d9577f" />
      <path d="M26 50 C28 42 32 36 38 34" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
    </Svg>
  );
}

/** Conical flask — practicals */
export function FlaskArt(p: ArtProps) {
  const g = useIds("glass", "liq", "sh");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.liq} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#88aee3" />
          <stop offset="1" stopColor="#2e5a99" />
        </linearGradient>
        <linearGradient id={g.glass} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#e7e1db" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <Shadow id={g.sh} rx={34} />
      <path d="M48 14 H72 V44 L98 96 C101 102 97 108 90 108 H30 C23 108 19 102 22 96 L48 44 Z" fill={url(g.glass)} stroke="#a69c94" strokeWidth="3" strokeLinejoin="round" />
      <path d="M36 70 H84 L96 96 C98 101 95 105 90 105 H30 C25 105 22 101 24 96 Z" fill={url(g.liq)} />
      <rect x="44" y="10" width="32" height="7" rx="3.5" fill="#a69c94" />
      <circle cx="52" cy="86" r="4" fill="#fff" opacity="0.7" />
      <circle cx="66" cy="94" r="3" fill="#fff" opacity="0.6" />
      <circle cx="74" cy="80" r="2.5" fill="#fff" opacity="0.6" />
      <path d="M53 20 V46 L34 84" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
    </Svg>
  );
}

/** Light bulb — clinical & extra topics */
export function BulbArt(p: ArtProps) {
  const g = useIds("glass", "sh");
  return (
    <Svg {...p}>
      <defs>
        <radialGradient id={g.glass} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff6cf" />
          <stop offset="1" stopColor="#f2b63d" />
        </radialGradient>
      </defs>
      <Shadow id={g.sh} rx={22} />
      <path d="M60 12 C38 12 24 28 24 48 C24 64 34 72 40 82 H80 C86 72 96 64 96 48 C96 28 82 12 60 12 Z" fill={url(g.glass)} />
      <path d="M50 82 V64 C50 58 56 56 60 60 C64 56 70 58 70 64 V82" stroke="#b7790f" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="40" y="82" width="40" height="8" rx="3" fill="#a69c94" />
      <rect x="42" y="90" width="36" height="7" rx="3" fill="#8c827a" />
      <path d="M50 97 H70 L66 104 H54 Z" fill="#6d645d" />
      <path d="M36 44 C36 34 44 26 54 24" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
    </Svg>
  );
}


/* ---------------- General Education ---------------- */
export function BooksArt(p: ArtProps) {
  const g = useIds("sh");
  return (
    <Svg {...p}>
      <Shadow id={g.sh} rx={30} />
      <rect x="26" y="30" width="16" height="66" rx="3" fill="#4f7a6b" />
      <rect x="44" y="22" width="18" height="74" rx="3" fill="#c9893b" />
      <rect x="64" y="34" width="14" height="62" rx="3" fill="#5b7fb0" />
      <rect x="78" y="38" width="16" height="60" rx="3" fill="#a5664a" transform="rotate(12 86 68)" />
      <path d="M26 42 H42 M44 34 H62 M64 46 H78" stroke="#fff" strokeWidth="3" opacity="0.6" />
      <rect x="20" y="96" width="80" height="6" rx="3" fill="#8c827a" />
    </Svg>
  );
}
export function DomeArt(p: ArtProps) {
  const g = useIds("d", "sh");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.d} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fb7a3" />
          <stop offset="1" stopColor="#3f7a66" />
        </linearGradient>
      </defs>
      <Shadow id={g.sh} rx={32} />
      <path d="M60 18 V26" stroke="#c9a23b" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 62 C32 40 46 28 60 26 C74 28 88 40 88 62 Z" fill={url(g.d)} />
      <rect x="28" y="62" width="64" height="38" rx="3" fill="#efe6d6" />
      <path d="M52 100 V82 C52 76 56 72 60 72 C64 72 68 76 68 82 V100 Z" fill="#8c6a43" />
      <rect x="16" y="50" width="8" height="50" rx="3" fill="#d9cdb7" />
      <rect x="96" y="50" width="8" height="50" rx="3" fill="#d9cdb7" />
      <path d="M16 50 L20 40 L24 50 M96 50 L100 40 L104 50" fill="#3f7a66" />
      <path d="M40 44 C42 38 48 34 54 32" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
    </Svg>
  );
}
export function MapArt(p: ArtProps) {
  const g = useIds("sh");
  return (
    <Svg {...p}>
      <Shadow id={g.sh} rx={32} />
      <path d="M20 34 L44 26 L76 36 L100 28 V90 L76 98 L44 88 L20 96 Z" fill="#e8dcc6" />
      <path d="M44 26 V88 M76 36 V98" stroke="#c9b893" strokeWidth="2" />
      <path d="M26 70 C36 60 46 74 56 62 C66 50 78 64 94 52" stroke="#5b7fb0" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M62 30 C52 30 46 38 46 46 C46 58 62 72 62 72 C62 72 78 58 78 46 C78 38 72 30 62 30 Z" fill="#3f7a66" />
      <circle cx="62" cy="46" r="6" fill="#fff" />
    </Svg>
  );
}
export function MindArt(p: ArtProps) {
  const g = useIds("h", "sh");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={g.h} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9cdb7" />
          <stop offset="1" stopColor="#a69c94" />
        </linearGradient>
      </defs>
      <Shadow id={g.sh} rx={26} />
      <path d="M38 100 V84 C28 78 24 66 24 56 C24 34 40 20 60 20 C80 20 94 34 94 52 L102 66 L94 68 V80 C94 86 90 88 84 88 H74 V100 Z" fill={url(g.h)} />
      <circle cx="58" cy="50" r="14" fill="none" stroke="#3f7a66" strokeWidth="4" />
      <path d="M58 36 V30 M58 64 V70 M44 50 H38 M72 50 H78 M48 40 L44 36 M68 60 L72 64 M68 40 L72 36 M48 60 L44 64" stroke="#3f7a66" strokeWidth="3" strokeLinecap="round" />
      <circle cx="58" cy="50" r="5" fill="#c9893b" />
    </Svg>
  );
}
export function ThinkerArt(p: ArtProps) {
  const g = useIds("sh");
  return (
    <Svg {...p}>
      <Shadow id={g.sh} rx={30} />
      <rect x="22" y="88" width="76" height="10" rx="3" fill="#a69c94" />
      <rect x="30" y="34" width="10" height="54" rx="2" fill="#efe6d6" />
      <rect x="55" y="34" width="10" height="54" rx="2" fill="#efe6d6" />
      <rect x="80" y="34" width="10" height="54" rx="2" fill="#efe6d6" />
      <path d="M22 34 L60 16 L98 34 Z" fill="#d9cdb7" />
      <rect x="22" y="32" width="76" height="6" rx="2" fill="#c9b893" />
      <circle cx="60" cy="25" r="4" fill="#c9893b" />
    </Svg>
  );
}
export function ChartArt(p: ArtProps) {
  const g = useIds("sh");
  return (
    <Svg {...p}>
      <Shadow id={g.sh} rx={30} />
      <rect x="20" y="20" width="80" height="78" rx="8" fill="#f5efe4" />
      <rect x="32" y="62" width="12" height="26" rx="2" fill="#5b7fb0" />
      <rect x="52" y="46" width="12" height="42" rx="2" fill="#3f7a66" />
      <rect x="72" y="34" width="12" height="54" rx="2" fill="#c9893b" />
      <circle cx="84" cy="30" r="14" fill="none" stroke="#352d28" strokeWidth="4" />
      <path d="M94 40 L104 50" stroke="#352d28" strokeWidth="5" strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */
const SUBJECT_ART: Record<string, (p: ArtProps) => React.ReactElement> = {
  anat: SkullArt,
  phys: HeartArt,
  "oral-bio": ToothArt,
  biochem: DnaArt,
  pharm: CapsuleArt,
  path: MicroscopeArt,
  "gen-ed": BooksArt,
};

const AREA_ART: Record<string, (p: ArtProps) => React.ReactElement> = {
  embryology: EmbryoArt,
  histology: CellsArt,
  neuroanatomy: BrainArt,
  "head-and-neck": SkullArt,
  "general-anatomy": BoneArt,
  "thorax-and-abdomen": LungsArt,
  // Biochemistry chapters
  "cell-water-and-ph": WaterArt,
  carbohydrates: SugarArt,
  lipids: LipidArt,
  proteins: ProteinArt,
  "haemoglobin-and-liver": BloodArt,
  enzymes: EnzymeArt,
  "nucleotides-and-genetics": DnaArt,
  "vitamins-and-minerals": VitaminArt,
  endocrinology: GlandArt,
  "clinical-topics": BulbArt,
  "practicals-and-revision": FlaskArt,
  // General Education chapters
  "islamic-studies": DomeArt,
  "pakistan-studies": MapArt,
  "research-methods": ChartArt,
  philosophy: ThinkerArt,
  "behavioural-sciences": MindArt,
};

export function SubjectArt({ id, className, title }: ArtProps & { id: string }) {
  const Art = SUBJECT_ART[id] ?? ToothArt;
  return <Art className={className} title={title} />;
}

export function AreaArt({ slug, className, title }: ArtProps & { slug: string }) {
  const Art = AREA_ART[slug] ?? ToothArt;
  return <Art className={className} title={title} />;
}

/* Stable icon-like components per area (drop-in for lucide icons in nav lists) */
const areaIconCache: Record<string, (p: { className?: string }) => React.ReactElement> = {};
export function areaIcon(slug: string) {
  return (areaIconCache[slug] ??= function AreaIcon({ className }: { className?: string }) {
    return <AreaArt slug={slug} className={`${(className ?? "").replace(/\btext-\S+/g, "")} scale-[1.35]`} />;
  });
}
