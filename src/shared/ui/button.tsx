import * as React from "react";
import { cn } from "@/shared/lib/cn";

function Button({
  className,
  type = "button",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export { Button };
