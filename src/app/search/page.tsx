import { Suspense } from "react";
import { searchRecipes, getSearchHistory } from "@/features/search/data";
import SearchClient from "@/features/search/components/SearchClient";
import SearchPageSkeleton from "@/features/search/components/SearchPageSkeleton";

// Ensure page always fetches fresh data
export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: { q?: string };
}

/**
 * SearchPage Server Component
 * Reads the `q` query param from URL
 * Fetches:
 * Initial search results (based on query)
 * User's search history
 * Renders the SearchClient with initial data
 * Wraps in <Suspense> so skeleton UI is shown when needed
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  // Fetch results + history
  const [initialResults, initialHistory] = await Promise.all([
    searchRecipes(query),
    getSearchHistory(),
  ]);

  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchClient
        query={query}
        initialResults={initialResults}
        initialHistory={initialHistory}
      />
    </Suspense>
  );
}
