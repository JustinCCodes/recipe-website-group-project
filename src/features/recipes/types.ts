import { z } from "zod";

// Define a maximum file size and accepted types
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];

/**
 * Updated recipe validation schema for new dynamic form
 */
export const recipeSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description is too short." }),
  media: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `Max file size is 10MB.`
    )
    .refine(
      (file) =>
        !file || file.type === "" || ACCEPTED_MEDIA_TYPES.includes(file.type),
      "Only .jpg, .png, .gif, .mp4 and .webm formats are supported."
    ),
  prepTime: z.coerce.number().int().min(0, "Prep time can't be negative."),
  cookTime: z.coerce.number().int().min(0, "Cook time can't be negative."),
  servings: z.coerce.number().int().positive("Servings must be at least 1."),
  category: z.string().min(1, { message: "Category is required." }),
  isPublic: z.boolean().default(false),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name can't be empty."),
        amount: z.string().min(1, "Amount can't be empty."),
        unit: z.string().optional(),
      })
    )
    .min(1, "You must add at least one ingredient."),
  instructionSteps: z
    .array(
      z.object({
        text: z.string().min(3, "Instruction step is too short."),
      })
    )
    .min(1, "You must add at least one instruction."),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

/**
 * Form state type used for server actions
 */
export type RecipeFormState = {
  message?: string;
  errors?: {
    name?: string[];
    description?: string[];
    media?: string[];
    prepTime?: string[];
    cookTime?: string[];
    servings?: string[];
    category?: string[];
    isPublic?: string[];
    // Tells TypeScript that ingredients can be an array of error objects
    ingredients?: (
      | {
          name?: string[];
          amount?: string[];
          unit?: string[];
        }
      | undefined
    )[];
    // This does the same for instructionSteps
    instructionSteps?: (
      | {
          text?: string[];
        }
      | undefined
    )[];
    _form?: string[];
  };
};

/**
 * Schema for recipe cards shown in feeds
 */
export const recipeCardSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    mediaUrl: z.string(),
    mediaType: z.string(),
    durationSec: z.number().int().positive().optional().nullable(),
    _count: z.object({ likes: z.number() }),
    likes: z
      .array(z.object({ userId: z.number(), recipeId: z.number() }))
      .optional()
      .default([]),
    users: z
      .array(z.object({ userId: z.number(), recipeId: z.number() }))
      .optional()
      .default([]),
  })
  .transform((data) => ({
    title: data.name,
    id: String(data.id),
    mediaUrl: data.mediaUrl,
    mediaType: data.mediaType === "video" ? "video" : "gif",
    durationSec: data.durationSec,
    likes: data._count.likes,
    isLiked: data.likes.length > 0,
    isSaved: data.users.length > 0,
  }));

/** Type representing a recipe card for feeds */
export type RecipeCard = z.infer<typeof recipeCardSchema>;
