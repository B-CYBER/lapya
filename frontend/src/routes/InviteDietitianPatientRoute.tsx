import { useState } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import Container from "@/components/layout/Container";
import { invitePatient } from "@/services/dietitian";
import { ApiError } from "@/types/api";

export function InviteDietitianPatientRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: (e: string) => invitePatient({ email: e }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dietitian", "patients"] });
      toast.success("Invite sent. The patient will get an email shortly.");
      navigate("/app/dietitian", { replace: true });
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Could not send invite."),
  });

  const isValid = /\S+@\S+\.\S+/.test(email) && !mutation.isPending;

  const handleSend = () => {
    if (isValid) mutation.mutate(email);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: "rgba(30, 42, 94, 0.6)" }}
    >
      <div
        className="w-full rounded-t-3xl pb-8"
        style={{ backgroundColor: "#FBFAF7", maxHeight: "85vh" }}
      >
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-5 border-b"
          style={{ borderColor: "#E7E4DD" }}
        >
          <h2
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#1E2A5E",
            }}
          >
            Invite a patient
          </h2>
          <button
            onClick={() => navigate("/app/dietitian")}
            className="p-2"
            style={{ color: "#5E6680" }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="pt-6">
          <Container maxWidth="form">
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.9375rem",
                color: "#5E6680",
                marginBottom: "1.5rem",
                lineHeight: 1.6,
              }}
            >
              We'll email them a link. They sign in (or sign up) and accept to share
              their meal plan with you.
            </p>

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
                Patient email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full px-4 py-3 rounded-xl"
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
              onClick={handleSend}
              disabled={!isValid}
              className="w-full py-4 rounded-xl transition-all"
              style={{
                backgroundColor: isValid ? "#3D6BE5" : "#E7E4DD",
                color: isValid ? "#FFFFFF" : "#5E6680",
                fontFamily: "Inter, sans-serif",
                fontSize: "1rem",
                fontWeight: 500,
                border: "none",
                cursor: isValid ? "pointer" : "not-allowed",
                boxShadow: isValid ? "0 4px 16px rgba(61, 107, 229, 0.2)" : "none",
              }}
            >
              {mutation.isPending ? "Sending…" : "Send invitation"}
            </button>
          </Container>
        </div>
      </div>
    </div>
  );
}
