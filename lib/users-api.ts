import { apiFetch } from "./api-client";
import type { User, UserRole } from "./types";

/** User shape returned by the NestJS users API (password field stripped). */
export interface ApiUserRecord {
  readonly _id: string;
  readonly email: string;
  readonly name: string;
  readonly role: "admin" | "user";
  readonly address: string;
  readonly phone: string;
  readonly isEmailVerified: boolean;
  readonly createdAt: string;
  readonly updatedAt?: string;
}

export interface FetchUsersSuccess {
  readonly ok: true;
  readonly users: readonly User[];
}

export interface FetchUsersFailure {
  readonly ok: false;
  readonly message: string;
}

export type FetchUsersResult = FetchUsersSuccess | FetchUsersFailure;

export interface UserMutationSuccess {
  readonly ok: true;
  readonly user: User;
}

export interface UserMutationFailure {
  readonly ok: false;
  readonly status: number;
  readonly message: string;
}

export type UserMutationResult = UserMutationSuccess | UserMutationFailure;

export interface DeleteUserSuccess {
  readonly ok: true;
}

export interface DeleteUserFailure {
  readonly ok: false;
  readonly status: number;
  readonly message: string;
}

export type DeleteUserResult = DeleteUserSuccess | DeleteUserFailure;

function mapApiRole(role: ApiUserRecord["role"]): UserRole {
  return role === "admin" ? "admin" : "customer";
}

function mapRoleToApi(role: UserRole): "admin" | "user" {
  return role === "admin" ? "admin" : "user";
}

/** Maps a backend user record to the frontend admin user model. */
export function mapApiUserToUser(apiUser: ApiUserRecord): User {
  return {
    id: apiUser._id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone,
    address: apiUser.address,
    role: mapApiRole(apiUser.role),
    createdAt: apiUser.createdAt,
    isEmailVerified: apiUser.isEmailVerified,
  };
}

function authHeaders(accessToken: string): HeadersInit {
  return { Authorization: `Bearer ${accessToken}` };
}

/** Lists all users. Admin only. */
export async function fetchUsersApi(accessToken: string): Promise<FetchUsersResult> {
  const result = await apiFetch<readonly ApiUserRecord[]>("/api/users", {
    method: "GET",
    headers: authHeaders(accessToken),
  });

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  return { ok: true, users: result.data.map(mapApiUserToUser) };
}

/** Updates a user's role. Admin only; rejected if it would demote the last admin. */
export async function updateUserRoleApi(
  accessToken: string,
  id: string,
  role: UserRole,
): Promise<UserMutationResult> {
  const result = await apiFetch<ApiUserRecord>(`/api/users/${id}`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ role: mapRoleToApi(role) }),
  });

  if (!result.ok) {
    return { ok: false, status: result.status, message: result.message };
  }

  return { ok: true, user: mapApiUserToUser(result.data) };
}

/** Deletes a user. Admin only; rejected if it would remove the last admin. */
export async function deleteUserApi(
  accessToken: string,
  id: string,
): Promise<DeleteUserResult> {
  const result = await apiFetch<undefined>(`/api/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
  });

  if (!result.ok) {
    return { ok: false, status: result.status, message: result.message };
  }

  return { ok: true };
}
