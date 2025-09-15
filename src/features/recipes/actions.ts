"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { recipeSchema, type RecipeFormState, recipeCardSchema } from "./types";

/**
 * Server Action to create a new recipe
 */
export async function createRecipe(
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const session = await getSession();
  if (!session?.userId) {
    return { message: "You must be logged in to create a recipe." };
  }

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
    const {
      name,
      description,
      prepTime,
      cookTime,
      servings,
      category,
      mediaUrl,
      mediaType,
      ingredients,
      instructions,
    } = validatedFields.data;

    // Insert recipe into DB
    await prisma.recipe.create({
      data: {
        name,
        description,
        prepTime,
        cookTime,
        servings,
        category,
        mediaUrl,
        mediaType,

        // Convert comma separated strings to trimmed arrays
        ingredients: ingredients.split(",").map((item) => item.trim()),
        instructions: instructions.split(",").map((item) => item.trim()),
      },
    });
  } catch (error) {
    console.error("Database Error: Failed to create recipe.", error);
    return { message: "Failed to create recipe. Please try again." };
  }

  revalidatePath("/recipes");
  redirect("/recipes");
}

/**
 * Server Action to delete a recipe by ID
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

  revalidatePath("/recipes");
  redirect("/recipes");
}

/**
 * Server Action for the feed component to fetch recipes
 */
export async function getFeedRecipesAction(cursor?: number, take: number = 5) {
  try {
    const recipesFromDb = await prisma.recipe.findMany({
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        mediaUrl: true,
        mediaType: true,
        durationSec: true,
        likes: true,
      },
    });

    const items = recipesFromDb.map((recipe) => recipeCardSchema.parse(recipe));

    const nextId = items.length === take ? items[take - 1].id : null;
    const nextCursor = nextId ? Number(nextId) : null;

    return { items, nextCursor };
  } catch (error) {
    console.error("Failed to fetch feed recipes:", error);
    return { items: [], nextCursor: null };
  }
}
