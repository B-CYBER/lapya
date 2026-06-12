export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type SafetyRating = "safe" | "caution" | "avoid";
export type ConditionSafety = Record<string, SafetyRating>;

export type IngredientCategory =
  | "proteins"
  | "grains"
  | "vegetables"
  | "fruits"
  | "essentials"
  | "other";

export interface Ingredient {
  id: number;
  item: string;
  amount: string;
  category: IngredientCategory;
  nairaKobo: number;
  sortOrder: number;
}

export interface RecipeStep {
  id: number;
  stepNumber: number;
  instruction: string;
}

export interface RecipeSummary {
  id: number;
  slug: string;
  name: string;
  localName: string | null;
  mealType: MealType;
  imageUrl: string;
  portion: string;
  reason: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sodiumMg: number;
  potassiumMg: number;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  cuisineRegion: string | null;
  conditionSafety: ConditionSafety;
}

export interface Recipe extends RecipeSummary {
  description: string | null;
  ingredients: Ingredient[];
  steps: RecipeStep[];
}
