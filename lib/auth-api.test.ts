import { afterEach, describe, expect, it, vi } from "vitest";
import { loginApi, registerApi } from "./auth-api";

const fetchMock = vi.fn();

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe("loginApi", () => {
  it("returns a session on success", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        accessToken: "jwt-token",
        user: {
          _id: "user-1",
          email: "user@dreamkit.vn",
          name: "User",
          role: "user",
        },
      }),
    });

    const result = await loginApi({
      email: "user@dreamkit.vn",
      password: "secret123",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.session.accessToken).toBe("jwt-token");
      expect(result.session.user.role).toBe("customer");
    }
  });

  it("maps 401 to invalid credentials", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ message: "Invalid credentials" }),
    });

    const result = await loginApi({
      email: "user@dreamkit.vn",
      password: "wrong",
    });

    expect(result).toEqual({
      ok: false,
      code: "invalid-credentials",
      message: "Email hoặc mật khẩu không đúng.",
    });
  });

  it("maps 403 to email not verified", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({ message: "Email not verified" }),
    });

    const result = await loginApi({
      email: "user@dreamkit.vn",
      password: "secret123",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("email-not-verified");
    }
  });
});

describe("registerApi", () => {
  it("returns success message on 201", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        message: "Registration successful. Please verify your email before login.",
        email: "new@dreamkit.vn",
      }),
    });

    const result = await registerApi({
      name: "New User",
      email: "new@dreamkit.vn",
      password: "secret123",
      confirmPassword: "secret123",
      address: "1 Main St",
      phone: "555-0100",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.email).toBe("new@dreamkit.vn");
    }
  });

  it("maps 409 to email taken", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
      statusText: "Conflict",
      json: async () => ({ message: "Email already in use" }),
    });

    const result = await registerApi({
      name: "User",
      email: "taken@dreamkit.vn",
      password: "secret123",
      confirmPassword: "secret123",
      address: "1 Main St",
      phone: "555-0100",
    });

    expect(result).toEqual({
      ok: false,
      code: "email-taken",
      message: "Email này đã được sử dụng.",
    });
  });
});
