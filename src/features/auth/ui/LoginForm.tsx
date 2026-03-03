"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Ошибка входа");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Вход</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Введите email и пароль для входа в аккаунт.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}
        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/30 dark:border-zinc-700"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-zinc-300 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/30 dark:border-zinc-700"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Вход…" : "Войти"}
        </button>
      </form>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-medium underline">
          Зарегистрироваться
        </Link>
      </p>
    </section>
  );
}
