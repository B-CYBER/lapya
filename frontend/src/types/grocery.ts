export interface GroceryItem {
  id: number;
  slug: string;
  name: string;
  quantity: string;
  category: string;
  nairaKobo: number;
  isChecked: boolean;
}

export interface GroceryList {
  weekStart: string;
  items: GroceryItem[];
  totalNairaKobo: number;
}
