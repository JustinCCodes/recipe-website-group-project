"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  // Callback to notify SearchClient when input value change
  onQueryChange: (newQuery: string) => void;
}

/**
 * SearchBar component
 * Provides text input for recipe searching
 * Keeps query in sync with URL
 * Debounces input changes before notifying parent
 * Handles submission (navigates to /search?q=...)
 * Includes clear button to reset the search
 */
export default function SearchBar({ onQueryChange }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Initial value comes from `?q=` URL param (if present)
  const initialQuery = searchParams.get("q") || "";
  // State for current input value
  const [inputValue, setInputValue] = useState(initialQuery);
  // Ref to access input DOM element for focusing after clear
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Debounce input changes:
   * Wait 300ms after user stops typing
   * Then call onQueryChange used for live suggestions
   */
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onQueryChange(inputValue);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue, onQueryChange]);

  /**
   * Keeps input state in sync with URL param
   * For navigating back/forward or submitting search
   */
  useEffect(() => {
    setInputValue(initialQuery);
  }, [initialQuery]);

  /**
   * Handles full search form submission
   * Navigates to /search?q=...
   */
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    router.push(`/search?q=${inputValue}`);
  };

  /**
   * Clears search input and refocuses the field
   */
  const handleClear = () => {
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      {/* Search form (submits query on Enter key press) */}
      <form
        onSubmit={handleSearch}
        action="/search"
        method="GET"
        className="w-full"
      >
        <input
          ref={inputRef}
          type="text"
          name="q"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for recipes, ingredients..."
          className="input input-bordered input-primary w-full rounded-full pr-12 pl-5"
          autoComplete="off"
        />
      </form>

      {/* Clear button only visible when input has text */}
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-gray-500 active:bg-base-content/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
