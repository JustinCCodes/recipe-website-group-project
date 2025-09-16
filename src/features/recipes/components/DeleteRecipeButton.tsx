"use client";

import { useTransition } from "react";
import { deleteRecipe } from "../actions";
import toast from "react-hot-toast";

/**
 * DeleteRecipeButton
 * - Deletes recipe via server action
 * - Asks user for confirmation before deleting
 * - Uses useTransition to keep UI responsive and show loading state
 * - Shows toast notifications for success/error feedback
 */
export default function DeleteRecipeButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      startTransition(async () => {
        try {
          // Wrap delete in toast.promise for feedback
          await toast.promise(deleteRecipe(id), {
            loading: "Deleting recipe...",
            success: "Recipe deleted successfully!",
            error: "Failed to delete recipe.",
          });
        } catch (err) {
          console.error(err);
          toast.error("Something went wrong!");
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      type="button"
      disabled={isPending}
      className="underline text-red-600 active:scale-95 no-animation"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
