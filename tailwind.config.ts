import type { Config } from "tailwindcss";

/*
 * Mulberry Mind theme
 * -------------------
 * Every colour below points at a CSS variable defined in src/app/globals.css.
 * The light theme (default) and the dark theme (html.dark) each set their own
 * values, so one class name renders differently in each theme:
 *   light → mint-white surfaces, navy text, mint (brand) + navy (accent), amber for rewards
 *   dark  → deep navy surfaces, glowing mint (brand) + sky blue (accent)
 * `indigo` and `blue` are aliases of `brand`; `violet` and `purple` alias `accent`.
 */
const SHADES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;
const scale = (name: string, extra: string[] = []) =>
  Object.fromEntries([...SHADES, ...extra].map((s) => [s, v(`${name}-${s}`)]));

const brand = scale("brand");
const accent = scale("accent");

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: v("canvas"),
        surface: { DEFAULT: v("surface"), 2: v("surface-2") },
        ink: v("ink"),
        muted: v("muted"),
        line: v("line"),
        brand,
        accent,
        indigo: brand,
        blue: brand,
        violet: accent,
        purple: accent,
        slate: scale("slate", ["850"]),
        amber: scale("amber"),
        rose: scale("rose"),
        pink: scale("pink"),
        cyan: scale("cyan"),
        sky: scale("sky"),
        teal: scale("teal"),
        emerald: scale("emerald"),
        stone: scale("stone"),
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgb(var(--c-shadow) / 0.06), 0 8px 24px -6px rgb(var(--c-shadow) / 0.10)",
        lift: "0 2px 4px rgb(var(--c-shadow) / 0.06), 0 22px 48px -12px rgb(var(--c-shadow) / 0.22)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(2deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.08)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(28px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.08)" },
          "66%": { transform: "translate(-25px, 20px) scale(0.95)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        confetti: {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translate(var(--drift, 0px), 280px) rotate(540deg)", opacity: "0" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        fadeIn: "fadeIn 0.4s ease-out forwards",
        rise: "rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-right": "slide-in-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        drift: "drift 18s ease-in-out infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        marquee: "marquee 40s linear infinite",
        "spin-slow": "spin-slow 24s linear infinite",
        confetti: "confetti 1.8s cubic-bezier(0.2, 0.7, 0.4, 1) forwards",
        "pop-in": "pop-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
