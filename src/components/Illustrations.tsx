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
          <stop offset="0" stopColor="#8e7cc3" />
          <stop offset="1" stopColor="#3f2d75" />
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
            <circle cx={x + (i % 3) - 2} cy={y - 1} r="1.1" fill="#d6ccf0" opacity="0.8" />
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
          <stop offset="0" stopColor="#d9c4e8" />
          <stop offset="1" stopColor="#8f6aaf" />
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
      <path d="M74 82 C80 80 88 81 93 84 M73 87 C79 86 86 88 90 90" stroke="#6f4f8f" strokeWidth="1.2" fill="none" opacity="0.7" />
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
/* Lookups                                                             */
/* ------------------------------------------------------------------ */
const SUBJECT_ART: Record<string, (p: ArtProps) => React.ReactElement> = {
  anat: SkullArt,
  phys: HeartArt,
  "oral-bio": ToothArt,
  biochem: DnaArt,
  pharm: CapsuleArt,
  path: MicroscopeArt,
};

const AREA_ART: Record<string, (p: ArtProps) => React.ReactElement> = {
  embryology: EmbryoArt,
  histology: CellsArt,
  neuroanatomy: BrainArt,
  "head-and-neck": SkullArt,
  "general-anatomy": BoneArt,
  "thorax-and-abdomen": LungsArt,
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
