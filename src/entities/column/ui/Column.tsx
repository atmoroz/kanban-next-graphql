"use client";

import { cn } from "@/shared/lib/cn";
import type { BoardColumn } from "../model/column.types";

type ColumnProps = {
  column: BoardColumn;
  tasksCount?: number;
};

export function Column({ column, tasksCount = 0 }: ColumnProps) {
  return (
    <section
      className={cn(
        "flex min-w-80 max-w-80 flex-col rounded-lg border border-border",
        "bg-muted/30 p-4 transition-colors",
      )}
    >
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{column.title}</h3>
          <span className="inline-flex h-5 min-w-7 items-center justify-center rounded-full border border-border bg-background px-2 text-xs text-muted-foreground">
            {tasksCount}
          </span>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto text-sm text-muted-foreground">
        <p className="text-xs text-muted-foreground/80">
          Tasks for this column will appear here in the next epics.
        </p>
      </div>
    </section>
  );
}
