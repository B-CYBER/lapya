import { apiFetch } from "@/lib/api";
import type { CheckoutRequest, Subscription } from "@/types/subscription";

export function getSubscription(): Promise<Subscription | null> {
  return apiFetch<Subscription | null>("/api/subscription");
}

export function checkout(payload: CheckoutRequest): Promise<Subscription> {
  return apiFetch<Subscription>("/api/subscription/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
