"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  TasksByColumnDocument,
  type TasksByColumnQuery,
  type TasksByColumnQueryVariables,
} from "@/graphql/generated/graphql";
import type { BoardTask } from "../model/task.types";

export type UseTasksByColumnResult = {
  tasks: BoardTask[];
  isLoading: boolean;
};

export function useTasksByColumn(columnId: string | null): UseTasksByColumnResult {
  const shouldSkip = !columnId;

  const { data, loading } = useQuery<TasksByColumnQuery, TasksByColumnQueryVariables>(
    TasksByColumnDocument,
    {
      variables: { columnId: columnId ?? "", first: 100 },
      skip: shouldSkip,
    },
  );

  const tasks: BoardTask[] = useMemo(
    () =>
      (data?.tasksByColumn.edges ?? [])
        .map((edge) => edge.node)
        .slice()
        .sort((a, b) => a.position - b.position),
    [data],
  );

  return { tasks, isLoading: loading && !shouldSkip };
}

