import "server-only"; // Code only runs on server
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { decrypt } from "@/lib/encryption";

/**
 * Fetches most recent unique search queries for logged in user
 * Limit is 10 most recent entries
 * Returns queries decrypted
 * @returns {Promise<string[]>} Array of decrypted search queries
 */
export async function getUniqueSearchHistory() {
  const session = await getSession();
  // If not logged in return empty
  if (!session?.userId) {
    return [];
  }
  // Fetch most recent unique search queries from database
  try {
    const recentUniqueSearches = await prisma.searchHistory.findMany({
      where: { userId: session.userId },
      distinct: ["query"],
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    // Decrypt each query before returning
    return recentUniqueSearches.map((item) => decrypt(item.query));
  } catch (error) {
    console.error("Failed to fetch unique search history:", error);
    return [];
  }
}
