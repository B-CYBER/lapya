import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { MealSwap } from "@/components/mealplan/MealSwap";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { editPatientMeal, getPatient } from "@/services/dietitian";
import { listRecipes } from "@/services/recipes";
import { ApiError } from "@/types/api";
import type { MealType } from "@/types/recipe";

export function DietitianMealSwapRoute() {
  const { patientId, itemId } = useParams<{ patientId: string; itemId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const numericPatientId = Number(patientId);
  const numericItemId = Number(itemId);

  const patientQuery = useQuery({
    queryKey: ["dietitian", "patient", patientId],
    queryFn: () => getPatient(numericPatientId),
    enabled: !!patientId,
  });

  const item = patientQuery.data?.weekPlan.items.find((i) => i.id === numericItemId);
  const mealType = (item?.mealType as MealType) ?? "lunch";

  const alternativesQuery = useQuery({
    queryKey: ["recipes", { mealType }],
    queryFn: () => listRecipes({ mealType }),
    enabled: !!item,
  });

  const swap = useMutation({
    mutationFn: (recipeId: number) =>
      editPatientMeal(numericPatientId, numericItemId, { recipeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dietitian", "patient", patientId],
      });
      toast.success("Meal swapped.");
      navigate(`/app/dietitian/patients/${patientId}`, { replace: true });
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Could not swap."),
  });

  if (!item || !alternativesQuery.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  const alternatives = alternativesQuery.data
    .filter((r) => r.id !== item.recipe.id)
    .map((r) => ({
      id: r.id,
      name: r.name,
      localName: r.localName ?? undefined,
      image: r.imageUrl,
      calories: r.calories,
      carbs: `${r.carbsG}g`,
      protein: `${r.proteinG}g`,
      safety: Object.values(r.conditionSafety)[0] ?? "safe",
      safetyText: r.portion,
      reason: r.reason,
    }));

  return (
    <MealSwap
      mealType={mealType}
      currentMeal={{
        name: item.recipe.name,
        localName: item.recipe.localName ?? undefined,
        image: item.recipe.imageUrl,
      }}
      onClose={() => navigate(`/app/dietitian/patients/${patientId}`)}
      onSwap={(newMeal) => swap.mutate(newMeal.id)}
      alternatives={alternatives}
    />
  );
}
