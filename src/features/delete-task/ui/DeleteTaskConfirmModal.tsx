"use client";

import { useCallback } from "react";
import type { BoardTask } from "@/entities/task";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/shared/ui/modal";
import { useDeleteTask } from "../model/useDeleteTask";

type DeleteTaskConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  task: BoardTask | null;
};

export function DeleteTaskConfirmModal({
  open,
  onClose,
  task,
}: DeleteTaskConfirmModalProps) {
  const { deleteTask, loading } = useDeleteTask();

  const handleConfirm = useCallback(async () => {
    if (!task) return;
    await deleteTask({ id: task.id, columnId: task.columnId });
    onClose();
  }, [deleteTask, onClose, task]);

  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title="Delete task" onClose={onClose} />
      <ModalBody>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete &quot;{task.title}&quot;? This action cannot
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

