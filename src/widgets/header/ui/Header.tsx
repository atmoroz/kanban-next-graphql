"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Kanban, Moon, Sun } from "lucide-react";
import { useLogout } from "@/features/auth/logout";
import { cn } from "@/shared/lib/cn";
import { useTheme } from "@/shared/lib/useTheme";
import { useUser } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui/button";

export function Header() {
  const user = useUser();
  const { logout } = useLogout();
  const { toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    void logout();
  };

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? "?");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Kanban className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">TaskFlow</span>
          </Link>
          {/* <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Profile
            </Link>
          </nav> */}
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={toggleTheme}
            className="relative inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setMenuOpen((o) => !o)}
                className="relative flex size-9 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                {initials}
              </Button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-56 origin-top-right rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
                  <div className="flex flex-col gap-1 px-2 py-2">
                    <p className="text-sm font-medium leading-none">
                      {user.name ?? user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="my-1 h-px bg-border" />
                  <Link
                    href="/profile"
                    className="block rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full rounded-sm px-2 py-1.5 text-left justify-start h-auto text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className={cn(
                  "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90",
                )}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
