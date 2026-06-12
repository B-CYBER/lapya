import { apiFetch } from "@/lib/api";
import type { Notification } from "@/types/notification";

export function listNotifications(unread = false): Promise<Notification[]> {
  return apiFetch<Notification[]>(`/api/notifications${unread ? "?unread=true" : ""}`);
}

export function markRead(notificationId: number): Promise<Notification> {
  return apiFetch<Notification>(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
}

export function markAllRead(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/notifications/mark-all-read", {
    method: "POST",
  });
}
