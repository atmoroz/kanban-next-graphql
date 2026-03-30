import type { BoardPermissions } from "@/graphql/generated/graphql";

export type BoardPermissionKey = keyof BoardPermissions;

export function hasBoardPermission(
  permissions: BoardPermissions | null | undefined,
  key: BoardPermissionKey,
): boolean {
  return Boolean(permissions?.[key]);
}

