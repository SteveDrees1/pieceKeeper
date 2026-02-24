export type ToastType = "error" | "success" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  createdAt: number;
}

let nextId = 0;
const DEFAULT_DURATION = 5000;

export function useToaster() {
  const toasts = useState<Toast[]>("toaster-toasts", () => []);

  function showToast(message: string, type: ToastType = "error", durationMs = DEFAULT_DURATION) {
    const id = ++nextId;
    const toast: Toast = { id, message, type, createdAt: Date.now() };
    toasts.value = [...toasts.value, toast];
    if (durationMs > 0) {
      setTimeout(() => {
        toasts.value = toasts.value.filter((t) => t.id !== id);
      }, durationMs);
    }
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return { toasts, showToast, dismiss };
}
