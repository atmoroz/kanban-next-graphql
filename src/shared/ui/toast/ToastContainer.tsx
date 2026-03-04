"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useToastStore } from "@/stores/toast.store";

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  useEffect(() => {
    if (typeof document === "undefined") return;
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  const content = (
    <div className="pointer-events-none fixed inset-0 z-60 flex items-start justify-end px-4 py-4 sm:items-start sm:px-6 sm:py-6">
      <div className="flex w-full flex-col items-end gap-2 sm:max-w-sm">
        {toasts.map((toast) => {
          const Icon =
            toast.type === "success"
              ? CheckCircle2
              : toast.type === "error"
                ? AlertCircle
                : toast.type === "warning"
                  ? AlertTriangle
                  : Info;

          return (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              className={cn(
                "pointer-events-auto flex w-full items-start gap-3 rounded-md border bg-popover p-3 text-popover-foreground shadow-lg ring-1 ring-black/5",
              )}
            >
              <div className="mt-0.5">
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4",
                    toast.type === "success" && "text-emerald-500",
                    toast.type === "error" && "text-red-500",
                    toast.type === "warning" && "text-amber-500",
                    toast.type === "info" && "text-blue-500",
                  )}
                />
              </div>
              <div className="flex-1 text-sm leading-snug">{toast.message}</div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="inline-flex h-5 w-5 items-center justify-center rounded text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                aria-label="Close notification"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return content;
  }

  return createPortal(content, document.body);
}
