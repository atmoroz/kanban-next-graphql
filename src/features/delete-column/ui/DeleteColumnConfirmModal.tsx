"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/shared/ui/modal";
import type { BoardColumn } from "@/entities/column";
import {
  ColumnsDocument,
  DeleteColumnDocument,
  type ColumnsQuery,
  type ColumnsQueryVariables,
} from "@/graphql/generated/graphql";

type DeleteColumnConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  column: BoardColumn | null;
  boardId: string;
};

export function DeleteColumnConfirmModal({
  open,
  onClose,
  column,
  boardId,
}: DeleteColumnConfirmModalProps) {
  const [deleteColumn, { loading }] = useMutation(DeleteColumnDocument, {
    update(cache, _, { variables }) {
      const id = variables?.id;
      if (!id) return;
      try {
        const existing = cache.readQuery<ColumnsQuery, ColumnsQueryVariables>({
          query: ColumnsDocument,
          variables: { boardId },
        });
        if (!existing?.columns) return;
        const nextColumns = existing.columns.filter((c) => c.id !== id);
        cache.writeQuery<ColumnsQuery, ColumnsQueryVariables>({
          query: ColumnsDocument,
          variables: { boardId },
          data: { columns: nextColumns },
        });
      } catch {
        // Columns query might not be in cache
      }
    },
  });

  const handleConfirm = useCallback(async () => {
    if (!column) return;
    await deleteColumn({ variables: { id: column.id } });
    onClose();
  }, [column, deleteColumn, onClose]);

  if (!column) return null;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title="Delete column" onClose={onClose} />
      <ModalBody>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete &quot;{column.title}&quot;? This action cannot
          be undone.
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
