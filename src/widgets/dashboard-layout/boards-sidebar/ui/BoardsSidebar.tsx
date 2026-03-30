"use client";

import { useState } from "react";
import { CreateBoardButton, BoardFormModal } from "@/features/create-board";
import { DeleteBoardConfirmModal } from "@/features/delete-board";
import type { BoardsSidebarProps, SidebarBoard } from "@/entities/board";
import { PublicBoards } from "./PublicBoards";
import { PrivateBoards } from "./PrivateBoards";
import { useUser } from "@/shared/providers/auth-provider";

export function BoardsSidebar({
  boards,
  selectedBoardId,
  onSelectBoard,
  isLoading,
}: BoardsSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenuBoardId, setOpenMenuBoardId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editBoard, setEditBoard] = useState<SidebarBoard | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<SidebarBoard | null>(null);
  const user = useUser();

  const closeBoardModal = () => {
    setCreateModalOpen(false);
    setEditBoard(null);
  };

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
    <>
      <BoardFormModal
        open={createModalOpen || !!editBoard}
        onClose={closeBoardModal}
        mode={editBoard ? "edit" : "create"}
        initialBoard={editBoard}
      />
      <DeleteBoardConfirmModal
        open={!!boardToDelete}
        onClose={() => setBoardToDelete(null)}
        board={boardToDelete}
        selectedBoardId={selectedBoardId}
      />
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
            <PublicBoards
              isLoading={isLoading ?? false}
              publicBoards={publicBoards}
              onSelectBoard={onSelectBoard}
              selectedBoardId={selectedBoardId}
              openMenuBoardId={openMenuBoardId}
              onOpenMenu={setOpenMenuBoardId}
              onEditBoard={(board) => {
                setOpenMenuBoardId(null);
                setEditBoard(board);
                setCreateModalOpen(false);
              }}
              onDeleteBoard={(board) => {
                setOpenMenuBoardId(null);
                setBoardToDelete(board);
              }}
            />
          </div>
          {user && !!privateBoards.length && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
                  L
                </span>
                <span>Private Boards</span>
              </div>
              <PrivateBoards
                isLoading={isLoading ?? false}
                privateBoards={privateBoards}
                onSelectBoard={onSelectBoard}
                selectedBoardId={selectedBoardId}
                openMenuBoardId={openMenuBoardId}
                onOpenMenu={setOpenMenuBoardId}
                onEditBoard={(board) => {
                  setOpenMenuBoardId(null);
                  setEditBoard(board);
                  setCreateModalOpen(false);
                }}
                onDeleteBoard={(board) => {
                  setOpenMenuBoardId(null);
                  setBoardToDelete(board);
                }}
              />
            </div>
          )}
        </div>

        {user && (
          <div className="border-t border-border p-4">
            <CreateBoardButton
              className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              onOpenCreate={() => {
                setCreateModalOpen(true);
                setEditBoard(null);
              }}
            />
          </div>
        )}
      </aside>
    </>
  );
}
