"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import type {
  TasksByBoardQuery,
  TasksByBoardQueryVariables,
} from "@/graphql/generated/graphql";
import { TasksByBoardDocument } from "@/graphql/generated/graphql";
import type { BoardTask, TasksByColumn } from "../model/task.types";
import { groupTasksByColumn } from "../model/task.types";
import { mapTasks } from "../model/task.mapper";

export type UseBoardTasksResult = {
  tasksByColumn: TasksByColumn;
  isLoading: boolean;
};

export type UseBoardTasksArgs = {
  boardId: string | null;
  query?: string;
  first?: number;
  skip?: boolean;
};

export function useBoardTasks({
  boardId,
  query,
  first = 50,
  skip = false,
}: UseBoardTasksArgs): UseBoardTasksResult {
  const shouldSkip = !boardId || skip;

  const { data, loading, previousData } = useQuery<
    TasksByBoardQuery,
    TasksByBoardQueryVariables
  >(TasksByBoardDocument, {
    variables: {
      boardId: boardId ?? "",
      query: query?.trim() || undefined,
      first,
    },
    skip: shouldSkip,
    fetchPolicy: "cache-and-network",
    returnPartialData: true,
    notifyOnNetworkStatusChange: true,
  });
  const safeData = data ?? previousData;
  const flatTasks = useMemo(
    () => mapTasks(safeData?.tasksByBoard?.edges, boardId ?? ""),
    [safeData, boardId],
  );

  const tasksByColumn = useMemo(() => groupTasksByColumn(flatTasks), [flatTasks]);

  return {
    tasksByColumn,
    isLoading: loading && !safeData,
  };
}
