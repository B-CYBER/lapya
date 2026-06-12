import { useState } from "react";
import { ChevronLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";

import Container from "@/components/layout/Container";
import { resetPassword } from "@/services/auth";
import { ApiError } from "@/types/api";

export function ResetPasswordRoute() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordsMatch = password.length >= 6 && password === confirm;
  const canSubmit = !!token && passwordsMatch && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await resetPassword(token, password);
      toast.success("Password updated. Please sign in.");
      navigate("/login", { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not reset your password.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ backgroundColor: "#FBFAF7" }}>
      <div className="px-4 sm:px-6 py-5">
        <button
          onClick={() => navigate("/login")}
          className="p-2"
          style={{ color: "#1E2A5E", background: "none", border: "none", cursor: "pointer" }}
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col pb-8 overflow-y-auto">
        <Container maxWidth="auth">
          <div
            className="rounded-3xl p-8"
            style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 24px rgba(30, 42, 94, 0.08)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{
                backgroundColor: "rgba(61, 107, 229, 0.12)",
                border: "1.5px solid rgba(61, 107, 229, 0.2)",
              }}
            >
              <Lock size={32} style={{ color: "#3D6BE5" }} />
            </div>

            <h1
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "2rem",
                fontWeight: 600,
                color: "#1E2A5E",
                marginBottom: "0.75rem",
                lineHeight: 1.2,
              }}
            >
              Set a new password
            </h1>

            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.9375rem",
                color: "#5E6680",
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              Choose a strong password you'll remember. At least 6 characters.
            </p>

            {!token && (
              <p
                className="mb-4"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.875rem",
                  color: "#B4533A",
                }}
              >
                This reset link is missing a token. Please request a new one.
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#1E2A5E",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #E7E4DD",
                    color: "#1E2A5E",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
              </div>

              <div className="mb-6">
                <label
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#1E2A5E",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1.5px solid #E7E4DD",
                    color: "#1E2A5E",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-4 rounded-xl"
                style={{
                  backgroundColor: canSubmit ? "#3D6BE5" : "#E7E4DD",
                  color: canSubmit ? "#FFFFFF" : "#5E6680",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 500,
                  border: "none",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  boxShadow: canSubmit ? "0 4px 16px rgba(61, 107, 229, 0.2)" : "none",
                }}
              >
                {isSubmitting ? "Updating…" : "Update password"}
              </button>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
}
