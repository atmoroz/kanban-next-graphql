export type SidebarBoard = {
  id: string;
  title: string;
  visibility: "PUBLIC" | "PRIVATE";
  tasksCount: number;
};

export type BoardsSidebarProps = {
  boards: SidebarBoard[];
  selectedBoardId: string | null;
  onSelectBoard: (id: string) => void;
};
