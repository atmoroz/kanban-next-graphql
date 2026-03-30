import { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Pencil, MoveRight, Trash2, MoreVertical } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import type { TaskPriority } from "@/graphql/generated/graphql";
import type { BoardTask } from "../model/task.types";
import type { BoardLabel } from "@/entities/label";
import { LabelBadge } from "@/entities/label";
import { toInitials } from "@/shared/lib/toInitials";

type TaskCardProps = {
  task: BoardTask;
  labels?: BoardLabel[];
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  index: number;
  columnId: string;
  isDragDisabled?: boolean;
  moveTargets?: { id: string; label: string }[];
  isMoveDisabled?: boolean;
  assigneeInitialsByUserId?: Record<string, string>;
  /** targetColumnId, targetIndex, and on drop — dragged task { id, columnId } */
  onMoveTo?: (
    targetColumnId: string,
    targetIndex?: number,
    draggedItem?: { id: string; columnId: string },
  ) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  /** id of the card currently hovered (stable id, not index) */
  onDragOver?: (overTaskId: string | null) => void;
};

export function TaskCard({
  task,
  labels,
  onClick,
  onEdit,
  onDelete,
  index,
  columnId,
  isDragDisabled = false,
  moveTargets,
  isMoveDisabled,
  assigneeInitialsByUserId,
  onMoveTo,
  onDragStart,
  onDragEnd,
  onDragOver,
}: TaskCardProps) {
  const priorityConfig: Record<
    TaskPriority,
    {
      label: string;
      className: string;
    }
  > = {
    LOW: {
      label: "Low",
      className:
        "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-700",
    },
    MEDIUM: {
      label: "Medium",
      className:
        "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700",
    },
    HIGH: {
      label: "High",
      className:
        "bg-red-100 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-200 dark:border-red-700",
    },
  };

  const priorityMeta = priorityConfig[task.priority];
  const hasLabels = (task.labelIds?.length ?? 0) > 0;
  const hasMetaRow = Boolean(priorityMeta || task.dueDate);
  const assigneeInitials = task.assigneeId
    ? assigneeInitialsByUserId
      ? (assigneeInitialsByUserId[task.assigneeId] ?? "")
      : toInitials(undefined, task.assigneeId)
    : "";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);
  const [moveMenuSide, setMoveMenuSide] = useState<"left" | "right">("right");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const moveTriggerRef = useRef<HTMLDivElement | null>(null);

  const prevIsDraggingRef = useRef(false);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "TASK",
      item: { id: task.id, columnId: task.columnId },
      canDrag: !isDragDisabled,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => {
        onDragEnd?.();
      },
    }),
    [task.id, task.columnId, isDragDisabled, onDragEnd],
  );

  useEffect(() => {
    if (isDragging && !prevIsDraggingRef.current) {
      onDragStart?.(task.id);
    }
    prevIsDraggingRef.current = isDragging;
  }, [isDragging, task.id, onDragStart]);

  const [{ isOver, isOverOther }, dropRef] = useDrop<
    { id: string; columnId: string },
    void,
    { isOver: boolean; isOverOther: boolean }
  >({
    accept: "TASK",
    drop: (item) => {
      if (!onMoveTo) return;
      const fromColumnId = item.columnId;
      const toColumnId = columnId;

      // Moves between columns are handled at the Column drop level
      if (fromColumnId !== toColumnId) return;

      // Dropping on the same card does nothing
      if (item.id === task.id) return;

      onMoveTo(toColumnId, index, item);
    },
    collect: (monitor) => {
      const item = monitor.getItem() as { id: string; columnId: string } | null;
      const overSameColumn = item?.columnId === columnId;
      const over = monitor.isOver({ shallow: true }) && overSameColumn;
      const isOverOther = over && item?.id !== task.id;
      return { isOver: over, isOverOther };
    },
  });

  useEffect(() => {
    if (isOverOther) {
      onDragOver?.(task.id);
    } else if (!isOver) {
      onDragOver?.(null);
    }
    // When isOver && !isOverOther the cursor is over the dragged card's own slot; do not reset overTaskId to avoid flicker when dragging upwards
  }, [isOver, isOverOther, task.id, onDragOver]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsMoveMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isMenuOpen]);

  return (
    <Card
      ref={(node) => {
        dragRef(node);
        dropRef(node);
      }}
      className={`relative flex flex-col gap-2 rounded-lg border-border bg-background/60 p-3 shadow-sm cursor-pointer transition-shadow ${
        isOverOther ? "ring-2 ring-primary/50 ring-inset" : ""
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <Button
        type="button"
        variant="secondary"
        className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-xs text-muted-foreground hover:bg-muted"
        onClick={(event) => {
          event.stopPropagation();
          setIsMenuOpen((open) => !open);
        }}
        aria-label="Task actions"
      >
        <MoreVertical className="size-4" aria-hidden="true" />
      </Button>

      <div className="pr-7">
        <div className="text-sm font-medium leading-snug text-foreground line-clamp-2">
          {task.title}
        </div>
      </div>

      {hasLabels && (
        <div className="mt-1 flex flex-wrap gap-1">
          {labels!.slice(0, 3).map((label) => (
            <LabelBadge key={label.id} label={label} className="max-w-[120px]" />
          ))}
        </div>
      )}
      {task.description && (
        <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
      )}
      {priorityMeta && (
        <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
          <span className="ml-0 inline-flex items-center gap-2 text-xs text-muted-foreground">
            Priority:&nbsp;{" "}
          </span>
          <span
            className={[
              "inline-flex items-center rounded-full border px-2 py-0.5 font-medium w-fit",
              priorityMeta.className,
            ].join(" ")}
          >
            {priorityMeta.label}
          </span>
        </div>
      )}
      {hasMetaRow && (
        <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
          <span className="ml-0 inline-flex items-center gap-2 text-xs text-muted-foreground">
            Due date:&nbsp;{" "}
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "--/--/--"}
          </span>
          {assigneeInitials && (
            <span
              className={[
                "inline-flex h-7 w-7 items-center justify-center rounded-full",
                "text-[10px] font-semibold border border-border bg-background/60 text-foreground",
              ].join(" ")}
              aria-label="Assignee"
            >
              {assigneeInitials}
            </span>
          )}
        </div>
      )}

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-1.5 top-8 z-30 min-w-[160px] rounded-lg border border-border bg-popover p-1 text-xs shadow-lg"
          onClick={(event) => event.stopPropagation()}
          onMouseLeave={() => {
            setIsMoveMenuOpen(false);
          }}
        >
          {onEdit && (
            <Button
              type="button"
              variant="ghost"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left justify-start h-auto text-foreground hover:bg-muted"
              onMouseEnter={() => {
                setIsMoveMenuOpen(false);
              }}
              onClick={() => {
                setIsMenuOpen(false);
                onEdit();
              }}
            >
              <Pencil className="size-3.5" aria-hidden="true" />
              <span>Edit</span>
            </Button>
          )}
          {onMoveTo && (
            <div
              ref={moveTriggerRef}
              className={`relative ${
                isMoveDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              onMouseEnter={() => {
                if (!isMoveDisabled && moveTargets && moveTargets.length > 0) {
                  if (typeof window !== "undefined" && moveTriggerRef.current) {
                    const rect = moveTriggerRef.current.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const spaceRight = viewportWidth - rect.right;
                    const spaceLeft = rect.left;
                    const estimatedWidth = 200;
                    if (spaceRight < estimatedWidth && spaceLeft > spaceRight) {
                      setMoveMenuSide("left");
                    } else {
                      setMoveMenuSide("right");
                    }
                  }
                  setIsMoveMenuOpen(true);
                }
              }}
            >
              <Button
                type="button"
                variant="ghost"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left justify-start h-auto text-foreground hover:bg-muted"
                disabled={isMoveDisabled || !moveTargets || moveTargets.length === 0}
              >
                <MoveRight className="size-3.5" aria-hidden="true" />
                <span>Move</span>
              </Button>
              {!isMoveDisabled &&
                moveTargets &&
                moveTargets.length > 0 &&
                isMoveMenuOpen && (
                  <div
                    className={`absolute top-0 z-40 min-w-[160px] rounded-lg border border-border bg-popover p-1 text-xs shadow-lg ${
                      moveMenuSide === "left" ? "right-full mr-1" : "left-full ml-1"
                    }`}
                  >
                    {moveTargets.map((target) => (
                      <Button
                        key={target.id}
                        type="button"
                        variant="ghost"
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left justify-start h-auto text-foreground hover:bg-muted"
                        onClick={() => {
                          setIsMoveMenuOpen(false);
                          setIsMenuOpen(false);
                          onMoveTo(target.id);
                        }}
                      >
                        <span>{target.label}</span>
                      </Button>
                    ))}
                  </div>
                )}
            </div>
          )}
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left justify-start h-auto"
              onMouseEnter={() => {
                setIsMoveMenuOpen(false);
              }}
              onClick={() => {
                setIsMenuOpen(false);
                onDelete();
              }}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
