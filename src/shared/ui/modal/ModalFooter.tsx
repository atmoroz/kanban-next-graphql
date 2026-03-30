"use client";

import { Button } from "@/shared/ui/button";
import { Loader2 } from "lucide-react";

type ModalFooterProps = {
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  showCancel?: boolean;
  isLoading?: boolean;
  okVariant?: "primary" | "secondary" | "destructive";
  isOkDisabled?: boolean;
};

export function ModalFooter({
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  showCancel = true,
  isLoading = false,
  okVariant = "primary",
  isOkDisabled = false,
}: ModalFooterProps) {
  return (
    <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
      {showCancel && onCancel && (
        <Button variant="secondary" type="button" onClick={onCancel} className="px-4">
          {cancelText}
        </Button>
      )}
      {onOk && (
        <Button
          type="button"
          variant={okVariant}
          onClick={onOk}
          className="px-4"
          disabled={isLoading || isOkDisabled}
        >
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
