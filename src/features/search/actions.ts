"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { encrypt, hashQuery } from "@/lib/encryption";
import type { Suggestion } from "./types";
import { getSearchHistory } from "./data";

/**
 * Saves search term to user's history & log
 * Encrypts query for storage
 * Deduplicates by query hash
 * Logs repeated searches separately in searchLog
 */

export async function addSearchTermAction(term: string) {
  const session = await getSession();
  if (!session?.userId) {
    return { error: "Unauthorized" };
  }

  const trimmedTerm = term.trim();
  if (!trimmedTerm) {
    return { error: "Query is required" };
  }

  try {
    const queryHash = hashQuery(trimmedTerm);
    const encryptedQuery = encrypt(trimmedTerm);

    await prisma.$transaction(async (tx) => {
      // Check if query already exists in search history
      const existingSearch = await tx.searchHistory.findUnique({
        where: { userId_queryHash: { userId: session.userId, queryHash } },
      });

      if (existingSearch) {
        // Log old entry before replacing it
        await tx.searchLog.create({
          data: {
            userId: existingSearch.userId,
            query: existingSearch.query,
            queryHash: existingSearch.queryHash,
            createdAt: existingSearch.createdAt,
          },
        });
        // Remove duplicate from history
        await tx.searchHistory.delete({ where: { id: existingSearch.id } });
      }

      // Add new/updated entry to history
      await tx.searchHistory.create({
        data: {
          query: encryptedQuery,
          queryHash: queryHash,
          userId: session.userId,
        },
      });
    });
    return { success: true };
  } catch (error) {
    console.error("Database Error: Failed to save search term.", error);
    return { error: "Internal Server Error" };
  }
}

/**
 * Fetches search suggestions based on history and recipe names.
 * Replaces /api/recipes/suggestions
 */
export async function getSearchSuggestions(
  query: string
): Promise<Suggestion[]> {
  if (!query) return [];
  const session = await getSession();
  const lowerCaseQuery = query.toLowerCase();

  try {
    let historySuggestions: Suggestion[] = [];
    if (session?.userId) {
      const history = await getSearchHistory();
      historySuggestions = history
        .filter((term) => term.toLowerCase().includes(lowerCaseQuery))
        .map((term) => ({ value: term, type: "history" }));
    }

    const recipeSuggestions: Suggestion[] = await prisma.recipe
      .findMany({
        where: { name: { contains: lowerCaseQuery, mode: "insensitive" } },
        select: { name: true },
        take: 10,
      })
      .then((recipes) =>
        recipes.map((r) => ({ value: r.name, type: "recipe" }))
      );

    // Remove duplicates where recipe name already exists in history
    const historyValues = new Set(historySuggestions.map((h) => h.value));
    const uniqueRecipeSuggestions = recipeSuggestions.filter(
      (r) => !historyValues.has(r.value)
    );

    return [...historySuggestions, ...uniqueRecipeSuggestions].slice(0, 10);
  } catch (error) {
    console.error("Database Error: Failed to fetch suggestions.", error);
    return [];
  }
}
