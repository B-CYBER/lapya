import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { WeekView } from "@/components/mealplan/WeekView";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { useAuthContext } from "@/context/AuthContext";
import { getWeek, regenerateWeek } from "@/services/meal_plan";
import type { MealPlanItem, WeekPlan } from "@/types/meal_plan";
import type { SafetyRating } from "@/types/recipe";
import { ApiError } from "@/types/api";

const SHORT_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIME_BY_TYPE: Record<string, string> = {
  breakfast: "7:00 AM",
  lunch: "1:00 PM",
  dinner: "6:30 PM",
  snack: "4:00 PM",
};

function safetyArray(safety: Record<string, SafetyRating>): string[] {
  return Object.values(safety);
}

function toWeekMeal(item: MealPlanItem) {
  return {
    itemId: item.id,
    time: TIME_BY_TYPE[item.mealType] ?? "",
    type: item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1),
    name: item.recipe.name,
    localName: item.recipe.localName ?? undefined,
    image: item.recipe.imageUrl,
    portion: item.recipe.portion,
    safety: safetyArray(item.recipe.conditionSafety),
  };
}

function buildDays(plan: WeekPlan) {
  const start = new Date(plan.weekStart);
  return SHORT_NAMES.map((short, idx) => {
    const d = new Date(start);
    d.setDate(start.getDate() + idx);
    return { short, date: String(d.getDate()), full: FULL_NAMES[idx] };
  });
}

function buildMealsByDay(plan: WeekPlan) {
  const start = new Date(plan.weekStart);
  const grouped: Record<string, ReturnType<typeof toWeekMeal>[]> = {};
  for (let i = 0; i < 7; i += 1) {
    grouped[SHORT_NAMES[i]] = [];
  }
  for (const item of plan.items) {
    const itemDate = new Date(item.date);
    const offset = Math.floor((itemDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const short = SHORT_NAMES[offset];
    if (short) grouped[short].push(toWeekMeal(item));
  }
  return grouped;
}

export function WeekRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const userPlan: "free" | "care" =
    user?.plan === "care" || user?.plan === "family" ? "care" : "free";
  const weekQuery = useQuery({ queryKey: ["meal-plan", "week"], queryFn: () => getWeek() });

  const regenerate = useMutation({
    mutationFn: () => regenerateWeek(),
    onSuccess: (data) => {
      queryClient.setQueryData(["meal-plan", "week"], data);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "today"] });
      queryClient.invalidateQueries({ queryKey: ["grocery-list"] });
      toast.success("New plan ready.");
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not regenerate.");
    },
  });

  const days = useMemo(() => (weekQuery.data ? buildDays(weekQuery.data) : undefined), [weekQuery.data]);
  const mealsByDay = useMemo(
    () => (weekQuery.data ? buildMealsByDay(weekQuery.data) : undefined),
    [weekQuery.data],
  );

  if (weekQuery.isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <WeekView
      onBack={() => navigate("/app")}
      onMealClick={(meal) => {
        if (meal.itemId) navigate(`/app/meals/${meal.itemId}`);
      }}
      userPlan={userPlan}
      days={days}
      mealsByDay={mealsByDay}
      onRegenerate={() => regenerate.mutate()}
      isRegenerating={regenerate.isPending}
    />
  );
}
