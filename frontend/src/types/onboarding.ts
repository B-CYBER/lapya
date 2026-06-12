export type ConditionSlug =
  | "diabetes"
  | "hypertension"
  | "kidney"
  | "heart"
  | "weight"
  | "cholesterol"
  | "uric-acid"
  | "migraines"
  | "anxiety"
  | "acid-reflux"
  | "fatty-liver"
  | "arthritis";

export type Severity = "Mild" | "Moderate" | "Severe";

export type Region =
  | "north-central"
  | "north-east"
  | "north-west"
  | "south-east"
  | "south-south"
  | "south-west";

export type OnboardingRole = "patient" | "caregiver" | "dietitian";

export interface OnboardingCondition {
  slug: ConditionSlug;
  severity: Severity;
}

export interface OnboardingPayload {
  role: OnboardingRole;
  displayName: string;
  conditions?: OnboardingCondition[];
  foods?: string[];
  allergies?: string | null;
  region?: Region;
  age?: number;
  weightKg?: number;
  lastBpCheck?: string | null;
  bpSystolic?: number | null;
  bpDiastolic?: number | null;
}
