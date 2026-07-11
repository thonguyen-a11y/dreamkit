import { describe, expect, it } from "vitest";
import { mapApiUserToAuthUser } from "./auth-api";
import { isAdmin, parseAuthUser, parseSession } from "./auth";

describe("mapApiUserToAuthUser", () => {
  it("maps admin role", () => {
    const user = mapApiUserToAuthUser({
      _id: "abc123",
      email: "admin@dreamkit.local",
      name: "Admin",
      role: "admin",
      phone: "000",
      address: "System",
    });

    expect(user).toEqual({
      id: "abc123",
      email: "admin@dreamkit.local",
      name: "Admin",
      role: "admin",
      phone: "000",
      address: "System",
    });
    expect(isAdmin(user)).toBe(true);
  });

  it("maps user role to customer", () => {
    const user = mapApiUserToAuthUser({
      _id: "user-1",
      email: "user@dreamkit.vn",
      name: "Customer",
      role: "user",
    });

    expect(user.role).toBe("customer");
    expect(isAdmin(user)).toBe(false);
  });
});

describe("parseSession", () => {
  it("parses a stored API session", () => {
    const session = parseSession({
      accessToken: "token-123",
      user: {
        id: "user-1",
        name: "A",
        email: "a@dreamkit.vn",
        role: "customer",
      },
    });

    expect(session).toEqual({
      accessToken: "token-123",
      user: {
        id: "user-1",
        name: "A",
        email: "a@dreamkit.vn",
        role: "customer",
      },
    });
  });

  it("rejects legacy user-only payloads without a token", () => {
    expect(
      parseSession({
        id: "user-1",
        name: "A",
        email: "a@dreamkit.vn",
        role: "customer",
      }),
    ).toBeNull();
  });
});

describe("parseAuthUser", () => {
  it("validates user shape", () => {
    expect(
      parseAuthUser({
        id: "1",
        name: "Test",
        email: "test@dreamkit.vn",
        role: "admin",
      }),
    ).not.toBeNull();
  });
});
