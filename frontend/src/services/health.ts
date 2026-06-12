import { apiFetch } from "@/lib/api";
import type { HealthMetric, HealthMetricCreate, MetricType } from "@/types/health";

interface ListParams {
  type?: MetricType;
  fromDate?: string;
  toDate?: string;
}

export function listMetrics(params: ListParams = {}): Promise<HealthMetric[]> {
  const search = new URLSearchParams();
  if (params.type) search.set("type", params.type);
  if (params.fromDate) search.set("fromDate", params.fromDate);
  if (params.toDate) search.set("toDate", params.toDate);
  const qs = search.toString();
  return apiFetch<HealthMetric[]>(`/api/health/metrics${qs ? `?${qs}` : ""}`);
}

export function logMetric(input: HealthMetricCreate): Promise<HealthMetric> {
  return apiFetch<HealthMetric>("/api/health/metrics", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
