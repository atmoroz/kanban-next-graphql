"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
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

      try {
        await mutate({
          variables: { id, title: trimmed },
          context: {
            meta: {
              successMessage: "Column updated",
            },
          },
        });
      } catch (err: unknown) {
        if (!CombinedGraphQLErrors.is(err)) throw err;
      }
    },
    [mutate],
  );

  return { updateColumn, loading };
}

