"use client";

import { useState, MouseEvent } from "react";
import toast from "react-hot-toast";
import { toggleSaveAction } from "../actions";

interface SaveButtonProps {
  recipeId: number;
  initialIsSaved: boolean;
}

/**
 * SaveButton
 * - Toggles the saved state of recipe for current user
 * - Performs optimistic UI updates for instant feedback
 * - Shows toast notifications for saved and unsaved states
 */
export default function SaveButton({
  recipeId,
  initialIsSaved,
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (e: MouseEvent) => {
    e.stopPropagation();
    setIsPending(true);

    // Optimistic update
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
      // Call server action
      await toggleSaveAction(recipeId);

      // Show toast feedback
      toast.success(
        newSavedState ? "Recipe saved!" : "Recipe removed from saved!"
      );
    } catch (err) {
      // Rollback on error
      setIsSaved(!newSavedState);
      console.error(err);

      // Show error toast
      toast.error("Failed to update saved state. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className="flex flex-col items-center active:scale-95 transition-transform no-animation"
    >
      {isSaved ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
      )}
      <span className="text-xs font-semibold">Save</span>
    </button>
  );
}
