"use client";

import { createContext, useContext } from "react";

export type AuthMode = "login" | "register";

export interface AuthModalContextValue {
  isOpen: boolean;
  mode: AuthMode;
  open: (mode?: AuthMode) => void;
  close: () => void;
  setMode: (mode: AuthMode) => void;
}

export const AuthModalContext = createContext<AuthModalContextValue | null>(null);

/** Access the auth-modal controls. Must be used within `AuthModalProvider`. */
export function useAuthModal(): AuthModalContextValue {
  const context = useContext(AuthModalContext);
  if (context === null) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
