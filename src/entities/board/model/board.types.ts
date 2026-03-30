import type { BoardPermissions } from "@/graphql/generated/graphql";
import { BoardVisibility } from "@/graphql/generated/graphql";

export type SidebarBoard = {
  id: string;
  title: string;
  description?: string | null;
  visibility: BoardVisibility;
  permissions: BoardPermissions;
  tasksCount: number;
};

export type UseBoardsResult = {
  boards: SidebarBoard[];
  isLoading: boolean;
};

export type BoardsSidebarProps = {
  boards: SidebarBoard[];
  selectedBoardId: string | null;
  onSelectBoard: (id: string) => void;
  isLoading?: boolean;
};
