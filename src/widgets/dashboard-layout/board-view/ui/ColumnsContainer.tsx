"use client";

import { Column, useColumns } from "@/entities/column";
import { CreateColumnButton, CreateColumnModal } from "@/features/create-column";
import { useState } from "react";

type ColumnsContainerProps = {
  boardId: string;
};

export function ColumnsContainer({ boardId }: ColumnsContainerProps) {
  const { columns, isLoading } = useColumns(boardId);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Columns</h2>
        <CreateColumnButton onClick={() => setCreateOpen(true)} />
      </div>
      <div className="flex flex-1 gap-4 overflow-x-auto pb-2">
        {isLoading && columns.length === 0 && (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`column-skeleton-${index}`}
                className="flex min-w-80 max-w-80 flex-col rounded-lg border border-dashed border-border/60 bg-muted/40 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-8 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </>
        )}

        {columns.map((column) => (
          <Column key={column.id} column={column} tasksCount={0} />
        ))}
      </div>

      <CreateColumnModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        boardId={boardId}
      />
    </div>
  );
}
