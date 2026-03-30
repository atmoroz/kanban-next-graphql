"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  BoardMembersDocument,
  type BoardMembersQuery,
  type BoardMembersQueryVariables,
  UpdateBoardMemberRoleDocument,
  type UpdateBoardMemberRoleMutation,
  type UpdateBoardMemberRoleMutationVariables,
  type BoardRole,
} from "@/graphql/generated/graphql";

type UseUpdateBoardMemberRoleParams = {
  boardId: string;
};

type UpdateRoleInput = {
  userId: string;
  role: BoardRole;
};

export function useUpdateBoardMemberRole({ boardId }: UseUpdateBoardMemberRoleParams) {
  const [mutate, { loading }] = useMutation<
    UpdateBoardMemberRoleMutation,
    UpdateBoardMemberRoleMutationVariables
  >(UpdateBoardMemberRoleDocument);

  const updateBoardMemberRole = useCallback(
    async ({ userId, role }: UpdateRoleInput) => {
      try {
        await mutate({
          variables: {
            boardId,
            userId,
            role,
          },
          update(cache, { data }) {
            const updated = data?.updateBoardMemberRole;
            if (!updated) return;

            try {
              const existing = cache.readQuery<
                BoardMembersQuery,
                BoardMembersQueryVariables
              >({
                query: BoardMembersDocument,
                variables: { boardId },
              });

              const next = existing?.boardMembers.map((m) => {
                if (m.user.id !== updated.user.id) return m;
                return {
                  ...m,
                  role: updated.role,
                  user: {
                    ...m.user,
                    ...updated.user,
                  },
                };
              });

              cache.writeQuery<
                BoardMembersQuery,
                BoardMembersQueryVariables
              >({
                query: BoardMembersDocument,
                variables: { boardId },
                data: {
                  boardMembers: next ?? [],
                },
              });
            } catch {
              // boardMembers query might not be in cache yet
            }
          },
          context: {
            meta: {
              successMessage: "Role updated",
            },
          },
        });
      } catch {
        // errorLink already handles toasts/redirects.
      }
    },
    [boardId, mutate],
  );

  return { updateBoardMemberRole, loading };
}
