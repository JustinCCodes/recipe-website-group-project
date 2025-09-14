import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { decrypt } from "@/lib/encryption";
import type { RecipeSearchResult, Suggestion } from "./types";

/**
 * Searches for recipes by name, description, or ingredients.
 * Replaces /api/recipes/search
 */
export async function searchRecipes(
  query: string
): Promise<RecipeSearchResult[]> {
  if (!query) return [];

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { ingredients: { has: query.toLowerCase() } },
        ],
      },
      select: { id: true, name: true, description: true }, // Select only needed fields
    });
    return recipes;
  } catch (error) {
    console.error("Database Error: Failed to search recipes.", error);
    return [];
  }
}

/**
 * Fetches the user's search history.
 * Replaces GET /api/user/search-history
 */
export async function getSearchHistory(): Promise<string[]> {
  const session = await getSession();
  if (!session?.userId) return [];

  try {
    const history = await prisma.searchHistory.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return history.map((item) => decrypt(item.query));
  } catch (error) {
    console.error("Database Error: Failed to fetch search history.", error);
    return [];
  }
}

/**
 * Fetches the user's full, non-unique search log.
 * Replaces GET /api/user/search-log
 */
export async function getSearchLog() {
  const session = await getSession();
  if (!session?.userId) return [];

  try {
    const log = await prisma.searchLog.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Decrypt query for each log entry
    return log.map((item) => ({
      ...item,
      query: decrypt(item.query),
    }));
  } catch (error) {
    console.error("Database Error: Failed to fetch search log.", error);
    return [];
  }
}
