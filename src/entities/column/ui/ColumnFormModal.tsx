"use client";

import { useCallback, useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/shared/ui/modal";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";

export type ColumnFormMode = "create" | "edit";

type ColumnFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: ColumnFormMode;
  initialTitle?: string;
  isLoading?: boolean;
  onSubmit: (title: string) => Promise<void> | void;
};

export function ColumnFormModal({
  open,
  onClose,
  mode,
  initialTitle = "",
  isLoading = false,
  onSubmit,
}: ColumnFormModalProps) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (!open) return;
    const nextTitle = initialTitle;
    queueMicrotask(() => {
      setTitle(nextTitle);
    });
  }, [initialTitle, open]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onSubmit(title);
    },
    [onSubmit, title],
  );

  const headerTitle = mode === "edit" ? "Edit column" : "Add column";
  const submitText = mode === "edit" ? "Save" : "Create";

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title={headerTitle} onClose={onClose} />
      <ModalBody>
        <form id="column-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-title">Title</Label>
            <Input
              id="column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Column title"
              autoFocus
              disabled={isLoading}
              required
              maxLength={80}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter
        onOk={() => {
          const form = document.getElementById("column-form") as HTMLFormElement | null;
          form?.requestSubmit();
        }}
        onCancel={onClose}
        okText={submitText}
        isLoading={isLoading}
        showCancel
      />
    </Modal>
  );
}

