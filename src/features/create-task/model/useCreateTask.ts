"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  CreateTaskDocument,
  TasksByColumnDocument,
  TaskPriority,
  type CreateTaskMutation,
  type CreateTaskMutationVariables,
  type TasksByColumnQuery,
  type TasksByColumnQueryVariables,
} from "@/graphql/generated/graphql";

type UseCreateTaskParams = {
  columnId: string;
};

type UseCreateTaskResult = {
  createTask: (input: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    labelIds?: string[];
    dueDate?: string | null;
  }) => Promise<void>;
  loading: boolean;
};

export function useCreateTask({ columnId }: UseCreateTaskParams): UseCreateTaskResult {
  const [mutate, { loading }] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(CreateTaskDocument);

  const createTask = useCallback(
    async ({
      title,
      description,
      priority,
      labelIds,
      dueDate,
    }: {
      title: string;
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
            statusId: "",
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

          try {
            const existing = cache.readQuery<
              TasksByColumnQuery,
              TasksByColumnQueryVariables
            >({
              query: TasksByColumnDocument,
              variables: { columnId, first: 100 },
            });

            const edges = existing?.tasksByColumn.edges ?? [];

            const withoutOptimistic = edges.filter(
              (edge) => edge.node.id !== optimisticId,
            );
            const finalNode =
              created ??
              edges.find((edge) => edge.node.id === optimisticId)?.node ??
              null;

            const nextEdges = finalNode
              ? [
                  {
                    __typename: "TaskEdge" as const,
                    cursor: optimisticId,
                    node: finalNode,
                  },
                  ...withoutOptimistic,
                ]
              : withoutOptimistic;

            cache.writeQuery<TasksByColumnQuery, TasksByColumnQueryVariables>({
              query: TasksByColumnDocument,
              variables: { columnId, first: 100 },
              data: {
                tasksByColumn: {
                  __typename: "TaskConnection",
                  edges: nextEdges,
                  pageInfo: existing?.tasksByColumn.pageInfo ?? {
                    __typename: "PageInfo",
                    hasNextPage: false,
                    endCursor: null,
                  },
                },
              },
            });
          } catch {}
        },
        context: {
          meta: {
            successMessage: "Task created",
          },
        },
      });
    },
    [columnId, mutate],
  );

  return { createTask, loading };
}
