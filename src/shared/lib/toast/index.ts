import { useToastStore, type ToastType } from "@/stores/toast.store";

type ShowToastOptions = {
  type: ToastType;
  message: string;
};

export function showToast({ type, message }: ShowToastOptions) {
  useToastStore.getState().show({ type, message });
}

export function showErrorToast(message: string) {
  showToast({ type: "error", message });
}

export function showSuccessToast(message: string) {
  showToast({ type: "success", message });
}

export function showInfoToast(message: string) {
  showToast({ type: "info", message });
}

export function showWarningToast(message: string) {
  showToast({ type: "warning", message });
}

