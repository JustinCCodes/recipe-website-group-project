import "server-only";
import { prisma } from "@/lib/prisma";
import type { Recipe } from "@/generated/prisma";

/**
 * Fetches all recipes from database ordered by creation date
 */
export async function getAllRecipes() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
    });
    return recipes;
  } catch (error) {
    console.error("Database Error: Failed to fetch recipes.", error);
    return [];
  }
}

/**
 * Fetches single recipe by its ID
 * @param id The ID of the recipe to fetch
 */
export async function getRecipeById(id: number) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });
    return recipe;
  } catch (error) {
    console.error(`Database Error: Failed to fetch recipe ${id}.`, error);
    return null;
  }
}

/**
 * Fetches the 5 most recently created recipes from the database.
 */
export async function getRecentRecipes(): Promise<Recipe[]> {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
      take: 5, // Limit the result to 5
    });
    return recipes;
  } catch (error) {
    console.error("Database Error: Failed to fetch recent recipes.", error);
    return [];
  }
}
