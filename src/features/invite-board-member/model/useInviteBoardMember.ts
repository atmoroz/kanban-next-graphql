"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import {
  PendingInvitesDocument,
  type PendingInvitesQuery,
  type PendingInvitesQueryVariables,
  InviteByEmailDocument,
  type InviteByEmailMutation,
  type InviteByEmailMutationVariables,
  type BoardRole,
  InviteStatus,
} from "@/graphql/generated/graphql";

type UseInviteBoardMemberParams = {
  boardId: string;
};

type InviteByEmailInput = {
  email: string;
  role: BoardRole;
};

type UseInviteBoardMemberResult = {
  inviteByEmail: (input: InviteByEmailInput) => Promise<void>;
  loading: boolean;
};

export function useInviteBoardMember({
  boardId,
}: UseInviteBoardMemberParams): UseInviteBoardMemberResult {
  const [mutate, { loading }] = useMutation<
    InviteByEmailMutation,
    InviteByEmailMutationVariables
  >(InviteByEmailDocument);

  const inviteByEmail = useCallback(
    async ({ email, role }: InviteByEmailInput) => {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) return;

      const optimisticId = `temp-invite-${Date.now()}`;

      try {
        await mutate({
          variables: {
            boardId,
            email: trimmedEmail,
            role,
          },
          optimisticResponse: {
            __typename: "Mutation",
            inviteByEmail: {
              __typename: "PendingInvite",
              id: optimisticId,
              email: trimmedEmail,
              role,
              status: InviteStatus.Pending,
            },
          },
          update(cache, { data }) {
            const created = data?.inviteByEmail;
            if (!created) return;

            const variables: PendingInvitesQueryVariables = { boardId };

            try {
              const existing = cache.readQuery<
                PendingInvitesQuery,
                PendingInvitesQueryVariables
              >({
                query: PendingInvitesDocument,
                variables,
              });

              const prev = existing?.pendingInvites ?? [];

              const next = [
                ...prev.filter(
                  (i) => i.id !== created.id && i.id !== optimisticId,
                ),
                created,
              ];

              cache.writeQuery<
                PendingInvitesQuery,
                PendingInvitesQueryVariables
              >({
                query: PendingInvitesDocument,
                variables,
                data: {
                  pendingInvites: next,
                },
              });
            } catch {
              // pendingInvites query might not be in cache yet
            }
          },
          context: {
            meta: {
              successMessage: "Invitation sent",
            },
          },
        });
      } catch {
        // errorLink already handles toasts/redirects.
      }
    },
    [boardId, mutate],
  );

  return { inviteByEmail, loading };
}
