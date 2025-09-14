// Single recipe search result from database
export type RecipeSearchResult = {
  id: number;
  name: string;
  description: string;
};

// Autocomplete/Search suggestion
export type Suggestion = {
  value: string;
  type: "history" | "recipe";
};
