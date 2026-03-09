"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  BoardsDocument,
  ColumnsDocument,
  CreateColumnDocument,
  type BoardsQuery,
  type BoardsQueryVariables,
  type ColumnsQuery,
  type ColumnsQueryVariables,
} from "@/graphql/generated/graphql";

type UseCreateColumnParams = {
  boardId: string;
};

type UseCreateColumnResult = {
  createColumn: (title: string) => Promise<void>;
  loading: boolean;
};

export function useCreateColumn({
  boardId,
}: UseCreateColumnParams): UseCreateColumnResult {
  const [mutate, { loading }] = useMutation(CreateColumnDocument);

  const createColumn = useCallback(
    async (title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      const optimisticId = `temp-column-${Date.now()}`;
      const now = new Date().toISOString();

      await mutate({
        variables: { boardId, title: trimmed },
        optimisticResponse: {
          createColumn: {
            __typename: "Column",
            id: optimisticId,
            boardId,
            title: trimmed,
            position: 0,
            statusId: "",
            createdAt: now,
            updatedAt: now,
          },
        },
        update(cache, { data }) {
          const created = data?.createColumn;
          try {
            const existing = cache.readQuery<ColumnsQuery, ColumnsQueryVariables>({
              query: ColumnsDocument,
              variables: { boardId },
            });

            const columns = existing?.columns ?? [];

            const withoutOptimistic = columns.filter((c) => c.id !== optimisticId);
            const finalColumn = created ?? columns.find((c) => c.id === optimisticId);

            const nextColumns = finalColumn
              ? [...withoutOptimistic, finalColumn].sort(
                  (a, b) => a.position - b.position,
                )
              : withoutOptimistic;

            cache.writeQuery<ColumnsQuery, ColumnsQueryVariables>({
              query: ColumnsDocument,
              variables: { boardId },
              data: { columns: nextColumns },
            });
          } catch {
            // Columns query might not be in cache yet
          }

          try {
            const boardsData = cache.readQuery<BoardsQuery, BoardsQueryVariables>({
              query: BoardsDocument,
            });
            if (!boardsData?.boards) return;
            cache.writeQuery<BoardsQuery, BoardsQueryVariables>({
              query: BoardsDocument,
              data: boardsData,
            });
          } catch {
            // Boards query might not be in cache; safe to ignore
          }
        },
        context: {
          meta: {
            successMessage: "Column created",
          },
        },
      });
    },
    [boardId, mutate],
  );

  return { createColumn, loading };
}
