import { BoardSidebarItem, SidebarBoard } from "@/entities/board";
import React from "react";
import { SKELETON_ITEMS_COUNT } from "../model/constants";

type PublicBoardsProps = {
  isLoading: boolean;
  publicBoards: SidebarBoard[];
  onSelectBoard: (id: string) => void;
  selectedBoardId: string | null;
  openMenuBoardId: string | null;
  onOpenMenu: (id: string | null) => void;
  onEditBoard: (board: SidebarBoard) => void;
  onDeleteBoard: (board: SidebarBoard) => void;
};

export const PublicBoards = ({
  isLoading,
  publicBoards,
  onSelectBoard,
  selectedBoardId,
  openMenuBoardId,
  onOpenMenu,
  onEditBoard,
  onDeleteBoard,
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
            <BoardSidebarItem
              key={board.id}
              board={board}
              selectedBoardId={selectedBoardId}
              onSelectBoard={onSelectBoard}
              isMenuOpen={openMenuBoardId === board.id}
              onOpenMenu={onOpenMenu}
              variant="public"
              onEdit={onEditBoard}
              onDelete={onDeleteBoard}
            />
          ))}
    </div>
  );
};
