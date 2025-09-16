import Link from "next/link";
import { getDashboardData } from "@/features/recipes/data"; // Function to fetch dashboard specific data
import DeleteRecipeButton from "@/features/recipes/components/DeleteRecipeButton"; // Button for deleting recipe

// Main dashboard page component
export default async function DashboardPage() {
  // Fetch user created and saved recipes
  const { createdRecipes, savedRecipes } = await getDashboardData();

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Your Dashboard</h1>
      </header>

      {/* Button linking to user settings */}
      <Link
        href="/settings"
        className="btn btn-ghost btn-circle absolute right-8 top-6"
      >
        {/* Settings Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </Link>

      {/* Recipes created by user */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">My Created Recipes</h2>
          <Link
            href="/create-recipe"
            className="btn btn-primary btn-sm no-animation"
          >
            Create New
          </Link>
        </div>

        {/* If user didn't create recipe show placeholder */}
        {createdRecipes.length === 0 ? (
          <p className="text-gray-400">You haven't created any recipes yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {createdRecipes.map((recipe) => (
              <li
                key={recipe.id}
                className="border border-base-300 bg-base-200 rounded-lg overflow-hidden"
              >
                {/* Recipe image */}
                <img
                  src={recipe.mediaUrl}
                  alt={recipe.name}
                  className="w-full h-40 object-cover"
                />
                {/* Recipe info and actions */}
                <div className="p-3 space-y-2">
                  <h3 className="font-medium truncate">{recipe.name}</h3>
                  <div className="flex gap-3 pt-2">
                    {/* Link to edit the recipe */}
                    <Link
                      href={`/edit-recipe?id=${recipe.id}`}
                      className="underline"
                    >
                      Edit
                    </Link>
                    {/* Delete button */}
                    <DeleteRecipeButton id={recipe.id} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recipes saved by user */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Saved Recipes</h2>
        {savedRecipes.length === 0 ? (
          <p className="text-gray-400">You haven't saved any recipes yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {savedRecipes.map((recipe) => (
              <li
                key={recipe.id}
                className="border border-base-300 bg-base-200 rounded-lg overflow-hidden"
              >
                <Link href={`/recipes/${recipe.id}`} className="block">
                  <img
                    src={recipe.mediaUrl}
                    alt={recipe.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium truncate">{recipe.name}</h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Placeholder for edited recipes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-600">
          My Edited Recipes (Coming Soon)
        </h2>
        <p className="text-gray-500">
          This section will show recipes you've edited.
        </p>
      </section>
    </main>
  );
}
