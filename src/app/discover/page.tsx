import DiscoverFeed from "@/features/discover/components/DiscoverFeed";
import { getRecentRecipes } from "@/features/recipes/data";
import { recipeCardSchema } from "@/features/recipes/types";

export default async function DiscoverPage() {
  // Fetch last 5 recipes on server
  const recentRecipes = await getRecentRecipes();

  // Transform full recipe data into RecipeCard shape
  const feedItems = recentRecipes.map((recipe) =>
    recipeCardSchema.parse(recipe)
  );

  return (
    <main className="relative">
      {/* Pass prepared data to client component */}
      <DiscoverFeed recipes={feedItems} />
    </main>
  );
}
