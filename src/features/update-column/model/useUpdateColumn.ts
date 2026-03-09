"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { UpdateColumnDocument } from "@/graphql/generated/graphql";

type UseUpdateColumnResult = {
  updateColumn: (id: string, title: string) => Promise<void>;
  loading: boolean;
};

export function useUpdateColumn(): UseUpdateColumnResult {
  const [mutate, { loading }] = useMutation(UpdateColumnDocument);

  const updateColumn = useCallback(
    async (id: string, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      await mutate({
        variables: { id, title: trimmed },
        context: {
          meta: {
            successMessage: "Column updated",
          },
        },
      });
    },
    [mutate],
  );

  return { updateColumn, loading };
}

