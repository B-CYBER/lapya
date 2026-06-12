import { apiFetch } from "@/lib/api";
import type { GroceryItem, GroceryList } from "@/types/grocery";

export function getGroceryList(week?: string): Promise<GroceryList> {
  const qs = week ? `?week=${week}` : "";
  return apiFetch<GroceryList>(`/api/grocery-list${qs}`);
}

export function regenerateGroceryList(week?: string): Promise<GroceryList> {
  const qs = week ? `?week=${week}` : "";
  return apiFetch<GroceryList>(`/api/grocery-list/regenerate${qs}`, { method: "POST" });
}

export function toggleGroceryItem(itemId: number, isChecked: boolean): Promise<GroceryItem> {
  return apiFetch<GroceryItem>(`/api/grocery-list/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ isChecked }),
  });
}
