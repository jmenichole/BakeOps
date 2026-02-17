'use client';

import { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast, Toast as ToastType } from '@/hooks/useToast';

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    icon: 'text-green-500',
    border: 'border-green-100',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    icon: 'text-red-500',
    border: 'border-red-100',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    icon: 'text-blue-500',
    border: 'border-blue-100',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    icon: 'text-yellow-500',
    border: 'border-yellow-100',
  },
};

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = iconMap[toast.type];
  const colors = colorMap[toast.type];

  return (
    <div
      className={`
        ${colors.bg} ${colors.text} ${colors.border}
        border rounded-xl p-4 shadow-lg
        flex items-start gap-3
        animate-in slide-in-from-right-4 duration-300
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${colors.icon} shrink-0 mt-0.5`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Toast Container component - place this once at the root of your app
 */
export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}

/**
 * Simple Toast for quick use without the hook
 */
export function SimpleToast({
  message,
  type = 'info',
  onClose,
}: {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <div
      className={`
        ${colors.bg} ${colors.text} ${colors.border}
        border rounded-xl p-4 shadow-lg
        flex items-center gap-3
        animate-in slide-in-from-right-4 duration-300
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${colors.icon} shrink-0`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
