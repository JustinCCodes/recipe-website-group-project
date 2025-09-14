import { z } from "zod";

// Zod schema for validating recipe data
export const recipeSchema = z.object({
  // Name must be a string with at least 3 characters
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  // Description must be at least 10 characters
  description: z.string().min(10, { message: "Description is too short." }),

  // Prep time must be a positive integer
  prepTime: z.coerce
    .number()
    .int()
    .positive({ message: "Must be a positive number." }),

  // Cook time must be a positive integer
  cookTime: z.coerce
    .number()
    .int()
    .positive({ message: "Must be a positive number." }),

  // Servings must be a positive integer
  servings: z.coerce
    .number()
    .int()
    .positive({ message: "Must be a positive number." }),

  // Category is required
  category: z.string().min(1, { message: "Category is required." }),

  // Must be a valid URL string
  imageUrl: z.string().url({ message: "Must be a valid URL." }),

  // Ingredients string (later split into an array)
  ingredients: z.string().min(1, { message: "Ingredients cannot be empty." }),

  // Instructions string (later split into an array)
  instructions: z.string().min(1, { message: "Instructions cannot be empty." }),
});

// Type for state returned by create/update
export type RecipeFormState = {
  message?: string; // General error or success message
  errors?: {
    // Field level errors mapped from zod validation
    [key in keyof z.infer<typeof recipeSchema>]?: string[];
  };
};
