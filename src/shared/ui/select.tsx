import * as React from "react";
import { cn } from "@/shared/lib/cn";

type SelectProps = React.ComponentProps<"select">;

function Select({ className, ...props }: SelectProps) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground shadow-sm outline-none",
        "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Select };

