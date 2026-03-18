import { BoardColumn } from "@/entities/column";
import { CreateColumnButton } from "@/features/create-column";
import { CreateTaskButton } from "@/features/create-task";
import { BoardSearchInput } from "@/features/filters";
import React from "react";

type ToolbarProps = {
  setEditingColumn: (column: BoardColumn | null) => void;
  setCreateOpen: (open: boolean) => void;
  firstColumnId: string;
  setCreateTaskOpen: (open: boolean) => void;
  columns: BoardColumn[];
  createTaskLoading: boolean;
};

export const Toolbar = ({
  setEditingColumn,
  setCreateOpen,
  firstColumnId,
  setCreateTaskOpen,
  columns,
  createTaskLoading,
}: ToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="text-sm font-semibold text-muted-foreground">Columns</h2>
      <BoardSearchInput />
      <div className="flex items-center gap-2">
        <CreateColumnButton
          onClick={() => {
            setEditingColumn(null);
            setCreateOpen(true);
          }}
        />
        <CreateTaskButton
          onClick={() => {
            if (!firstColumnId) return;
            setCreateTaskOpen(true);
          }}
          disabled={columns.length === 0 || createTaskLoading}
        />
      </div>
    </div>
  );
};
