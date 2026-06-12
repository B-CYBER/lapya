import { apiFetch } from "@/lib/api";
import type {
  CaregiverHome,
  CaregiverInviteRequest,
  CaregiverInviteResponse,
  CaregiverRelationship,
} from "@/types/caregiver";

export function invite(input: CaregiverInviteRequest): Promise<CaregiverInviteResponse> {
  return apiFetch<CaregiverInviteResponse>("/api/caregivers/invite", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function accept(token: string): Promise<CaregiverRelationship> {
  return apiFetch<CaregiverRelationship>(`/api/caregivers/accept/${encodeURIComponent(token)}`, {
    method: "POST",
  });
}

export function listMyCaregivers(): Promise<CaregiverRelationship[]> {
  return apiFetch<CaregiverRelationship[]>("/api/caregivers");
}

export function listMyPatients(): Promise<CaregiverRelationship[]> {
  return apiFetch<CaregiverRelationship[]>("/api/patients");
}

export function revoke(relationshipId: number): Promise<CaregiverRelationship> {
  return apiFetch<CaregiverRelationship>(`/api/caregivers/${relationshipId}`, {
    method: "DELETE",
  });
}

export function getCaregiverHome(patientId: number): Promise<CaregiverHome> {
  return apiFetch<CaregiverHome>(`/api/caregiver/patients/${patientId}/home`);
}
