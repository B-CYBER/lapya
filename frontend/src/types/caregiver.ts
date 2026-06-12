import type { HealthMetric } from "./health";
import type { MealPlanItem } from "./meal_plan";
import type { User } from "./user";

export type Relationship = "Daughter" | "Son" | "Spouse" | "Friend" | "Other";
export type RelationshipStatus = "pending" | "accepted" | "revoked";

export interface CaregiverRelationship {
  id: number;
  patientId: number;
  caregiverId: number | null;
  status: RelationshipStatus;
  relationship: string;
  email: string;
  otherName: string | null;
  createdAt: string;
  acceptedAt: string | null;
}

export interface CaregiverInviteResponse {
  token: string;
  inviteUrl: string;
  sharePreview: string;
}

export interface CaregiverInviteRequest {
  email: string;
  relationship: Relationship;
}

export interface CaregiverHome {
  patient: User;
  todaysMeals: MealPlanItem[];
  groceryTotalKobo: number;
  recentMetrics: HealthMetric[];
}
