import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { EditProfile } from "@/components/profile/EditProfile";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { getProfile, updateProfile } from "@/services/profile";
import type { ProfileUpdate } from "@/types/profile";
import { ApiError } from "@/types/api";

export function EditProfileRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated.");
      navigate("/app/profile", { replace: true });
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Could not save changes."),
  });

  if (profileQuery.isLoading || !profileQuery.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  const profile = profileQuery.data;
  return (
    <EditProfile
      onBack={() => navigate("/app/profile")}
      isSubmitting={mutation.isPending}
      initial={{
        firstName: profile.user.firstName,
        lastName: profile.user.lastName,
        email: profile.user.email,
        phone: profile.user.phone ?? "",
      }}
      onSave={(data) => {
        const patch: ProfileUpdate = {
          displayName: `${data.firstName} ${data.lastName}`.trim(),
        };
        mutation.mutate(patch);
      }}
    />
  );
}
