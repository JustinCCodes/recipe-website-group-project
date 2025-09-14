"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { recipeSchema, type RecipeFormState } from "./types";

/**
 * Server Action to create a new recipe
 * Validates input data with Zod schema
 * Splits comma separated ingredients/instructions into arrays
 * Persists recipe to database with Prisma
 * Revalidates /recipes page and redirects after success
 */
export async function createRecipe(
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const session = await getSession();
  if (!session?.userId) {
    return { message: "You must be logged in to create a recipe." };
  }

  // Extract fields that will be processed separate as comma separated lists
  const ingredients = formData.get("ingredients") as string;
  const instructions = formData.get("instructions") as string;

  // Validate all fields with schema
  const validatedFields = recipeSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    ingredients,
    instructions,
  });

  if (!validatedFields.success) {
    return {
      message: "Please correct the form errors.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Destructure validated data
    const {
      name,
      description,
      prepTime,
      cookTime,
      servings,
      category,
      imageUrl,
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
        imageUrl,
        // Convert comma separated strings to trimmed arrays
        ingredients: ingredients.split(",").map((item) => item.trim()),
        instructions: instructions.split(",").map((item) => item.trim()),
      },
    });
  } catch (error) {
    console.error("Database Error: Failed to create recipe.", error);
    return { message: "Failed to create recipe. Please try again." };
  }

  // Revalidate recipes page to show new recipe
  revalidatePath("/recipes");
  redirect("/recipes");
}

/**
 * Server Action to delete a recipe by ID
 * Requires logged in user
 * Removes recipe from DB
 * Revalidates /recipes page and redirects
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

  // Revalidate and redirect
  revalidatePath("/recipes");
  redirect("/recipes");
}
