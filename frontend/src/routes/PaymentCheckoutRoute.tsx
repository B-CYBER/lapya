import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { PaymentCheckout } from "@/components/payment/PaymentCheckout";
import { checkout } from "@/services/subscription";
import type { BillingPeriod, PaidPlan } from "@/types/subscription";
import { ApiError } from "@/types/api";

const PLAN_DISPLAY: Record<PaidPlan, { name: string; priceMonthly: string; priceAnnual: string }> = {
  care: { name: "Care", priceMonthly: "₦1,500", priceAnnual: "₦15,000" },
  family: { name: "Family", priceMonthly: "₦3,500", priceAnnual: "₦35,000" },
};

export function PaymentCheckoutRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();

  const plan = (params.get("plan") ?? "care") as PaidPlan;
  const billingPeriod = (params.get("period") ?? "monthly") as BillingPeriod;

  const display = PLAN_DISPLAY[plan];
  const price = billingPeriod === "annual" ? display.priceAnnual : display.priceMonthly;
  const period = billingPeriod === "annual" ? "/year" : "/month";

  const mutation = useMutation({
    mutationFn: () => checkout({ plan, billingPeriod }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success(`Welcome to ${display.name}.`);
      navigate("/app", { replace: true });
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Payment failed."),
  });

  return (
    <PaymentCheckout
      plan={{ name: display.name, price, period }}
      onClose={() => navigate("/app/upgrade")}
      onSuccess={() => mutation.mutate()}
    />
  );
}
