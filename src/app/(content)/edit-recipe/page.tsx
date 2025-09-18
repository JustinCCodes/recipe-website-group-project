import { notFound } from "next/navigation";
import RecipeForm from "@/features/recipes/components/RecipeForm";
import { getCategoryNames, getRecipeDetails } from "@/features/recipes/data";
import type {
  Recipe,
  Ingredient,
  InstructionStep,
  Category,
} from "@/generated/prisma";

function transformRecipeForForm(
  recipe: Recipe & {
    ingredients: Ingredient[];
    instructionSteps: InstructionStep[];
    category: Category | null;
  }
) {
  return {
    ...recipe,
    media: undefined,
    category: recipe.category?.name || "",
    ingredients: recipe.ingredients.map((ing) => {
      const parts = ing.amount.match(/^([\d/.,\s]+)\s*(.*)$/);
      return {
        name: ing.name,
        amount: parts ? parts[1].trim() : "",
        unit: parts ? parts[2].trim() : "",
      };
    }),
    instructionSteps: recipe.instructionSteps.map((step) => ({
      text: step.text,
    })),
  };
}

interface EditRecipePageProps {
  searchParams: { id?: string };
}

export default async function EditRecipePage({
  searchParams,
}: EditRecipePageProps) {
  const params = await searchParams;
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const [categories, recipeDetails] = await Promise.all([
    getCategoryNames(),
    getRecipeDetails(id),
  ]);

  if (!recipeDetails) {
    return notFound();
  }

  const initialDataForForm = transformRecipeForForm(recipeDetails as any);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Edit Recipe: {recipeDetails.name}
      </h1>
      <RecipeForm categories={categories} initialData={initialDataForForm} />
    </main>
  );
}
