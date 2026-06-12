import { AlertCircle, Bell, Calendar, CheckCircle2, Clock, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { NotificationsList } from "@/components/notifications/NotificationsList";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { listNotifications, markAllRead, markRead } from "@/services/notifications";
import type { Notification, NotificationKind } from "@/types/notification";

interface PrototypeRow {
  id: string;
  type: string;
  icon: typeof Clock;
  iconColor: string;
  iconBg: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const ICON_BY_KIND: Record<NotificationKind, { icon: typeof Clock; color: string; bg: string }> = {
  reminder: { icon: Clock, color: "#3D6BE5", bg: "rgba(61, 107, 229, 0.12)" },
  success: { icon: CheckCircle2, color: "#6E9A6E", bg: "rgba(110, 154, 110, 0.12)" },
  caregiver: { icon: Users, color: "#E8A92E", bg: "rgba(232, 169, 46, 0.12)" },
  alert: { icon: AlertCircle, color: "#C9892E", bg: "rgba(201, 137, 46, 0.12)" },
  welcome: { icon: Bell, color: "#3D6BE5", bg: "rgba(61, 107, 229, 0.12)" },
};

function relativeTime(iso: string): string {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function toRow(n: Notification): PrototypeRow {
  const icon = ICON_BY_KIND[n.kind] ?? ICON_BY_KIND.alert;
  return {
    id: String(n.id),
    type: n.kind,
    icon: icon.icon,
    iconColor: icon.color,
    iconBg: icon.bg,
    title: n.title,
    message: n.body,
    time: relativeTime(n.createdAt),
    read: n.isRead,
  };
}

export function NotificationsRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["notifications"], queryFn: () => listNotifications() });

  const readMutation = useMutation({
    mutationFn: (id: number) => markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const allMutation = useMutation({
    mutationFn: () => markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  void Calendar;

  if (query.isLoading || !query.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <NotificationsList
      onBack={() => navigate("/app")}
      onOpenSettings={() => navigate("/app/settings")}
      notifications={query.data.map(toRow)}
      onMarkRead={(id) => readMutation.mutate(Number(id))}
      onMarkAllRead={() => allMutation.mutate()}
    />
  );
}
