"use client";

import { useQuery } from "@apollo/client/react";
import {
  BoardMembersDocument,
  PendingInvitesDocument,
  type BoardMembersQuery,
  type BoardMembersQueryVariables,
  type PendingInvitesQuery,
  type PendingInvitesQueryVariables,
} from "@/graphql/generated/graphql";

type UseBoardInvitesParams = {
  boardId: string | null;
};

export function useBoardInvites({ boardId }: UseBoardInvitesParams) {
  const { data: pendingData, loading: pendingLoading } = useQuery<
    PendingInvitesQuery,
    PendingInvitesQueryVariables
  >(PendingInvitesDocument, {
    variables: { boardId: boardId ?? "" },
    skip: !boardId,
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  });

  const { data: membersData, loading: membersLoading } = useQuery<
    BoardMembersQuery,
    BoardMembersQueryVariables
  >(BoardMembersDocument, {
    variables: { boardId: boardId ?? "" },
    skip: !boardId,
    fetchPolicy: "network-only",
    errorPolicy: "ignore",
  });

  const pendingInvites = pendingData?.pendingInvites ?? [];
  const boardMembers = membersData?.boardMembers ?? [];

  return {
    pendingInvites,
    boardMembers,
    isLoading: pendingLoading || membersLoading,
  };
}
