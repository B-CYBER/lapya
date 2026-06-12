import { useNavigate } from "react-router";

import { UpgradeScreen } from "@/components/upgrade/UpgradeScreen";

export function UpgradeRoute() {
  const navigate = useNavigate();
  return (
    <UpgradeScreen
      onClose={() => navigate(-1)}
      onSelectPlan={(planId) => {
        // Always check out with monthly billing for the MVP flow.
        navigate(`/app/payment/checkout?plan=${planId}&period=monthly`);
      }}
    />
  );
}
