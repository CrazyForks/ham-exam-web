"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = Exclude<Theme, "system">;

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = "theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;

  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;

  return resolvedTheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const storedTheme = (window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? "system";
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    setThemeState(storedTheme);
    setResolvedTheme(applyTheme(storedTheme));

    const handleChange = () => {
      setResolvedTheme(applyTheme(storedTheme === "system" ? "system" : storedTheme));
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const setTheme = (nextTheme: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setThemeState(nextTheme);
    setResolvedTheme(applyTheme(nextTheme));
  };

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function ThemeScript() {
  const script = `(() => {
    const storageKey = "${THEME_STORAGE_KEY}";
    const root = document.documentElement;
    const storedTheme = localStorage.getItem(storageKey) ?? "system";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolvedTheme = storedTheme === "system" ? (prefersDark ? "dark" : "light") : storedTheme;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  })();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
