"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  AuthModalContext,
  type AuthMode,
  type AuthModalContextValue,
} from "./auth-modal-context";
import { AuthModal } from "./auth-modal";

/**
 * Provides global open/close control for the auth modal and renders the modal
 * itself. Using context (instead of prop drilling) lets any component — header,
 * CTAs, route guards — trigger sign-in without threading callbacks through the
 * tree.
 */
export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const open = useCallback((nextMode: AuthMode = "login") => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<AuthModalContextValue>(
    () => ({ isOpen, mode, open, close, setMode }),
    [isOpen, mode, open, close],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthModalContext.Provider>
  );
}
