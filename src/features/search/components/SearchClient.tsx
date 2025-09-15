"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { getSearchSuggestions, addSearchTermAction } from "../actions";
import type {
  RecipeSearchResult,
  Suggestion,
  UnifiedHistoryItem,
} from "../types";

interface SearchClientProps {
  query: string; // initial query from URL
  initialResults: RecipeSearchResult[]; // search results pre-fetched on the server
  initialHistory: UnifiedHistoryItem[]; // search history items
}

export default function SearchClient({
  query,
  initialResults,
  initialHistory,
}: SearchClientProps) {
  const [liveQuery, setLiveQuery] = useState(query); // controlled search input value
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]); // live autocomplete suggestions

  // Save initial query to history when page loads
  useEffect(() => {
    if (query) {
      addSearchTermAction(query);
    }
  }, [query]);

  // Debounced live search suggestions when user types
  useEffect(() => {
    // Reset if query is unchanged or empty
    if (!liveQuery.trim() || liveQuery === query) {
      setSuggestions([]);
      return;
    }
    // Debounce API calls (300ms)
    const debounceTimer = setTimeout(async () => {
      const newSuggestions = await getSearchSuggestions(liveQuery);
      setSuggestions(newSuggestions);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [liveQuery, query]);

  // Display logic
  const showLiveSuggestions =
    liveQuery.trim().length > 0 && liveQuery !== query; // typing new query
  const showStaticHistory = !query && !showLiveSuggestions; // show history if no query & not typing
  const showResults = !!query; // results only if query exists

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full md:max-w-2xl lg:max-w-3xl">
        {/* Top bar with back button + search bar */}
        <div className="relative flex h-12 w-full items-center justify-center mb-5">
          {/* Back to homepage button */}
          <Link
            href="/"
            aria-label="Go to Homepage"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          {/* Search bar input */}
          <div className="w-full px-12">
            <SearchBar onQueryChange={setLiveQuery} />
          </div>
        </div>
        {/* Suggestions / history */}
        <div className="mt-4">
          {/* Show static search history if no active query */}
          {showStaticHistory && (
            <div className="flex flex-col gap-1">
              {initialHistory.map((item) => (
                <Link
                  key={`${item.source}-${item.id}`}
                  href={`/search?q=${encodeURIComponent(item.query)}`}
                  className="flex items-center gap-4 w-full p-3 rounded-lg active:bg-base-300 transition-colors"
                >
                  {/* Clock icon for history */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 opacity-50 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{item.query}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Show live suggestions while typing */}
          {showLiveSuggestions && (
            <div className="flex flex-col gap-1">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={`/search?q=${encodeURIComponent(suggestion.value)}`}
                  className="flex items-center gap-4 w-full p-3 rounded-lg active:bg-base-300 transition-colors"
                >
                  {/* Use clock icon if suggestion came from history otherwise magnifying glass */}
                  {suggestion.type === "history" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 opacity-50 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 opacity-50 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                  <span>{suggestion.value}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* No results message */}
        {showResults && initialResults.length === 0 && (
          <div role="alert" className="alert alert-info mt-4">
            <span>No recipes found for "{query}".</span>
          </div>
        )}
        {/* Results table */}
        {showResults && initialResults.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Test</th>
                </tr>
              </thead>
              <tbody>
                {initialResults.map((recipe) => (
                  <tr key={recipe.id}>
                    <td>
                      <div className="font-bold">{recipe.name}</div>
                    </td>
                    <td>{recipe.description}</td>
                    <td>
                      {/* Placeholder details button */}
                      <button className="btn btn-ghost btn-xs">
                        Placeholder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
