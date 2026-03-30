import { BoardSidebarItem, SidebarBoard } from "@/entities/board";
import React from "react";
import { SKELETON_ITEMS_COUNT } from "../model/constants";

type PrivateBoardsProps = {
  isLoading: boolean;
  privateBoards: SidebarBoard[];
  onSelectBoard: (id: string) => void;
  selectedBoardId: string | null;
  openMenuBoardId: string | null;
  onOpenMenu: (id: string | null) => void;
  onEditBoard: (board: SidebarBoard) => void;
  onDeleteBoard: (board: SidebarBoard) => void;
};

export const PrivateBoards = ({
  isLoading,
  privateBoards,
  onSelectBoard,
  selectedBoardId,
  openMenuBoardId,
  onOpenMenu,
  onEditBoard,
  onDeleteBoard,
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
            <BoardSidebarItem
              key={board.id}
              board={board}
              selectedBoardId={selectedBoardId}
              onSelectBoard={onSelectBoard}
              isMenuOpen={openMenuBoardId === board.id}
              onOpenMenu={onOpenMenu}
              variant="private"
              onEdit={onEditBoard}
              onDelete={onDeleteBoard}
            />
          ))}
    </div>
  );
};
