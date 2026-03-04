import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  createdAt: number;
};

type ToastState = {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id" | "createdAt"> & { id?: string }) => void;
  dismiss: (id: string) => void;
  clear: () => void;
};

const AUTO_DISMISS_MS = 4000;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],

  show: ({ type, message, id }) => {
    const now = Date.now();
    const existing = get().toasts.find(
      (t) =>
        t.type === type && t.message === message && now - t.createdAt < AUTO_DISMISS_MS,
    );
    if (existing) return;

    const toastId = id ?? `${now}-${Math.random().toString(36).slice(2)}`;
    const toast: Toast = { id: toastId, type, message, createdAt: now };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    setTimeout(() => {
      get().dismiss(toastId);
    }, AUTO_DISMISS_MS);
  },

  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clear: () => set({ toasts: [] }),
}));
