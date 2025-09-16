"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { recipeSchema, type RecipeFormState, recipeCardSchema } from "./types";

/**
 * Create a new recipe in the database
 * - Validates form data with Zod
 * - Requires user to be logged in
 * - Supports public/private recipes
 * - Splits ingredients and instructions from comma separated strings
 * - Revalidates /dashboard
 */
export async function createRecipe(
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const session = await getSession();
  if (!session?.userId) {
    return { message: "You must be logged in to create a recipe." };
  }

  const isPublic = formData.get("isPublic") === "on";
  const validatedFields = recipeSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Please correct the form errors.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { id, likes, ...recipeData } = validatedFields.data;

    await prisma.recipe.create({
      data: {
        ...recipeData,
        isPublic,
        authorId: session.userId,
        ingredients: recipeData.ingredients
          .split(",")
          .map((item) => item.trim()),
        instructions: recipeData.instructions
          .split(",")
          .map((item) => item.trim()),
      },
    });
  } catch (error) {
    console.error("Database Error: Failed to create recipe.", error);
    return { message: "Failed to create recipe. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

/**
 * Update an existing recipe
 * - Similar validation as createRecipe
 * - Updates recipe fields
 * - Splits ingredients/instructions from comma-separated strings
 * - Revalidates /dashboard and edit page after update
 */
export async function updateRecipe(
  id: number,
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const session = await getSession();
  if (!session?.userId) {
    return { message: "Unauthorized" };
  }

  const isPublic = formData.get("isPublic") === "on";
  const validatedFields = recipeSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Please correct the form errors.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { id: validatedId, likes, ...updatableData } = validatedFields.data;

    await prisma.recipe.update({
      where: { id },
      data: {
        ...updatableData,
        isPublic,
        ingredients: updatableData.ingredients.split(",").map((s) => s.trim()),
        instructions: updatableData.instructions
          .split(",")
          .map((s) => s.trim()),
      },
    });
  } catch (error) {
    console.error("Database Error: Failed to update recipe.", error);
    return { message: "Failed to update recipe." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/edit-recipe?id=${id}`);
  redirect("/dashboard");
}

/**
 * Delete recipe by ID
 * - Requires login
 * - Revalidates /dashboard after deletion
 */
export async function deleteRecipe(id: number) {
  const session = await getSession();
  if (!session?.userId) {
    return { message: "You must be logged in to delete a recipe." };
  }

  try {
    await prisma.recipe.delete({ where: { id } });
  } catch (error) {
    console.error("Database Error: Failed to delete recipe.", error);
    return { message: "Failed to delete recipe." };
  }

  revalidatePath("/dashboard");
}

/**
 * Fetch official recipes for main feed
 * - Pagination via cursor
 * - Includes like count and if current user liked each recipe
 */
export async function getFeedRecipesAction(cursor?: number, take: number = 5) {
  const session = await getSession();
  const userId = session?.userId;

  try {
    const recipesFromDb = await prisma.recipe.findMany({
      take,
      where: { authorId: null },
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
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

    const items = recipesFromDb.map((recipe) => recipeCardSchema.parse(recipe));
    const nextId = items.length === take ? items[items.length - 1].id : null;
    const nextCursor = nextId ? Number(nextId) : null;

    return { items, nextCursor };
  } catch (error) {
    console.error("Failed to fetch feed recipes:", error);
    return { items: [], nextCursor: null };
  }
}

/**
 * Fetch user submitted public recipes for community feed
 * - Similar to main feed but filters by isPublic
 */
export async function getCommunityRecipesAction(
  cursor?: number,
  take: number = 5
) {
  const session = await getSession();
  const userId = session?.userId;

  try {
    const recipesFromDb = await prisma.recipe.findMany({
      take,
      where: { isPublic: true },
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
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

    const items = recipesFromDb.map((recipe) => recipeCardSchema.parse(recipe));
    const nextId = items.length === take ? items[items.length - 1].id : null;
    const nextCursor = nextId ? Number(nextId) : null;

    return { items, nextCursor };
  } catch (error) {
    console.error("Failed to fetch community recipes:", error);
    return { items: [], nextCursor: null };
  }
}

/**
 * Toggle like on recipe
 * - Checks if user already liked recipe
 * - If yes removes like if no adds like
 */
export async function toggleLikeAction(recipeId: number) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    return { error: "You must be logged in to like a recipe." };
  }

  const existingLike = await prisma.like.findUnique({
    where: { recipeId_userId: { recipeId, userId } },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { recipeId_userId: { recipeId, userId } },
    });
  } else {
    await prisma.like.create({
      data: { recipeId, userId },
    });
  }
}

/**
 * Fetch all recipes created by current user
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
 * Toggle recipes saved status for current user
 * - Checks if user has saved recipe
 * - Adds or removes record in recipeUser table accordingly
 */
export async function toggleSaveAction(recipeId: number) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    return { error: "You must be logged in to save a recipe." };
  }

  const existingSave = await prisma.recipeUser.findUnique({
    where: { recipeId_userId: { recipeId, userId } },
  });

  if (existingSave) {
    await prisma.recipeUser.delete({
      where: { recipeId_userId: { recipeId, userId } },
    });
  } else {
    await prisma.recipeUser.create({
      data: { recipeId, userId },
    });
  }
}
