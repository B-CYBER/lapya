import { apiFetch } from "@/lib/api";
import type { MealType, Recipe, RecipeSummary } from "@/types/recipe";

interface ListRecipesParams {
  mealType?: MealType;
  cuisineRegion?: string;
}

export function listRecipes(params: ListRecipesParams = {}): Promise<RecipeSummary[]> {
  const search = new URLSearchParams();
  if (params.mealType) search.set("mealType", params.mealType);
  if (params.cuisineRegion) search.set("cuisineRegion", params.cuisineRegion);
  const qs = search.toString();
  return apiFetch<RecipeSummary[]>(`/api/recipes${qs ? `?${qs}` : ""}`);
}

export function getRecipe(recipeId: number): Promise<Recipe> {
  return apiFetch<Recipe>(`/api/recipes/${recipeId}`);
}
