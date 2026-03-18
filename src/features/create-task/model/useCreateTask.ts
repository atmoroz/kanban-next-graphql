"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
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
    }: {
      title: string;
      statusId: string;
      columnId: string;
      description?: string;
      priority?: TaskPriority;
      labelIds?: string[];
      dueDate?: string | null;
    }) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      const optimisticId = `temp-task-${Date.now()}`;
      const now = new Date().toISOString();
      const defaultPriority: TaskPriority = TaskPriority.Medium;
      const finalPriority: TaskPriority = priority ?? defaultPriority;
      const dueDateIso = dueDate ? new Date(dueDate).toISOString() : null;

      await mutate({
        variables: {
          columnId,
          title: trimmed,
          description: description?.trim() || undefined,
          priority: finalPriority,
          dueDate: dueDateIso ?? undefined,
          labelIds: labelIds ?? undefined,
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
            assigneeId: null,
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

            cache.writeQuery<TasksByBoardQuery, TasksByBoardQueryVariables>({
              query: TasksByBoardDocument,
              variables,
              data: {
                tasksByBoard: {
                  __typename: "TaskConnection",
                  edges: nextEdges,
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
    },
    [boardId, mutate],
  );

  return { createTask, loading };
}
