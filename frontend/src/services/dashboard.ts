import { apiFetch } from "@/lib/api";
import type { DashboardToday } from "@/types/dashboard";

export function getDashboardToday(): Promise<DashboardToday> {
  return apiFetch<DashboardToday>("/api/dashboard/today");
}
