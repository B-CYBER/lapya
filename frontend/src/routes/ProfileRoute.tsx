import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { useAuthContext } from "@/context/AuthContext";
import { getProfile } from "@/services/profile";
import type { ProfileSummary } from "@/types/profile";

const CONDITION_LABELS: Record<string, string> = {
  diabetes: "Type 2 Diabetes",
  hypertension: "High Blood Pressure",
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

const REGION_LABELS: Record<string, string> = {
  "north-central": "North Central",
  "north-east": "North East",
  "north-west": "North West",
  "south-east": "South East",
  "south-south": "South South",
  "south-west": "South West",
};

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  care: "Care",
  family: "Family",
};

function buildPrototypeData(p: ProfileSummary) {
  const join = new Date(p.user.createdAt);
  return {
    name: p.displayName ?? `${p.user.firstName} ${p.user.lastName}`,
    age: p.age ?? 0,
    weight: Math.round(p.weightKg ?? 0),
    conditions: p.conditions.map((c) => ({
      name: CONDITION_LABELS[c.slug] ?? c.slug,
      severity: c.severity,
    })),
    location: p.region ? REGION_LABELS[p.region] ?? p.region : "Nigeria",
    plan: PLAN_LABELS[p.user.plan] ?? p.user.plan,
    joinDate: join.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    streak: p.streakDays,
    mealsLogged: p.mealsLogged,
    adherence: p.adherencePct,
  };
}

export function ProfileRoute() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const query = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const profile = useMemo(
    () => (query.data ? buildPrototypeData(query.data) : undefined),
    [query.data],
  );

  if (query.isLoading || !query.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ProfileScreen
      onBack={() => navigate("/app")}
      onOpenSettings={() => navigate("/app/settings")}
      onOpenCareCircle={() => navigate("/app/care-circle")}
      onOpenHealthMetrics={() => navigate("/app/health-metrics")}
      onOpenUpgrade={() => navigate("/app/upgrade")}
      onEditProfile={() => navigate("/app/profile/edit")}
      onSignOut={logout}
      profile={profile}
    />
  );
}
