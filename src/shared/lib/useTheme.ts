"use client";

import { useEffect, useState } from "react";
import { DEFAULT_THEME, THEME_COOKIE_NAME, type Theme } from "@/shared/config/theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return DEFAULT_THEME;

    const attr = document.documentElement.dataset.theme;
    if (attr === "light" || attr === "dark") return attr;

    const stored = window.localStorage.getItem(THEME_COOKIE_NAME);
    if (stored === "light" || stored === "dark") return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_COOKIE_NAME, theme);
    document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; samesite=lax`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, setTheme, toggleTheme };
}
