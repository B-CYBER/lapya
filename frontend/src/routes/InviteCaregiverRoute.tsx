import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { InviteCaregiver } from "@/components/caregiver/InviteCaregiver";
import { invite } from "@/services/caregiver";
import type { Relationship } from "@/types/caregiver";
import { ApiError } from "@/types/api";

export function InviteCaregiverRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: invite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregivers"] });
      toast.success("Invite sent. They'll get an email shortly.");
      navigate("/app/care-circle", { replace: true });
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Could not send invite."),
  });

  return (
    <InviteCaregiver
      onClose={() => navigate("/app/care-circle")}
      isSubmitting={mutation.isPending}
      onInviteSent={async (payload) => {
        await mutation.mutateAsync({
          email: payload.email,
          relationship: payload.relationship as Relationship,
        });
      }}
    />
  );
}
