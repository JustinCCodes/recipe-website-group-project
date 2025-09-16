import "server-only";
import { prisma } from "@/lib/prisma";
import type { Recipe } from "@/generated/prisma"; // Type definition for Recipe
import { getSession } from "@/lib/session"; // Session helper to get current user
import { getRecipesByCurrentUser } from "./actions"; // Server action for user recipes

/**
 * Fetch all recipes from database ordered by creation date
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    return await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" }, // Most recent recipes first
    });
  } catch (error) {
    console.error("Database Error: Failed to fetch recipes.", error);
    return []; // Return empty array on error
  }
}

/**
 * Fetch a single recipe by ID
 * @param id Recipe ID
 */
export async function getRecipeById(id: number): Promise<Recipe | null> {
  try {
    return await prisma.recipe.findUnique({
      where: { id }, // Find recipe with matching ID
    });
  } catch (error) {
    console.error(`Database Error: Failed to fetch recipe ${id}.`, error);
    return null; // Return null on error
  }
}

/**
 * Fetch the 5 most recently created recipes
 */
export async function getRecentRecipes(): Promise<Recipe[]> {
  const session = await getSession(); // Get current user session
  const userId = session?.userId;

  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      take: 5, // Limit to 5 most recent
      select: {
        id: true,
        name: true,
        description: true,
        mediaUrl: true,
        mediaType: true,
        durationSec: true,
        prepTime: true,
        cookTime: true,
        servings: true,
        category: true,
        ingredients: true,
        instructions: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { likes: true } }, // Include like count
        likes: userId ? { where: { userId } } : false, // Include if current user liked
      },
    });
    return recipes as any;
  } catch (error) {
    console.error("Database Error: Failed to fetch recent recipes.", error);
    return [];
  }
}

/**
 * Fetch all recipes saved by the currently logged in user
 */
export async function getSavedRecipes(): Promise<Recipe[]> {
  const session = await getSession();
  if (!session?.userId) return []; // No user, return empty array

  try {
    const saved = await prisma.recipeUser.findMany({
      where: { userId: session.userId }, // Filter by current user
      include: { recipe: true }, // Include full recipe details
      orderBy: { recipe: { createdAt: "desc" } }, // Sort by newest first
    });

    // Extract only recipe objects
    return saved.map((item) => item.recipe);
  } catch (error) {
    console.error("Database Error: Failed to fetch saved recipes.", error);
    return [];
  }
}

/**
 * Fetch all data needed for user dashboard
 * - Includes recipes created by user and recipes saved by user
 */
export async function getDashboardData() {
  // Run both queries in parallel for better performance
  const [createdRecipes, savedRecipes] = await Promise.all([
    getRecipesByCurrentUser(),
    getSavedRecipes(),
  ]);

  return { createdRecipes, savedRecipes };
}
