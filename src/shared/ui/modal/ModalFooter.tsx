"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { Loader2 } from "lucide-react";

type ModalFooterProps = {
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  showCancel?: boolean;
  isLoading?: boolean;
};

export function ModalFooter({
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  showCancel = true,
  isLoading = false,
}: ModalFooterProps) {
  return (
    <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
      {showCancel && onCancel && (
        <Button variant="secondary" type="button" onClick={onCancel} className="px-4">
          {cancelText}
        </Button>
      )}
      {onOk && (
        <Button type="button" onClick={onOk} className="px-4" disabled={isLoading}>
          {isLoading ? (
            <>
              {okText}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            </>
          ) : (
            okText
          )}
        </Button>
      )}
    </div>
  );
}
