"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function Header() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.dataset.theme = stored;
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.dataset.theme = initial;
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
  };

  return (
    <header className="border-b border-zinc-200 bg-background/80 px-6 py-4 backdrop-blur dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <span className="text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
          Kanban Next GraphQL
        </span>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full border border-zinc-300 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Theme: {theme === "light" ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}


