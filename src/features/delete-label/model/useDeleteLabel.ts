"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import {
  BoardLabelsDocument,
  DeleteLabelDocument,
  type BoardLabelsQuery,
  type BoardLabelsQueryVariables,
} from "@/graphql/generated/graphql";

export function useDeleteLabel(boardId: string) {
  const [mutate, { loading }] = useMutation(DeleteLabelDocument, {
    update(cache, _, { variables }) {
      const id = variables?.id;
      if (!id) return;

      try {
        const existing = cache.readQuery<BoardLabelsQuery, BoardLabelsQueryVariables>({
          query: BoardLabelsDocument,
          variables: { boardId },
        });
        if (!existing?.boardLabels) return;

        const nextLabels = existing.boardLabels.filter((label) => label.id !== id);

        cache.writeQuery<BoardLabelsQuery, BoardLabelsQueryVariables>({
          query: BoardLabelsDocument,
          variables: { boardId },
          data: { boardLabels: nextLabels },
        });
      } catch {
        // boardLabels might not be in cache
      }
    },
  });

  const deleteLabel = useCallback(
    async (labelId: string) => {
      try {
        await mutate({
          variables: { id: labelId },
          optimisticResponse: {
            deleteLabel: true,
          },
        });
      } catch (err: unknown) {
        if (!CombinedGraphQLErrors.is(err)) throw err;
      }
    },
    [mutate],
  );

  return { deleteLabel, isLoading: loading };
}

