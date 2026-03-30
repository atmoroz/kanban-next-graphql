"use client";

import { useCallback, useState } from "react";
import { useLabels, LabelBadge, type BoardLabel } from "@/entities/label";
import { CreateLabelModal } from "@/features/create-label/ui/CreateLabelModal";
import { EditLabelModal } from "@/features/update-label/ui/EditLabelModal";
import { DeleteLabelConfirmModal } from "@/features/delete-label/ui/DeleteLabelConfirmModal";

type BoardLabelsPanelProps = {
  boardId: string | null;
  createLabelOpen: boolean;
  onCreateLabelOpenChange: (open: boolean) => void;
  canManageLabels: boolean;
};

export function BoardLabelsPanel({
  boardId,
  createLabelOpen,
  onCreateLabelOpenChange,
  canManageLabels,
}: BoardLabelsPanelProps) {
  const { labels } = useLabels(boardId);

  const [labelToEdit, setLabelToEdit] = useState<BoardLabel | null>(null);
  const [labelToDelete, setLabelToDelete] = useState<BoardLabel | null>(null);

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
    <div className="flex w-full min-w-0 justify-end">
      {/* <div className="flex flex-col items-end gap-1"> */}
      <div
        className="flex   gap-1 overflow-x-auto overflow-y-hidden whitespace-nowrap
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {labels.map((label) => (
          <LabelBadge
            key={label.id}
            label={label}
            onClick={canManageLabels ? () => handleOpenEditLabel(label) : undefined}
            onDeleteClick={
              canManageLabels ? () => handleOpenDeleteLabel(label) : undefined
            }
          />
        ))}
        {labels.length === 0 && (
          <span className="text-xs text-muted-foreground">No labels yet</span>
        )}
        {/* </div> */}
      </div>

      {canManageLabels && (
        <CreateLabelModal
          open={createLabelOpen}
          onClose={() => onCreateLabelOpenChange(false)}
          boardId={boardId}
        />
      )}
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
