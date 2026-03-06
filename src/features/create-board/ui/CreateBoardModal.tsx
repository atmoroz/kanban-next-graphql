"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/shared/ui/modal";
import { CreateBoardForm } from "./CreateBoardForm";
import type { CreateBoardFormValues } from "./CreateBoardForm";
import {
  BoardsDocument,
  CreateBoardDocument,
  type BoardsQuery,
  type BoardsQueryVariables,
  BoardSortBy,
  SortOrder,
} from "@/graphql/generated/graphql";

const BOARDS_QUERY_VARS: BoardsQueryVariables = {
  first: 20,
  sortBy: BoardSortBy.UpdatedAt,
  sortOrder: SortOrder.Desc,
};

type CreateBoardModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateBoardModal({ open, onClose }: CreateBoardModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [createBoard, { loading }] = useMutation(CreateBoardDocument, {
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

  const handleSubmit = useCallback(
    async (values: CreateBoardFormValues) => {
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
    },
    [createBoard, pathname, router, searchParams, onClose],
  );

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader title="Create board" onClose={onClose} />
      <ModalBody>
        <CreateBoardForm onSubmit={handleSubmit} isLoading={loading} />
      </ModalBody>
      <ModalFooter
        isLoading={loading}
        onOk={() => {
          const form = document.getElementById(
            "create-board-form",
          ) as HTMLFormElement | null;
          form?.requestSubmit();
        }}
        onCancel={onClose}
        okText="Create"
        showCancel
      />
    </Modal>
  );
}
