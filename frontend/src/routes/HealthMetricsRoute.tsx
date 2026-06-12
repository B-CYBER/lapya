import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { HealthMetrics } from "@/components/health/HealthMetrics";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { listMetrics } from "@/services/health";
import type { HealthMetric, MetricType } from "@/types/health";

interface Row {
  date: string;
  value: string;
  time: string;
}

interface Series {
  name: string;
  unit: string;
  latest: string;
  status: string;
  trend: string;
  change: string;
  data: Row[];
  chart: number[];
}

const TYPE_META: Record<MetricType, { name: string; unit: string }> = {
  weight: { name: "Weight", unit: "kg" },
  blood_pressure: { name: "Blood Pressure", unit: "mmHg" },
  blood_sugar: { name: "Blood Sugar", unit: "mg/dL" },
};

function formatValue(m: HealthMetric): string {
  if (m.metricType === "blood_pressure" && m.valueSecondary != null) {
    return `${Math.round(m.value)}/${Math.round(m.valueSecondary)}`;
  }
  return String(Math.round(m.value));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function buildSeries(metrics: HealthMetric[], type: MetricType): Series {
  const meta = TYPE_META[type];
  const filtered = metrics
    .filter((m) => m.metricType === type)
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

  const data = filtered.map<Row>((m) => ({
    date: formatDate(m.recordedAt),
    value: formatValue(m),
    time: formatTime(m.recordedAt),
  }));
  const chart = filtered.map((m) => Math.round(m.value));
  const latest = data[data.length - 1]?.value ?? "—";

  return {
    name: meta.name,
    unit: meta.unit,
    latest,
    status: "good",
    trend: "stable",
    change: "—",
    data,
    chart: chart.length ? chart : [0],
  };
}

export function HealthMetricsRoute() {
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ["health-metrics"], queryFn: () => listMetrics() });

  const metricsData = useMemo(() => {
    const all = query.data ?? [];
    return {
      bp: buildSeries(all, "blood_pressure"),
      weight: buildSeries(all, "weight"),
      sugar: buildSeries(all, "blood_sugar"),
    };
  }, [query.data]);

  if (query.isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <HealthMetrics
      onBack={() => navigate("/app")}
      onAddMetric={() => navigate("/app/health-metrics/log")}
      metricsData={metricsData}
    />
  );
}
