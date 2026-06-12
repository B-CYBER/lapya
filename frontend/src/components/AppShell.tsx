import { Outlet, useLocation, useNavigate } from "react-router";

import { WebNavigation } from "@/components/navigation/WebNavigation";

const PATH_TO_SCREEN: Array<[RegExp, string]> = [
  [/^\/app\/?$/, "home"],
  [/^\/app\/week/, "week"],
  [/^\/app\/meals/, "week"],
  [/^\/app\/recipes/, "week"],
  [/^\/app\/scanner/, "scanner"],
  [/^\/app\/chat/, "chat"],
  [/^\/app\/grocery/, "grocery"],
  [/^\/app\/care-circle/, "careCircle"],
  [/^\/app\/caregiver/, "careCircle"],
  [/^\/app\/profile/, "profile"],
  [/^\/app\/notifications/, "notifications"],
  [/^\/app\/health-metrics/, "healthMetrics"],
];

function currentScreenFromPath(pathname: string): string {
  for (const [pattern, screen] of PATH_TO_SCREEN) {
    if (pattern.test(pathname)) return screen;
  }
  return "home";
}

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "#FBFAF7" }}>
      <WebNavigation
        currentScreen={currentScreenFromPath(location.pathname)}
        onNavigateHome={() => navigate("/app")}
        onNavigateToWeek={() => navigate("/app/week")}
        onOpenScanner={() => navigate("/app/chat")}
        onOpenCareCircle={() => navigate("/app/care-circle")}
        onOpenHealthMetrics={() => navigate("/app/health-metrics")}
        onOpenProfile={() => navigate("/app/profile")}
        onOpenNotifications={() => navigate("/app/notifications")}
      />
      <div style={{ paddingTop: "64px" }}>
        <Outlet />
      </div>
    </div>
  );
}
