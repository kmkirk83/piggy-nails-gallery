import { useState, useCallback } from "react";
import { ToastMessage, ToastType } from "@/components/Toast";

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastMessage = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => addToast(message, "success", duration),
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => addToast(message, "error", duration),
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => addToast(message, "warning", duration),
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => addToast(message, "info", duration),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
