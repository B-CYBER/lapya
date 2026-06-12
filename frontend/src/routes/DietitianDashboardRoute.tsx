import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { DietitianDashboard } from "@/components/dietitian/DietitianDashboard";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { listPatients } from "@/services/dietitian";
import type { PatientSummary } from "@/types/dietitian";

const CONDITION_LABELS: Record<string, string> = {
  diabetes: "Diabetes",
  hypertension: "High BP",
  kidney: "Kidney",
  heart: "Heart",
  weight: "Weight",
  cholesterol: "Cholesterol",
  "uric-acid": "Uric Acid",
  migraines: "Migraines",
  anxiety: "Anxiety",
  "acid-reflux": "Reflux",
  "fatty-liver": "Fatty Liver",
  arthritis: "Arthritis",
};

const AVATAR_PALETTE = ["#A8BCF0", "#E8A92E", "#6E9A6E", "#B4533A", "#3D6BE5"];

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function toPrototypeRow(p: PatientSummary) {
  return {
    id: String(p.id),
    name: `${p.firstName} ${p.lastName}`,
    age: p.age ?? 0,
    conditions: p.conditions.map((c) => CONDITION_LABELS[c.slug] ?? c.slug),
    adherence: p.adherencePct,
    lastLog: relativeTime(p.lastActivityAt),
    status: p.status,
    alerts: p.alertCount,
    avatar: AVATAR_PALETTE[p.id % AVATAR_PALETTE.length],
  };
}

export function DietitianDashboardRoute() {
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ["dietitian", "patients"], queryFn: listPatients });

  if (query.isLoading || !query.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <DietitianDashboard
      patients={query.data.map(toPrototypeRow)}
      onPatientClick={(id) => navigate(`/app/dietitian/patients/${id}`)}
      onInviteClick={() => navigate("/app/dietitian/invite")}
    />
  );
}
