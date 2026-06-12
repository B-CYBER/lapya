import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { LogMetric } from "@/components/health/LogMetric";
import { logMetric } from "@/services/health";
import type { HealthMetricCreate, MetricType } from "@/types/health";
import { ApiError } from "@/types/api";

interface PrototypeData {
  type: "bp" | "weight" | "sugar";
  value: string;
  notes: string;
  timestamp: string;
}

function toPayload(data: PrototypeData): HealthMetricCreate | null {
  if (data.type === "weight") {
    const v = Number(data.value);
    return Number.isFinite(v) ? { type: "weight", value: v, notes: data.notes || null } : null;
  }
  if (data.type === "sugar") {
    const v = Number(data.value);
    return Number.isFinite(v)
      ? ({ type: "blood_sugar" as MetricType, value: v, notes: data.notes || null })
      : null;
  }
  // bp: value is "systolic/diastolic"
  const match = data.value.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (!match) return null;
  return {
    type: "blood_pressure",
    value: Number(match[1]),
    valueSecondary: Number(match[2]),
    notes: data.notes || null,
  };
}

export function LogMetricRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logMetric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-metrics"] });
      toast.success("Logged.");
      navigate("/app/health-metrics", { replace: true });
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Could not save reading."),
  });

  return (
    <LogMetric
      onClose={() => navigate("/app/health-metrics")}
      onSave={(data: PrototypeData) => {
        const payload = toPayload(data);
        if (!payload) {
          toast.error("Please enter valid numbers.");
          return;
        }
        mutation.mutate(payload);
      }}
    />
  );
}
