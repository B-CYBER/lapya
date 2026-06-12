import { useNavigate } from "react-router";

import { SettingsScreen } from "@/components/profile/SettingsScreen";

/**
 * Phase 5a wires the route + nav. Per-toggle persistence against `PATCH /api/settings`
 * is a Phase 5b polish task — the backend endpoint and tests are already in place;
 * the prototype's many individual toggles need a controlled-prop refactor to bind to them.
 */
export function SettingsRoute() {
  const navigate = useNavigate();
  return <SettingsScreen onBack={() => navigate("/app/profile")} />;
}
