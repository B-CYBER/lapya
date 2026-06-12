import { apiFetch } from "@/lib/api";
import type { OnboardingPayload } from "@/types/onboarding";
import type { User } from "@/types/user";

export function completeOnboarding(payload: OnboardingPayload): Promise<User> {
  return apiFetch<User>("/api/onboarding/complete", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
