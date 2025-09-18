
import { useState, useRef } from "react";

import { getRecipeDetails } from "@/features/recipes/data";
import RecipeDetailClient from "./RecipeDetailClient";

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const awaitedParams = await params;
  const recipeId = Number(awaitedParams.id);
  const recipe = await getRecipeDetails(recipeId);
  if (!recipe) {
    return <p>Recipe not found.</p>;
  }
  return <RecipeDetailClient recipe={recipe} />;
}

