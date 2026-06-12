import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { EmailVerification } from "@/components/auth/EmailVerification";
import { useAuthContext } from "@/context/AuthContext";
import { verifyEmail } from "@/services/auth";
import type { User } from "@/types/user";

export function EmailVerificationRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const verifyMutation = useMutation<User, Error>({
    mutationFn: () => verifyEmail("123456"),
    onSuccess: (updated) => {
      queryClient.setQueryData<User>(["me"], updated);
      toast.success("Email verified.");
      navigate("/app", { replace: true });
    },
  });

  return (
    <EmailVerification
      email={user?.email ?? "your email"}
      isVerifying={verifyMutation.isPending}
      onVerified={async () => {
        await verifyMutation.mutateAsync();
      }}
    />
  );
}
