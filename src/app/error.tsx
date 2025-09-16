"use client";

import { useEffect } from "react";

// Global error component
// Displays fallback UI when error occurs
export default function GlobalError({
  error, // Error object caught by boundary
  reset, // Function to reset error
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="grid min-h-[80vh] place-items-center p-6">
      <div className="space-y-4 text-center">
        {/* Error message */}
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-gray-400">
          An unexpected error occurred. Please try again.
        </p>

        {/* Button to retry / reset the error */}
        <button
          onClick={() => reset()}
          className="btn btn-primary no-animation active:scale-95"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
