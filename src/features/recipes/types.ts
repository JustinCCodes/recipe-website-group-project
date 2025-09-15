import { z } from "zod";

export const recipeSchema = z.object({
  id: z.number().int(),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description is too short." }),
  mediaUrl: z.string().min(1, { message: "Media URL cannot be empty." }),
  mediaType: z.enum(["video", "gif"]),
  durationSec: z.number().int().positive().optional().nullable(),
  likes: z.number().int().nonnegative().optional().nullable(),
  prepTime: z.coerce.number().int().positive(),
  cookTime: z.coerce.number().int().positive(),
  servings: z.coerce.number().int().positive(),
  category: z.string().min(1, { message: "Category is required." }),
  ingredients: z.string().min(1, { message: "Ingredients cannot be empty." }),
  instructions: z.string().min(1, { message: "Instructions cannot be empty." }),
});

export type Recipe = z.infer<typeof recipeSchema>;

export type RecipeFormState = {
  message?: string;
  errors?: {
    [key in keyof z.infer<typeof recipeSchema>]?: string[];
  };
};

export const recipeCardSchema = recipeSchema
  .pick({
    id: true,
    name: true,
    mediaUrl: true,
    mediaType: true,
    durationSec: true,
    likes: true,
  })
  .transform((data) => ({
    title: data.name,
    id: String(data.id),
    mediaUrl: data.mediaUrl,
    mediaType: data.mediaType,
    durationSec: data.durationSec,
    likes: data.likes,
  }));

export type RecipeCard = z.infer<typeof recipeCardSchema>;
