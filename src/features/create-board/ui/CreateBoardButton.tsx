"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

type CreateBoardButtonProps = {
  className?: string;
  /** Called on click — parent opens creation modal (e.g. BoardFormModal with mode="create") */
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
