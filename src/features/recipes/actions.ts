"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { recipeSchema, type RecipeFormState, recipeCardSchema } from "./types";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file: File) {
  const fileBuffer = await file.arrayBuffer();
  const mime = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");
  const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;
  const result = await cloudinary.uploader.upload(fileUri, {
    folder: "recipes",
    resource_type: "auto",
  });
  return { url: result.secure_url, type: result.resource_type };
}

/**
 * Server Action to create a new recipe.
 */
export async function createRecipe(
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const session = await getSession();
  if (!session?.userId) {
    return { message: "You must be logged in to create a recipe." };
  }

  function extractArray(prefix: string, fields: string[]): any[] {
    const result: any[] = [];
    let i = 0;
    while (true) {
      const obj: any = {};
      let found = false;
      for (const field of fields) {
        let value = formData.get(`${prefix}.${i}.${field}`);
        if (value === null) {
          value = formData.get(`${prefix}[${i}].${field}`);
        }
        if (value !== null && value !== undefined) {
          obj[field] = String(value);
          found = true;
        }
      }
      if (!found) break;
      result.push(obj);
      i++;
    }
    return result;
  }

  const dataToValidate = {
    name: formData.get("name"),
    description: formData.get("description"),
    media: formData.get("media"),
    prepTime: formData.get("prepTime"),
    cookTime: formData.get("cookTime"),
    servings: formData.get("servings"),
    category: formData.get("category"),
    isPublic: formData.get("isPublic") === "on",
    ingredients: extractArray("ingredients", ["name", "amount", "unit"]),
    instructionSteps: extractArray("instructionSteps", ["text"]),
  };

  console.log("DATA TO VALIDATE:", JSON.stringify(dataToValidate, null, 2));
  const validatedFields = recipeSchema.safeParse(dataToValidate);
  if (!validatedFields.success) {
    console.log(
      "VALIDATION ERRORS:",
      JSON.stringify(validatedFields.error.flatten(), null, 2)
    );
  }

  if (!validatedFields.success) {
    return {
      message: "Please correct the form errors.",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        ingredients: (
          validatedFields.error.flatten().fieldErrors.ingredients ?? []
        ).map((err: any) => ({
          name: err?.name,
          amount: err?.amount,
          unit: err?.unit,
        })),
        instructionSteps: (
          validatedFields.error.flatten().fieldErrors.instructionSteps ?? []
        ).map((err: any) => ({
          text: err?.text,
        })),
      },
    };
  }

  const mediaFile = validatedFields.data.media;
  if (!mediaFile || mediaFile.size === 0) {
    return {
      message: "A media file is required.",
      errors: { media: ["Please upload an image or video."] },
    };
  }

  try {
    const { url: mediaUrl, type: resourceType } = await uploadToCloudinary(
      mediaFile
    );
    const mediaType = resourceType === "video" ? "video" : "gif";

    const category = await prisma.category.findUnique({
      where: { name: validatedFields.data.category },
      select: { id: true },
    });

    if (!category) {
      return { message: "Selected category not found." };
    }

    await prisma.recipe.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        prepTime: validatedFields.data.prepTime,
        cookTime: validatedFields.data.cookTime,
        servings: validatedFields.data.servings,
        isPublic: validatedFields.data.isPublic,
        authorId: session.userId,
        categoryId: category.id,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        ingredients: {
          create: validatedFields.data.ingredients.map((ing) => ({
            name: ing.name,
            amount: `${ing.amount} ${ing.unit || ""}`.trim(),
          })),
        },
        instructionSteps: {
          create: validatedFields.data.instructionSteps.map((step, index) => ({
            text: step.text,
            stepNumber: index + 1,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Database Error: Failed to create recipe.", error);
    return { message: "An unexpected error occurred. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

/**
 * Server Action to update an existing recipe
 */
export async function updateRecipe(
  id: number,
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const session = await getSession();
  if (!session?.userId) {
    return { message: "You must be logged in to update a recipe." };
  }

  function extractArray(prefix: string, fields: string[]): any[] {
    const result: any[] = [];
    let i = 0;
    while (true) {
      const obj: any = {};
      let found = false;
      for (const field of fields) {
        let value = formData.get(`${prefix}.${i}.${field}`);
        if (value === null) {
          value = formData.get(`${prefix}[${i}].${field}`);
        }
        if (value !== null && value !== undefined) {
          obj[field] = String(value);
          found = true;
        }
      }
      if (!found) break;
      result.push(obj);
      i++;
    }
    return result;
  }

  let media = formData.get("media");
  // If media is not a File or is empty file input treat as undefined
  if (!(media instanceof File) || (media instanceof File && media.size === 0)) {
    media = null;
  }
  const dataToValidate = {
    name: formData.get("name"),
    description: formData.get("description"),
    media,
    prepTime: formData.get("prepTime"),
    cookTime: formData.get("cookTime"),
    servings: formData.get("servings"),
    category: formData.get("category"),
    isPublic: formData.get("isPublic") === "on",
    ingredients: extractArray("ingredients", ["name", "amount", "unit"]),
    instructionSteps: extractArray("instructionSteps", ["text"]),
  };

  const validatedFields = recipeSchema.safeParse(dataToValidate);
  if (!validatedFields.success) {
    return {
      message: "Please correct the form errors.",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        ingredients: (
          validatedFields.error.flatten().fieldErrors.ingredients ?? []
        ).map((err: any) => ({
          name: err?.name,
          amount: err?.amount,
          unit: err?.unit,
        })),
        instructionSteps: (
          validatedFields.error.flatten().fieldErrors.instructionSteps ?? []
        ).map((err: any) => ({
          text: err?.text,
        })),
      },
    };
  }

  // Find the recipe and check ownership
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { authorId: true, mediaUrl: true, mediaType: true },
  });
  if (!recipe || recipe.authorId !== session.userId) {
    return { message: "You do not have permission to update this recipe." };
  }

  let mediaUrl = recipe.mediaUrl;
  let mediaType = recipe.mediaType;
  const mediaFile = validatedFields.data.media;
  if (mediaFile && (mediaFile as File).size && (mediaFile as File).size > 0) {
    const upload = await uploadToCloudinary(mediaFile as File);
    mediaUrl = upload.url;
    mediaType = upload.type === "video" ? "video" : "gif";
  }

  const category = await prisma.category.findUnique({
    where: { name: validatedFields.data.category },
    select: { id: true },
  });
  if (!category) {
    return { message: "Selected category not found." };
  }

  try {
    // Update main recipe fields
    await prisma.recipe.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        prepTime: validatedFields.data.prepTime,
        cookTime: validatedFields.data.cookTime,
        servings: validatedFields.data.servings,
        isPublic: validatedFields.data.isPublic,
        categoryId: category.id,
        mediaUrl,
        mediaType,
        // Remove and recreate ingredients and instructions
        ingredients: {
          deleteMany: {},
          create: validatedFields.data.ingredients.map((ing) => ({
            name: ing.name,
            amount: `${ing.amount} ${ing.unit || ""}`.trim(),
          })),
        },
        instructionSteps: {
          deleteMany: {},
          create: validatedFields.data.instructionSteps.map((step, index) => ({
            text: step.text,
            stepNumber: index + 1,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Database Error: Failed to update recipe.", error);
    return { message: "An unexpected error occurred. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

/**
 * Server Action to delete a recipe by ID
 */
export async function deleteRecipe(id: number) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error("You must be logged in to delete a recipe.");
  }

  try {
    await prisma.recipe.delete({ where: { id, authorId: session.userId } }); // Ensure user owns recipe
  } catch (error) {
    console.error("Database Error: Failed to delete recipe.", error);
    throw new Error("Failed to delete recipe.");
  }

  revalidatePath("/dashboard");
}

/**
 * Server Action for the main feed (homepage) to fetch official recipes
 */
export async function getFeedRecipesAction(cursor?: number, take: number = 5) {
  const session = await getSession();
  const userId = session?.userId;

  try {
    const recipesFromDb = await prisma.recipe.findMany({
      take,
      where: { authorId: null }, // Official recipes have no author
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
    const nextCursor =
      items.length === take ? items[items.length - 1].id : null;

    return { items, nextCursor: nextCursor ? Number(nextCursor) : null };
  } catch (error) {
    console.error("Failed to fetch feed recipes:", error);
    return { items: [], nextCursor: null };
  }
}

/**
 * Server Action for Community feed to fetch user-submitted recipes
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
    const nextCursor =
      items.length === take ? items[items.length - 1].id : null;

    return { items, nextCursor: nextCursor ? Number(nextCursor) : null };
  } catch (error) {
    console.error("Failed to fetch community recipes:", error);
    return { items: [], nextCursor: null };
  }
}

/**
 * Server action to toggle a like on a recipe for current user
 */
export async function toggleLikeAction(recipeId: number) {
  const session = await getSession();
  const userId = session?.userId;
  if (!userId) throw new Error("Unauthorized");

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
  revalidatePath(`/`); // Revalidate feed
}

/**
 * Server action to toggle a recipes saved status for the current user
 */
export async function toggleSaveAction(recipeId: number) {
  const session = await getSession();
  const userId = session?.userId;
  if (!userId) throw new Error("Unauthorized");

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
  revalidatePath(`/`); // Revalidate feed
}

/**
 * Searches for an ingredient image in Cloudinary based on a naming convention
 * @param ingredientName The name of the ingredient to search for
 * @returns The secure URL of the image or null if not found
 */
export async function getIngredientImageAction(
  ingredientName: string
): Promise<string | null> {
  // Sanitize the input to match the public_id format (lowercase, spaces to underscores)
  const sanitizedName = ingredientName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (!sanitizedName) {
    return null;
  }

  try {
    const result = await cloudinary.search
      .expression(`folder=ingredients AND public_id=${sanitizedName}`)
      .execute();

    // Search returns an array of resources
    if (result.resources && result.resources.length > 0) {
      return result.resources[0].secure_url;
    }

    return null; // No image found
  } catch (error) {
    console.error("Cloudinary search failed:", error);
    return null;
  }
}
