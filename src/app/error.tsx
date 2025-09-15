"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logs the error to console
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="grid min-h-[80vh] place-items-center p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-gray-400">
          An unexpected error occurred. Please try again.
        </p>
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
