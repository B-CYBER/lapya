import { apiFetch, getToken } from "@/lib/api";
import { ApiError } from "@/types/api";
import type { ScanResult } from "@/types/scan";

export async function scan(image?: Blob): Promise<ScanResult> {
  if (!image) {
    return apiFetch<ScanResult>("/api/scanner/scan", { method: "POST" });
  }

  const form = new FormData();
  form.append("image", image, "scan.jpg");

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch("/api/scanner/scan", {
    method: "POST",
    headers,
    body: form,
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const code = (body && typeof body.error === "string" && body.error) || "request_failed";
    const message =
      (body && typeof body.message === "string" && body.message) ||
      "Could not scan that photo.";
    throw new ApiError(code, message, response.status);
  }
  return body as ScanResult;
}

export function getScanHistory(limit = 10): Promise<ScanResult[]> {
  return apiFetch<ScanResult[]>(`/api/scanner/history?limit=${limit}`);
}
