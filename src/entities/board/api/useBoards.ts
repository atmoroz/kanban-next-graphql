"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  BoardsDocument,
  type BoardsQuery,
  type BoardsQueryVariables,
  BoardSortBy,
  SortOrder,
} from "@/graphql/generated/graphql";
import type { UseBoardsResult } from "../model/board.types";
import { mapBoardToSidebar } from "../model/board.mapper";

export function useBoards(): UseBoardsResult {
  const { data, loading } = useQuery<BoardsQuery, BoardsQueryVariables>(BoardsDocument, {
    variables: {
      first: 20,
      sortBy: BoardSortBy.UpdatedAt,
      sortOrder: SortOrder.Desc,
    },
  });

  const boards = useMemo(
    () => data?.boards.edges.map((edge) => mapBoardToSidebar(edge.node)) ?? [],
    [data],
  );

  return { boards, isLoading: loading };
}
