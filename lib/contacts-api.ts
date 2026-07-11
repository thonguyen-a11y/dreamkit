import { apiFetch } from "./api-client";
import type { Contact, ContactStatus } from "./types";

/** Contact shape returned by the NestJS contacts API. */
export interface ApiContact {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly message: string;
  readonly status: ContactStatus;
  readonly createdAt: string;
  readonly updatedAt?: string;
}

export interface ContactsListMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
}

export interface ContactsListResponse {
  readonly data: readonly ApiContact[];
  readonly meta: ContactsListMeta;
}

export interface FetchContactsSuccess {
  readonly ok: true;
  readonly contacts: readonly Contact[];
  readonly meta: ContactsListMeta;
}

export interface FetchContactsFailure {
  readonly ok: false;
  readonly message: string;
}

export type FetchContactsResult = FetchContactsSuccess | FetchContactsFailure;

export interface ContactMutationSuccess {
  readonly ok: true;
  readonly contact: Contact;
}

export interface ContactMutationFailure {
  readonly ok: false;
  readonly status: number;
  readonly message: string;
}

export type ContactMutationResult = ContactMutationSuccess | ContactMutationFailure;

export interface CreateContactInput {
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly message: string;
}

interface ContactSubmissionResponse {
  readonly id: string;
  readonly createdAt: string;
}

export interface SubmitContactSuccess {
  readonly ok: true;
  readonly id: string;
  readonly createdAt: string;
}

export interface SubmitContactFailure {
  readonly ok: false;
  readonly message: string;
}

export type SubmitContactResult = SubmitContactSuccess | SubmitContactFailure;

/** Maps a backend contact record to the frontend admin model. */
export function mapApiContactToContact(apiContact: ApiContact): Contact {
  return {
    id: apiContact._id,
    name: apiContact.name,
    email: apiContact.email,
    phone: apiContact.phone,
    message: apiContact.message,
    status: apiContact.status,
    createdAt: apiContact.createdAt,
  };
}

function authHeaders(accessToken: string): HeadersInit {
  return { Authorization: `Bearer ${accessToken}` };
}

/** Lists contact submissions, newest first. Admin only. */
export async function fetchContactsApi(
  accessToken: string,
  page = 1,
  limit = 100,
): Promise<FetchContactsResult> {
  const result = await apiFetch<ContactsListResponse>(
    `/api/contacts?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: authHeaders(accessToken),
    },
  );

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  return {
    ok: true,
    contacts: result.data.data.map(mapApiContactToContact),
    meta: result.data.meta,
  };
}

/** Submits a contact message from the public inquiry form. */
export async function submitContactApi(
  input: CreateContactInput,
): Promise<SubmitContactResult> {
  const result = await apiFetch<ContactSubmissionResponse>("/api/contacts", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  return { ok: true, id: result.data.id, createdAt: result.data.createdAt };
}

/** Updates a contact message's read status. Admin only. */
export async function updateContactStatusApi(
  accessToken: string,
  id: string,
  status: ContactStatus,
): Promise<ContactMutationResult> {
  const result = await apiFetch<ApiContact>(`/api/contacts/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ status }),
  });

  if (!result.ok) {
    return { ok: false, status: result.status, message: result.message };
  }

  return { ok: true, contact: mapApiContactToContact(result.data) };
}
