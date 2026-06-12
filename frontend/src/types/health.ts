export type MetricType = "weight" | "blood_pressure" | "blood_sugar";

export interface HealthMetric {
  id: number;
  metricType: MetricType;
  value: number;
  valueSecondary: number | null;
  unit: string;
  recordedAt: string;
  notes: string | null;
}

export interface HealthMetricCreate {
  type: MetricType;
  value: number;
  valueSecondary?: number | null;
  unit?: string;
  notes?: string | null;
  recordedAt?: string | null;
}
