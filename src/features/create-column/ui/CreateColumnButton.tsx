"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

type CreateColumnButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function CreateColumnButton({ onClick, disabled }: CreateColumnButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="h-9 px-4 w-fit justify-start cursor-pointer border-dashed text-muted-foreground hover:text-foreground"
      onClick={onClick}
      disabled={disabled}
    >
      <Plus className="mr-2 size-4" />
      Column
    </Button>
  );
}
