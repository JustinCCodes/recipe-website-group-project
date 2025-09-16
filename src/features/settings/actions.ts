"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Type
type UnifiedHistoryItem = {
  id: string;
  source: "history" | "log";
};

/**
 * Deletes single item from history or the log
 */
export async function deleteUnifiedHistoryItemAction(item: UnifiedHistoryItem) {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  try {
    if (item.source === "history") {
      await prisma.searchHistory.delete({
        where: { id: item.id, userId: session.userId },
      });
    } else {
      await prisma.searchLog.delete({
        where: { id: item.id, userId: session.userId },
      });
    }
    revalidatePath("/settings/privacy/search-history");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete item." };
  }
}

/**
 * Deletes all search history and logs for current user
 */
export async function clearAllHistoryAction() {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  try {
    await prisma.$transaction([
      prisma.searchLog.deleteMany({ where: { userId: session.userId } }),
      prisma.searchHistory.deleteMany({ where: { userId: session.userId } }),
    ]);
    revalidatePath("/settings/privacy/search-history");
    return { success: true };
  } catch (error) {
    return { error: "Failed to clear history." };
  }
}

/**
 * Deletes all history created today for current user
 */
export async function clearTodaysHistoryAction() {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of the day

  try {
    await prisma.$transaction([
      prisma.searchLog.deleteMany({
        where: { userId: session.userId, createdAt: { gte: today } },
      }),
      prisma.searchHistory.deleteMany({
        where: { userId: session.userId, createdAt: { gte: today } },
      }),
    ]);
    revalidatePath("/settings/privacy/search-history");
    return { success: true };
  } catch (error) {
    return { error: "Failed to clear today's history." };
  }
}

/**
 * Deletes all history in a given date range
 */
export async function clearHistoryByDateRangeAction(
  startDate: Date,
  endDate: Date
) {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  try {
    await prisma.$transaction([
      prisma.searchLog.deleteMany({
        where: {
          userId: session.userId,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.searchHistory.deleteMany({
        where: {
          userId: session.userId,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);
    revalidatePath("/settings/privacy/search-history");
    return { success: true };
  } catch (error) {
    return { error: "Failed to clear history for the selected range." };
  }
}
