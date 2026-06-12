import type { HealthMetric } from "./health";
import type { WeekPlan } from "./meal_plan";
import type { ProfileSummary, ConditionView } from "./profile";
import type { User } from "./user";

export interface PatientSummary {
  id: number;
  firstName: string;
  lastName: string;
  age: number | null;
  conditions: ConditionView[];
  adherencePct: number;
  lastActivityAt: string | null;
  status: "active" | "attention";
  alertCount: number;
}

export interface DietitianPatientDetail {
  patient: User;
  profile: ProfileSummary;
  weekPlan: WeekPlan;
  recentMetrics: HealthMetric[];
}

export type DietitianRelationshipStatus = "pending" | "accepted" | "revoked";

export interface DietitianInviteRequest {
  email: string;
}

export interface DietitianInviteResponse {
  token: string;
  inviteUrl: string;
  sharePreview: string;
}

export interface DietitianRelationship {
  id: number;
  patientId: number | null;
  dietitianId: number;
  status: DietitianRelationshipStatus;
  email: string;
  otherName: string | null;
  createdAt: string;
  acceptedAt: string | null;
}

export interface PatientNote {
  id: number;
  patientId: number;
  dietitianId: number;
  dietitianName: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientNoteCreateRequest {
  body: string;
}

export interface DietitianMealEditRequest {
  recipeId?: number;
  dietitianNote?: string;
}
