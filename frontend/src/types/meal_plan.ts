import type { MealType, RecipeSummary } from "./recipe";

export type { MealType };

export interface MealPlanItem {
  id: number;
  date: string;
  mealType: MealType;
  isCompleted: boolean;
  completedAt: string | null;
  sortOrder: number;
  recipe: RecipeSummary;
  editedByDietitianId?: number | null;
  editedByDietitianName?: string | null;
  dietitianNote?: string | null;
}

export interface WeekPlan {
  weekStart: string;
  items: MealPlanItem[];
}
