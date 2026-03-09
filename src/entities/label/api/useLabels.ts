"use client";

import { useQuery } from "@apollo/client/react";
import {
  BoardLabelsDocument,
  type BoardLabelsQuery,
  type BoardLabelsQueryVariables,
} from "@/graphql/generated/graphql";
import type { UseLabelsResult } from "../model/label.types";

export function useLabels(boardId: string | null): UseLabelsResult {
  const shouldSkip = !boardId;

  const { data, loading } = useQuery<BoardLabelsQuery, BoardLabelsQueryVariables>(
    BoardLabelsDocument,
    {
      variables: { boardId: boardId ?? "" },
      skip: shouldSkip,
    },
  );

  return {
    labels: data?.boardLabels ?? [],
    isLoading: loading,
  };
}
