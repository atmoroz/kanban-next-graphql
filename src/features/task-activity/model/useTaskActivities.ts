"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  TaskActivitiesDocument,
  type TaskActivitiesQuery,
  type TaskActivitiesQueryVariables,
} from "@/graphql/generated/graphql";

type TaskActivity = TaskActivitiesQuery["taskActivities"]["edges"][number]["node"];

type UseTaskActivitiesResult = {
  activities: TaskActivity[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
};

export function useTaskActivities(taskId: string | null): UseTaskActivitiesResult {
  const shouldSkip = !taskId;
  const pageSize = 10;

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, loading, fetchMore } = useQuery<
    TaskActivitiesQuery,
    TaskActivitiesQueryVariables
  >(TaskActivitiesDocument, {
    variables: {
      taskId: taskId ?? "",
      first: pageSize,
      after: null,
    },
    skip: shouldSkip,
    notifyOnNetworkStatusChange: true,
  });

  const activities = useMemo(() => {
    return (data?.taskActivities.edges ?? []).map((edge) => edge.node);
  }, [data]);

  const hasMore = data?.taskActivities.pageInfo.hasNextPage ?? false;

  const loadMore = async () => {
    if (shouldSkip || !hasMore || isLoadingMore) return;

    const endCursor = data?.taskActivities.pageInfo.endCursor;
    if (!endCursor) return;

    setIsLoadingMore(true);

    try {
      await fetchMore({
        variables: {
          taskId: taskId ?? "",
          first: pageSize,
          after: endCursor,
        },
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    activities,
    isLoading: loading && !shouldSkip,
    isLoadingMore,
    hasMore,
    loadMore,
  };
}
