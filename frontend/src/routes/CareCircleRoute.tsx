import { Crown, Heart, Stethoscope } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { CareCircle } from "@/components/caregiver/CareCircle";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { useAuthContext } from "@/context/AuthContext";
import { listMyCaregivers } from "@/services/caregiver";
import type { CaregiverRelationship } from "@/types/caregiver";

interface CircleMember {
  name: string;
  role: string;
  icon: typeof Crown;
  iconColor: string;
  badgeColor: string;
  phone: string;
  joinedDate: string;
  canRemove: boolean;
  relationship?: string;
  clinic?: string;
}

function toCircleMember(r: CaregiverRelationship): CircleMember {
  return {
    name: r.otherName ?? "(pending)",
    role: r.status === "accepted" ? "Caregiver" : "Pending",
    icon: Heart,
    iconColor: "#3D6BE5",
    badgeColor: "#3D6BE5",
    phone: r.email,
    relationship: r.relationship,
    joinedDate:
      r.status === "accepted" && r.acceptedAt
        ? `Added ${new Date(r.acceptedAt).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}`
        : "Pending accept",
    canRemove: true,
  };
}

export function CareCircleRoute() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const query = useQuery({ queryKey: ["caregivers"], queryFn: listMyCaregivers });

  if (query.isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  const self: CircleMember = {
    name: user?.firstName ?? "You",
    role: "Patient",
    icon: Crown,
    iconColor: "#E8A92E",
    badgeColor: "#E8A92E",
    phone: user?.email ?? "",
    joinedDate: "Account owner",
    canRemove: false,
  };

  const members = [self, ...(query.data ?? []).map(toCircleMember)];
  void Stethoscope;

  return (
    <CareCircle
      onBack={() => navigate("/app")}
      onInviteCaregiver={() => navigate("/app/care-circle/invite")}
      members={members}
    />
  );
}
