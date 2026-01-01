export type ApiResponse<T> = { data: T };

const withAuthHeaders = (headers: HeadersInit | undefined): HeadersInit => {
  const token = localStorage.getItem("token");
  if (!token) return headers ?? {};
  return {
    ...(headers ?? {}),
    Authorization: `Bearer ${token}`,
  };
};

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(input, {
    credentials: "include",
    ...init,
    headers: {
      ...withAuthHeaders(init?.headers),
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = (isJson ? await res.json() : undefined) as T;

  if (!res.ok) {
    const message = typeof (data as any)?.message === "string" ? (data as any).message : `HTTP ${res.status}`;
    throw new Error(message);
  }

  return { data };
}

export const api = {
  get: <T = any>(url: string, init?: RequestInit) => requestJson<T>(url, { ...init, method: "GET" }),
  post: <T = any>(url: string, body?: unknown, init?: RequestInit) =>
    requestJson<T>(url, {
      ...init,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...withAuthHeaders(init?.headers),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  put: <T = any>(url: string, body?: unknown, init?: RequestInit) =>
    requestJson<T>(url, {
      ...init,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...withAuthHeaders(init?.headers),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  patch: <T = any>(url: string, body?: unknown, init?: RequestInit) =>
    requestJson<T>(url, {
      ...init,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...withAuthHeaders(init?.headers),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: <T = any>(url: string, init?: RequestInit) => requestJson<T>(url, { ...init, method: "DELETE" }),
};
