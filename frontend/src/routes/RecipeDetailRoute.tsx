import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import { RecipeDetail } from "@/components/mealplan/RecipeDetail";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { getRecipe } from "@/services/recipes";

export function RecipeDetailRoute() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["recipes", Number(recipeId)],
    queryFn: () => getRecipe(Number(recipeId)),
    enabled: !!recipeId,
  });

  if (!query.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  const r = query.data;
  return (
    <RecipeDetail
      onBack={() => navigate(-1)}
      recipe={{
        name: r.name,
        localName: r.localName ?? undefined,
        image: r.imageUrl,
        prepTime: `${r.prepMinutes} min`,
        cookTime: `${r.cookMinutes} min`,
        servings: r.servings,
        calories: r.calories,
      }}
      ingredients={r.ingredients.map((i) => ({ item: i.item, amount: i.amount }))}
      steps={r.steps.map((s) => ({ number: s.stepNumber, instruction: s.instruction }))}
    />
  );
}
