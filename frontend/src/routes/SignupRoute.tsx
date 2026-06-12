import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

import { SignupScreen } from "@/components/auth/SignupScreen";
import { useAuthContext } from "@/context/AuthContext";
import { ApiError } from "@/types/api";

export function SignupRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, signup } = useAuthContext();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSignup = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      await signup.mutateAsync(data);
      navigate("/onboarding", { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not create your account. Please try again.";
      toast.error(message);
    }
  };

  return (
    <SignupScreen
      onBack={() => navigate("/welcome")}
      onSignup={handleSignup}
      onOpenLogin={() => navigate("/login")}
    />
  );
}
