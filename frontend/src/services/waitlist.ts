import { apiFetch } from "@/lib/api";
import type { WaitlistRequest } from "@/types/waitlist";

export function joinWaitlist(input: WaitlistRequest): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/waitlist", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
