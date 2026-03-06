import { SidebarBoard } from "@/entities/board";
import { cn } from "@/shared/lib/cn";
import React from "react";
import { SKELETON_ITEMS_COUNT } from "../model/constants";

type PrivateBoardsProps = {
  isLoading: boolean;
  privateBoards: SidebarBoard[];
  onSelectBoard: (id: string) => void;
  selectedBoardId: string | null;
};

export const PrivateBoards = ({
  isLoading,
  privateBoards,
  onSelectBoard,
  selectedBoardId,
}: PrivateBoardsProps) => {
  return (
    <div className="space-y-1">
      {isLoading && privateBoards.length === 0
        ? Array.from({ length: SKELETON_ITEMS_COUNT }).map((_, index) => (
            <div
              key={`private-skeleton-${index}`}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm"
            >
              <div className="flex flex-1 items-center gap-2">
                <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
                <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
              </div>
              <div className="ml-2 h-4 w-8 animate-pulse rounded-full bg-muted" />
            </div>
          ))
        : privateBoards.map((board) => (
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
  );
};
