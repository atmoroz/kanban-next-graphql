/** Current user (from me query / auth payload etc.) */
import type { MeQuery } from "@/graphql/generated/graphql";

export type MeUser = NonNullable<MeQuery["me"]>;
