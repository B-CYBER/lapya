import { useNavigate } from "react-router";

import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { forgotPassword } from "@/services/auth";

export function ForgotPasswordRoute() {
  const navigate = useNavigate();

  return (
    <ForgotPassword
      onBack={() => navigate("/login")}
      onRequest={(email) => forgotPassword(email)}
    />
  );
}
