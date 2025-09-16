"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/generated/prisma";
import type { RecipeFormState } from "../types";
import { createRecipe, updateRecipe } from "../actions";

interface RecipeFormProps {
  initialData?: Recipe | null;
}

/**
 * SubmitButton
 * - Shows different text depending on whether creating or editing
 * - Disabled when form submission is pending
 */
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary no-animation"
    >
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Recipe"}
    </button>
  );
}

/**
 * RecipeForm
 * - Handles creating or editing recipe
 * - Uses useFormState with either createRecipe or updateRecipe server action
 * - Supports validation errors and general messages
 */
export default function RecipeForm({ initialData }: RecipeFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  // Select server action
  const action = isEditing
    ? updateRecipe.bind(null, initialData.id)
    : createRecipe;

  // useFormState manages form submission state + errors/messages
  const [state, formAction] = useFormState(action, { message: "", errors: {} });

  // Helper to convert arrays to comma separated string for textarea fields
  const arrayToText = (arr: string[] | undefined) => arr?.join(", ") || "";

  return (
    <form action={formAction} className="space-y-4">
      {/* General error message */}
      {state.message && !state.errors && (
        <p className="text-red-500">{state.message}</p>
      )}

      {/* Recipe name */}
      <div>
        <label className="block text-sm font-medium">Name *</label>
        <input
          name="name"
          defaultValue={initialData?.name}
          className="input input-bordered w-full"
          required
        />
        {state.errors?.name && (
          <p className="text-error text-xs mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={initialData?.description}
          className="textarea textarea-bordered w-full"
          rows={3}
        />
        {state.errors?.description && (
          <p className="text-error text-xs mt-1">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {/* Media */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Media URL</label>
          <input
            name="mediaUrl"
            defaultValue={initialData?.mediaUrl}
            className="input input-bordered w-full"
          />
          {state.errors?.mediaUrl && (
            <p className="text-error text-xs mt-1">
              {state.errors.mediaUrl[0]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Media Type</label>
          <select
            name="mediaType"
            defaultValue={initialData?.mediaType}
            className="select select-bordered w-full"
          >
            <option value="video">Video</option>
            <option value="gif">Image/GIF</option>
          </select>
          {state.errors?.mediaType && (
            <p className="text-error text-xs mt-1">
              {state.errors.mediaType[0]}
            </p>
          )}
        </div>
      </div>

      {/* Timing and servings */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>Prep (min)</label>
          <input
            name="prepTime"
            type="number"
            defaultValue={initialData?.prepTime}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label>Cook (min)</label>
          <input
            name="cookTime"
            type="number"
            defaultValue={initialData?.cookTime}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label>Servings</label>
          <input
            name="servings"
            type="number"
            defaultValue={initialData?.servings}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium">Category</label>
        <input
          name="category"
          defaultValue={initialData?.category}
          className="input input-bordered w-full"
        />
      </div>

      {/* Ingredients */}
      <div>
        <label>Ingredients * (comma-separated)</label>
        <textarea
          name="ingredients"
          defaultValue={arrayToText(initialData?.ingredients)}
          className="textarea textarea-bordered w-full"
          rows={4}
          required
        />
        {state.errors?.ingredients && (
          <p className="text-error text-xs mt-1">
            {state.errors.ingredients[0]}
          </p>
        )}
      </div>

      {/* Instructions */}
      <div>
        <label>Instructions * (comma-separated)</label>
        <textarea
          name="instructions"
          defaultValue={arrayToText(initialData?.instructions)}
          className="textarea textarea-bordered w-full"
          rows={4}
          required
        />
        {state.errors?.instructions && (
          <p className="text-error text-xs mt-1">
            {state.errors.instructions[0]}
          </p>
        )}
      </div>

      {/* Public checkbox */}
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            name="isPublic"
            defaultChecked={initialData?.isPublic || false}
            className="checkbox checkbox-primary"
          />
          <span className="label-text">
            Share this recipe with the community
          </span>
        </label>
      </div>

      {/* Submit button */}
      <SubmitButton isEditing={isEditing} />
    </form>
  );
}
