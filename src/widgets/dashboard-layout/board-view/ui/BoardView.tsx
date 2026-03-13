"use client";

import type { SidebarBoard } from "@/entities/board";
import { BoardLabelsPanel } from "@/features/board-labels-panel";
import { ColumnsContainer } from "./ColumnsContainer";

type BoardViewProps = {
  selectedBoard: SidebarBoard | null;
  isLoading?: boolean;
};

export function BoardView({ selectedBoard, isLoading }: BoardViewProps) {
  const hasSelectedBoard = !!selectedBoard;
  const boardId = selectedBoard?.id ?? null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {hasSelectedBoard ? (
        <>
          <div className="border-b border-border px-6 py-4 ">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div>
                  <h1 className="text-2xl font-semibold">{selectedBoard!.title}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedBoard!.tasksCount} task
                    {selectedBoard!.tasksCount !== 1 ? "s" : ""} •{" "}
                    {selectedBoard!.visibility === "PUBLIC" ? "Public" : "Private"} board
                  </p>
                </div>
              </div>

              <BoardLabelsPanel boardId={boardId} />
            </div>
          </div>
          <div className="flex-1 overflow-auto px-6 pb-0 pt-4 text-sm text-muted-foreground">
            {isLoading && !selectedBoard && (
              <div className="flex h-full items-center justify-center">
                <p>Loading board data...</p>
              </div>
            )}
            {selectedBoard && <ColumnsContainer boardId={selectedBoard.id} />}
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 py-0 text-sm text-muted-foreground">
          {isLoading ? <p>Loading boards...</p> : <p>Select a board to get started.</p>}
        </div>
      )}
    </div>
  );
}
