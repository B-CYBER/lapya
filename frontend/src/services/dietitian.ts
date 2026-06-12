import { apiFetch } from "@/lib/api";
import type { MealPlanItem } from "@/types/meal_plan";
import type {
  DietitianInviteRequest,
  DietitianInviteResponse,
  DietitianMealEditRequest,
  DietitianPatientDetail,
  DietitianRelationship,
  PatientNote,
  PatientNoteCreateRequest,
  PatientSummary,
} from "@/types/dietitian";

export function listPatients(): Promise<PatientSummary[]> {
  return apiFetch<PatientSummary[]>("/api/dietitian/patients");
}

export function getPatient(patientId: number): Promise<DietitianPatientDetail> {
  return apiFetch<DietitianPatientDetail>(`/api/dietitian/patients/${patientId}`);
}

export function invitePatient(
  payload: DietitianInviteRequest,
): Promise<DietitianInviteResponse> {
  return apiFetch<DietitianInviteResponse>("/api/dietitian/patients/invite", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function acceptPatientInvite(token: string): Promise<DietitianRelationship> {
  return apiFetch<DietitianRelationship>(
    `/api/dietitian/patients/accept/${token}`,
    { method: "POST" },
  );
}

export function revokeRelationship(
  relationshipId: number,
): Promise<DietitianRelationship> {
  return apiFetch<DietitianRelationship>(
    `/api/dietitian/patients/${relationshipId}`,
    { method: "DELETE" },
  );
}

export function listMyDietitians(): Promise<DietitianRelationship[]> {
  return apiFetch<DietitianRelationship[]>("/api/dietitian/my-dietitians");
}

export function editPatientMeal(
  patientId: number,
  itemId: number,
  payload: DietitianMealEditRequest,
): Promise<MealPlanItem> {
  return apiFetch<MealPlanItem>(
    `/api/dietitian/patients/${patientId}/meals/${itemId}`,
    { method: "PATCH", body: JSON.stringify(payload) },
  );
}

export function listPatientNotes(patientId: number): Promise<PatientNote[]> {
  return apiFetch<PatientNote[]>(`/api/dietitian/patients/${patientId}/notes`);
}

export function createPatientNote(
  patientId: number,
  payload: PatientNoteCreateRequest,
): Promise<PatientNote> {
  return apiFetch<PatientNote>(`/api/dietitian/patients/${patientId}/notes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
