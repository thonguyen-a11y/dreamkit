import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchContactsApi,
  mapApiContactToContact,
  updateContactStatusApi,
} from "./contacts-api";

const API_CONTACT = {
  _id: "6a4b68f19d7d69258ee3978f",
  name: "Nguyen Van A",
  email: "a@example.com",
  phone: "0900000000",
  message: "Cần báo giá 15 bộ áo đấu.",
  status: "unread",
  createdAt: "2026-01-01T00:00:00.000Z",
} as const;

describe("mapApiContactToContact", () => {
  it("maps API fields to the admin contact model", () => {
    expect(mapApiContactToContact(API_CONTACT)).toEqual({
      id: API_CONTACT._id,
      name: API_CONTACT.name,
      email: API_CONTACT.email,
      phone: API_CONTACT.phone,
      message: API_CONTACT.message,
      status: "unread",
      createdAt: API_CONTACT.createdAt,
    });
  });
});

describe("fetchContactsApi / updateContactStatusApi", () => {
  const fetchMock = vi.fn();

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("fetches and maps the paginated contact list", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: [API_CONTACT],
        meta: { page: 1, limit: 100, total: 1, totalPages: 1 },
      }),
    });

    const result = await fetchContactsApi("token-123");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.contacts).toHaveLength(1);
      expect(result.contacts[0]?.id).toBe(API_CONTACT._id);
      expect(result.meta.total).toBe(1);
    }
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contacts?page=1&limit=100",
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

    const result = await fetchContactsApi("token-123");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Admin role required");
    }
  });

  it("marks a contact as read", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ...API_CONTACT, status: "read" }),
    });

    const result = await updateContactStatusApi("token-123", API_CONTACT._id, "read");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.contact.status).toBe("read");
    }
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/contacts/${API_CONTACT._id}/status`,
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ status: "read" }),
      }),
    );
  });
});
