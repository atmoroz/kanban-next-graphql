import type { MeQuery } from "@/graphql/generated/graphql";

export type MeUser = NonNullable<MeQuery["me"]>;
