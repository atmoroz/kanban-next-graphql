"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex h-16 w-full  items-center justify-between px-6">
        <div className="text-sm text-muted-foreground">
          TaskFlow © {new Date().getFullYear()}
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://kanban-graphql-document-platform-xh.vercel.app/"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </a>
          <a
            href="https://github.com/atmoroz/kanban-next-graphql"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
