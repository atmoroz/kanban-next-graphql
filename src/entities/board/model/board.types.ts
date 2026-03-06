import { BoardVisibility } from "@/graphql/generated/graphql";

export type SidebarBoard = {
  id: string;
  title: string;
  visibility: BoardVisibility;
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
