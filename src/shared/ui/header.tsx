"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MeUser } from "@/features/auth/server/get-current-user";

type Theme = "light" | "dark";

type HeaderProps = {
  user: MeUser | null;
};

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("light");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

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
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300"
          >
            Kanban Next GraphQL
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-600 dark:text-zinc-300">
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-zinc-300 bg-white/70 px-2 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Выход
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <Link
                href="/login"
                className="rounded-md border border-zinc-300 bg-white/70 px-2 py-1 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-transparent bg-zinc-900 px-2 py-1 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Регистрация
              </Link>
            </div>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-zinc-300 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Theme: {theme === "light" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}


