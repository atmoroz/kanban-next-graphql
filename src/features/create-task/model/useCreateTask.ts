"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import {
  CreateTaskDocument,
  TasksByBoardDocument,
  TaskPriority,
  type CreateTaskMutation,
  type CreateTaskMutationVariables,
  type TasksByBoardQueryVariables,
  type TasksByBoardQuery,
} from "@/graphql/generated/graphql";

type UseCreateTaskParams = {
  columnId: string;
  boardId?: string | null;
};

type UseCreateTaskResult = {
  createTask: (input: {
    title: string;
    statusId: string;
    columnId: string;
    description?: string;
    priority?: TaskPriority;
    labelIds?: string[];
    dueDate?: string | null;
    assigneeId?: string | null;
  }) => Promise<void>;
  loading: boolean;
};

export function useCreateTask({ boardId }: UseCreateTaskParams): UseCreateTaskResult {
  const [mutate, { loading }] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(CreateTaskDocument);

  const createTask = useCallback(
    async ({
      title,
      statusId,
      columnId,
      description,
      priority,
      labelIds,
      dueDate,
      assigneeId,
    }: {
      title: string;
      statusId: string;
      columnId: string;
      description?: string;
      priority?: TaskPriority;
      labelIds?: string[];
      dueDate?: string | null;
      assigneeId?: string | null;
    }) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      const optimisticId = `temp-task-${Date.now()}`;
      const now = new Date().toISOString();
      const defaultPriority: TaskPriority = TaskPriority.Medium;
      const finalPriority: TaskPriority = priority ?? defaultPriority;
      const dueDateIso = dueDate ? new Date(dueDate).toISOString() : null;

      try {
        await mutate({
          variables: {
            columnId,
            title: trimmed,
            description: description?.trim() || undefined,
            priority: finalPriority,
            dueDate: dueDateIso ?? undefined,
            labelIds: labelIds ?? undefined,
            assigneeId: assigneeId ?? null,
          },
          optimisticResponse: {
            __typename: "Mutation",
            createTask: {
              __typename: "Task",
              id: optimisticId,
              columnId,
              title: trimmed,
              description: description?.trim() || null,
              priority: finalPriority,
              statusId: statusId,
              labelIds: labelIds ?? [],
              dueDate: dueDateIso,
              assigneeId: assigneeId ?? null,
              position: 0,
              createdAt: now,
              updatedAt: now,
            },
          },
          update(cache, { data }) {
            const created = data?.createTask;

            if (!boardId) return;

            try {
              const variables = {
                boardId,
                first: 100,
                query: undefined,
              } satisfies TasksByBoardQueryVariables;

              const existing = cache.readQuery<
                TasksByBoardQuery,
                TasksByBoardQueryVariables
              >({
                query: TasksByBoardDocument,
                variables,
              });

              const edges = existing?.tasksByBoard.edges ?? [];
              const withoutOptimistic = edges.filter(
                (edge) => edge.node.id !== optimisticId,
              );

              const finalNode =
                created ??
                edges.find((edge) => edge.node.id === optimisticId)?.node ??
                null;

              if (!finalNode) return;

              const nextEdges = [
                {
                  __typename: "TaskEdge" as const,
                  cursor: finalNode.id,
                  node: finalNode,
                },
                ...withoutOptimistic,
              ];

              // Prevent duplicates when both optimistic update and subscription
              // (taskCreated) try to insert the same task.
              const seen = new Set<string>();
              const dedupedEdges = nextEdges.filter((edge) => {
                const nodeId = edge.node.id;
                if (seen.has(nodeId)) return false;
                seen.add(nodeId);
                return true;
              });

              cache.writeQuery<TasksByBoardQuery, TasksByBoardQueryVariables>({
                query: TasksByBoardDocument,
                variables,
                data: {
                  tasksByBoard: {
                    __typename: "TaskConnection",
                    edges: dedupedEdges,
                    pageInfo: existing?.tasksByBoard.pageInfo ?? {
                      __typename: "PageInfo",
                      hasNextPage: false,
                      hasPreviousPage: false,
                      startCursor: null,
                      endCursor: null,
                    },
                  },
                },
              });
            } catch {
              // ignore
            }
          },
          context: {
            meta: {
              successMessage: "Task created",
            },
          },
        });
      } catch (err: unknown) {
        // errorLink already triggers toasts; prevent Next runtime overlay.
        if (!CombinedGraphQLErrors.is(err)) throw err;
      }
    },
    [boardId, mutate],
  );

  return { createTask, loading };
}
