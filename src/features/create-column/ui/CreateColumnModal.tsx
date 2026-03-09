"use client";

import { useCallback, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/shared/ui/modal";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { useCreateColumn } from "../model/useCreateColumn";

type CreateColumnModalProps = {
  open: boolean;
  onClose: () => void;
  boardId: string;
};

export function CreateColumnModal({ open, onClose, boardId }: CreateColumnModalProps) {
  const { createColumn, loading } = useCreateColumn({ boardId });
  const [title, setTitle] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await createColumn(title);
      setTitle("");
      onClose();
    },
    [createColumn, title, onClose],
  );

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title="Add column" onClose={onClose} />
      <ModalBody>
        <form id="create-column-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-title">Title</Label>
            <Input
              id="column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Column title"
              autoFocus
              disabled={loading}
              required
              maxLength={80}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter
        onOk={() => {
          const form = document.getElementById(
            "create-column-form",
          ) as HTMLFormElement | null;
          form?.requestSubmit();
        }}
        onCancel={onClose}
        okText="Create"
        isLoading={loading}
        showCancel
      />
    </Modal>
  );
}
