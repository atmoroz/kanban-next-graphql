"use client";

import { useCallback, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Column, ColumnFormModal, useColumns, type BoardColumn } from "@/entities/column";
import type { BoardTask } from "@/entities/task";
import { useLabels } from "@/entities/label";
import { useBoardFilters, useIsBoardSearchMode } from "@/features/filters";
import { useCreateColumn } from "@/features/create-column";
import { useUpdateColumn } from "@/features/update-column";
import { DeleteColumnConfirmModal } from "@/features/delete-column";
import { useCreateTask } from "@/features/create-task";
import { TaskModal, type TaskFormValues } from "@/features/task-modal";
import { DeleteTaskConfirmModal } from "@/features/delete-task";
import { useUpdateTask } from "@/features/update-task";
import { useUpdateTaskLabels } from "@/features/update-task-labels";
import { useMoveTask } from "@/features/move-task";
import { useBoardSubscriptionsSync } from "@/features/subscriptions-sync";
import { TaskPriority, type BoardPermissions } from "@/graphql/generated/graphql";
import { areArraysEqual } from "@/shared/lib/array/are-arrays-equal";
import { InviteBoardMemberModal } from "@/features/invite-board-member/ui/InviteBoardMemberModal";
import { Toolbar } from "./Toolbar";
import { useBoardMembers } from "@/features/task-modal/model/useBoardMembers";
import { toInitials } from "@/shared/lib/toInitials";
import { hasBoardPermission } from "@/shared/lib/permissions/boardPermissions";

type ColumnsContainerProps = {
  boardId: string;
  onOpenCreateLabel: () => void;
  permissions: BoardPermissions;
  hasTasks: boolean;
};

