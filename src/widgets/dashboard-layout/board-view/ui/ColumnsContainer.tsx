"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Column, ColumnFormModal, useColumns, type BoardColumn } from "@/entities/column";
import type { BoardTask } from "@/entities/task";
import { useLabels } from "@/entities/label";
import { CreateColumnButton } from "@/features/create-column";
import { useCreateColumn } from "@/features/create-column";
import { useUpdateColumn } from "@/features/update-column";
import { DeleteColumnConfirmModal } from "@/features/delete-column";
import { CreateTaskButton, useCreateTask } from "@/features/create-task";
import { TaskModal, type TaskFormValues } from "@/features/task-modal";
import { DeleteTaskConfirmModal } from "@/features/delete-task";
import { useUpdateTask } from "@/features/update-task";
import { useUpdateTaskLabels } from "@/features/update-task-labels";
import { useMoveTask } from "@/features/move-task";
import { TaskPriority } from "@/graphql/generated/graphql";
import { areArraysEqual } from "@/shared/lib/array/are-arrays-equal";
import { useState, useCallback } from "react";

type ColumnsContainerProps = {
  boardId: string;
};

export function ColumnsContainer({ boardId }: ColumnsContainerProps) {
  const { columns, isLoading } = useColumns(boardId);
  const { labels } = useLabels(boardId);
  const { createColumn, loading: createLoading } = useCreateColumn({ boardId });
  const { updateColumn, loading: updateLoading } = useUpdateColumn();
  const [createOpen, setCreateOpen] = useState(false);
  const [openMenuColumnId, setOpenMenuColumnId] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<BoardColumn | null>(null);
  const [columnToDelete, setColumnToDelete] = useState<BoardColumn | null>(null);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
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
  }: TaskFormValues) => {
    if (!firstColumnId) return;

    await createTask({
      title,
      description,
      priority: mapPriority(priority),
      labelIds,
      dueDate,
    });

    setCreateTaskOpen(false);
  };

  const handleUpdateTask = async ({
    title,
    description,
    priority,
    labelIds,
    dueDate,
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
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Columns</h2>
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
        <div className="flex flex-1 gap-4  pb-0">
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
            <Column
              key={column.id}
              column={column}
              tasksCount={0}
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
              onTaskClick={(task) => {
                setEditingTask(task);
              }}
              onTaskEdit={(task) => {
                setEditingTask(task);
              }}
              onTaskDelete={(task) => {
                setTaskToDelete(task);
              }}
              allColumns={columns}
              onTaskMoveTo={(task, targetColumnId, targetIndex) => {
                void moveTask({
                  id: task.id,
                  sourceColumnId: task.columnId,
                  targetColumnId,
                  position: targetIndex ?? undefined,
                });
              }}
              boardId={boardId}
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
          statusOptions={columns.map((column) => ({
            id: column.id,
            label: column.title,
          }))}
          labels={labels}
          initialStatusId={firstColumnId}
          onSubmit={handleCreateTask}
        />
        {editingTask && (
          <TaskModal
            open={!!editingTask}
            onClose={() => setEditingTask(null)}
            mode="update"
            isSubmitting={labelsSubmitting}
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
            initialDueDate={editingTask.dueDate}
            createdAt={editingTask.createdAt}
            taskId={editingTask.id}
            onSubmit={handleUpdateTask}
          />
        )}
      </div>
    </DndProvider>
  );
}
