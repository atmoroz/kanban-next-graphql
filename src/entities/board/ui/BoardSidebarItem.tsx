"use client";

import { useEffect, useRef } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { SidebarBoard } from "../model/board.types";

type BoardSidebarItemProps = {
  board: SidebarBoard;
  selectedBoardId: string | null;
  onSelectBoard: (id: string) => void;
  isMenuOpen: boolean;
  onOpenMenu: (id: string | null) => void;
  variant: "public" | "private";
  onEdit?: (board: SidebarBoard) => void;
  onDelete?: (board: SidebarBoard) => void;
};

export function BoardSidebarItem({
  board,
  selectedBoardId,
  onSelectBoard,
  isMenuOpen,
  onOpenMenu,
  variant,
  onEdit,
  onDelete,
}: BoardSidebarItemProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
        onOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isMenuOpen, onOpenMenu]);

  return (
    <div
      ref={rowRef}
      role="button"
      tabIndex={0}
      onClick={() => onSelectBoard(board.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectBoard(board.id);
        }
      }}
      className={cn(
        "relative flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
        selectedBoardId === board.id
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted",
      )}
    >
      <span className="truncate flex items-center gap-2 text-left">
        {variant === "private" && (
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
            *
          </span>
        )}
        {board.title}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu(isMenuOpen ? null : board.id);
        }}
        className={cn(
          "ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background/80 text-xs text-muted-foreground",
          selectedBoardId === board.id && "bg-primary-foreground/20",
        )}
        aria-label="Board actions"
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </button>

      {isMenuOpen && (
        <div
          className=" absolute right-1 top-10 z-30
            min-w-[160px]
            rounded-lg
            border border-border
            bg-popover
            p-1
            shadow-lg
            animate-in fade-in zoom-in-95
            
            "
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="flex w-full items-center gap-2
              rounded-md px-3 py-2
              text-sm
              hover:bg-muted
              transition-colors
              text-foreground"
            onClick={() => {
              onOpenMenu(null);
              onEdit?.(board);
            }}
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="flex w-full rounded-md items-center gap-2 px-3 py-2 text-left text-destructive hover:bg-destructive/10"
            onClick={() => {
              onOpenMenu(null);
              onDelete?.(board);
            }}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
