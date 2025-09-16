import { getRecipeById } from "@/features/recipes/data"; // Function to fetch recipe by its ID
import RecipeForm from "@/features/recipes/components/RecipeForm"; // Form used to edit or create recipe

// Props for EditRecipePage component
// Expects searchParams with an optional id string
interface EditRecipePageProps {
  searchParams: { id?: string };
}

// Main page component for editing recipes
export default async function EditRecipePage({
  searchParams,
}: EditRecipePageProps) {
  // Convert the id from string to number
  const id = Number(searchParams.id);

  // If ID is invalid or missing show a not found message
  if (!id) return <p>Recipe not found.</p>;

  // Fetch recipe data from database using ID
  const recipe = await getRecipeById(id);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      {/* Page title showing which recipe is being edited */}
      <h1 className="text-2xl font-semibold">Edit Recipe #{id}</h1>

      {/* RecipeForm component pre filled with the fetched recipe data */}
      <RecipeForm initialData={recipe} />
    </main>
  );
}
