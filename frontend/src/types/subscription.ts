export type PaidPlan = "care" | "family";
export type BillingPeriod = "monthly" | "annual";
export type SubscriptionStatus = "active" | "canceled" | "past_due";

export interface Subscription {
  plan: PaidPlan;
  billingPeriod: BillingPeriod;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
}

export interface CheckoutRequest {
  plan: PaidPlan;
  billingPeriod: BillingPeriod;
}
