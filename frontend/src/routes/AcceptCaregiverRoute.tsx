import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { accept } from "@/services/caregiver";
import { ApiError } from "@/types/api";

export function AcceptCaregiverRoute() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const mutation = useMutation({
    mutationFn: (t: string) => accept(t),
    onSuccess: () => {
      toast.success("You're now linked. Welcome to the care circle.");
      navigate("/app/care-circle", { replace: true });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not accept invite.");
      navigate("/app", { replace: true });
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Missing invite token.");
      navigate("/app", { replace: true });
      return;
    }
    if (mutation.isIdle) {
      mutation.mutate(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
      <LoadingSpinner message="Linking you in…" />
    </div>
  );
}
