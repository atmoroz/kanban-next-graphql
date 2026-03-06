"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/cn";

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
} as const;

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
};
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
export function Modal({ open, onClose, children, size = "md" }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key !== "Tab") return;
      const el = containerRef.current;
      if (!el) return;
      const focusable = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first && last) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last && first) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    // if (!open) {
    //   queueMicrotask(() => setEntered(false));
    //   return;
    // }
    // queueMicrotask(() => setEntered(false));
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusTimer = requestAnimationFrame(() => {
      containerRef.current?.focus();
    });
    const enterTimer = requestAnimationFrame(() => {
      setEntered(true);
    });
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
      cancelAnimationFrame(focusTimer);
      cancelAnimationFrame(enterTimer);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          "fixed inset-0 bg-muted/70 backdrop-blur-sm transition-opacity duration-200 ease-out",
          entered ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        // role="button"
        aria-hidden="true"
        tabIndex={-1}
        aria-label="Close modal"
      />
      <div
        ref={containerRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full rounded-xl bg-background shadow-lg",
          "transition-all duration-200 ease-out",
          entered ? "opacity-100 scale-100" : "opacity-0 scale-95",
          SIZE_CLASSES[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
