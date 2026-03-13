"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  UpdateTaskLabelsDocument,
  type UpdateTaskLabelsMutation,
  type UpdateTaskLabelsMutationVariables,
} from "@/graphql/generated/graphql";

type UseUpdateTaskLabelsResult = {
  updateTaskLabels: (params: { taskId: string; labelIds: string[] }) => Promise<void>;
  loading: boolean;
};

export function useUpdateTaskLabels(): UseUpdateTaskLabelsResult {
  const [mutate, { loading }] = useMutation<
    UpdateTaskLabelsMutation,
    UpdateTaskLabelsMutationVariables
  >(UpdateTaskLabelsDocument);

  const updateTaskLabels = useCallback(
    async ({ taskId, labelIds }: { taskId: string; labelIds: string[] }) => {
      if (!labelIds) return;

      await mutate({
        variables: {
          taskId,
          labelIds,
        },
      });
    },
    [mutate],
  );

  return { updateTaskLabels, loading };
}
