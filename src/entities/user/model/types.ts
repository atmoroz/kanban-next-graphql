/** Текущий пользователь (ответ me, auth payload и т.д.) */
import type { MeQuery } from "@/graphql/generated/graphql";

export type MeUser = NonNullable<MeQuery["me"]>;
