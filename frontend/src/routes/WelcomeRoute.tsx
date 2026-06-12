import { Navigate, useNavigate } from "react-router";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useAuthContext } from "@/context/AuthContext";

export function WelcomeRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthContext();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <WelcomeScreen
      onGetStarted={() => navigate("/signup")}
      onOpenLogin={() => navigate("/login")}
    />
  );
}
