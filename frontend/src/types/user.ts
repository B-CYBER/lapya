export type Role = "patient" | "caregiver" | "dietitian" | "admin";
export type Plan = "free" | "care" | "family";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  dietitianVerified: boolean;
  isEmailVerified: boolean;
  onboardingCompletedAt: string | null;
  language: string;
  phone: string | null;
  plan: Plan;
  notifMealReminders: boolean;
  notifTips: boolean;
  notifCaregiverAlerts: boolean;
  notifMarketing: boolean;
  createdAt: string;
}

export interface TokenResponse {
  user: User;
  accessToken: string;
}
