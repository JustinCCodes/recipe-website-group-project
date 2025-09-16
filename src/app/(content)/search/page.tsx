import { Suspense } from "react";
import { searchRecipes, getUnifiedSearchHistory } from "@/features/search/data"; // Fetch search results & user search history
import SearchClient from "@/features/search/components/SearchClient"; // Client for search UI
import SearchPageSkeleton from "@/features/search/components/SearchPageSkeleton"; // Skeleton UI shown while loading

// Ensure page always fetches fresh data needed due to some TypeScript issue
export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: { q?: string }; // Optional query string
}

/**
 * Reads q query param from URL
 * Fetches:
 * - Initial search results based on query
 * - User search history
 * Renders SearchClient with initial data
 * Wraps in <Suspense> to show skeleton UI while loading
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Get query param or default to empty string
  const params = await searchParams;
  const query = params.q || "";

  // Fetch search results and search history in parallel
  const [initialResults, initialHistory] = await Promise.all([
    searchRecipes(query),
    getUnifiedSearchHistory(),
  ]);

  return (
    // Show skeleton UI while SearchClient loads
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchClient
        query={query} // Current search query
        initialResults={initialResults} // Initial search results
        initialHistory={initialHistory} // Initial search history
      />
    </Suspense>
  );
}
