import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

import { LandingPage } from "@/components/landing/LandingPage";
import { useAuthContext } from "@/context/AuthContext";
import { joinWaitlist } from "@/services/waitlist";
import type { WaitlistRole } from "@/types/waitlist";
import { ApiError } from "@/types/api";

export function LandingRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (email: string, role: string) => {
    setIsSubmitting(true);
    try {
      await joinWaitlist({ email, role: role as WaitlistRole });
      toast.success("You're on the list. We'll be in touch.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't reach the server.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LandingPage
      onGetStarted={() => navigate("/signup")}
      onSubmitWaitlist={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
