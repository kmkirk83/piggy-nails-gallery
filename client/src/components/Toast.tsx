import { useState, useEffect } from "react";
import { X, Check, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    if (message.duration === 0) return;

    const timer = setTimeout(() => {
      onClose(message.id);
    }, message.duration || 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  const typeStyles: Record<ToastType, string> = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const iconStyles: Record<ToastType, React.ReactNode> = {
    success: <Check className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${typeStyles[message.type]} animate-in fade-in slide-in-from-top-2 duration-300`}
      role="alert"
    >
      {iconStyles[message.type]}
      <span className="flex-1 text-sm font-medium">{message.message}</span>
      <button
        onClick={() => onClose(message.id)}
        className="ml-2 inline-flex text-current hover:opacity-75"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default Toast;
