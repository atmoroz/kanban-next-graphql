"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import {
  BoardLabelsDocument,
  CreateLabelDocument,
  type BoardLabelsQuery,
  type BoardLabelsQueryVariables,
  type CreateLabelMutation,
  type CreateLabelMutationVariables,
} from "@/graphql/generated/graphql";

type UseCreateLabelParams = {
  boardId: string;
};

type UseCreateLabelResult = {
  createLabel: (input: { name: string; color: string }) => Promise<void>;
  loading: boolean;
};

export function useCreateLabel({ boardId }: UseCreateLabelParams): UseCreateLabelResult {
  const [mutate, { loading }] = useMutation<
    CreateLabelMutation,
    CreateLabelMutationVariables
  >(CreateLabelDocument);

  const createLabel = useCallback(
    async ({ name, color }: { name: string; color: string }) => {
      const trimmedName = name.trim();
      if (!trimmedName) return;

      const optimisticId = `temp-label-${Date.now()}`;

      try {
        await mutate({
          variables: {
            boardId,
            name: trimmedName,
            color,
          },
          optimisticResponse: {
            __typename: "Mutation",
            createLabel: {
              __typename: "Label",
              id: optimisticId,
              boardId,
              name: trimmedName,
              color,
            },
          },
          update(cache, { data }) {
            const created = data?.createLabel;

            try {
              const existing = cache.readQuery<
                BoardLabelsQuery,
                BoardLabelsQueryVariables
              >({
                query: BoardLabelsDocument,
                variables: { boardId },
              });

              const labels = existing?.boardLabels ?? [];

              const withoutOptimistic = labels.filter((l) => l.id !== optimisticId);

              // For optimistic stage `created.id === optimisticId`, for the real stage `created.id` is the server id.
              const finalLabel =
                created ?? labels.find((l) => l.id === optimisticId) ?? null;
              if (!finalLabel) return;

              cache.writeQuery<BoardLabelsQuery, BoardLabelsQueryVariables>({
                query: BoardLabelsDocument,
                variables: { boardId },
                data: {
                  boardLabels: [...withoutOptimistic, finalLabel],
                },
              });
            } catch {
              // boardLabels might not be in cache yet
            }
          },
          context: {
            meta: {
              successMessage: "Label created",
            },
          },
        });
      } catch (err: unknown) {
        if (!CombinedGraphQLErrors.is(err)) throw err;
      }
    },
    [boardId, mutate],
  );

  return { createLabel, loading };
}
