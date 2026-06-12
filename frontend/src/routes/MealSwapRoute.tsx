import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { MealSwap } from "@/components/mealplan/MealSwap";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { listRecipes } from "@/services/recipes";
import { getWeek, swapMealItem } from "@/services/meal_plan";
import type { MealType } from "@/types/recipe";
import { ApiError } from "@/types/api";

export function MealSwapRoute() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const weekQuery = useQuery({ queryKey: ["meal-plan", "week"], queryFn: () => getWeek() });
  const item = weekQuery.data?.items.find((i) => i.id === Number(itemId));
  const mealType = (item?.mealType as MealType) ?? "lunch";

  const alternativesQuery = useQuery({
    queryKey: ["recipes", { mealType }],
    queryFn: () => listRecipes({ mealType }),
    enabled: !!item,
  });

  const swap = useMutation({
    mutationFn: (recipeId: number) => swapMealItem(Number(itemId), recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plan", "week"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "today"] });
      toast.success("Meal swapped.");
      navigate(`/app/meals/${itemId}`, { replace: true });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not swap."),
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
      onClose={() => navigate(`/app/meals/${itemId}`)}
      onSwap={(newMeal) => swap.mutate(newMeal.id)}
      alternatives={alternatives}
    />
  );
}
