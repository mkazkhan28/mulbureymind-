"use client";

/**
 * HMHDental motion system (Motion for React).
 *
 * Principles
 * - Only transform + opacity are animated (GPU-friendly, no layout shift).
 * - One easing curve and three durations everywhere, so the site feels consistent.
 * - Content above the fold is never hidden waiting for JavaScript; scroll reveals
 *   only apply to content below it (and render fully if JS or motion is off).
 * - `prefers-reduced-motion` is respected globally through <MotionConfig reducedMotion="user">.
 * - Motion's feature bundle is loaded lazily (LazyMotion), so it doesn't slow the first paint.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  LazyMotion,
  MotionConfig,
  m,
  animate,
  useInView,
  useReducedMotion,
  type Variants,
  type Transition,
} from "motion/react";

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */
export const EASE = [0.22, 1, 0.36, 1] as const; // smooth "expo-out"
export const DUR = { fast: 0.18, base: 0.45, slow: 0.7 } as const;
export const SPRING: Transition = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 };
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 260, damping: 30 };

const loadFeatures = () => import("motion/react").then((mod) => mod.domMax);

/** Wrap the app once (in layout.tsx). */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DUR.base, ease: EASE }}>
      <LazyMotion features={loadFeatures}>{children}</LazyMotion>
    </MotionConfig>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll reveals                                                      */
/* ------------------------------------------------------------------ */
type Tag = "div" | "section" | "article" | "li" | "ul" | "header" | "span";
const VIEWPORT = { once: true, amount: 0.15, margin: "0px 0px -60px 0px" } as const;

/** Fades content up as it scrolls into view. `delay` is in ms (kept for older call sites). */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  y = 18,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: Tag;
  y?: number;
}) {
  const C = m[as] as typeof m.div;
  const reduce = useReducedMotion();
  return (
    <C
      className={className}
      data-reveal=""
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.slow, ease: EASE, delay: delay / 1000 }}
    >
      {children}
    </C>
  );
}

const staggerParent = (gap: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base + 0.1, ease: EASE } },
};

/** Container whose <StaggerItem> children appear one after another when scrolled into view. */
export function Stagger({
  children,
  className = "",
  as = "div",
  gap = 0.06,
  delay = 0,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  gap?: number;
  delay?: number;
  /** animate on mount instead of on scroll (for content near the top of a page) */
  immediate?: boolean;
}) {
  const C = m[as] as typeof m.div;
  const reduce = useReducedMotion();
  return (
    <C
      className={className}
      data-reveal=""
      variants={staggerParent(gap, delay)}
      initial={reduce ? false : "hidden"}
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT })}
    >
      {children}
    </C>
  );
}

export function StaggerItem({ children, className = "", as = "div" }: { children: React.ReactNode; className?: string; as?: Tag }) {
  const C = m[as] as typeof m.div;
  return (
    <C className={`min-w-0 ${className}`} data-reveal="" variants={staggerChild}>
      {children}
    </C>
  );
}

/* ------------------------------------------------------------------ */
/* Numbers                                                             */
/* ------------------------------------------------------------------ */
/**
 * Counts up to `to` when first seen. The real number is rendered on the server,
 * so it is correct without JavaScript and never shifts layout (tabular figures).
 */
export function CountUp({ to, duration = 1.2, suffix = "", className = "" }: { to: number; duration?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || started.current) return;
    started.current = true;
    if (reduce || to === 0) {
      el.textContent = to.toLocaleString() + suffix;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = Math.round(v).toLocaleString() + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, duration, reduce]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`} data-countup={to} data-suffix={suffix}>
      {to.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * A number that animates whenever it changes (and counts up from 0 the first time it is seen).
 * For values that only exist in the browser (progress, streaks), so there is no server/client flash.
 */
export function AnimatedNumber({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const from = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = value.toLocaleString();
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration: Math.min(1.2, 0.35 + Math.abs(value - from.current) * 0.05),
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = Math.round(v).toLocaleString();
      },
    });
    from.current = value;
    return () => controls.stop();
  }, [value, inView, reduce]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {reduce ? value.toLocaleString() : "0"}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Progress                                                            */
/* ------------------------------------------------------------------ */
/** A bar that grows from 0 to `pct` when it comes into view (scaleX — no layout work). */
export function ProgressBar({ pct, className = "", barClassName = "bg-primary" }: { pct: number; className?: string; barClassName?: string }) {
  const p = Math.max(0, Math.min(100, pct));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div
      ref={ref}
      className={`h-1.5 overflow-hidden rounded-full bg-slate-800 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(p)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <m.div
        className={`h-full w-full origin-left rounded-full ${barClassName}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? p / 100 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page transitions                                                    */
/* ------------------------------------------------------------------ */
let navigated = false;
/**
 * Fades each new page in after client-side navigation. The first page load is
 * shown immediately (no hidden content before hydration).
 */
export function PageTransition({ children, routeKey }: { children: React.ReactNode; routeKey: string }) {
  const [first] = useState(() => !navigated);
  useEffect(() => {
    navigated = true;
  }, []);
  return (
    <m.div
      key={routeKey}
      initial={first ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

export { m };
export { AnimatePresence, useReducedMotion } from "motion/react";
