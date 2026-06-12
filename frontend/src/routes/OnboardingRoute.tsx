import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

import { OnboardingFlow, type OnboardingUserData } from "@/components/onboarding/OnboardingFlow";
import { useAuthContext } from "@/context/AuthContext";
import { completeOnboarding } from "@/services/onboarding";
import type {
  ConditionSlug,
  OnboardingPayload,
  OnboardingRole,
  Region,
  Severity,
} from "@/types/onboarding";
import { ApiError } from "@/types/api";
import type { User } from "@/types/user";

const STORAGE_KEY = "lapya_onboarding";

const BP_PATTERN = /^\s*(\d+)\s*\/\s*(\d+)\s*$/;

function parseBpReading(raw: string): { bpSystolic: number | null; bpDiastolic: number | null } {
  const match = raw.match(BP_PATTERN);
  if (!match) return { bpSystolic: null, bpDiastolic: null };
  return { bpSystolic: Number(match[1]), bpDiastolic: Number(match[2]) };
}

function buildPayload(userData: OnboardingUserData): OnboardingPayload {
  if (userData.role === "dietitian") {
    return {
      role: "dietitian" as OnboardingRole,
      displayName: userData.name,
    } as OnboardingPayload;
  }
  const { bpSystolic, bpDiastolic } = parseBpReading(userData.bpReading);
  return {
    role: userData.role as OnboardingRole,
    displayName: userData.name,
    conditions: userData.conditions.map((c) => ({
      slug: c.id as ConditionSlug,
      severity: c.severity as Severity,
    })),
    foods: userData.foods,
    allergies: userData.allergies || null,
    region: userData.location as Region,
    age: Number(userData.age),
    weightKg: Number(userData.weight),
    lastBpCheck: userData.lastBpCheck || null,
    bpSystolic,
    bpDiastolic,
  };
}

export function OnboardingRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuthContext();

  const mutation = useMutation<User, Error, OnboardingPayload>({
    mutationFn: completeOnboarding,
    onSuccess: (updated) => {
      queryClient.setQueryData<User>(["me"], updated);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      navigate("/verify-email", { replace: true });
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : "Could not save your onboarding. Please try again.";
      toast.error(message);
    },
  });

  if (isLoading) return null;

  if (user?.onboardingCompletedAt) {
    return <Navigate to="/app" replace />;
  }

  return (
    <OnboardingFlow
      defaultName={user?.firstName ?? ""}
      onComplete={async (userData) => {
        await mutation.mutateAsync(buildPayload(userData));
      }}
    />
  );
}
