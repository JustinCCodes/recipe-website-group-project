import "server-only";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { decrypt } from "@/lib/encryption";
import type { RecipeSearchResult, UnifiedHistoryItem } from "./types";

/**
 * Creates a sorted unified list of all search history and logs
 */
export async function getUnifiedSearchHistory(): Promise<UnifiedHistoryItem[]> {
  const session = await getSession();
  if (!session?.userId) return [];

  try {
    const history = await prisma.searchHistory.findMany({
      where: { userId: session.userId },
      select: { id: true, query: true, createdAt: true },
    });
    const log = await prisma.searchLog.findMany({
      where: { userId: session.userId },
      select: { id: true, query: true, createdAt: true },
    });

    const combined = [
      ...history.map((item) => ({
        ...item,
        query: decrypt(item.query),
        source: "history" as const,
      })),
      ...log.map((item) => ({
        ...item,
        query: decrypt(item.query),
        source: "log" as const,
      })),
    ];

    combined.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return combined;
  } catch (error) {
    console.error("Failed to fetch unified search history:", error);
    return [];
  }
}

/**
 * Searches for recipes by name description or ingredients
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
          {
            ingredients: {
              some: {
                name: { contains: query, mode: "insensitive" },
              },
            },
          },
        ],
      },
      select: { id: true, name: true, description: true },
    });
    return recipes;
  } catch (error) {
    console.error("Database Error: Failed to search recipes.", error);
    return [];
  }
}

/**
 * Fetches the users recent unique search history
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
