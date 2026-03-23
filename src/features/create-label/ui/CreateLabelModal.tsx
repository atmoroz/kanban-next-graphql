"use client";

import { useCallback, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/shared/ui/modal";
import { Label as FieldLabel } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { useCreateLabel } from "@/features/create-label/model/useCreateLabel";

type CreateLabelModalProps = {
  open: boolean;
  onClose: () => void;
  boardId: string;
};

export function CreateLabelModal({ open, onClose, boardId }: CreateLabelModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#22C55E");

  const { createLabel, loading } = useCreateLabel({ boardId });

  const resetForm = useCallback(() => {
    setName("");
    setColor("#22C55E");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedName = name.trim();
      if (!trimmedName) return;

      await createLabel({ name: trimmedName, color });

      resetForm();
      onClose();
    },
    [color, createLabel, name, onClose, resetForm],
  );

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  return (
    <Modal open={open} onClose={handleClose} size="sm">
      <ModalHeader title="Create label" onClose={handleClose} />
      <ModalBody>
        <form id="create-label-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <FieldLabel htmlFor="label-name">Name</FieldLabel>
            <Input
              id="label-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bug, Feature, Urgent…"
              disabled={loading}
              required
              maxLength={40}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="label-color">Color</FieldLabel>
            <div className="flex items-center gap-3">
              <Input
                id="label-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-16 cursor-pointer p-1"
                disabled={loading}
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="font-mono text-xs"
                maxLength={7}
                disabled={loading}
              />
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter
        isLoading={loading}
        onOk={() => {
          const form = document.getElementById(
            "create-label-form",
          ) as HTMLFormElement | null;
          form?.requestSubmit();
        }}
        onCancel={handleClose}
        okText="Create"
        showCancel
      />
    </Modal>
  );
}
