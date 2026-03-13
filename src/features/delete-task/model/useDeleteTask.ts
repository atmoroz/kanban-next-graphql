"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  DeleteTaskDocument,
  TasksByColumnDocument,
  type DeleteTaskMutation,
  type DeleteTaskMutationVariables,
  type TasksByColumnQuery,
  type TasksByColumnQueryVariables,
} from "@/graphql/generated/graphql";

type UseDeleteTaskResult = {
  deleteTask: (params: { id: string; columnId: string }) => Promise<void>;
  loading: boolean;
};

export function useDeleteTask(): UseDeleteTaskResult {
  const [mutate, { loading }] = useMutation<
    DeleteTaskMutation,
    DeleteTaskMutationVariables
  >(DeleteTaskDocument);

  const deleteTask = useCallback(
    async ({ id, columnId }: { id: string; columnId: string }) => {
      await mutate({
        variables: { id },
        update(cache, { data }) {
          const success = data?.deleteTask;
          if (!success) return;

          try {
            const existing = cache.readQuery<
              TasksByColumnQuery,
              TasksByColumnQueryVariables
            >({
              query: TasksByColumnDocument,
              variables: { columnId, first: 100 },
            });
            if (!existing?.tasksByColumn) return;

            const nextEdges = existing.tasksByColumn.edges.filter(
              (edge) => edge.node.id !== id,
            );

            cache.writeQuery<TasksByColumnQuery, TasksByColumnQueryVariables>({
              query: TasksByColumnDocument,
              variables: { columnId, first: 100 },
              data: {
                tasksByColumn: {
                  __typename: "TaskConnection",
                  edges: nextEdges,
                  pageInfo: existing.tasksByColumn.pageInfo,
                },
              },
            });
          } catch {
            // query might not be in cache
          }
        },
        context: {
          meta: {
            successMessage: "Task deleted",
          },
        },
      });
    },
    [mutate],
  );

  return { deleteTask, loading };
}
