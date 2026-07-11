export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface ApiErrorBody {
  readonly message?: string | readonly string[];
  readonly statusCode?: number;
  readonly error?: string;
}

export type ApiFetchResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly status: number; readonly message: string };

export async function parseApiError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (Array.isArray(body.message)) {
      return body.message.join(", ");
    }
    if (typeof body.message === "string" && body.message.length > 0) {
      return body.message;
    }
  } catch {
    // Fall through to status text.
  }

  return response.statusText || "Đã xảy ra lỗi. Vui lòng thử lại.";
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiFetchResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: await parseApiError(response),
      };
    }

    if (response.status === 204) {
      return { ok: true, data: undefined as T };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Không thể kết nối máy chủ. Vui lòng thử lại sau.",
    };
  }
}
