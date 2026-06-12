import { apiFetch } from "@/lib/api";
import type { MealPlanItem, WeekPlan } from "@/types/meal_plan";

export function getWeek(start?: string): Promise<WeekPlan> {
  const qs = start ? `?start=${start}` : "";
  return apiFetch<WeekPlan>(`/api/meal-plan/week${qs}`);
}

export function regenerateWeek(start?: string): Promise<WeekPlan> {
  const qs = start ? `?start=${start}` : "";
  return apiFetch<WeekPlan>(`/api/meal-plan/regenerate${qs}`, { method: "POST" });
}

export function swapMealItem(itemId: number, recipeId: number): Promise<MealPlanItem> {
  return apiFetch<MealPlanItem>(`/api/meal-plan/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ recipeId }),
  });
}

export function toggleMealComplete(itemId: number, isCompleted: boolean): Promise<MealPlanItem> {
  return apiFetch<MealPlanItem>(`/api/meal-plan/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ isCompleted }),
  });
}
