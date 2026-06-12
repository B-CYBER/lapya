import { useEffect } from "react";
import { useNavigate } from "react-router";
import { SplashScreen } from "@/components/SplashScreen";
import { useAuthContext } from "@/context/AuthContext";

export function SplashRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? "/app" : "/welcome", { replace: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigate]);

  return <SplashScreen />;
}
