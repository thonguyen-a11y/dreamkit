import { afterEach, describe, expect, it, vi } from "vitest";
import {
  deleteUserApi,
  fetchUsersApi,
  mapApiUserToUser,
  updateUserRoleApi,
} from "./users-api";

const API_USER = {
  _id: "6a4b68f19d7d69258ee3978f",
  email: "customer@dreamkit.vn",
  name: "Nguyen Van A",
  role: "user",
  address: "123 Le Loi",
  phone: "0900000000",
  isEmailVerified: true,
  createdAt: "2026-01-01T00:00:00.000Z",
} as const;

describe("mapApiUserToUser", () => {
  it("maps API fields to the admin user model", () => {
    expect(mapApiUserToUser(API_USER)).toEqual({
      id: API_USER._id,
      name: API_USER.name,
      email: API_USER.email,
      phone: API_USER.phone,
      address: API_USER.address,
      role: "customer",
      createdAt: API_USER.createdAt,
      isEmailVerified: true,
    });
  });

  it("maps admin role through unchanged", () => {
    expect(mapApiUserToUser({ ...API_USER, role: "admin" }).role).toBe("admin");
  });
});

describe("fetchUsersApi / updateUserRoleApi / deleteUserApi", () => {
  const fetchMock = vi.fn();

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("fetches and maps the user list", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [API_USER],
    });

    const result = await fetchUsersApi("token-123");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.users).toHaveLength(1);
      expect(result.users[0]?.id).toBe(API_USER._id);
    }
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/users",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ Authorization: "Bearer token-123" }),
      }),
    );
  });

  it("surfaces a failure message when the request fails", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({ message: "Admin role required" }),
    });

    const result = await fetchUsersApi("token-123");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Admin role required");
    }
  });

  it("sends the mapped role when updating a user", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ...API_USER, role: "admin" }),
    });

    const result = await updateUserRoleApi("token-123", API_USER._id, "admin");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.role).toBe("admin");
    }
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/users/${API_USER._id}`,
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ role: "admin" }),
      }),
    );
  });

  it("reports failure when demoting the last admin is rejected", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({ message: "Cannot remove or demote the last admin" }),
    });

    const result = await updateUserRoleApi("token-123", API_USER._id, "customer");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(403);
    }
  });

  it("deletes a user", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({ ok: true, status: 204 });

    const result = await deleteUserApi("token-123", API_USER._id);

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/users/${API_USER._id}`,
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
