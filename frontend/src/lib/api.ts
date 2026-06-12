import { ApiError } from "@/types/api";

const TOKEN_KEY = "lapya_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, { ...init, headers });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const code = (body && typeof body.error === "string" && body.error) || "request_failed";
    const message =
      (body && typeof body.message === "string" && body.message) ||
      "Something went wrong. Please try again.";
    throw new ApiError(code, message, response.status);
  }

  return body as T;
}
