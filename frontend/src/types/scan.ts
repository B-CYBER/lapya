import type { RecipeSummary } from "./recipe";

export interface ScanResult {
  id: number;
  confidence: number;
  scannedAt: string;
  recipe: RecipeSummary;
}
