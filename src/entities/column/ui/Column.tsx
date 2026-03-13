"use client";

import { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { BoardColumn } from "../model/column.types";
import { TasksList } from "@/widgets/dashboard-layout/board-view/ui/TasksList";
import { useTasksByColumn, type BoardTask } from "@/entities/task";
import { useLabels } from "@/entities/label";

type ColumnProps = {
  column: BoardColumn;
  tasksCount?: number;
  isMenuOpen: boolean;
  onOpenMenu: (id: string | null) => void;
  onEdit?: (column: BoardColumn) => void;
  onDelete?: (column: BoardColumn) => void;
  onTaskClick?: (task: BoardTask) => void;
  onTaskEdit?: (task: BoardTask) => void;
  onTaskDelete?: (task: BoardTask) => void;
  allColumns: BoardColumn[];
  onTaskMoveTo?: (task: BoardTask, targetColumnId: string, targetIndex?: number) => void;
  boardId: string;
};

export function Column({
  column,
  tasksCount = 0,
  isMenuOpen,
  onOpenMenu,
  onEdit,
  onDelete,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  allColumns,
  onTaskMoveTo,
  boardId,
}: ColumnProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { tasks, isLoading: tasksLoading } = useTasksByColumn(column.id);
  const { labels, isLoading: labelsLoading } = useLabels(boardId);

  const moveTargets = allColumns
    .filter((c) => c.id !== column.id)
    .map((c) => ({ id: c.id, label: c.title }));
  const isMoveDisabled = allColumns.length <= 1;

  const [{ isOver, showBackdrop }, dropRef] = useDrop<
    { id: string; columnId: string },
    void,
    { isOver: boolean; showBackdrop: boolean }
  >(
    {
      accept: "TASK",
      drop: (item) => {
        if (!onTaskMoveTo) return;
        if (item.columnId === column.id) return;
        const toIndex = tasks.length;
        onTaskMoveTo(
          { id: item.id, columnId: item.columnId } as BoardTask,
          column.id,
          toIndex,
        );
      },
      collect: (monitor) => {
        const item = monitor.getItem() as { columnId: string } | null;
        const isDraggingTask = !!item;
        const isCrossColumn = item?.columnId !== column.id;
        return {
          isOver: monitor.isOver() && isCrossColumn,
          showBackdrop: isDraggingTask && isCrossColumn,
        };
      },
    },
    [onTaskMoveTo, column.id, tasks.length],
  );

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isMenuOpen, onOpenMenu]);

  return (
    <section
      ref={(node) => {
        dropRef(node);
      }}
      className={cn(
        "relative flex min-w-80 max-w-80 flex-col rounded-t-lg border border-b-0 border-border",
        "bg-muted/30 pt-4 transition-colors",
        isOver ? "border-primary/60 bg-muted/50" : "",
      )}
    >
      <header className="mb-3 px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {column.title}
          </h3>
          <span className="inline-flex h-5 min-w-7 items-center justify-center rounded-full border border-border bg-background px-2 text-[11px] text-muted-foreground">
            {tasksCount ?? tasks.length}
          </span>
        </div>
        <button
          type="button"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background/80 text-xs text-muted-foreground hover:bg-muted"
          onClick={() => onOpenMenu(isMenuOpen ? null : column.id)}
          aria-label="Column actions"
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </button>
      </header>

      <div className="relative flex-1 space-y-3  px-4 text-sm text-muted-foreground">
        {showBackdrop && (
          <div
            className="absolute inset-0 z-10 rounded-b-lg bg-muted/80 pointer-events-none transition-opacity duration-150"
            aria-hidden
          />
        )}
        {(tasksLoading || labelsLoading) && tasks.length === 0 && (
          <div className="space-y-2">
            <div className="h-10 rounded-md bg-muted/70" />
            <div className="h-10 rounded-md bg-muted/70" />
          </div>
        )}

        {!tasksLoading && !labelsLoading && (
          <TasksList
            tasks={tasks}
            labels={labels}
            onTaskClick={onTaskClick}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
            moveTargets={moveTargets}
            isMoveDisabled={isMoveDisabled}
            onTaskMoveTo={onTaskMoveTo}
          />
        )}
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-2 top-10 z-30 min-w-[160px] rounded-lg border border-border bg-popover p-1 text-sm shadow-lg"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-foreground transition-colors hover:bg-muted"
            onClick={() => {
              onOpenMenu(null);
              onEdit?.(column);
            }}
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-destructive transition-colors hover:bg-destructive/10"
            onClick={() => {
              onOpenMenu(null);
              onDelete?.(column);
            }}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </section>
  );
}
