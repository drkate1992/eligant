// Typed fetch wrappers used by the React Query hooks.

export class FetchError extends Error {
  status: number;
  issues?: Record<string, string[]>;
  constructor(message: string, status: number, issues?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new FetchError(
      body?.error ?? `Request failed (${res.status})`,
      res.status,
      body?.issues,
    );
  }
  return body as T;
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data?: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(data ?? {}) }),
  patch: <T>(url: string, data?: unknown) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(data ?? {}) }),
  del: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

export function buildQuery(params: Record<string, string | number | undefined | null>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "" && v !== "ALL") {
      sp.set(k, String(v));
    }
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
