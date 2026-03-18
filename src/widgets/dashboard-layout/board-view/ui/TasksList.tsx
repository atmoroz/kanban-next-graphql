import { TaskCard, type BoardTask } from "@/entities/task";
import { type BoardLabel } from "@/entities/label";

type TasksListProps = {
  tasks: BoardTask[];
  labels: BoardLabel[];
  isDragDisabled?: boolean;
  onTaskClick?: (task: BoardTask) => void;
  onTaskEdit?: (task: BoardTask) => void;
  onTaskDelete?: (task: BoardTask) => void;
  moveTargets?: { id: string; label: string }[];
  isMoveDisabled?: boolean;
  onTaskMoveTo?: (task: BoardTask, targetColumnId: string, targetIndex?: number) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  onDragOver?: (overTaskId: string | null) => void;
};

export function TasksList({
  tasks,
  labels,
  isDragDisabled,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  moveTargets,
  isMoveDisabled,
  onTaskMoveTo,
  onDragStart,
  onDragEnd,
  onDragOver,
}: TasksListProps) {
  if (!tasks.length) {
    return null;
  }

  const labelsById = new Map(labels.map((label) => [label.id, label]));

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task, index) => {
        const taskLabels = task.labelIds
          .map((labelId) => labelsById.get(labelId))
          .filter((label): label is BoardLabel => Boolean(label))
          .slice(0, 3);

        return (
          <TaskCard
            key={task.id}
            task={task}
            labels={taskLabels}
            index={index}
            columnId={task.columnId}
            isDragDisabled={isDragDisabled}
            onClick={onTaskClick ? () => onTaskClick(task) : undefined}
            onEdit={onTaskEdit ? () => onTaskEdit(task) : undefined}
            onDelete={onTaskDelete ? () => onTaskDelete(task) : undefined}
            moveTargets={moveTargets}
            isMoveDisabled={isMoveDisabled}
            onMoveTo={
              onTaskMoveTo
                ? (targetColumnId, targetIndex, draggedItem) =>
                    onTaskMoveTo(
                      draggedItem
                        ? ({
                            id: draggedItem.id,
                            columnId: draggedItem.columnId,
                          } as BoardTask)
                        : task,
                      targetColumnId,
                      targetIndex,
                    )
                : undefined
            }
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          />
        );
      })}
    </div>
  );
}
