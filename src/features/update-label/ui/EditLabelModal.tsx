"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/shared/ui/modal";
import { Label as FieldLabel } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import type { BoardLabel } from "@/entities/label";
import {
  BoardLabelsDocument,
  UpdateLabelDocument,
  type BoardLabelsQuery,
  type BoardLabelsQueryVariables,
} from "@/graphql/generated/graphql";

type EditLabelModalProps = {
  open: boolean;
  onClose: () => void;
  label: BoardLabel | null;
};

export function EditLabelModal({ open, onClose, label }: EditLabelModalProps) {
  const [name, setName] = useState(label?.name ?? "");
  const [color, setColor] = useState(label?.color ?? "#22C55E");

  useEffect(() => {
    if (!open || !label) return;
    const nextName = label.name;
    const nextColor = label.color ?? "#22C55E";
    queueMicrotask(() => {
      setName(nextName);
      setColor(nextColor);
    });
  }, [label, open]);

  const [updateLabel, { loading }] = useMutation(UpdateLabelDocument, {
    update(cache, { data }) {
      const updated = data?.updateLabel;
      if (!updated) return;

      const boardId = updated.boardId;

      try {
        const existing = cache.readQuery<BoardLabelsQuery, BoardLabelsQueryVariables>({
          query: BoardLabelsDocument,
          variables: { boardId },
        });
        if (!existing?.boardLabels) return;

        const nextLabels = existing.boardLabels.map((l) =>
          l.id === updated.id ? updated : l,
        );

        cache.writeQuery<BoardLabelsQuery, BoardLabelsQueryVariables>({
          query: BoardLabelsDocument,
          variables: { boardId },
          data: { boardLabels: nextLabels },
        });
      } catch {
        // boardLabels might not be in cache
      }
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!label) return;
      const trimmedName = name.trim();
      if (!trimmedName && !color) return;

      await updateLabel({
        variables: {
          id: label.id,
          name: trimmedName || undefined,
          color: color || undefined,
        },
        optimisticResponse: {
          updateLabel: {
            __typename: "Label",
            id: label.id,
            boardId: label.boardId,
            name: trimmedName || label.name,
            color: color || label.color,
          },
        },
      });

      onClose();
    },
    [color, label, name, onClose, updateLabel],
  );

  if (!label) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} size="sm">
      <ModalHeader title="Edit label" onClose={handleClose} />
      <ModalBody>
        <form id="edit-label-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <FieldLabel htmlFor="edit-label-name">Name</FieldLabel>
            <Input
              id="edit-label-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Label name"
              disabled={loading}
              maxLength={40}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="edit-label-color">Color</FieldLabel>
            <div className="flex items-center gap-3">
              <Input
                id="edit-label-color"
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
            "edit-label-form",
          ) as HTMLFormElement | null;
          form?.requestSubmit();
        }}
        onCancel={handleClose}
        okText="Save"
        showCancel
      />
    </Modal>
  );
}

