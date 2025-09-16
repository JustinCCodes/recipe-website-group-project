"use client";

import { useState, MouseEvent } from "react";
import { toggleLikeAction } from "../actions";

interface LikeButtonProps {
  recipeId: number; // ID of recipe to like/unlike
  initialLikes: number; // Initial like count from server
  initialIsLiked: boolean; // Initial liked state from server
}

/**
 * LikeButton
 * - Handles like/unlike interactions for recipe
 * - Optimistically updates UI to reflect new like state immediately
 * - Reverts UI if server action fails
 */
export default function LikeButton({
  recipeId,
  initialLikes,
  initialIsLiked,
}: LikeButtonProps) {
  // Local state for like count
  const [likes, setLikes] = useState(initialLikes);

  // Local state for when user has liked recipe
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  // Loading state to prevent rapid multiple clicks
  const [isPending, setIsPending] = useState(false);

  /**
   * Handle like/unlike click
   * - Stops propagation to avoid triggering parent clicks
   * - Optimistically updates UI
   * - Calls server action
   * - Reverts state if server action fails
   */
  const handleLike = async (e: MouseEvent) => {
    e.stopPropagation();
    setIsPending(true);

    // Save previous state in case server call fails
    const previousState = { likes, isLiked };

    // Optimistic UI update
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await toggleLikeAction(recipeId);
    } catch (err) {
      // Revert to previous state if server action fails
      setIsLiked(previousState.isLiked);
      setLikes(previousState.likes);
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleLike} // Trigger like/unlike
      disabled={isPending} // Prevent interaction while pending
      className="flex flex-col items-center active:scale-95 transition-transform no-animation"
    >
      {/* Render filled Thumbs Up if liked outline if not */}
      {isLiked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path>
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
            d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
          ></path>
        </svg>
      )}
      {/* Show current like count */}
      <span className="text-xs font-semibold">{likes}</span>
    </button>
  );
}
