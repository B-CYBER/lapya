import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { ScanAnalyzing } from "@/components/scanner/ScanAnalyzing";
import { ScanCamera } from "@/components/scanner/ScanCamera";
import { ScanResult } from "@/components/scanner/ScanResult";
import { scan } from "@/services/scanner";
import type { SafetyRating } from "@/types/recipe";
import type { ScanResult as ScanResultType } from "@/types/scan";
import { ApiError } from "@/types/api";

type Stage = "camera" | "analyzing" | "result" | "not_recognized";

const CONFIDENCE_FLOOR = 60;

const CONDITION_LABELS: Record<string, string> = {
  diabetes: "Type 2 Diabetes",
  hypertension: "High Blood Pressure",
  kidney: "Kidney Disease",
  heart: "Heart Disease",
  weight: "Weight Management",
  cholesterol: "High Cholesterol",
  "uric-acid": "Uric Acid / Gout",
  migraines: "Migraines",
  anxiety: "Anxiety",
  "acid-reflux": "Acid Reflux",
  "fatty-liver": "Fatty Liver",
  arthritis: "Arthritis",
};

const DOTS: Record<SafetyRating, string> = {
  safe: "#6E9A6E",
  caution: "#C9892E",
  avoid: "#B4533A",
};

const MESSAGES: Record<SafetyRating, string> = {
  safe: "Looks fine for this condition.",
  caution: "Watch your portion — eat smaller.",
  avoid: "Skip this one today.",
};

export function ScannerRoute() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("camera");
  const [result, setResult] = useState<ScanResultType | null>(null);

  const mutation = useMutation({
    mutationFn: (blob: Blob | undefined) => scan(blob),
    onSuccess: (data) => {
      setResult(data);
      const nextStage: Stage = data.confidence < CONFIDENCE_FLOOR ? "not_recognized" : "result";
      setTimeout(() => setStage(nextStage), 1200);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Could not scan.");
      setStage("camera");
    },
  });

  const handleCapture = (blob: Blob) => {
    setStage("analyzing");
    mutation.mutate(blob);
  };

  const handleReset = () => {
    setResult(null);
    setStage("camera");
  };

  if (stage === "camera") {
    return <ScanCamera onCapture={handleCapture} onClose={() => navigate("/app")} />;
  }
  if (stage === "analyzing" || !result) {
    return <ScanAnalyzing onComplete={() => undefined} />;
  }
  if (stage === "not_recognized") {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center px-8"
        style={{ backgroundColor: "#FBFAF7" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: "rgba(232, 169, 46, 0.15)" }}
        >
          <span style={{ fontSize: "2.5rem" }}>🤔</span>
        </div>
        <h2
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1E2A5E",
            marginBottom: "0.75rem",
            textAlign: "center",
          }}
        >
          Couldn't read this one
        </h2>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.9375rem",
            color: "#5E6680",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: "20rem",
            marginBottom: "1.5rem",
          }}
        >
          Try framing the whole plate with more light. Best results when the dish fills most of the frame.
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-xl"
          style={{
            backgroundColor: "#3D6BE5",
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.9375rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  const r = result.recipe;
  return (
    <ScanResult
      onLogMeal={() => {
        toast.success("Logged.");
        navigate("/app");
      }}
      onScanAgain={handleReset}
      imageUrl={r.imageUrl}
      confidence={result.confidence}
      dishName={r.name}
      localName={r.localName ?? undefined}
      nutritionStats={[
        { label: "Calories", value: `${r.calories} kcal` },
        { label: "Carbs", value: `${r.carbsG}g` },
        { label: "Sodium", value: `${r.sodiumMg}mg` },
        { label: "Potassium", value: `${r.potassiumMg}mg` },
      ]}
      safetyCards={Object.entries(r.conditionSafety).map(([slug, rating]) => ({
        condition: CONDITION_LABELS[slug] ?? slug,
        status: rating,
        message: MESSAGES[rating],
        dot: DOTS[rating],
      }))}
    />
  );
}
