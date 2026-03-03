"use client";

import { Plus } from "lucide-react";

type CreateBoardButtonProps = {
  className?: string;
};

export function CreateBoardButton({ className }: CreateBoardButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        // TODO: открыть модалку/форму создания доски (EPIC-04)
      }}
    >
      <Plus className="size-4" />
      Create board
    </button>
  );
}
