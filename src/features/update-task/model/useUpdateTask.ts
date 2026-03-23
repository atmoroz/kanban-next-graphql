"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import {
  UpdateTaskDocument,
  type UpdateTaskMutation,
  type UpdateTaskMutationVariables,
  type TaskPriority,
  TaskActivitiesDocument,
} from "@/graphql/generated/graphql";

type UpdateTaskInput = {
  id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
};

type UseUpdateTaskResult = {
  updateTask: (input: UpdateTaskInput) => Promise<void>;
  loading: boolean;
};

export function useUpdateTask(): UseUpdateTaskResult {
  const [mutate, { loading }] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(UpdateTaskDocument);

  const updateTask = useCallback(
    async ({
      id,
      title,
      description,
      priority,
      dueDate,
      assigneeId,
    }: UpdateTaskInput) => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return;

      const dueDateIso = dueDate ? new Date(dueDate).toISOString() : null;

      try {
        await mutate({
          variables: {
            id,
            title: trimmedTitle,
            description: description?.trim() || undefined,
            priority,
            dueDate: dueDateIso ?? undefined,
            assigneeId: assigneeId ?? null,
          },
          refetchQueries: [
            {
              query: TaskActivitiesDocument,
              variables: {
                taskId: id,
                first: 10,
                after: null,
              },
            },
          ],
          context: {
            meta: {
              successMessage: "Task updated",
            },
          },
        });
      } catch (err: unknown) {
        // errorLink already triggers toasts; prevent Next runtime overlay.
        if (!CombinedGraphQLErrors.is(err)) throw err;
      }
    },
    [mutate],
  );

  return { updateTask, loading };
}
