import { apiFetch } from "@/lib/api";
import type { Settings, SettingsUpdate } from "@/types/settings";

export function getSettings(): Promise<Settings> {
  return apiFetch<Settings>("/api/settings");
}

export function updateSettings(patch: SettingsUpdate): Promise<Settings> {
  return apiFetch<Settings>("/api/settings", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}
