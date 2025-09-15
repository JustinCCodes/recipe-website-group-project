// Recipe returned from main search
export type RecipeSearchResult = {
  id: number;
  name: string;
  description: string;
};

// Autocomplete suggestion
export type Suggestion = {
  value: string;
  type: "history" | "recipe";
};

// Single item in combined history list
export type UnifiedHistoryItem = {
  id: string;
  query: string;
  createdAt: Date;
  source: "history" | "log";
};
