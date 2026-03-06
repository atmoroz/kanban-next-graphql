"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/shared/ui/modal";
import { showErrorToast } from "@/shared/lib/toast";
import type { SidebarBoard } from "@/entities/board";
import {
  BoardsDocument,
  DeleteBoardDocument,
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

type DeleteBoardConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  board: SidebarBoard | null;
  /** Если удаляемый борд выбран — после удаления сбрасываем URL */
  selectedBoardId: string | null;
};

export function DeleteBoardConfirmModal({
  open,
  onClose,
  board,
  selectedBoardId,
}: DeleteBoardConfirmModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [deleteBoard, { loading }] = useMutation(DeleteBoardDocument, {
    update(cache, _, { variables }) {
      const id = variables?.id;
      if (!id) return;
      try {
        const existing = cache.readQuery<BoardsQuery>({
          query: BoardsDocument,
          variables: BOARDS_QUERY_VARS,
        });
        if (!existing?.boards) return;
        const newEdges = existing.boards.edges.filter((edge) => edge.node.id !== id);
        cache.writeQuery<BoardsQuery>({
          query: BoardsDocument,
          variables: BOARDS_QUERY_VARS,
          data: {
            ...existing,
            boards: {
              ...existing.boards,
              edges: newEdges,
            },
          },
        });
      } catch {
        // Query might not be in cache
      }
    },
  });

  const handleConfirm = useCallback(async () => {
    if (!board) return;
    try {
      await deleteBoard({ variables: { id: board.id } });
      onClose();
      if (selectedBoardId === board.id) {
        const next = new URLSearchParams(searchParams.toString());
        next.delete("boardId");
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      }
    } catch (err) {
      console.log("err", err);
      const message = CombinedGraphQLErrors.is(err)
        ? (err.errors[0]?.message ?? "Failed to delete board.")
        : err instanceof Error
          ? err.message
          : "Failed to delete board.";
      showErrorToast(message);
    }
  }, [board, deleteBoard, selectedBoardId, onClose, pathname, router, searchParams]);

  if (!board) return null;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title="Delete board" onClose={onClose} />
      <ModalBody>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete &quot;{board.title}&quot;? This action cannot be
          undone.
        </p>
      </ModalBody>
      <ModalFooter
        isLoading={loading}
        onOk={handleConfirm}
        onCancel={onClose}
        okText="Delete"
        okVariant="destructive"
        showCancel
      />
    </Modal>
  );
}
