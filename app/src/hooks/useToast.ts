'use client';

import { useSyncExternalStore, useCallback } from 'react';

// ---------- Types ----------

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

// ---------- Store (singleton, lives outside React) ----------

let toasts: Toast[] = [];
const listeners = new Set<() => void>();
let nextId = 0;

function getSnapshot(): Toast[] {
  return toasts;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((l) => l());
}

function addToast(message: string, type: ToastType, options: ToastOptions = {}) {
  const { duration = 4000 } = options;
  const id = String(++nextId);
  toasts = [...toasts, { id, message, type, duration }];
  notify();

  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration);
  }
}

function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

// ---------- Imperative API (for non-hook consumers) ----------

export const toast = {
  success: (message: string, options?: ToastOptions) => addToast(message, 'success', options),
  error: (message: string, options?: ToastOptions) => addToast(message, 'error', options),
  info: (message: string, options?: ToastOptions) => addToast(message, 'info', options),
  warning: (message: string, options?: ToastOptions) => addToast(message, 'warning', options),
};

// ---------- React Hook ----------

export function useToast() {
  const currentToasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const dismiss = useCallback((id: string) => {
    dismissToast(id);
  }, []);

  return { toasts: currentToasts, dismiss, toast };
}
