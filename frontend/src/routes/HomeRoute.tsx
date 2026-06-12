import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";

import { HomeScreen } from "@/components/HomeScreen";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { useAuthContext } from "@/context/AuthContext";
import { getDashboardToday } from "@/services/dashboard";
import type { MealPlanItem } from "@/types/meal_plan";
import type { SafetyRating } from "@/types/recipe";

function summariseSafety(safety: Record<string, SafetyRating>): {
  level: SafetyRating;
  text: string;
} {
  const entries = Object.entries(safety);
  if (entries.length === 0) return { level: "safe", text: "Safe for your plan" };
  const worst: SafetyRating = entries.some(([, v]) => v === "avoid")
    ? "avoid"
    : entries.some(([, v]) => v === "caution")
      ? "caution"
      : "safe";
  const conditionLabels = entries.map(([k]) => k).slice(0, 2).join(" & ");
  const text =
    worst === "safe"
      ? `Safe for ${conditionLabels}`
      : worst === "caution"
        ? `Watch portion (${conditionLabels})`
        : `Avoid (${conditionLabels})`;
  return { level: worst, text };
}

function toHomeMeal(item: MealPlanItem) {
  const safety = summariseSafety(item.recipe.conditionSafety);
  return {
    itemId: item.id,
    type: item.mealType.toUpperCase(),
    name: item.recipe.name,
    image: item.recipe.imageUrl,
    safety: safety.level,
    safetyText: safety.text,
    portion: item.recipe.portion,
  };
}

export function HomeRoute() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const today = useQuery({ queryKey: ["dashboard", "today"], queryFn: getDashboardToday });

  if (user?.role === "dietitian" && user.dietitianVerified) {
    return <Navigate to="/app/dietitian" replace />;
  }

  if (today.isLoading || !today.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  const userPlan: "free" | "care" =
    user?.plan === "care" || user?.plan === "family" ? "care" : "free";

  return (
    <HomeScreen
      userName={user?.firstName ?? "Mama"}
      userPlan={userPlan}
      streakDays={today.data.streakDays}
      tip={today.data.tip}
      meals={today.data.todaysMeals.map(toHomeMeal)}
      onNavigateToWeek={() => navigate("/app/week")}
      onOpenGroceryList={() => navigate("/app/grocery")}
      onOpenScanner={() => navigate("/app/scanner")}
      onOpenUpgrade={() => navigate("/app/upgrade")}
      onOpenProfile={() => navigate("/app/profile")}
      onOpenNotifications={() => navigate("/app/notifications")}
      onMealClick={(meal) => {
        if (meal.itemId) navigate(`/app/meals/${meal.itemId}`);
      }}
    />
  );
}
