"use client";

import { useQuery } from "@apollo/client/react";
import {
  BoardMembersDocument,
  type BoardMembersQuery,
  type BoardMembersQueryVariables,
} from "@/graphql/generated/graphql";

type UseBoardMembersResult = {
  members: BoardMembersQuery["boardMembers"];
  loading: boolean;
};

export function useBoardMembers(boardId: string): UseBoardMembersResult {
  const { data, loading } = useQuery<BoardMembersQuery, BoardMembersQueryVariables>(
    BoardMembersDocument,
    {
      variables: { boardId },
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
      returnPartialData: false,
    },
  );

  const members = (data?.boardMembers ?? []).filter(
    (m): m is NonNullable<BoardMembersQuery["boardMembers"][number]> =>
      Boolean(m && m.role && m.user?.id),
  );

  return {
    members,
    loading,
  };
}
