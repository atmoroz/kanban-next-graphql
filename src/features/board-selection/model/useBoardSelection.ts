"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SidebarBoard } from "@/entities/board";

type UseBoardSelectionResult = {
  selectedBoardId: string | null;
  setSelectedBoardId: (id: string) => void;
  effectiveSelectedBoard: SidebarBoard | null;
};

export function useBoardSelection(boards: SidebarBoard[]): UseBoardSelectionResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedBoardId = searchParams.get("boardId");

  useEffect(() => {
    if (!boards.length) {
      return;
    }

    const exists = boards.some((board) => board.id === selectedBoardId);
    const fallbackId = boards[0]?.id ?? null;

    if (!exists && fallbackId) {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.set("boardId", fallbackId);

      router.replace(`${pathname}?${nextSearchParams.toString()}`, {
        scroll: false,
      });
    }
  }, [boards, pathname, router, searchParams, selectedBoardId]);

  const setSelectedBoardId = (id: string) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("boardId", id);

    router.replace(`${pathname}?${nextSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const effectiveSelectedBoard = useMemo(
    () => boards.find((board) => board.id === selectedBoardId) ?? boards[0] ?? null,
    [boards, selectedBoardId],
  );

  return {
    selectedBoardId,
    setSelectedBoardId,
    effectiveSelectedBoard,
  };
}
