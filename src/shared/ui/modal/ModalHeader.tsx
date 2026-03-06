"use client";

import { X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

type ModalHeaderProps = {
  title: string;
  onClose?: () => void;
};

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
