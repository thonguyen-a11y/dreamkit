"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { LoginValues, RegisterValues } from "@/lib/auth-validation";
import {
  getMeApi,
  loginApi,
  registerApi,
  type AuthSession,
} from "@/lib/auth-api";
import {
  clearSessionCookie,
  isAdmin,
  parseSession,
  SESSION_STORAGE_KEY,
  writeSessionCookie,
} from "@/lib/auth";
import type { AuthUser } from "@/lib/types";
import {
  AuthModalContext,
  type AuthMode,
  type AuthModalContextValue,
} from "./auth-modal-context";
import { AuthModal } from "./auth-modal";

function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return parseSession(JSON.parse(stored));
  } catch {
    return null;
  }
}

/**
 * Provides global open/close control for the auth modal and renders the modal
 * itself. Using context (instead of prop drilling) lets any component — header,
 * CTAs, route guards — trigger sign-in without threading callbacks through the
 * tree.
 */
export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((session: AuthSession | null) => {
    setUser(session?.user ?? null);
    setAccessToken(session?.accessToken ?? null);

    try {
      if (session) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        writeSessionCookie(session.user);
      } else {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
        clearSessionCookie();
      }
    } catch {
      // Ignore storage failures.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const stored = readStoredSession();
      if (!stored) {
        if (!cancelled) {
          setIsLoading(false);
        }
        return;
      }

      const me = await getMeApi(stored.accessToken);
      if (cancelled) {
        return;
      }

      if (me.ok) {
        persistSession({
          user: me.user,
          accessToken: stored.accessToken,
        });
      } else {
        persistSession(null);
      }

      setIsLoading(false);
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [persistSession]);

  const open = useCallback((nextMode: AuthMode = "login") => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const login = useCallback(
    (session: AuthSession) => {
      persistSession(session);
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const authenticate = useCallback(async (values: LoginValues) => {
    return loginApi(values);
  }, []);

  const register = useCallback(async (values: RegisterValues) => {
    return registerApi(values);
  }, []);

  const value = useMemo<AuthModalContextValue>(
    () => ({
      isOpen,
      mode,
      user,
      accessToken,
      isAuthenticated: user !== null,
      isAdmin: isAdmin(user),
      isLoading,
      open,
      close,
      setMode,
      login,
      logout,
      authenticate,
      register,
    }),
    [
      isOpen,
      mode,
      user,
      accessToken,
      isLoading,
      open,
      close,
      login,
      logout,
      authenticate,
      register,
    ],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthModalContext.Provider>
  );
}
