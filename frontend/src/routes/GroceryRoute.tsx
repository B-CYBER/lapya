import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { GroceryList } from "@/components/GroceryList";
import { LoadingSpinner } from "@/components/polish/LoadingSpinner";
import { getGroceryList, regenerateGroceryList, toggleGroceryItem } from "@/services/grocery";
import type { GroceryItem, GroceryList as GroceryListType } from "@/types/grocery";
import { ApiError } from "@/types/api";

const CATEGORY_LABELS: Record<string, string> = {
  proteins: "PROTEINS",
  grains: "GRAINS & STARCHES",
  vegetables: "VEGETABLES",
  fruits: "FRUITS",
  essentials: "COOKING ESSENTIALS",
  other: "OTHER",
};

const CATEGORY_ORDER = ["proteins", "grains", "vegetables", "fruits", "essentials", "other"];

function groupByCategory(items: GroceryItem[]) {
  const byCategory: Record<string, GroceryItem[]> = {};
  for (const item of items) {
    (byCategory[item.category] ??= []).push(item);
  }
  return CATEGORY_ORDER.filter((cat) => byCategory[cat]?.length).map((cat) => ({
    id: cat,
    name: CATEGORY_LABELS[cat] ?? cat.toUpperCase(),
    count: byCategory[cat].length,
    items: byCategory[cat].map((i) => ({
      id: String(i.id),
      name: i.name,
      quantity: i.quantity,
    })),
  }));
}

function whatsappShareUrl(list: GroceryListType): string {
  const lines = ["🛒 Lapya grocery list", ""];
  for (const item of list.items) {
    lines.push(`• ${item.name} — ${item.quantity}`);
  }
  return `https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function GroceryRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const listQuery = useQuery({ queryKey: ["grocery-list"], queryFn: () => getGroceryList() });

  const toggle = useMutation({
    mutationFn: ({ id, isChecked }: { id: number; isChecked: boolean }) =>
      toggleGroceryItem(id, isChecked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["grocery-list"] }),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Could not update."),
  });

  const regenerate = useMutation({
    mutationFn: () => regenerateGroceryList(),
    onSuccess: (data) => {
      queryClient.setQueryData(["grocery-list"], data);
      toast.success("Grocery list rebuilt.");
    },
  });

  if (!listQuery.data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FBFAF7" }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <GroceryList
      onBack={() => navigate("/app")}
      categories={groupByCategory(listQuery.data.items)}
      onToggle={(id, isChecked) => toggle.mutate({ id: Number(id), isChecked })}
      onShare={() => {
        window.location.href = whatsappShareUrl(listQuery.data!);
      }}
      onRegenerate={() => regenerate.mutate()}
    />
  );
}
