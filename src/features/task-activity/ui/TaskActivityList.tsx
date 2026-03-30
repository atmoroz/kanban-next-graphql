"use client";

import { useEffect, useRef } from "react";
import type { TaskActivitiesQuery } from "@/graphql/generated/graphql";
import { Clock, User } from "lucide-react";

type TaskActivity = TaskActivitiesQuery["taskActivities"]["edges"][number]["node"];

type TaskActivityListProps = {
  activities: TaskActivity[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
};

const skeleton = (key: number) => (
  <li key={`activity-skeleton-${key}`} className="flex items-start justify-between gap-3">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="h-4 w-4 rounded-full bg-muted animate-pulse" />
        <span className="h-3 w-36 rounded bg-muted animate-pulse" />
      </div>
      <div className="ml-6 h-3 w-32 rounded bg-muted animate-pulse" />
    </div>
    <div className="shrink-0 h-3 w-24 rounded bg-muted animate-pulse" />
  </li>
);
export function TaskActivityList({
  activities,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
}: TaskActivityListProps) {
  const loadMoreRef = useRef<HTMLLIElement | null>(null);

  const stateRef = useRef({
    hasMore,
    isLoading,
    isLoadingMore,
    onLoadMore,
  });

  useEffect(() => {
    stateRef.current = {
      hasMore,
      isLoading,
      isLoadingMore,
      onLoadMore,
    };
  }, [hasMore, isLoading, isLoadingMore, onLoadMore]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        const { hasMore, isLoading, isLoadingMore, onLoadMore } = stateRef.current;

        if (!hasMore || !onLoadMore || isLoading || isLoadingMore) return;

        onLoadMore();
      },
      {
        root: loadMoreRef.current?.closest("ul"),
        rootMargin: "40px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  if (!activities.length && !isLoading) {
    return (
      <div className="mt-2 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        No activity yet for this task.
      </div>
    );
  }
  return (
    <div className="mt-2 space-y-2 px-3 py-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground">
        <Clock className="size-4" />
        Activity
      </div>
      <ul className="space-y-1 text-xs text-muted-foreground max-h-[120px] overflow-y-auto">
        {isLoading &&
          activities.length === 0 &&
          Array.from({ length: 4 }).map((_, idx) => skeleton(idx))}
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <User className="size-4" />
                {activity.actor?.email ?? "System"}
              </div>
              <div className="ml-6 text-[11px]">
                {activity.action}
                {activity.diff ? ` — ${activity.diff}` : ""}
              </div>
            </div>
            <div className="shrink-0 text-[11px] text-muted-foreground/80">
              {new Date(activity.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
        <li ref={loadMoreRef} className="h-1" />
        {isLoadingMore && skeleton(1090)}
      </ul>
    </div>
  );
}
