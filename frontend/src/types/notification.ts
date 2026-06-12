export type NotificationKind = "reminder" | "success" | "caregiver" | "alert" | "welcome";

export interface Notification {
  id: number;
  kind: NotificationKind;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}
