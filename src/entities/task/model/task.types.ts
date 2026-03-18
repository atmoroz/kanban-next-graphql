import type { TaskPriority } from "@/graphql/generated/graphql";

export type TaskId = string;

export type BoardTask = {
  id: TaskId;
  title: string;
  description?: string | null;
  columnId: string;
  boardId?: string;
  priority: TaskPriority;
  statusId: string;
  labelIds: string[];
  dueDate?: string | null;
  assigneeId?: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type TasksByColumn = Record<string, BoardTask[]>;

export function groupTasksByColumn(tasks: BoardTask[]): TasksByColumn {
  const map: TasksByColumn = {};

  for (const task of tasks) {
    const columnId = task.columnId;

    if (!map[columnId]) {
      map[columnId] = [];
    }

    map[columnId].push(task);
  }

  for (const columnId in map) {
    map[columnId].sort((a, b) => a.position - b.position);
  }

  return map;
}
