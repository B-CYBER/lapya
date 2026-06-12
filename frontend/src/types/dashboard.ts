import type { MealPlanItem } from "./meal_plan";
import type { User } from "./user";

export interface DashboardToday {
  user: User;
  todaysMeals: MealPlanItem[];
  streakDays: number;
  tip: string;
}
