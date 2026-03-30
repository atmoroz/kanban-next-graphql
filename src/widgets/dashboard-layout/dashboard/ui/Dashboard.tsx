"use client";

import { BoardsSidebar } from "@/widgets/dashboard-layout/boards-sidebar";
import { BoardView } from "../../board-view";
import { useBoards } from "@/entities/board";
import { useBoardSelection } from "@/features/board-selection";

export function Dashboard() {
  const { boards, isLoading } = useBoards();
  const { selectedBoardId, setSelectedBoardId, effectiveSelectedBoard } =
    useBoardSelection(boards);

  return (
    <section className="flex h-full w-full">
      <BoardsSidebar
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelectBoard={setSelectedBoardId}
        isLoading={isLoading}
      />
      <BoardView selectedBoard={effectiveSelectedBoard} isLoading={isLoading} />
    </section>
  );
}
