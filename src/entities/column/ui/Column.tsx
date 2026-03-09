"use client";

import { useEffect, useRef } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { BoardColumn } from "../model/column.types";

type ColumnProps = {
  column: BoardColumn;
  tasksCount?: number;
  isMenuOpen: boolean;
  onOpenMenu: (id: string | null) => void;
  onEdit?: (column: BoardColumn) => void;
  onDelete?: (column: BoardColumn) => void;
};

export function Column({
  column,
  tasksCount = 0,
  isMenuOpen,
  onOpenMenu,
  onEdit,
  onDelete,
}: ColumnProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isMenuOpen, onOpenMenu]);

  return (
    <section
      className={cn(
        "relative flex min-w-80 max-w-80 flex-col rounded-lg border border-border",
        "bg-muted/30 p-4 transition-colors",
      )}
    >
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg capitalize font-semibold">{column.title}</h3>
          <span className="inline-flex h-5 min-w-7 items-center justify-center rounded-full border border-border bg-background px-2 text-xs text-muted-foreground">
            {tasksCount}
          </span>
        </div>
        <button
          type="button"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background/80 text-xs text-muted-foreground hover:bg-muted"
          onClick={() => onOpenMenu(isMenuOpen ? null : column.id)}
          aria-label="Column actions"
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto text-sm text-muted-foreground">
        <p className="text-xs text-muted-foreground/80">
          Tasks for this column will appear here as we implement tasks in the next epics.
        </p>
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-2 top-10 z-30 min-w-[160px] rounded-lg border border-border bg-popover p-1 text-sm shadow-lg"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-foreground transition-colors hover:bg-muted"
            onClick={() => {
              onOpenMenu(null);
              onEdit?.(column);
            }}
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-destructive transition-colors hover:bg-destructive/10"
            onClick={() => {
              onOpenMenu(null);
              onDelete?.(column);
            }}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </section>
  );
}
