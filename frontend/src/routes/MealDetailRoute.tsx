import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { MealDetail } from "@/components/mealplan/MealDetail";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { getRecipe } from "@/services/recipes";
import { getWeek, toggleMealComplete } from "@/services/meal_plan";
import type { MealPlanItem } from "@/types/meal_plan";
import { ApiError } from "@/types/api";

export function MealDetailRoute() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const weekQuery = useQuery({ queryKey: ["meal-plan", "week"], queryFn: () => getWeek() });
  const item: MealPlanItem | undefined = weekQuery.data?.items.find(
    (i) => i.id === Number(itemId),
  );
  const recipeId = item?.recipe.id;

  const recipeQuery = useQuery({
    queryKey: ["recipes", recipeId],
    queryFn: () => getRecipe(recipeId as number),
    enabled: !!recipeId,
  });

  const mark = useMutation({
    mutationFn: () => toggleMealComplete(Number(itemId), true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plan", "week"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "today"] });
      toast.success("Logged. Keep going.");
      navigate("/app", { replace: true });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not log meal."),
  });

  if (!item || !recipeQuery.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  const recipe = recipeQuery.data;
  const meal = {
    name: recipe.name,
    localName: recipe.localName ?? undefined,
    image: recipe.imageUrl,
    type: item.mealType,
    portion: recipe.portion,
  };

  return (
    <MealDetail
      meal={meal}
      onBack={() => navigate("/app/week")}
      onSwap={() => navigate(`/app/meals/${itemId}/swap`)}
      onViewRecipe={() => navigate(`/app/recipes/${recipe.id}`)}
      onMarkEaten={() => mark.mutate()}
      isMarking={mark.isPending}
      ingredients={recipe.ingredients.map((i) => `${i.amount} ${i.item}`.trim())}
      cookingSteps={recipe.steps.map((s) => s.instruction)}
    />
  );
}
