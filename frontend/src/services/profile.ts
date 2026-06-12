import { apiFetch } from "@/lib/api";
import type { ProfileSummary, ProfileUpdate } from "@/types/profile";

export function getProfile(): Promise<ProfileSummary> {
  return apiFetch<ProfileSummary>("/api/profile");
}

export function updateProfile(patch: ProfileUpdate): Promise<ProfileSummary> {
  return apiFetch<ProfileSummary>("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/profile/password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
