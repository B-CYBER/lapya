import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import { CaregiverHome } from "@/components/caregiver/CaregiverHome";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { getCaregiverHome } from "@/services/caregiver";

const TIME_BY_TYPE: Record<string, string> = {
  breakfast: "7:00 AM",
  lunch: "1:00 PM",
  dinner: "6:30 PM",
  snack: "4:00 PM",
};

export function CaregiverHomeRoute() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["caregiver-home", patientId],
    queryFn: () => getCaregiverHome(Number(patientId)),
    enabled: !!patientId,
  });

  if (query.isLoading || !query.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  const todays = query.data.todaysMeals.map((m) => ({
    type: m.mealType.toUpperCase(),
    time: TIME_BY_TYPE[m.mealType] ?? "",
    name: m.recipe.name,
    logged: m.isCompleted,
    loggedAt: m.completedAt
      ? new Date(m.completedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      : undefined,
  }));

  return (
    <CaregiverHome
      patientName={query.data.patient.firstName}
      todaysMeals={todays}
      onViewWeek={() => navigate("/app/week")}
      onViewGroceryList={() => navigate("/app/grocery")}
    />
  );
}
