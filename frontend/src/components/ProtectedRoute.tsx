import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "@/context/AuthContext";
import type { Role } from "@/types/user";
import { LoadingSpinner } from "./polish/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
}

const ONBOARDING_BYPASS_PATHS = new Set(["/onboarding", "/verify-email"]);

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FBFAF7]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    user &&
    !user.onboardingCompletedAt &&
    !ONBOARDING_BYPASS_PATHS.has(location.pathname)
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  // Onboarded but unverified: hold at the code screen until the OTP is entered.
  if (
    user &&
    user.onboardingCompletedAt &&
    !user.isEmailVerified &&
    !ONBOARDING_BYPASS_PATHS.has(location.pathname)
  ) {
    return <Navigate to="/verify-email" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/app" replace />;
  }

  if (requiredRole === "dietitian" && user && !user.dietitianVerified) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
