import { redirect } from "next/navigation";
import { getSession } from "@/lib/session"; // Get current user session
import { getUnifiedSearchHistory } from "@/features/search/data"; // Fetch unified search history
import SearchLogManager from "@/features/settings/components/SearchLogManager"; // Component to manage search history

// Search history page
export default async function SearchHistoryPage() {
  // Get the current session
  const session = await getSession();

  // Redirect to login if no active session
  if (!session) {
    redirect("/login");
  }

  // Fetch all unified search history
  const unifiedHistory = await getUnifiedSearchHistory();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Search History</h1>
        <p className="text-lg text-gray-400 mt-2">
          Review and delete your past searches.
        </p>
      </header>

      {/* Lists history and provides delete options */}
      <SearchLogManager initialHistory={unifiedHistory} />
    </div>
  );
}
