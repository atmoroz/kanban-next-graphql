"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import {
  MoveTaskDocument,
  type MoveTaskMutation,
  type MoveTaskMutationVariables,
  TasksByColumnDocument,
  type TasksByColumnQuery,
  type TasksByColumnQueryVariables,
} from "@/graphql/generated/graphql";

type MoveTaskParams = {
  id: string;
  sourceColumnId: string;
  targetColumnId: string;
  position?: number | null;
};

type UseMoveTaskResult = {
  moveTask: (params: MoveTaskParams) => Promise<void>;
  loading: boolean;
};

export function useMoveTask(): UseMoveTaskResult {
  const [mutate, { loading }] = useMutation<MoveTaskMutation, MoveTaskMutationVariables>(
    MoveTaskDocument,
  );

  const moveTask = useCallback(
    async ({ id, sourceColumnId, targetColumnId, position }: MoveTaskParams) => {
      try {
        await mutate({
          variables: {
            id,
            columnId: targetColumnId,
            position: position ?? null,
          },
          optimisticResponse: {
            moveTask: {
              __typename: "Task",
              id,
              columnId: targetColumnId,
              position: position ?? 0,
              statusId: "",
              updatedAt: new Date().toISOString(),
            },
          },
          update(cache, _result, { variables, context }) {
            const taskId = variables?.id;
            const destColumnId = variables?.columnId;
            const srcColumnId = (context as any)?.meta?.sourceColumnId as
              | string
              | undefined;

            if (!taskId || !destColumnId || !srcColumnId) return;

            try {
              // Moving within the same column (reorder)
              if (srcColumnId === destColumnId) {
                const data = cache.readQuery<
                  TasksByColumnQuery,
                  TasksByColumnQueryVariables
                >({
                  query: TasksByColumnDocument,
                  variables: { columnId: srcColumnId, first: 100 },
                });
                if (!data?.tasksByColumn) return;

                const edges = [...data.tasksByColumn.edges];
                const fromIndex = edges.findIndex((edge) => edge.node.id === taskId);
                if (fromIndex === -1) return;

                const [movedEdge] = edges.splice(fromIndex, 1);
                // After removal, edges.length = N-1. Inserting at position gives the desired order (including append when position === edges.length).
                const insertIndex =
                  typeof position === "number" &&
                  position >= 0 &&
                  position <= edges.length
                    ? position
                    : fromIndex;

                const nextEdges = [
                  ...edges.slice(0, insertIndex),
                  movedEdge,
                  ...edges.slice(insertIndex),
                ];

                const recomputePositions = (
                  es: TasksByColumnQuery["tasksByColumn"]["edges"],
                ) =>
                  es.map((edge, index) => ({
                    ...edge,
                    node: {
                      ...edge.node,
                      position: index,
                    },
                  }));

                const finalEdges = recomputePositions(nextEdges);

                cache.writeQuery<TasksByColumnQuery, TasksByColumnQueryVariables>({
                  query: TasksByColumnDocument,
                  variables: { columnId: srcColumnId, first: 100 },
                  data: {
                    tasksByColumn: {
                      __typename: "TaskConnection",
                      edges: finalEdges,
                      pageInfo: data.tasksByColumn.pageInfo,
                    },
                  },
                });

                return;
              }

              // Moving between different columns
              const sourceData = cache.readQuery<
                TasksByColumnQuery,
                TasksByColumnQueryVariables
              >({
                query: TasksByColumnDocument,
                variables: { columnId: srcColumnId, first: 100 },
              });
              const destData = cache.readQuery<
                TasksByColumnQuery,
                TasksByColumnQueryVariables
              >({
                query: TasksByColumnDocument,
                variables: { columnId: destColumnId, first: 100 },
              });

              if (!sourceData?.tasksByColumn || !destData?.tasksByColumn) return;

              const sourceEdges = [...sourceData.tasksByColumn.edges];
              const destEdges = [...destData.tasksByColumn.edges];

              const edgeIndex = sourceEdges.findIndex((edge) => edge.node.id === taskId);
              if (edgeIndex === -1) return;

              const [movedEdge] = sourceEdges.splice(edgeIndex, 1);

              const updatedMovedEdge = {
                ...movedEdge,
                node: {
                  ...movedEdge.node,
                  columnId: destColumnId,
                },
              };

              const insertPosition =
                typeof position === "number" &&
                position >= 0 &&
                position <= destEdges.length
                  ? position
                  : 0;

              const nextDestEdges = [
                ...destEdges.slice(0, insertPosition),
                updatedMovedEdge,
                ...destEdges.slice(insertPosition),
              ];

              const recomputePositions = (
                edges: TasksByColumnQuery["tasksByColumn"]["edges"],
              ) =>
                edges.map((edge, index) => ({
                  ...edge,
                  node: {
                    ...edge.node,
                    position: index,
                  },
                }));

              const nextSourceEdges = recomputePositions(sourceEdges);
              const finalDestEdges = recomputePositions(nextDestEdges);

              cache.writeQuery<TasksByColumnQuery, TasksByColumnQueryVariables>({
                query: TasksByColumnDocument,
                variables: { columnId: srcColumnId, first: 100 },
                data: {
                  tasksByColumn: {
                    __typename: "TaskConnection",
                    edges: nextSourceEdges,
                    pageInfo: sourceData.tasksByColumn.pageInfo,
                  },
                },
              });

              cache.writeQuery<TasksByColumnQuery, TasksByColumnQueryVariables>({
                query: TasksByColumnDocument,
                variables: { columnId: destColumnId, first: 100 },
                data: {
                  tasksByColumn: {
                    __typename: "TaskConnection",
                    edges: finalDestEdges,
                    pageInfo: destData.tasksByColumn.pageInfo,
                  },
                },
              });
            } catch {
              // queries might not be in cache
            }
          },
          context: {
            meta: {
              sourceColumnId,
              successMessage: "Task moved",
            },
          },
        });
      } catch (err) {
        // GraphQL errors are already handled in errorLink (toasts).
        // Here we only prevent an Uncaught (in promise) for CombinedGraphQLErrors.
        if (!CombinedGraphQLErrors.is(err)) {
          throw err;
        }
      }
    },
    [mutate],
  );

  return { moveTask, loading };
}
