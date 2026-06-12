export type WaitlistRole = "patient" | "caregiver" | "dietitian" | "other";

export interface WaitlistRequest {
  email: string;
  role: WaitlistRole;
}
