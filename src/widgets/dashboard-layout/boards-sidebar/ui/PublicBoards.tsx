import { SidebarBoard } from "@/entities/board";
import { cn } from "@/shared/lib/cn";
import React from "react";
import { SKELETON_ITEMS_COUNT } from "../model/constants";

type PublicBoardsProps = {
  isLoading: boolean;
  publicBoards: SidebarBoard[];
  onSelectBoard: (id: string) => void;
  selectedBoardId: string | null;
};

export const PublicBoards = ({
  isLoading,
  publicBoards,
  onSelectBoard,
  selectedBoardId,
}: PublicBoardsProps) => {
  return (
    <div className="space-y-1">
      {isLoading && publicBoards.length === 0
        ? Array.from({ length: SKELETON_ITEMS_COUNT }).map((_, index) => (
            <div
              key={`public-skeleton-${index}`}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm"
            >
              <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
              <div className="ml-2 h-4 w-8 animate-pulse rounded-full bg-muted" />
            </div>
          ))
        : publicBoards.map((board) => (
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
  );
};
