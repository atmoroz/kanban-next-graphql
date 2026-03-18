import { BoardTask } from "./task.types";

type TaskNodeShape = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  columnId?: string | null;
  priority?: unknown;
  statusId?: string | null;
  labelIds?: string[] | null;
  dueDate?: string;
  assigneeId?: string | null;
  position?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

type TaskEdgeLike = {
  node?: TaskNodeShape | null;
};

export function mapTasks<T extends TaskEdgeLike>(
  edges: ReadonlyArray<T> | undefined,
  boardId: string,
): BoardTask[] {
  if (!edges) return [];

  const result: BoardTask[] = [];

  for (const edge of edges) {
    const node = edge?.node;

    if (!node?.id) continue;

    result.push({
      id: node.id,
      title: node.title ?? "",
      description: node.description ?? null,
      columnId: node.columnId ?? "",
      boardId,
      priority: node.priority as BoardTask["priority"],
      statusId: node.statusId ?? "",
      labelIds: node.labelIds ?? [],
      dueDate: node.dueDate ?? null,
      assigneeId: node.assigneeId ?? null,
      position: node.position ?? 0,
      createdAt: node.createdAt ?? "",
      updatedAt: node.updatedAt ?? "",
    });
  }

  return result;
}
