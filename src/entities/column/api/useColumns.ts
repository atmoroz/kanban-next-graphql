"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  ColumnsDocument,
  type ColumnsQuery,
  type ColumnsQueryVariables,
} from "@/graphql/generated/graphql";
import type { UseColumnsResult } from "../model/column.types";

export function useColumns(boardId: string | null): UseColumnsResult {
  const shouldSkip = !boardId;

  const { data, loading } = useQuery<ColumnsQuery, ColumnsQueryVariables>(
    ColumnsDocument,
    {
      variables: { boardId: boardId ?? "" },
      skip: shouldSkip,
    },
  );

  const columns = useMemo(
    () => (data?.columns ?? []).sort((a, b) => a.position - b.position),
    [data],
  );

  return { columns, isLoading: loading && !shouldSkip };
}
