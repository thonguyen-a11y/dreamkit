"use client";

import { createContext, useContext } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastContextValue {
  readonly showToast: (message: string, variant?: ToastVariant) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
