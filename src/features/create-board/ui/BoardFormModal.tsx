"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/shared/ui/modal";
import { CreateBoardForm } from "./CreateBoardForm";
import type { CreateBoardFormValues } from "./CreateBoardForm";
import type { SidebarBoard } from "@/entities/board";
import {
  BoardsDocument,
  CreateBoardDocument,
  UpdateBoardDocument,
  type BoardsQuery,
  type BoardsQueryVariables,
  BoardSortBy,
  SortOrder,
} from "@/graphql/generated/graphql";

const BOARDS_QUERY_VARS: BoardsQueryVariables = {
  first: 20,
  sortBy: BoardSortBy.UpdatedAt,
  sortOrder: SortOrder.Asc,
};

export type BoardFormModalMode = "create" | "edit";

type BoardFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: BoardFormModalMode;
  initialBoard?: SidebarBoard | null;
};

export function BoardFormModal({
  open,
  onClose,
  mode,
  initialBoard,
}: BoardFormModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [createBoard, { loading: createLoading }] = useMutation(CreateBoardDocument, {
    update(cache, { data }) {
      const newBoard = data?.createBoard;
      if (!newBoard) return;
      try {
        const existing = cache.readQuery<BoardsQuery>({
          query: BoardsDocument,
          variables: BOARDS_QUERY_VARS,
        });
        if (!existing?.boards) return;
        cache.writeQuery<BoardsQuery>({
          query: BoardsDocument,
          variables: BOARDS_QUERY_VARS,
          data: {
            ...existing,
            boards: {
              ...existing.boards,
              edges: [
                {
                  __typename: "BoardEdge",
                  cursor: newBoard.id,
                  node: newBoard,
                },
                ...existing.boards.edges,
              ],
            },
          },
        });
      } catch {
        // Query might not be in cache yet
      }
    },
  });

  const [updateBoard, { loading: updateLoading }] = useMutation(UpdateBoardDocument);

  const loading = createLoading || updateLoading;

  const handleSubmit = useCallback(
    async (values: CreateBoardFormValues) => {
      if (mode === "create") {
        const { data } = await createBoard({
          variables: {
            title: values.title,
            description: values.description || undefined,
            visibility: values.visibility,
          },
        });
        const boardId = data?.createBoard?.id;
        if (boardId) {
          const next = new URLSearchParams(searchParams.toString());
          next.set("boardId", boardId);
          router.replace(`${pathname}?${next.toString()}`, { scroll: false });
          onClose();
        }
      } else if (initialBoard) {
        await updateBoard({
          variables: {
            id: initialBoard.id,
            title: values.title,
            description: values.description || undefined,
            visibility: values.visibility,
          },
        });
        onClose();
      }
    },
    [
      mode,
      initialBoard,
      createBoard,
      updateBoard,
      pathname,
      router,
      searchParams,
      onClose,
    ],
  );

  const title = mode === "create" ? "Create board" : "Edit board";
  const submitLabel = mode === "create" ? "Create" : "Save";
  const formKey = mode === "edit" && initialBoard ? initialBoard.id : "create";
  const initialValues =
    mode === "edit" && initialBoard
      ? {
          title: initialBoard.title,
          description: initialBoard.description ?? "",
          visibility: initialBoard.visibility,
        }
      : undefined;

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>
        <CreateBoardForm
          key={formKey}
          onSubmit={handleSubmit}
          isLoading={loading}
          initialValues={initialValues}
          formId={formKey}
        />
      </ModalBody>
      <ModalFooter
        isLoading={loading}
        onOk={() => {
          const form = document.getElementById(
            `board-form-${formKey}`,
          ) as HTMLFormElement | null;
          form?.requestSubmit();
        }}
        onCancel={onClose}
        okText={submitLabel}
        showCancel
      />
    </Modal>
  );
}
