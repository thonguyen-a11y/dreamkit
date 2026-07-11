import type { AuthSession } from "./auth-api";
import type { AuthUser } from "./types";

export const SESSION_STORAGE_KEY = "dreamkit-session";
export const SESSION_COOKIE_KEY = "dreamkit-session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const ADMIN_HOME_PATH = "/admin";

export function parseSession(value: unknown): AuthSession | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (
    typeof record.accessToken === "string" &&
    typeof record.user === "object" &&
    record.user !== null
  ) {
    const user = parseAuthUser(record.user);
    if (!user) {
      return null;
    }

    return { user, accessToken: record.accessToken };
  }

  const legacyUser = parseAuthUser(record);
  if (!legacyUser) {
    return null;
  }

  return null;
}

export function parseAuthUser(value: unknown): AuthUser | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const user = value as AuthUser;
  if (
    typeof user.id !== "string" ||
    typeof user.name !== "string" ||
    typeof user.email !== "string" ||
    (user.role !== "admin" && user.role !== "customer")
  ) {
    return null;
  }

  return user;
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin";
}

export function serializeSessionCookie(user: AuthUser): string {
  return encodeURIComponent(JSON.stringify(user));
}

export function readSessionFromCookieValue(value: string | undefined): AuthUser | null {
  if (!value) {
    return null;
  }

  try {
    return parseAuthUser(JSON.parse(decodeURIComponent(value)));
  } catch {
    return null;
  }
}

/** Writes the session cookie so middleware can read auth on navigation. */
export function writeSessionCookie(user: AuthUser): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_COOKIE_KEY}=${serializeSessionCookie(user)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
}
