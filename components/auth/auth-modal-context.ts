"use client";

import { createContext, useContext } from "react";
import type { LoginValues, RegisterValues } from "@/lib/auth-validation";
import type { AuthResult, AuthSession, RegisterResult } from "@/lib/auth-api";
import type { AuthUser } from "@/lib/types";

export type AuthMode = "login" | "register";

export interface AuthModalContextValue {
  isOpen: boolean;
  mode: AuthMode;
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  open: (mode?: AuthMode) => void;
  close: () => void;
  setMode: (mode: AuthMode) => void;
  login: (session: AuthSession) => void;
  logout: () => void;
  authenticate: (values: LoginValues) => Promise<AuthResult>;
  register: (values: RegisterValues) => Promise<RegisterResult>;
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
