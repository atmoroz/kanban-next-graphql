"use client";

import { gql } from "@apollo/client";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import type { ApolloClient, Reference, StoreObject } from "@apollo/client";
import {
  TaskCreatedDocument,
  TaskUpdatedDocument,
  TaskDeletedDocument,
  type Task,
} from "@/graphql/generated/graphql";

type UseBoardSubscriptionsSyncArgs = {
  boardId: string | null;
};

const taskFragment = gql`
  fragment TaskSyncFields on Task {
    id
    columnId
    title
    description
    priority
    statusId
    labelIds
    dueDate
    assigneeId
    position
    createdAt
    updatedAt
  }
`;

type TaskEdge = {
  __typename: "TaskEdge";
  cursor: string;
  node: Reference | StoreObject;
};

type ColumnTaskRef = {
  id: string;
  columnId: string;
  position: number;
};

function isTaskConnectionStoreObject(
  value: Reference | StoreObject | undefined,
): value is StoreObject & { edges?: TaskEdge[] } {
  const storeObject = value as StoreObject | undefined;
  return Boolean(
    value && "__typename" in value && storeObject?.__typename === "TaskConnection",
  );
}

function upsertTaskIntoBoardCache(args: { client: ApolloClient; task: Task }) {
  const { client, task } = args;
  const cache = client.cache;

  // ✅ 1. Update the Task entity itself
  const taskCacheId = cache.identify({
    __typename: "Task",
    id: task.id,
  });

  if (taskCacheId) {
    cache.writeFragment({ id: taskCacheId, fragment: taskFragment, data: task });
  }

  // ✅ 2. Update the tasksByBoard connection
  cache.modify({
    fields: {
      tasksByBoard(
        existing: Reference | StoreObject | undefined,
        {
          readField,
        }: {
          readField: <T = unknown>(
            fieldName: string,
            from: Reference | StoreObject,
          ) => T | undefined;
        },
      ): Reference | StoreObject | undefined {
        if (!existing) return existing;
        if (!isTaskConnectionStoreObject(existing)) return existing;

        const edges = (existing.edges as TaskEdge[] | undefined) ?? [];

        const byId = new Map<string, TaskEdge>();
        const taskRefs: ColumnTaskRef[] = [];

        edges.forEach((edge) => {
          const id = readField<string>("id", edge.node);
          if (!id) return;
          byId.set(id, edge);
          taskRefs.push({
            id,
            columnId: readField<string>("columnId", edge.node) ?? "",
            position: readField<number>("position", edge.node) ?? 0,
          });
        });

        const movedExisting = taskRefs.find((t) => t.id === task.id);
        const sourceColumnId = movedExisting?.columnId ?? task.columnId;
        const targetColumnId = task.columnId;
        const targetPosition = Math.max(0, task.position ?? 0);

        if (!movedExisting) {
          const taskRef = cache.writeFragment({
            fragment: taskFragment,
            data: task,
          });
          if (!taskRef) return existing;

          const nextEdges = [
            ...edges,
            {
              __typename: "TaskEdge",
              cursor: task.id,
              node: taskRef,
            },
          ];

          return {
            ...existing,
            __typename: "TaskConnection",
            edges: nextEdges,
          } as StoreObject;
        }

        const sourceColumnTasks = taskRefs
          .filter((t) => t.columnId === sourceColumnId && t.id !== task.id)
          .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
        const targetColumnTasks = taskRefs
          .filter((t) => t.columnId === targetColumnId && t.id !== task.id)
          .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));

        if (sourceColumnId === targetColumnId) {
          const insertIndex = Math.min(targetPosition, targetColumnTasks.length);
          targetColumnTasks.splice(insertIndex, 0, {
            id: task.id,
            columnId: targetColumnId,
            position: insertIndex,
          });
          targetColumnTasks.forEach((t, index) => {
            const taskStoreId = cache.identify({ __typename: "Task", id: t.id });
            if (!taskStoreId) return;
            cache.modify({
              id: taskStoreId,
              fields: {
                columnId() {
                  return targetColumnId;
                },
                position() {
                  return index;
                },
              },
            });
          });
        } else {
          const insertIndex = Math.min(targetPosition, targetColumnTasks.length);
          targetColumnTasks.splice(insertIndex, 0, {
            id: task.id,
            columnId: targetColumnId,
            position: insertIndex,
          });

          sourceColumnTasks.forEach((t, index) => {
            const taskStoreId = cache.identify({ __typename: "Task", id: t.id });
            if (!taskStoreId) return;
            cache.modify({
              id: taskStoreId,
              fields: {
                columnId() {
                  return sourceColumnId;
                },
                position() {
                  return index;
                },
              },
            });
          });

          targetColumnTasks.forEach((t, index) => {
            const taskStoreId = cache.identify({ __typename: "Task", id: t.id });
            if (!taskStoreId) return;
            cache.modify({
              id: taskStoreId,
              fields: {
                columnId() {
                  return targetColumnId;
                },
                position() {
                  return index;
                },
              },
            });
          });
        }

        const nextEdges: TaskEdge[] = taskRefs
          .map((ref) => {
            const edge = byId.get(ref.id);
            if (!edge) return null;
            return {
              ...edge,
              cursor: ref.id,
            };
          })
          .filter((edge): edge is TaskEdge => edge !== null);

        if (!nextEdges.some((edge) => readField<string>("id", edge.node) === task.id)) {
          const taskRef = cache.writeFragment({
            fragment: taskFragment,
            data: task,
          });
          if (!taskRef) return existing;
          nextEdges.push({
            __typename: "TaskEdge",
            cursor: task.id,
            node: taskRef,
          });
        }

        const sortedEdges = nextEdges.slice().sort((a, b) => {
          const colA = readField<string>("columnId", a.node) ?? "";
          const colB = readField<string>("columnId", b.node) ?? "";
          if (colA !== colB) return colA.localeCompare(colB);

          const posA = readField<number>("position", a.node) ?? 0;
          const posB = readField<number>("position", b.node) ?? 0;
          if (posA !== posB) return posA - posB;

          const idA = readField<string>("id", a.node) ?? "";
          const idB = readField<string>("id", b.node) ?? "";
          return idA.localeCompare(idB);
        });

        const nextConnection = {
          ...existing,
          __typename: "TaskConnection",
          edges: sortedEdges,
        };
        return nextConnection as StoreObject;
      },
    },
  });
}

