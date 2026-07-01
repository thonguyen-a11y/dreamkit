import { describe, expect, it } from "vitest";
import {
  isValid,
  validateLogin,
  validateRegister,
  type LoginValues,
  type RegisterValues,
} from "./auth-validation";

const validLogin: LoginValues = {
  identifier: "user@dreamkit.vn",
  password: "secret123",
};

const validRegister: RegisterValues = {
  name: "Nguyen Van A",
  email: "user@dreamkit.vn",
  password: "secret123",
  confirmPassword: "secret123",
};

describe("validateLogin", () => {
  it("passes with an identifier and password", () => {
    expect(isValid(validateLogin(validLogin))).toBe(true);
  });

  it("flags empty identifier and password", () => {
    const errors = validateLogin({ identifier: "  ", password: "" });
    expect(errors.identifier).toBeDefined();
    expect(errors.password).toBeDefined();
  });
});

describe("validateRegister", () => {
  it("passes with valid input", () => {
    expect(isValid(validateRegister(validRegister))).toBe(true);
  });

  it("rejects an invalid email", () => {
    const errors = validateRegister({ ...validRegister, email: "not-an-email" });
    expect(errors.email).toBeDefined();
  });

  it("rejects a short password", () => {
    const errors = validateRegister({
      ...validRegister,
      password: "123",
      confirmPassword: "123",
    });
    expect(errors.password).toBeDefined();
  });

  it("rejects mismatched confirmation", () => {
    const errors = validateRegister({
      ...validRegister,
      confirmPassword: "different",
    });
    expect(errors.confirmPassword).toBeDefined();
  });

  it("requires a name", () => {
    const errors = validateRegister({ ...validRegister, name: "" });
    expect(errors.name).toBeDefined();
  });
});
