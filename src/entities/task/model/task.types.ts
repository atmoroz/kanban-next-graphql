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
