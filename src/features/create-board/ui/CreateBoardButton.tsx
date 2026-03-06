"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

type CreateBoardButtonProps = {
  className?: string;
  /** Вызывается по клику — родитель открывает модалку создания (например BoardFormModal с mode="create") */
  onOpenCreate: () => void;
};

export function CreateBoardButton({ className, onOpenCreate }: CreateBoardButtonProps) {
  return (
    <Button type="button" className={className} onClick={onOpenCreate}>
      <Plus className="size-4" />
      Create board
    </Button>
  );
}
