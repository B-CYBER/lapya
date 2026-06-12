import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

import { LoginScreen } from "@/components/LoginScreen";
import { useAuthContext } from "@/context/AuthContext";
import { ApiError } from "@/types/api";

export function LoginRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuthContext();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const result = await login.mutateAsync(data);
      if (!result.user.onboardingCompletedAt) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/app", { replace: true });
      }
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not sign in. Please try again.";
      toast.error(message);
    }
  };

  return (
    <LoginScreen
      onBack={() => navigate("/welcome")}
      onForgotPassword={() => navigate("/forgot-password")}
      onLogin={handleLogin}
      isSubmitting={login.isPending}
    />
  );
}
