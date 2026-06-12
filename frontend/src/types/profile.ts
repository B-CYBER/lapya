import type { OnboardingCondition, Region } from "./onboarding";
import type { User } from "./user";

export interface ConditionView {
  slug: string;
  severity: string;
}

export interface ProfileSummary {
  user: User;
  displayName: string | null;
  age: number | null;
  weightKg: number | null;
  region: Region | null;
  foods: string[];
  allergies: string | null;
  conditions: ConditionView[];
  streakDays: number;
  mealsLogged: number;
  adherencePct: number;
}

export interface ProfileUpdate {
  displayName?: string;
  foods?: string[];
  allergies?: string | null;
  region?: Region;
  age?: number;
  weightKg?: number;
  conditions?: OnboardingCondition[];
}
