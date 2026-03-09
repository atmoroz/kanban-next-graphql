"use client";

import { useCallback, useState } from "react";
import { useLabels, LabelBadge, type BoardLabel } from "@/entities/label";
import { Button } from "@/shared/ui/button";
import { CreateLabelModal } from "@/features/create-label/ui/CreateLabelModal";
import { EditLabelModal } from "@/features/update-label/ui/EditLabelModal";
import { DeleteLabelConfirmModal } from "@/features/delete-label/ui/DeleteLabelConfirmModal";

type BoardLabelsPanelProps = {
  boardId: string | null;
};

export function BoardLabelsPanel({ boardId }: BoardLabelsPanelProps) {
  const { labels } = useLabels(boardId);

  const [isCreateLabelOpen, setIsCreateLabelOpen] = useState(false);
  const [labelToEdit, setLabelToEdit] = useState<BoardLabel | null>(null);
  const [labelToDelete, setLabelToDelete] = useState<BoardLabel | null>(null);

  const handleOpenCreateLabel = useCallback(() => {
    setIsCreateLabelOpen(true);
  }, []);

  const handleCloseCreateLabel = useCallback(() => {
    setIsCreateLabelOpen(false);
  }, []);

  const handleOpenEditLabel = useCallback((label: BoardLabel) => {
    setLabelToEdit(label);
  }, []);

  const handleCloseEditLabel = useCallback(() => {
    setLabelToEdit(null);
  }, []);

  const handleOpenDeleteLabel = useCallback((label: BoardLabel) => {
    setLabelToDelete(label);
  }, []);

  const handleCloseDeleteLabel = useCallback(() => {
    setLabelToDelete(null);
  }, []);

  if (!boardId) {
    return null;
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleOpenCreateLabel}
            className="h-7 px-2 text-xs"
          >
            Create label
          </Button>
        </div>
        <div
          className="flex w-[300px] justify-start gap-1 overflow-x-auto overflow-y-hidden whitespace-nowrap
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {labels.map((label) => (
            <LabelBadge
              key={label.id}
              label={label}
              onClick={() => handleOpenEditLabel(label)}
              onDeleteClick={() => handleOpenDeleteLabel(label)}
            />
          ))}
          {labels.length === 0 && (
            <span className="text-xs text-muted-foreground">No labels yet</span>
          )}
        </div>
      </div>

      <CreateLabelModal
        open={isCreateLabelOpen}
        onClose={handleCloseCreateLabel}
        boardId={boardId}
      />
      <EditLabelModal
        open={!!labelToEdit}
        onClose={handleCloseEditLabel}
        label={labelToEdit}
      />
      <DeleteLabelConfirmModal
        open={!!labelToDelete}
        onClose={handleCloseDeleteLabel}
        label={labelToDelete}
        boardId={boardId}
      />
    </div>
  );
}
