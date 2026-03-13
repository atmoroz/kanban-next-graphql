"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

type CreateTaskButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function CreateTaskButton({ onClick, disabled }: CreateTaskButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="h-9 px-4 w-fit justify-start cursor-pointer border-dashed text-muted-foreground hover:text-foreground"
      onClick={onClick}
      disabled={disabled}
    >
      <Plus className="mr-2 size-3" />
      Create task
    </Button>
  );
}
