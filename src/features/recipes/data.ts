import "server-only";
import { prisma } from "@/lib/prisma";

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
