"use client";

import { useCallback } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/shared/ui/modal";
import type { BoardLabel } from "@/entities/label";
import { useDeleteLabel } from "../model/useDeleteLabel";

type DeleteLabelConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  label: BoardLabel | null;
  boardId: string;
};

export function DeleteLabelConfirmModal({
  open,
  onClose,
  label,
  boardId,
}: DeleteLabelConfirmModalProps) {
  const { deleteLabel, isLoading } = useDeleteLabel(boardId);

  const handleConfirm = useCallback(async () => {
    if (!label) return;
    await deleteLabel(label.id);
    onClose();
  }, [deleteLabel, label, onClose]);

  if (!label) return null;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title="Delete label" onClose={onClose} />
      <ModalBody>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete &quot;{label.name}&quot;? This action cannot be
          undone.
        </p>
      </ModalBody>
      <ModalFooter
        isLoading={isLoading}
        onOk={handleConfirm}
        onCancel={onClose}
        okText="Delete"
        okVariant="destructive"
        showCancel
      />
    </Modal>
  );
}

