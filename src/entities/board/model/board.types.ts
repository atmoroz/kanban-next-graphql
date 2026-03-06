export type SidebarBoard = {
  id: string;
  title: string;
  visibility: "PUBLIC" | "PRIVATE";
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

