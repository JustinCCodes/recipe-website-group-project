export type RecipeSearchResult = {
  id: number;
  name: string;
  description: string;
};

export type Suggestion = {
  value: string;
  type: "history" | "recipe";
};

export type UnifiedHistoryItem = {
  id: string;
  query: string;
  createdAt: Date;
  source: "history" | "log";
};
