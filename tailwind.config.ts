import type { Config } from "tailwindcss";

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
        // Deep obsidian canvas & surfaces
        duhsDark: {
          950: "#050811",
          900: "#070b14",
          850: "#0b101f",
          800: "#0f1629",
          750: "#141c33",
          700: "#1a2440",
          600: "#243254",
        },
        // Modern jewel accents
        jewelAmber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        jewelRose: {
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
        jewelCyan: {
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
        jewelViolet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        jewelEmerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        jewelBlue: {
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        }
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
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        fadeIn: "fadeIn 0.4s ease-out forwards",
      }
    },
  },
  plugins: [],
};
export default config;
