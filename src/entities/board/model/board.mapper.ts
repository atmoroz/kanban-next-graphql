import type { Board as GqlBoard } from "@/graphql/generated/graphql";
import type { SidebarBoard } from "./board.types";

export function mapBoardToSidebar(board: GqlBoard): SidebarBoard {
  return {
    id: board.id,
    title: board.title,
    visibility: board.visibility,
    // TODO: заменить на реальное число задач, когда появятся связанные данные
    tasksCount: 0,
  };
}