function deleteTaskFromBoardCache(args: { client: ApolloClient; taskId: string }) {
  const { client, taskId } = args;
  const cache = client.cache;

  // Remove from any cached tasksByBoard connection where it's present.
  cache.modify({
    fields: {
      tasksByBoard(
        existing: Reference | StoreObject | undefined,
        {
          readField,
        }: {
          readField: <T = unknown>(
            fieldName: string,
            from: Reference | StoreObject,
          ) => T | undefined;
        },
      ) {
        if (!existing) return existing;
        if (!isTaskConnectionStoreObject(existing)) return existing;

        const edges = (existing.edges as TaskEdge[] | undefined) ?? [];
        const nextEdges = edges.filter(
          (edge) => readField<string>("id", edge.node) !== taskId,
        );

        if (nextEdges.length === edges.length) return existing;

        const sortedEdges = nextEdges.slice().sort((a, b) => {
          const colA = readField<string>("columnId", a.node) ?? "";
          const colB = readField<string>("columnId", b.node) ?? "";
          if (colA !== colB) return colA.localeCompare(colB);

          const posA = readField<number>("position", a.node) ?? 0;
          const posB = readField<number>("position", b.node) ?? 0;
          if (posA !== posB) return posA - posB;

          const idA = readField<string>("id", a.node) ?? "";
          const idB = readField<string>("id", b.node) ?? "";
          return idA.localeCompare(idB);
        });

        return {
          ...existing,
          edges: sortedEdges,
          __typename: "TaskConnection",
        } as StoreObject;
      },
    },
  });

  // Evict the Task entity itself to reduce chances of stale UI.
  const taskStoreId = cache.identify({ __typename: "Task", id: taskId });
  if (taskStoreId) {
    cache.evict({ id: taskStoreId });
    cache.gc();
  }
}

export function useBoardSubscriptionsSync({ boardId }: UseBoardSubscriptionsSyncArgs) {
  const client = useApolloClient();

  useSubscription(TaskCreatedDocument, {
    variables: { boardId: boardId ?? "" },
    skip: !boardId,
    onData: ({ data }) => {
      const task = data.data?.taskCreated;
      if (!task || !boardId) return;

      upsertTaskIntoBoardCache({ client, task });
    },
  });

  useSubscription(TaskUpdatedDocument, {
    variables: { boardId: boardId ?? "" },
    skip: !boardId,
    onData: ({ data }) => {
      const task = data.data?.taskUpdated;
      if (!task || !boardId) return;

      upsertTaskIntoBoardCache({ client, task });
    },
  });

  useSubscription(TaskDeletedDocument, {
    variables: { boardId: boardId ?? "" },
    skip: !boardId,
    onData: ({ data }) => {
      const raw = data.data?.taskDeleted as unknown;
      const taskId =
        typeof raw === "string" ? raw : (raw as { id?: string } | undefined)?.id;
      if (!taskId) return;
      deleteTaskFromBoardCache({ client, taskId });
    },
  });
}
