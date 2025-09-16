import { z } from "zod";

/**
 * Full recipe validation schema for form submissions
 */
export const recipeSchema = z.object({
  id: z.number().int(), // Recipe ID must be an integer
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description is too short." }),
  mediaUrl: z.string().min(1, { message: "Media URL cannot be empty." }),
  mediaType: z.enum(["video", "gif"]), // Must be either video or gif
  durationSec: z.number().int().positive().optional().nullable(), // Optional video duration
  likes: z.number().int().nonnegative().optional().nullable(), // Optional like count
  prepTime: z.coerce.number().int().positive(), // Coerce from string to number
  cookTime: z.coerce.number().int().positive(),
  servings: z.coerce.number().int().positive(),
  category: z.string().min(1, { message: "Category is required." }),
  ingredients: z.string().min(1, { message: "Ingredients cannot be empty." }),
  instructions: z.string().min(1, { message: "Instructions cannot be empty." }),
});

/** Type representing full recipe object */
export type Recipe = z.infer<typeof recipeSchema>;

/**
 * Form state type used for server actions
 * Contains optional message and field specific errors
 */
export type RecipeFormState = {
  message?: string;
  errors?: {
    [key in keyof z.infer<typeof recipeSchema>]?: string[];
  };
};

/**
 * Schema for recipe cards
 * Only picks essential fields and adds extra metadata
 */
export const recipeCardSchema = recipeSchema
  .pick({
    id: true,
    name: true,
    mediaUrl: true,
    mediaType: true,
    durationSec: true,
  })
  .extend({
    _count: z.object({ likes: z.number() }), // Include like count
    likes: z.array(z.object({ userId: z.number(), recipeId: z.number() })), // Users who liked
    users: z.array(z.object({ userId: z.number(), recipeId: z.number() })), // Users who saved
  })
  .transform((data) => ({
    title: data.name,
    id: String(data.id),
    mediaUrl: data.mediaUrl,
    mediaType: data.mediaType,
    durationSec: data.durationSec,
    likes: data._count.likes, // Count of likes
    isLiked: data.likes.length > 0, // Whether current user liked
    isSaved: data.users.length > 0, // Whether current user saved
  }));

/** Type representing recipe card for feeds */
export type RecipeCard = z.infer<typeof recipeCardSchema>;
