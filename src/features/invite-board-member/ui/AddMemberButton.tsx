"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

type AddMemberButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function AddMemberButton({ onClick, disabled }: AddMemberButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="h-9 px-4 w-fit justify-start cursor-pointer border-dashed text-muted-foreground hover:text-foreground"
      onClick={onClick}
      disabled={disabled}
    >
      <Plus className="mr-2 size-3" />
      Member
    </Button>
  );
}
