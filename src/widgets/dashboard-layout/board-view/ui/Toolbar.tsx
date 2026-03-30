import { BoardColumn } from "@/entities/column";
import { CreateColumnButton } from "@/features/create-column";
import { CreateTaskButton } from "@/features/create-task";
import { CreateLabelButton } from "@/features/create-label/ui/CreateLabelButton";
import { AddMemberButton } from "@/features/invite-board-member/ui/AddMemberButton";
import { BoardSearchInput } from "@/features/filters";
import React from "react";

type ToolbarProps = {
  setEditingColumn: (column: BoardColumn | null) => void;
  setCreateOpen: (open: boolean) => void;
  firstColumnId: string;
  setCreateTaskOpen: (open: boolean) => void;
  columns: BoardColumn[];
  createTaskLoading: boolean;
  onOpenCreateLabel: () => void;
  onOpenInviteMember: () => void;
  canCreateColumn: boolean;
  canCreateTask: boolean;
  canManageLabels: boolean;
  canInviteMember: boolean;
  hasTasks: boolean;
};

export const Toolbar = ({
  setEditingColumn,
  setCreateOpen,
  firstColumnId,
  setCreateTaskOpen,
  columns,
  createTaskLoading,
  onOpenCreateLabel,
  onOpenInviteMember,
  canCreateColumn,
  canCreateTask,
  canManageLabels,
  canInviteMember,
  hasTasks,
}: ToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      {hasTasks ? <BoardSearchInput /> : <div className="w-[320px] max-w-full" />}
      <div className="flex items-center gap-2">
        <CreateColumnButton
          onClick={() => {
            setEditingColumn(null);
            setCreateOpen(true);
          }}
          disabled={!canCreateColumn}
        />
        <CreateTaskButton
          onClick={() => {
            if (!firstColumnId) return;
            setCreateTaskOpen(true);
          }}
          disabled={!canCreateTask || columns.length === 0 || createTaskLoading}
        />
        <CreateLabelButton onClick={onOpenCreateLabel} disabled={!canManageLabels} />
        <AddMemberButton onClick={onOpenInviteMember} disabled={!canInviteMember} />
      </div>
    </div>
  );
};
