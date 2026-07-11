import { describe, expect, it } from "vitest";
import { getPostLoginRedirect } from "./auth-redirect";

describe("getPostLoginRedirect", () => {
  it("sends admins to the admin dashboard", () => {
    expect(
      getPostLoginRedirect({
        id: "admin",
        name: "Admin",
        email: "admin@dreamkit.vn",
        role: "admin",
      }),
    ).toBe("/admin");
  });

  it("keeps customers on the current page", () => {
    expect(
      getPostLoginRedirect({
        id: "user-1",
        name: "Customer",
        email: "user@dreamkit.vn",
        role: "customer",
      }),
    ).toBeNull();
  });
});
