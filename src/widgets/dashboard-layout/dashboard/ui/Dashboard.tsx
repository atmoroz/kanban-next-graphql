"use client";

import { useMemo, useState } from "react";
import {
  BoardsSidebar,
  type SidebarBoard,
} from "@/widgets/dashboard-layout/boards-sidebar";
import { BoardView } from "../../board-view";

const MOCK_BOARDS: SidebarBoard[] = [
  {
    id: "public-1",
    title: "Public roadmap",
    visibility: "PUBLIC",
    tasksCount: 12,
  },
  {
    id: "public-2",
    title: "Marketing",
    visibility: "PUBLIC",
    tasksCount: 7,
  },
  {
    id: "private-1",
    title: "Engineering",
    visibility: "PRIVATE",
    tasksCount: 23,
  },
  {
    id: "private-2",
    title: "Personal",
    visibility: "PRIVATE",
    tasksCount: 4,
  },
];

export function Dashboard() {
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(
    MOCK_BOARDS[0]?.id ?? null,
  );

  const selectedBoard = useMemo(
    () => MOCK_BOARDS.find((b) => b.id === selectedBoardId) ?? null,
    [selectedBoardId],
  );

  return (
    <section className="flex h-full w-full">
      <BoardsSidebar
        boards={MOCK_BOARDS}
        selectedBoardId={selectedBoardId}
        onSelectBoard={setSelectedBoardId}
      />
      <BoardView selectedBoard={selectedBoard} />
    </section>
  );
}
