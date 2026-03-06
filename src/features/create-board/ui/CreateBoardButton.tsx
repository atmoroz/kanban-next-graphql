"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { CreateBoardModal } from "./CreateBoardModal";

type CreateBoardButtonProps = {
  className?: string;
};

export function CreateBoardButton({ className }: CreateBoardButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" className={className} onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Create board
      </Button>
      <CreateBoardModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
