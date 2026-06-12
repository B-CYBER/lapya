import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { PatientDetail } from "@/components/dietitian/PatientDetail";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import {
  createPatientNote,
  getPatient,
  listPatientNotes,
} from "@/services/dietitian";
import { ApiError } from "@/types/api";
import type { DietitianPatientDetail } from "@/types/dietitian";

const CONDITION_LABELS: Record<string, string> = {
  diabetes: "Type 2 Diabetes",
  hypertension: "Hypertension",
  kidney: "Kidney Disease",
  heart: "Heart Disease",
  weight: "Weight Management",
  cholesterol: "High Cholesterol",
  "uric-acid": "Uric Acid / Gout",
  migraines: "Migraines",
  anxiety: "Anxiety",
  "acid-reflux": "Acid Reflux",
  "fatty-liver": "Fatty Liver",
  arthritis: "Arthritis",
};

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function buildPatientProp(d: DietitianPatientDetail) {
  const bpMetric = d.recentMetrics.find((m) => m.metricType === "blood_pressure");
  const bpString = bpMetric && bpMetric.valueSecondary != null
    ? `${Math.round(bpMetric.value)}/${Math.round(bpMetric.valueSecondary)}`
    : "—";
  const bpDate = bpMetric
    ? new Date(bpMetric.recordedAt).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
  return {
    name: `${d.patient.firstName} ${d.patient.lastName}`,
    age: d.profile.age ?? 0,
    weight: Math.round(d.profile.weightKg ?? 0),
    conditions: d.profile.conditions.map((c) => ({
      name: CONDITION_LABELS[c.slug] ?? c.slug,
      severity: c.severity,
    })),
    location: d.profile.region ?? "—",
    adherence: d.profile.adherencePct,
    lastBP: bpString,
    lastBPDate: bpDate,
  };
}

function buildWeeklyPlan(d: DietitianPatientDetail) {
  const start = new Date(d.weekPlan.weekStart);
  return DAY_NAMES.map((day, idx) => {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + idx);
    const dayKey = dayDate.toISOString().slice(0, 10);
    const meals = d.weekPlan.items
      .filter((item) => item.date.slice(0, 10) === dayKey)
      .map((item) => {
        const allSafe = Object.values(item.recipe.conditionSafety).every((v) => v === "safe");
        return {
          itemId: item.id,
          type: item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1),
          name: item.recipe.name,
          calories: item.recipe.calories,
          safe: allSafe,
          editedByName: item.editedByDietitianName ?? null,
          dietitianNote: item.dietitianNote ?? null,
        };
      });
    return { day, meals };
  }).filter((d) => d.meals.length > 0);
}

function buildRecentActivity(d: DietitianPatientDetail) {
  return d.recentMetrics.slice(0, 6).map((m) => ({
    date: new Date(m.recordedAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
    action:
      m.metricType === "blood_pressure" && m.valueSecondary != null
        ? `BP reading: ${Math.round(m.value)}/${Math.round(m.valueSecondary)}`
        : `${m.metricType.replace("_", " ")}: ${m.value} ${m.unit}`,
    status: "info" as const,
  }));
}

export function PatientDetailRoute() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const numericPatientId = Number(patientId);

  const query = useQuery({
    queryKey: ["dietitian", "patient", patientId],
    queryFn: () => getPatient(numericPatientId),
    enabled: !!patientId,
  });

  const notesQuery = useQuery({
    queryKey: ["dietitian", "patient", patientId, "notes"],
    queryFn: () => listPatientNotes(numericPatientId),
    enabled: !!patientId,
  });

  const noteMutation = useMutation({
    mutationFn: (body: string) =>
      createPatientNote(numericPatientId, { body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dietitian", "patient", patientId, "notes"],
      });
      toast.success("Note added.");
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Could not save note."),
  });

  if (query.isLoading || !query.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PatientDetail
      patientId={String(patientId)}
      onBack={() => navigate("/app/dietitian")}
      patient={buildPatientProp(query.data)}
      weeklyPlan={buildWeeklyPlan(query.data)}
      recentActivity={buildRecentActivity(query.data)}
      notes={(notesQuery.data ?? []).map((n) => ({
        id: n.id,
        body: n.body,
        dietitianName: n.dietitianName,
        createdAt: n.createdAt,
      }))}
      onSwapMeal={(itemId) =>
        navigate(`/app/dietitian/swap/${patientId}/${itemId}`)
      }
      onAddNote={async (body) => {
        await noteMutation.mutateAsync(body);
      }}
    />
  );
}
