"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import {
  MoveTaskDocument,
  type MoveTaskMutation,
  type MoveTaskMutationVariables,
  TasksByBoardDocument,
} from "@/graphql/generated/graphql";

type TaskLikeNode = {
  id: string;
  columnId: string;
  position?: number | null;
};

function normalizeBoardQuery(query: string | undefined) {
  return query?.trim() || undefined;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function byPositionThenId(
  a: { position?: number | null; id: string },
  b: { position?: number | null; id: string },
) {
  const posA = a.position ?? 0;
  const posB = b.position ?? 0;
  if (posA !== posB) return posA - posB;
  return a.id.localeCompare(b.id);
}

function getSortedColumnNodes(allNodes: TaskLikeNode[], columnId: string) {
  return allNodes
    .filter((n) => n.columnId === columnId)
    .slice()
    .sort(byPositionThenId);
}

function renumberPositions(nodes: TaskLikeNode[]) {
  nodes.forEach((n, index) => {
    n.position = index;
  });
}

function reorderWithinColumnOnCardDrop(args: {
  allNodes: TaskLikeNode[];
  columnId: string;
  movedId: string;
  hoverIndexRaw?: number;
}): boolean {
  const { allNodes, columnId, movedId, hoverIndexRaw } = args;
  const nodes = getSortedColumnNodes(allNodes, columnId);

  const fromIndex = nodes.findIndex((n) => n.id === movedId);
  if (fromIndex === -1) return false;

  const hoverIndex =
    hoverIndexRaw !== undefined
      ? clamp(hoverIndexRaw, 0, nodes.length - 1)
      : nodes.length - 1;

  // Drop is "on card", not "between cards":
  // dragging up  -> insert before hovered card
  // dragging down -> insert after hovered card
  let insertIndex = hoverIndex > fromIndex ? hoverIndex + 1 : hoverIndex;
  insertIndex = clamp(insertIndex, 0, nodes.length);

  const next = [...nodes];
  const [removed] = next.splice(fromIndex, 1);

  if (insertIndex > fromIndex) {
    insertIndex -= 1;
  }
  // If index is the same after normalization, there's no reordering to apply.
  // Still re-number positions to keep them consistent (avoids duplicates).
  if (insertIndex === fromIndex) {
    renumberPositions(nodes);
    return true;
  }
  next.splice(insertIndex, 0, removed);
  renumberPositions(next);
  return true;
}

function moveBetweenColumns(args: {
  allNodes: TaskLikeNode[];
  fromColumnId: string;
  toColumnId: string;
  movedId: string;
  hoverIndexRaw?: number;
}): boolean {
  const { allNodes, fromColumnId, toColumnId, movedId, hoverIndexRaw } = args;
  const sourceNodes = getSortedColumnNodes(allNodes, fromColumnId);
  const targetNodes = getSortedColumnNodes(allNodes, toColumnId);

  const fromIndex = sourceNodes.findIndex((n) => n.id === movedId);
  if (fromIndex === -1) return false;

  const updatedSource = [...sourceNodes];
  const [removed] = updatedSource.splice(fromIndex, 1);
  removed.columnId = toColumnId;

  const insertIndex =
    hoverIndexRaw !== undefined
      ? clamp(hoverIndexRaw, 0, targetNodes.length)
      : targetNodes.length;

  const updatedTarget = [...targetNodes];
  updatedTarget.splice(insertIndex, 0, removed);

  renumberPositions(updatedSource);
  renumberPositions(updatedTarget);
  return true;
}

function rebuildEdgesWithSortedNodes<T extends { node: TaskLikeNode }>(
  edges: T[],
  allNodes: TaskLikeNode[],
) {
  const edgeById = new Map<string, T>();
  edges.forEach((edge) => edgeById.set(edge.node.id, edge));

  const sortedNodes = allNodes.slice().sort((a, b) => {
    if (a.columnId !== b.columnId) {
      return a.columnId.localeCompare(b.columnId);
    }
    return byPositionThenId(a, b);
  });

  return sortedNodes.flatMap((node) => {
    const original = edgeById.get(node.id);
    if (!original) return [];
    return [{ ...original, node }];
  });
}

type MoveTaskParams = {
  id: string;
  sourceColumnId: string;
  targetColumnId: string;
  position?: number | null;
  boardId: string;
  searchQuery: string;
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
    async ({
      id,
      sourceColumnId,
      targetColumnId,
      position,
      boardId,
      searchQuery,
    }: MoveTaskParams) => {
      try {
        await mutate({
          variables: {
            id,
            columnId: targetColumnId,
            position: position ?? null,
          },
          context: {
            meta: {
              sourceColumnId,
              boardId,
              query: searchQuery,
              successMessage: "Task moved",
            },
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
            const targetColumnId = variables?.columnId;
            const { boardId, query, sourceColumnId } =
              (
                context as {
                  meta: { boardId: string; query: string; sourceColumnId: string };
                }
              )?.meta ?? {};

            if (!taskId || !targetColumnId || !boardId) return;
            try {
              const normalizedQuery = normalizeBoardQuery(query);
              const cacheKeyVars = {
                boardId,
                query: normalizedQuery,
                first: 100,
              };

              const data = cache.readQuery({
                query: TasksByBoardDocument,
                variables: cacheKeyVars,
              });
              if (!data?.tasksByBoard) return;

              // Clone edges/nodes so we can safely mutate positions and columnId locally
              const edges = data.tasksByBoard.edges.map((edge) => ({
                ...edge,
                node: { ...edge.node },
              }));

              const allNodes = edges.map((e) => e.node);
              const movedNode = allNodes.find((n) => n.id === taskId);
              if (!movedNode) return;

              const hoverIndexRaw =
                typeof position === "number" && position >= 0 ? position : undefined;

              if (sourceColumnId === targetColumnId) {
                const changed = reorderWithinColumnOnCardDrop({
                  allNodes,
                  columnId: sourceColumnId,
                  movedId: movedNode.id,
                  hoverIndexRaw,
                });
                if (!changed) return;
              } else {
                const changed = moveBetweenColumns({
                  allNodes,
                  fromColumnId: sourceColumnId,
                  toColumnId: targetColumnId,
                  movedId: movedNode.id,
                  hoverIndexRaw,
                });
                if (!changed) return;
              }

              const nextEdges = rebuildEdgesWithSortedNodes(edges, allNodes);
              cache.writeQuery({
                query: TasksByBoardDocument,
                variables: cacheKeyVars,
                data: {
                  tasksByBoard: {
                    ...data.tasksByBoard,
                    edges: nextEdges,
                  },
                },
              });
            } catch {
              // ignore
            }
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
