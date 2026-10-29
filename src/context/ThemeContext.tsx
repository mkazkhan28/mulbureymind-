"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const STORAGE_KEY = "bds-theme";

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

/**
 * Runs before React hydrates (injected in layout.tsx) so the saved theme is
 * applied on first paint — no flash of the wrong theme. First visit follows the
 * device's light/dark preference; after that the student's own choice is remembered.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t!=="dark"&&t!=="light"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var r=document.documentElement;if(t==="dark"){r.classList.add("dark");r.classList.remove("light");}else{r.classList.add("light");r.classList.remove("dark");}}catch(e){}})();`;

function applyTheme(t: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
  root.classList.toggle("light", t === "light");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");

  useEffect(() => {
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setThemeState(current);
    // enable smooth colour transitions only after first paint
    const id = window.setTimeout(() => document.documentElement.classList.add("theme-ready"), 100);
    return () => window.clearTimeout(id);
  }, []);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* storage unavailable (private mode) — theme still applies for this visit */
    }
    applyTheme(t);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
