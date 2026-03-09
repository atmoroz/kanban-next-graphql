import type { Column as GqlColumn } from "@/graphql/generated/graphql";

export type BoardColumn = GqlColumn;

export type UseColumnsResult = {
  columns: BoardColumn[];
  isLoading: boolean;
};

export type GqlColumnType = GqlColumn;
