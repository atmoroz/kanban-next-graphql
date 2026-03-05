"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { CreateBoardButton } from "@/features/create-board";
import { BoardsSidebarProps } from "@/entities/dashboard";

export function BoardsSidebar({
  boards,
  selectedBoardId,
  onSelectBoard,
}: BoardsSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const publicBoards = boards.filter((b) => b.visibility === "PUBLIC");
  const privateBoards = boards.filter((b) => b.visibility === "PRIVATE");

  if (collapsed) {
    return (
      <aside className="flex h-full w-14 flex-col items-center border-r border-border bg-muted/30 py-4">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Expand sidebar"
        >
          <span className="text-lg font-semibold">&gt;</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-muted/30">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Boards</h2>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Collapse sidebar"
        >
          <span className="text-lg font-semibold">&lt;</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
              P
            </span>
            <span>Public Boards</span>
          </div>
          <div className="space-y-1">
            {publicBoards.map((board) => (
              <button
                key={board.id}
                type="button"
                onClick={() => onSelectBoard(board.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  selectedBoardId === board.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <span className="truncate">{board.title}</span>
                <span
                  className={cn(
                    "ml-2 inline-flex min-w-8 items-center justify-center rounded-full bg-background px-2 text-xs font-medium",
                    selectedBoardId === board.id && "bg-primary-foreground/20",
                  )}
                >
                  {board.tasksCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
              L
            </span>
            <span>Private Boards</span>
          </div>
          <div className="space-y-1">
            {privateBoards.map((board) => (
              <button
                key={board.id}
                type="button"
                onClick={() => onSelectBoard(board.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  selectedBoardId === board.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <span className="truncate flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
                    *
                  </span>
                  {board.title}
                </span>
                <span
                  className={cn(
                    "ml-2 inline-flex min-w-8 items-center justify-center rounded-full bg-background px-2 text-xs font-medium",
                    selectedBoardId === board.id && "bg-primary-foreground/20",
                  )}
                >
                  {board.tasksCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4">
        <CreateBoardButton className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90" />
      </div>
    </aside>
  );
}
