"use client";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-background/80 px-6 py-4 text-xs text-zinc-500 backdrop-blur dark:border-zinc-800 dark:text-zinc-400">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <span>Footer placeholder</span>
        <span>© {new Date().getFullYear()} Kanban Next GraphQL</span>
      </div>
    </footer>
  );
}

