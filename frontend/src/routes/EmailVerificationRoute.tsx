import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

import { EmailVerification } from "@/components/auth/EmailVerification";
import { useAuthContext } from "@/context/AuthContext";
import { resendVerification, verifyEmail } from "@/services/auth";
import { ApiError } from "@/types/api";
import type { User } from "@/types/user";

export function EmailVerificationRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuthContext();

  const verifyMutation = useMutation<User, Error, string>({
    mutationFn: (code: string) => verifyEmail(code),
    onSuccess: (updated) => {
      queryClient.setQueryData<User>(["me"], updated);
      toast.success("Email verified. Welcome!");
      navigate("/app", { replace: true });
    },
  });

  if (isLoading) return null;
  if (user?.isEmailVerified) {
    return <Navigate to="/app" replace />;
  }

  return (
    <EmailVerification
      email={user?.email ?? "your email"}
      isVerifying={verifyMutation.isPending}
      onVerified={async (code) => {
        try {
          await verifyMutation.mutateAsync(code);
        } catch (err) {
          throw err instanceof ApiError ? new Error(err.message) : err;
        }
      }}
      onResend={async () => {
        await resendVerification();
      }}
    />
  );
}
