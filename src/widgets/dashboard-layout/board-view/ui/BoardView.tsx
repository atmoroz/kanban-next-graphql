"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import type {
  TasksByBoardQuery,
  TasksByBoardQueryVariables,
} from "@/graphql/generated/graphql";
import { TasksByBoardDocument } from "@/graphql/generated/graphql";
import type { SidebarBoard } from "@/entities/board";
import { BoardLabelsPanel } from "@/features/board-labels-panel";
import { BoardMembersAvatars } from "@/features/invite-board-member/ui/BoardMembersAvatars";
import { ColumnsContainer } from "./ColumnsContainer";
import { hasBoardPermission } from "@/shared/lib/permissions/boardPermissions";

type BoardViewProps = {
  selectedBoard: SidebarBoard | null;
  isLoading?: boolean;
};

export function BoardView({ selectedBoard, isLoading }: BoardViewProps) {
  const hasSelectedBoard = !!selectedBoard;
  const boardId = selectedBoard?.id ?? null;
  const [isCreateLabelOpen, setIsCreateLabelOpen] = useState(false);

  const { data: tasksData } = useQuery<TasksByBoardQuery, TasksByBoardQueryVariables>(
    TasksByBoardDocument,
    {
      variables: { boardId: boardId ?? "", first: 100, query: undefined },
      skip: !boardId,
      // Important: don't trigger a network call here.
      // We only need the count if other parts of the UI already populated the cache.
      fetchPolicy: "cache-only",
      returnPartialData: true,
    },
  );

  const tasksCount = tasksData?.tasksByBoard?.edges?.length ?? 0;
  const tasksLabel = useMemo(() => (tasksCount === 1 ? "task" : "tasks"), [tasksCount]);

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
                    {tasksData ? tasksCount : "Loading…"} {tasksLabel} •{" "}
                    {selectedBoard!.visibility === "PUBLIC" ? "Public" : "Private"} board
                  </p>
                </div>
              </div>
              <div className="flex flex-col w-[60%] items-end gap-2">
                <BoardMembersAvatars
                  boardId={boardId}
                  canManageBoardMembers={hasBoardPermission(
                    selectedBoard!.permissions,
                    "manageBoardMembers",
                  )}
                />
                <BoardLabelsPanel
                  boardId={boardId}
                  createLabelOpen={isCreateLabelOpen}
                  onCreateLabelOpenChange={setIsCreateLabelOpen}
                  canManageLabels={hasBoardPermission(
                    selectedBoard!.permissions,
                    "manageLabels",
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden px-6 pb-0 pt-4 text-sm text-muted-foreground">
            {isLoading && !selectedBoard && (
              <div className="flex h-full items-center justify-center">
                <p>Loading board data...</p>
              </div>
            )}
            {selectedBoard && (
              <ColumnsContainer
                boardId={selectedBoard.id}
                onOpenCreateLabel={() => setIsCreateLabelOpen(true)}
                permissions={selectedBoard.permissions}
                hasTasks={tasksCount > 0}
              />
            )}
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