export function ColumnsContainer({
  boardId,
  onOpenCreateLabel,
  permissions,
  hasTasks,
}: ColumnsContainerProps) {
  const isSearchMode = useIsBoardSearchMode();
  const { searchQuery: boardSearchQuery } = useBoardFilters();

  useBoardSubscriptionsSync({ boardId });

  const { columns } = useColumns(boardId);
  const { labels } = useLabels(boardId);
  const { members, loading: membersLoading } = useBoardMembers(boardId);

  const canCreateTask = hasBoardPermission(permissions, "createTask");
  const canUpdateTask = hasBoardPermission(permissions, "updateTask");
  const canDeleteTask = hasBoardPermission(permissions, "deleteTask");
  const canMoveCard = hasBoardPermission(permissions, "moveCard");
  const canCreateColumn = hasBoardPermission(permissions, "createColumn");
  const canManageLabels = hasBoardPermission(permissions, "manageLabels");
  const canInviteMember = hasBoardPermission(permissions, "inviteMember");
  // manageBoardMembers is handled in `BoardMembersAvatars`.
  // NOTE: moveColumn currently affects column reordering (if/when implemented).

  const assigneeInitialsByUserId = useMemo(() => {
    if (membersLoading) return undefined;
    const map: Record<string, string> = {};
    for (const m of members) {
      const initials = toInitials(m.user.name, m.user.email);
      if (initials) map[m.user.id] = initials;
    }
    return map;
  }, [members, membersLoading]);
  const { createColumn, loading: createLoading } = useCreateColumn({ boardId });
  const { updateColumn, loading: updateLoading } = useUpdateColumn();
  const [createOpen, setCreateOpen] = useState(false);
  const [openMenuColumnId, setOpenMenuColumnId] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<BoardColumn | null>(null);
  const [columnToDelete, setColumnToDelete] = useState<BoardColumn | null>(null);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<BoardTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<BoardTask | null>(null);

  const handleSubmit = useCallback(
    async (title: string) => {
      if (editingColumn) {
        await updateColumn(editingColumn.id, title);
      } else {
        await createColumn(title);
      }
      setCreateOpen(false);
      setEditingColumn(null);
    },
    [createColumn, updateColumn, editingColumn],
  );

  const formMode = editingColumn ? "edit" : "create";
  const formLoading = createLoading || updateLoading;
  const firstColumnId = columns[0]?.id ?? "";
  const { createTask, loading: createTaskLoading } = useCreateTask({
    columnId: firstColumnId,
    boardId,
  });
  const { updateTask, loading: updateTaskLoading } = useUpdateTask();
  const { updateTaskLabels, loading: updateTaskLabelsLoading } = useUpdateTaskLabels();
  const { moveTask, loading: moveTaskLoading } = useMoveTask();

  const labelsSubmitting =
    updateTaskLoading || updateTaskLabelsLoading || moveTaskLoading;

  const mapPriority = (priority: TaskFormValues["priority"]) => {
    switch (priority) {
      case "low":
        return TaskPriority.Low;
      case "high":
        return TaskPriority.High;
      default:
        return TaskPriority.Medium;
    }
  };

  const handleCreateTask = async ({
    title,
    description,
    priority,
    labelIds,
    dueDate,
    statusId,
    columnId,
    assigneeId,
  }: TaskFormValues) => {
    if (!firstColumnId) return;

    await createTask({
      title,
      statusId,
      columnId,
      description,
      priority: mapPriority(priority),
      labelIds,
      dueDate,
      assigneeId,
    });

    setCreateTaskOpen(false);
  };

  const handleUpdateTask = async ({
    title,
    description,
    priority,
    labelIds,
    dueDate,
    assigneeId,
  }: TaskFormValues) => {
    if (!editingTask) return;

    const promises: Promise<unknown>[] = [];

    promises.push(
      updateTask({
        id: editingTask.id,
        title,
        description,
        priority: mapPriority(priority),
        dueDate,
        assigneeId,
      }),
    );

    if (!areArraysEqual(editingTask.labelIds, labelIds)) {
      promises.push(
        updateTaskLabels({
          taskId: editingTask.id,
          labelIds,
        }),
      );
    }

    await Promise.all(promises);
    setEditingTask(null);
  };

  return (
    <>
      <Toolbar
        setEditingColumn={setEditingColumn}
        setCreateOpen={setCreateOpen}
        firstColumnId={firstColumnId}
        setCreateTaskOpen={setCreateTaskOpen}
        columns={columns}
        createTaskLoading={createTaskLoading}
        hasTasks={hasTasks}
        onOpenCreateLabel={() => {
          if (!canManageLabels) return;
          onOpenCreateLabel();
        }}
        onOpenInviteMember={() => {
          if (!canInviteMember) return;
          setInviteMemberOpen(true);
        }}
        canCreateColumn={canCreateColumn}
        canCreateTask={canCreateTask}
        canManageLabels={canManageLabels}
        canInviteMember={canInviteMember}
      />
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-full flex-col gap-4 overflow-auto">
          <div className="flex flex-1 gap-4 pb-0">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                isMenuOpen={openMenuColumnId === column.id}
                onOpenMenu={setOpenMenuColumnId}
                onEdit={(col) => {
                  setOpenMenuColumnId(null);
                  setEditingColumn(col);
                  setCreateOpen(true);
                }}
                onDelete={(col) => {
                  setOpenMenuColumnId(null);
                  setColumnToDelete(col);
                }}
                onTaskClick={
                  canUpdateTask
                    ? (task) => {
                        setEditingTask(task);
                      }
                    : undefined
                }
                onTaskEdit={
                  canUpdateTask
                    ? (task) => {
                        setEditingTask(task);
                      }
                    : undefined
                }
                onTaskDelete={
                  canDeleteTask
                    ? (task) => {
                        setTaskToDelete(task);
                      }
                    : undefined
                }
                allColumns={columns}
                onTaskMoveTo={(task, targetColumnId, targetIndex) => {
                  void moveTask({
                    id: task.id,
                    sourceColumnId: task.columnId,
                    targetColumnId,
                    position: targetIndex ?? undefined,
                    boardId,
                    searchQuery: boardSearchQuery,
                  });
                }}
                boardId={boardId}
                isSearchMode={isSearchMode}
                searchQuery={boardSearchQuery}
                assigneeInitialsByUserId={assigneeInitialsByUserId}
                canEditColumn={canCreateColumn}
                canDeleteColumn={canCreateColumn}
                canUpdateTask={canUpdateTask}
                canDeleteTask={canDeleteTask}
                canMoveCard={canMoveCard}
              />
            ))}
          </div>

          <ColumnFormModal
            open={createOpen}
            onClose={() => {
              setCreateOpen(false);
              setEditingColumn(null);
            }}
            mode={formMode}
            initialTitle={editingColumn?.title ?? ""}
            isLoading={formLoading}
            onSubmit={handleSubmit}
          />
          <DeleteColumnConfirmModal
            open={!!columnToDelete}
            onClose={() => setColumnToDelete(null)}
            column={columnToDelete}
            boardId={boardId}
          />
          <DeleteTaskConfirmModal
            open={!!taskToDelete}
            onClose={() => {
              if (taskToDelete && editingTask && editingTask.id === taskToDelete.id) {
                setEditingTask(null);
              }
              setTaskToDelete(null);
            }}
            task={taskToDelete}
          />
          <TaskModal
            open={createTaskOpen}
            onClose={() => setCreateTaskOpen(false)}
            isSubmitting={createTaskLoading}
            boardId={boardId}
            isOkDisabled={!canCreateTask}
            statusOptions={columns.map((column) => ({
              id: column.id,
              label: column.title,
            }))}
            labels={labels}
            initialStatusId={firstColumnId}
            onSubmit={handleCreateTask}
          />
          <InviteBoardMemberModal
            open={inviteMemberOpen}
            onClose={() => setInviteMemberOpen(false)}
            boardId={boardId}
          />
          {editingTask && (
            <TaskModal
              open={!!editingTask}
              onClose={() => setEditingTask(null)}
              mode="update"
              isSubmitting={labelsSubmitting}
              boardId={boardId}
              isOkDisabled={!canUpdateTask}
              statusOptions={columns.map((column) => ({
                id: column.id,
                label: column.title,
              }))}
              labels={labels}
              initialTitle={editingTask.title}
              initialDescription={editingTask.description ?? ""}
              initialStatusId={editingTask.columnId}
              initialPriority={
                editingTask.priority === TaskPriority.Low
                  ? "low"
                  : editingTask.priority === TaskPriority.High
                    ? "high"
                    : "medium"
              }
              initialLabelIds={editingTask.labelIds}
              initialAssigneeId={editingTask.assigneeId ?? null}
              initialDueDate={editingTask.dueDate}
              createdAt={editingTask.createdAt}
              taskId={editingTask.id}
              onSubmit={handleUpdateTask}
            />
          )}
        </div>
      </DndProvider>
    </>
  );
}
