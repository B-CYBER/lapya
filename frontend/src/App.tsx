import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/components/AppShell";

import { SplashRoute } from "@/routes/SplashRoute";
import { WelcomeRoute } from "@/routes/WelcomeRoute";
import { LoginRoute } from "@/routes/LoginRoute";
import { SignupRoute } from "@/routes/SignupRoute";
import { ForgotPasswordRoute } from "@/routes/ForgotPasswordRoute";
import { ResetPasswordRoute } from "@/routes/ResetPasswordRoute";
import { EmailVerificationRoute } from "@/routes/EmailVerificationRoute";
import { OnboardingRoute } from "@/routes/OnboardingRoute";
import { HomeRoute } from "@/routes/HomeRoute";
import { WeekRoute } from "@/routes/WeekRoute";
import { MealDetailRoute } from "@/routes/MealDetailRoute";
import { MealSwapRoute } from "@/routes/MealSwapRoute";
import { RecipeDetailRoute } from "@/routes/RecipeDetailRoute";
import { ScannerRoute } from "@/routes/ScannerRoute";
import { GroceryRoute } from "@/routes/GroceryRoute";
import { HealthMetricsRoute } from "@/routes/HealthMetricsRoute";
import { LogMetricRoute } from "@/routes/LogMetricRoute";
import { CareCircleRoute } from "@/routes/CareCircleRoute";
import { InviteCaregiverRoute } from "@/routes/InviteCaregiverRoute";
import { AcceptCaregiverRoute } from "@/routes/AcceptCaregiverRoute";
import { InviteDietitianPatientRoute } from "@/routes/InviteDietitianPatientRoute";
import { AcceptDietitianPatientRoute } from "@/routes/AcceptDietitianPatientRoute";
import { DietitianMealSwapRoute } from "@/routes/DietitianMealSwapRoute";
import { CaregiverHomeRoute } from "@/routes/CaregiverHomeRoute";
import { ChatbotRoute } from "@/routes/ChatbotRoute";
import { ProfileRoute } from "@/routes/ProfileRoute";
import { EditProfileRoute } from "@/routes/EditProfileRoute";
import { SettingsRoute } from "@/routes/SettingsRoute";
import { NotificationsRoute } from "@/routes/NotificationsRoute";
import { UpgradeRoute } from "@/routes/UpgradeRoute";
import { PaymentCheckoutRoute } from "@/routes/PaymentCheckoutRoute";
import { LandingRoute } from "@/routes/LandingRoute";
import { DietitianDashboardRoute } from "@/routes/DietitianDashboardRoute";
import { PatientDetailRoute } from "@/routes/PatientDetailRoute";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: "Inter, sans-serif",
                background: "#FFFFFF",
                color: "#1A2244",
                border: "1px solid #E7E4DD",
              },
            }}
          />
          <Routes>
            <Route path="/" element={<LandingRoute />} />
            <Route path="/landing" element={<LandingRoute />} />
            <Route path="/splash" element={<SplashRoute />} />
            <Route path="/welcome" element={<WelcomeRoute />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/signup" element={<SignupRoute />} />
            <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
            <Route path="/reset-password" element={<ResetPasswordRoute />} />
            <Route
              path="/verify-email"
              element={
                <ProtectedRoute>
                  <EmailVerificationRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<HomeRoute />} />
              <Route path="week" element={<WeekRoute />} />
              <Route path="meals/:itemId" element={<MealDetailRoute />} />
              <Route path="meals/:itemId/swap" element={<MealSwapRoute />} />
              <Route path="recipes/:recipeId" element={<RecipeDetailRoute />} />
              <Route path="scanner" element={<ScannerRoute />} />
              <Route path="grocery" element={<GroceryRoute />} />
              <Route path="health-metrics" element={<HealthMetricsRoute />} />
              <Route path="health-metrics/log" element={<LogMetricRoute />} />
              <Route path="care-circle" element={<CareCircleRoute />} />
              <Route path="care-circle/invite" element={<InviteCaregiverRoute />} />
              <Route path="care-circle/accept" element={<AcceptCaregiverRoute />} />
              <Route path="caregiver/:patientId" element={<CaregiverHomeRoute />} />
              <Route path="chat" element={<ChatbotRoute />} />
              <Route path="profile" element={<ProfileRoute />} />
              <Route path="profile/edit" element={<EditProfileRoute />} />
              <Route path="settings" element={<SettingsRoute />} />
              <Route path="notifications" element={<NotificationsRoute />} />
              <Route path="upgrade" element={<UpgradeRoute />} />
              <Route path="payment/checkout" element={<PaymentCheckoutRoute />} />
              <Route
                path="dietitian"
                element={
                  <ProtectedRoute requiredRole="dietitian">
                    <DietitianDashboardRoute />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dietitian/patients/:patientId"
                element={
                  <ProtectedRoute requiredRole="dietitian">
                    <PatientDetailRoute />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dietitian/invite"
                element={
                  <ProtectedRoute requiredRole="dietitian">
                    <InviteDietitianPatientRoute />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dietitian/accept"
                element={<AcceptDietitianPatientRoute />}
              />
              <Route
                path="dietitian/swap/:patientId/:itemId"
                element={
                  <ProtectedRoute requiredRole="dietitian">
                    <DietitianMealSwapRoute />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
