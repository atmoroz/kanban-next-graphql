"use client";

import { useCallback } from "react";
import { gql } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { useMutation } from "@apollo/client/react";
import {
  BoardMembersDocument,
  type BoardMembersQuery,
  type BoardMembersQueryVariables,
} from "@/graphql/generated/graphql";

const RemoveBoardMemberDocument = gql`
  mutation RemoveBoardMember($boardId: ID!, $userId: ID!) {
    removeBoardMember(boardId: $boardId, userId: $userId)
  }
`;

type UseRemoveBoardMemberParams = {
  boardId: string;
};

type UseRemoveBoardMemberResult = {
  removeBoardMember: (params: { userId: string }) => Promise<void>;
  loading: boolean;
};

export function useRemoveBoardMember({
  boardId,
}: UseRemoveBoardMemberParams): UseRemoveBoardMemberResult {
  const [mutate, { loading }] = useMutation<
    { removeBoardMember: boolean },
    { boardId: string; userId: string }
  >(RemoveBoardMemberDocument);

  const removeBoardMember = useCallback(
    async ({ userId }: { userId: string }) => {
      try {
        await mutate({
          variables: { boardId, userId },
          context: {
            meta: {
              successMessage: "Member removed",
            },
          },
          update(cache, { data }) {
            if (!data?.removeBoardMember) return;

            try {
              const existing = cache.readQuery<
                BoardMembersQuery,
                BoardMembersQueryVariables
              >({
                query: BoardMembersDocument,
                variables: { boardId },
              });

              const next =
                existing?.boardMembers.filter((m) => m.user.id !== userId) ?? [];

              cache.writeQuery<BoardMembersQuery, BoardMembersQueryVariables>({
                query: BoardMembersDocument,
                variables: { boardId },
                data: {
                  boardMembers: next,
                },
              });
            } catch {
              // boardMembers query might not be in cache yet
            }
          },
        });
      } catch (err: unknown) {
        if (!CombinedGraphQLErrors.is(err)) throw err;
      }
    },
    [boardId, mutate],
  );

  return { removeBoardMember, loading };
}
