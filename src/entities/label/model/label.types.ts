import type { Label as GqlLabel } from "@/graphql/generated/graphql";

export type BoardLabel = GqlLabel;

export type UseLabelsResult = {
  labels: BoardLabel[];
  isLoading: boolean;
};

