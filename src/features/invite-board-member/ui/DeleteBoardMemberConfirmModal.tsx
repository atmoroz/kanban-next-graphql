"use client";

import { useCallback } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/shared/ui/modal";
import { useRemoveBoardMember } from "@/features/invite-board-member/model/useRemoveBoardMember";

type DeleteBoardMemberConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  boardId: string;
  userId: string;
  email: string;
};

export function DeleteBoardMemberConfirmModal({
  open,
  onClose,
  boardId,
  userId,
  email,
}: DeleteBoardMemberConfirmModalProps) {
  const { removeBoardMember, loading } = useRemoveBoardMember({ boardId });

  const handleConfirm = useCallback(async () => {
    await removeBoardMember({ userId });
    onClose();
  }, [removeBoardMember, userId, onClose]);

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title="Remove member" onClose={onClose} />
      <ModalBody>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to remove <span className="text-foreground">{email}</span>{" "}
          from this board? This action cannot be undone.
        </p>
      </ModalBody>
      <ModalFooter
        isLoading={loading}
        onOk={handleConfirm}
        onCancel={onClose}
        okText="Remove"
        okVariant="destructive"
        showCancel
      />
    </Modal>
  );
}
