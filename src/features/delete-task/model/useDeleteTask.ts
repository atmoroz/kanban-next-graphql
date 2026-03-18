"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  DeleteTaskDocument,
  TasksByBoardDocument,
  type DeleteTaskMutation,
  type DeleteTaskMutationVariables,
  type TasksByBoardQueryVariables,
} from "@/graphql/generated/graphql";

type UseDeleteTaskResult = {
  deleteTask: (params: { id: string; boardId?: string | null }) => Promise<void>;
  loading: boolean;
};

export function useDeleteTask(): UseDeleteTaskResult {
  const [mutate, { loading }] = useMutation<
    DeleteTaskMutation,
    DeleteTaskMutationVariables
  >(DeleteTaskDocument);

  const deleteTask = useCallback(
    async ({ id, boardId }: { id: string; boardId?: string | null }) => {
      await mutate({
        variables: { id },
        update(cache, { data }) {
          const success = data?.deleteTask;
          if (!success) return;
        },
        refetchQueries: boardId
          ? [
              {
                query: TasksByBoardDocument,
                variables: {
                  boardId,
                  first: 100,
                } satisfies TasksByBoardQueryVariables,
              },
            ]
          : undefined,
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
