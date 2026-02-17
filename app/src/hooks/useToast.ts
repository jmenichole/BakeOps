'use client';

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastOptions {
  duration?: number;
}

interface UseToastReturn {
  toasts: Toast[];
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// Global state for toasts (works across components)
let globalToasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

function notifyListeners() {
  listeners.forEach(listener => listener([...globalToasts]));
}

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Custom hook for managing toast notifications
 * Uses global state so toasts can be shown from anywhere
 */
export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Subscribe to global toasts
  if (typeof window !== 'undefined') {
    const listener = (newToasts: Toast[]) => {
      setToasts(newToasts);
    };
    
    if (!listeners.includes(listener)) {
      listeners.push(listener);
    }
  }

  const addToast = useCallback((message: string, type: ToastType, options: ToastOptions = {}) => {
    const { duration = 5000 } = options;
    
    const toast: Toast = {
      id: generateId(),
      message,
      type,
      duration,
    };

    globalToasts.push(toast);
    notifyListeners();

    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        dismiss(toast.id);
      }, duration);
    }

    return toast.id;
  }, []);

  const dismiss = useCallback((id: string) => {
    globalToasts = globalToasts.filter(t => t.id !== id);
    notifyListeners();
  }, []);

  const dismissAll = useCallback(() => {
    globalToasts = [];
    notifyListeners();
  }, []);

  return {
    toasts,
    success: (message, options) => addToast(message, 'success', options),
    error: (message, options) => addToast(message, 'error', options),
    info: (message, options) => addToast(message, 'info', options),
    warning: (message, options) => addToast(message, 'warning', options),
    dismiss,
    dismissAll,
  };
}

// Standalone functions for showing toasts without hook
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    const id = generateId();
    globalToasts.push({ id, message, type: 'success', ...options });
    notifyListeners();
    if (options?.duration !== 0) {
      setTimeout(() => toast.dismiss(id), options?.duration || 5000);
    }
    return id;
  },
  error: (message: string, options?: ToastOptions) => {
    const id = generateId();
    globalToasts.push({ id, message, type: 'error', ...options });
    notifyListeners();
    if (options?.duration !== 0) {
      setTimeout(() => toast.dismiss(id), options?.duration || 5000);
    }
    return id;
  },
  info: (message: string, options?: ToastOptions) => {
    const id = generateId();
    globalToasts.push({ id, message, type: 'info', ...options });
    notifyListeners();
    if (options?.duration !== 0) {
      setTimeout(() => toast.dismiss(id), options?.duration || 5000);
    }
    return id;
  },
  warning: (message: string, options?: ToastOptions) => {
    const id = generateId();
    globalToasts.push({ id, message, type: 'warning', ...options });
    notifyListeners();
    if (options?.duration !== 0) {
      setTimeout(() => toast.dismiss(id), options?.duration || 5000);
    }
    return id;
  },
  dismiss: (id: string) => {
    globalToasts = globalToasts.filter(t => t.id !== id);
    notifyListeners();
  },
  dismissAll: () => {
    globalToasts = [];
    notifyListeners();
  },
};
