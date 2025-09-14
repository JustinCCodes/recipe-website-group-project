"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { getSearchSuggestions, addSearchTermAction } from "../actions";
import type { RecipeSearchResult, Suggestion } from "../types";

interface SearchClientProps {
  query: string; // Current search query from URL
  initialResults: RecipeSearchResult[]; // Initial results from server
  initialHistory: string[]; // Initial user history from server
}

/**
 * Client side search page logic
 * Handles live query updates, debounced suggestions, and showing results/history
 */
export default function SearchClient({
  query,
  initialResults,
  initialHistory,
}: SearchClientProps) {
  const [liveQuery, setLiveQuery] = useState(query); // Controlled search input
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]); // Live suggestions

  // On mount store initial query into history
  useEffect(() => {
    if (query) {
      addSearchTermAction(query);
    }
  }, [query]);

  // Watch liveQuery fetch suggestions after 300ms debounce
  useEffect(() => {
    if (!liveQuery.trim() || liveQuery === query) {
      setSuggestions([]);
      return;
    }
    const debounceTimer = setTimeout(async () => {
      const newSuggestions = await getSearchSuggestions(liveQuery);
      setSuggestions(newSuggestions);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [liveQuery, query]);

  // State flags for rendering
  const showLiveSuggestions =
    liveQuery.trim().length > 0 && liveQuery !== query;
  const showStaticHistory = !query && !showLiveSuggestions;
  const showResults = !!query;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full md:max-w-2xl lg:max-w-3xl">
        {/* Top bar with back button + search input */}
        <div className="relative flex h-12 w-full items-center justify-center mb-5">
          <Link
            href="/"
            aria-label="Go to Homepage"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2"
          >
            {/* Back arrow icon */}
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
          <div className="w-full px-12">
            <SearchBar onQueryChange={setLiveQuery} />
          </div>
        </div>

        {/* History or live suggestions */}
        <div className="mt-4">
          {showStaticHistory && (
            <div className="flex flex-col gap-1">
              {initialHistory.map((term, index) => (
                <Link
                  key={index}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="flex items-center gap-4 w-full p-3 rounded-lg active:bg-base-300 transition-colors"
                >
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
                  <span>{term}</span>
                </Link>
              ))}
            </div>
          )}

          {showLiveSuggestions && (
            <div className="flex flex-col gap-1">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={`/search?q=${encodeURIComponent(suggestion.value)}`}
                  className="flex items-center gap-4 w-full p-3 rounded-lg active:bg-base-300 transition-colors"
                >
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

        {/* Results / no-results */}
        {showResults && initialResults.length === 0 && (
          <div role="alert" className="alert alert-info mt-4">
            <span>No recipes found for "{query}".</span>
          </div>
        )}

        {showResults && initialResults.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {initialResults.map((recipe) => (
                  <tr key={recipe.id} className="hover">
                    <td>
                      <div className="font-bold">{recipe.name}</div>
                    </td>
                    <td>{recipe.description}</td>
                    <td>
                      <button className="btn btn-ghost btn-xs">
                        Test-Still needs logic
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
