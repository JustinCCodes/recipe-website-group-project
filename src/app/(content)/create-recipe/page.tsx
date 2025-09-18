import RecipeForm from "@/features/recipes/components/RecipeForm";
import { getCategoryNames } from "@/features/recipes/data";

export default async function CreateRecipePage() {
  const categories = await getCategoryNames();

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create a Recipe</h1>
      <RecipeForm categories={categories} />
    </main>
  );
}
