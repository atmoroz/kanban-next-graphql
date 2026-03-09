import type { BoardLabel } from "../model/label.types";
import { cn } from "@/shared/lib/cn";
import { X } from "lucide-react";

type LabelBadgeProps = {
  label: BoardLabel;
  className?: string;
  onClick?: () => void;
  onDeleteClick?: () => void;
};

export function LabelBadge({
  label,
  className,
  onClick,
  onDeleteClick,
}: LabelBadgeProps) {
  const color = label.color ?? "#6B7280"; // fallback: gray-500

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold",
        "cursor-pointer transition-colors hover:bg-background/40",
        className,
      )}
      style={{
        backgroundColor: `${color}20`,
        color,
        borderColor: color,
      }}
      onClick={onClick}
    >
      <span className="truncate">{label.name}</span>
      {onDeleteClick && (
        <span
          className="ml-0.5 flex items-center justify-center rounded-full bg-background/60 p-0.5 text-[10px] hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick();
          }}
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </span>
      )}
    </button>
  );
}
