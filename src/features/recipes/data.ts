import "server-only";
import { prisma } from "@/lib/prisma";
import type { Recipe } from "@/generated/prisma";
import { getSession } from "@/lib/session";

/**
 * Fetches all recipes created by the currently logged in user
 */
export async function getRecipesByCurrentUser() {
  const session = await getSession();
  if (!session?.userId) {
    return [];
  }
  try {
    const recipes = await prisma.recipe.findMany({
      where: { authorId: session.userId },
      orderBy: { createdAt: "desc" },
    });
    return recipes;
  } catch (error) {
    console.error("Database Error: Failed to fetch user's recipes.", error);
    return [];
  }
}

/**
 * Fetches all recipes saved by currently logged in user
 */
export async function getSavedRecipes(): Promise<Recipe[]> {
  const session = await getSession();
  if (!session?.userId) return [];

  try {
    const saved = await prisma.recipeUser.findMany({
      where: { userId: session.userId },
      include: { recipe: true },
      orderBy: { recipe: { createdAt: "desc" } },
    });
    return saved.map((item) => item.recipe);
  } catch (error) {
    console.error("Database Error: Failed to fetch saved recipes.", error);
    return [];
  }
}

/**
 * Fetches all data needed for user dashboard
 */
export async function getDashboardData() {
  const [createdRecipes, savedRecipes] = await Promise.all([
    getRecipesByCurrentUser(),
    getSavedRecipes(),
  ]);
  return { createdRecipes, savedRecipes };
}

/**
 * Fetches a recipe by ID including its ingredients and steps
 */
export async function getRecipeDetails(id: number) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: true,
        instructionSteps: {
          orderBy: { stepNumber: "asc" },
        },
        category: true,
      },
    });
    return recipe;
  } catch (error) {
    console.error(`Database Error: Failed to fetch recipe ${id}.`, error);
    return null;
  }
}

/**
 * Fetches 5 most recently created recipes for Discover page
 */
export async function getRecentRecipes() {
  const session = await getSession();
  const userId = session?.userId;
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        mediaUrl: true,
        mediaType: true,
        durationSec: true,
        _count: { select: { likes: true } },
        likes: userId ? { where: { userId } } : false,
        users: userId ? { where: { userId } } : false,
      },
    });
    return recipes;
  } catch (error) {
    console.error("Database Error: Failed to fetch recent recipes.", error);
    return [];
  }
}

/**
 * Fetches all category names from database
 */
export async function getCategoryNames() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return categories.map((cat) => cat.name);
  } catch (error) {
    console.error("Database Error: Failed to fetch categories.", error);
    return [];
  }
}
