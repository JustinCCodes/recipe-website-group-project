"use client";

import {
  useForm,
  useFieldArray,
  useWatch,
  type Resolver,
  type Control,
} from "react-hook-form";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recipeSchema, type RecipeFormState } from "../types";
import {
  createRecipe,
  updateRecipe,
  getIngredientImageAction,
} from "../actions";
import { SubmitButton as SharedSubmitButton } from "@/features/auth/components/SubmitButton";
import { useEffect, useState } from "react";

type RecipeFormData = z.infer<typeof recipeSchema>;

function IngredientRow({
  index,
  control,
  register,
  remove,
  errors,
  state,
}: {
  index: number;
  control: Control<RecipeFormData>;
  register: any;
  remove: (index: number) => void;
  errors: any;
  state: RecipeFormState;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ingredientName = useWatch({
    control,
    name: `ingredients.${index}.name`,
  });

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (ingredientName && ingredientName.trim().length > 2) {
        setIsLoading(true);
        const url = await getIngredientImageAction(ingredientName);
        setImageUrl(url);
        setIsLoading(false);
      } else {
        setImageUrl(null);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [ingredientName]);

  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 pt-1">
        {isLoading ? (
          <div className="skeleton h-16 w-16 rounded-lg"></div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={ingredientName}
            className="h-16 w-16 rounded-lg object-cover bg-base-200"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-base-200 text-xs text-base-content/50">
            No Image
          </div>
        )}
      </div>
      <div className="grid flex-grow grid-cols-2 gap-2">
        <div className="col-span-2">
          <input
            {...register(`ingredients.${index}.name`)}
            placeholder="Name (e.g., Onion)"
            className="input input-bordered w-full"
          />
          {errors.ingredients?.[index]?.name && (
            <p className="text-error text-xs mt-1">
              {errors.ingredients[index]?.name?.message}
            </p>
          )}
          {state.errors?.ingredients?.[index]?.name?.[0] && (
            <p className="text-error text-xs mt-1">
              {state.errors.ingredients[index]?.name?.[0]}
            </p>
          )}
        </div>
        <div>
          <input
            type="text"
            {...register(`ingredients.${index}.amount`)}
            placeholder="Amount"
            className="input input-bordered w-full"
          />
          {errors.ingredients?.[index]?.amount && (
            <p className="text-error text-xs mt-1">
              {errors.ingredients[index]?.amount?.message}
            </p>
          )}
          {state.errors?.ingredients?.[index]?.amount?.[0] && (
            <p className="text-error text-xs mt-1">
              {state.errors.ingredients[index]?.amount?.[0]}
            </p>
          )}
        </div>
        <div>
          <select
            {...register(`ingredients.${index}.unit`)}
            className="select select-bordered w-full"
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit || "Unit"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={() => remove(index)}
        className="btn btn-ghost btn-circle btn-sm mt-1"
      >
        ✕
      </button>
    </div>
  );
}

interface RecipeFormProps {
  categories: string[];
  initialData?: RecipeFormData & { id?: number };
}

function FormSubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <SharedSubmitButton
      label={isEditing ? "Save Changes" : "Create Recipe"}
      loadingLabel={isEditing ? "Saving..." : "Creating..."}
    />
  );
}

const UNITS = [
  "",
  "g",
  "kg",
  "ml",
  "L",
  "tsp",
  "tbsp",
  "cup",
  "pinch",
  "piece(s)",
];

export default function RecipeForm({
  categories,
  initialData,
}: RecipeFormProps) {
  const isEditing = !!initialData;
  const action = isEditing
    ? updateRecipe.bind(null, initialData.id!)
    : createRecipe;
  const [state, formAction] = useActionState<RecipeFormState, FormData>(
    action,
    { message: "" }
  );

  const {
    register,
    control,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema) as Resolver<RecipeFormData>,
    defaultValues: initialData || {
      isPublic: false,
      ingredients: [{ name: "", amount: "", unit: "" }],
      instructionSteps: [{ text: "" }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });
  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({ control, name: "instructionSteps" });

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{state.message}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Name *</label>
        <input {...register("name")} className="input input-bordered w-full" />
        {errors.name?.message && (
          <p className="text-error text-xs mt-1">{errors.name.message}</p>
        )}
        {state.errors?.name?.[0] && (
          <p className="text-error text-xs mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Description *</label>
        <textarea
          {...register("description")}
          className="textarea textarea-bordered w-full"
          rows={3}
        />
        {errors.description?.message && (
          <p className="text-error text-xs mt-1">
            {errors.description.message}
          </p>
        )}
        {state.errors?.description?.[0] && (
          <p className="text-error text-xs mt-1">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Recipe Media (Image or Video){!isEditing && " *"}
        </label>
        <input
          type="file"
          {...register("media")}
          accept="image/*,video/*"
          className="file-input file-input-bordered w-full"
        />
        {!isEditing && errors.media?.message && (
          <p className="text-error text-xs mt-1">
            {errors.media.message as string}
          </p>
        )}
        {!isEditing && state.errors?.media?.[0] && (
          <p className="text-error text-xs mt-1">{state.errors.media[0]}</p>
        )}
        {isEditing && initialData?.media && (
          <div className="mt-2 text-xs text-base-content/70">
            Current media will be kept unless you upload a new file.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Prep (min)</label>
          <input
            type="number"
            {...register("prepTime")}
            defaultValue={0}
            className="input input-bordered w-full"
          />
          {errors.prepTime?.message && (
            <p className="text-error text-xs mt-1">{errors.prepTime.message}</p>
          )}
          {state.errors?.prepTime?.[0] && (
            <p className="text-error text-xs mt-1">
              {state.errors.prepTime[0]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Cook (min)</label>
          <input
            type="number"
            {...register("cookTime")}
            defaultValue={0}
            className="input input-bordered w-full"
          />
          {errors.cookTime?.message && (
            <p className="text-error text-xs mt-1">{errors.cookTime.message}</p>
          )}
          {state.errors?.cookTime?.[0] && (
            <p className="text-error text-xs mt-1">
              {state.errors.cookTime[0]}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Servings</label>
          <input
            type="number"
            {...register("servings")}
            defaultValue={1}
            className="input input-bordered w-full"
          />
          {errors.servings?.message && (
            <p className="text-error text-xs mt-1">{errors.servings.message}</p>
          )}
          {state.errors?.servings?.[0] && (
            <p className="text-error text-xs mt-1">
              {state.errors.servings[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Category *</label>
        <input
          list="categories"
          {...register("category")}
          className="input input-bordered w-full"
          placeholder="Select or type..."
          defaultValue={initialData?.category || ""}
        />
        <datalist id="categories">
          {categories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
        {errors.category?.message && (
          <p className="text-error text-xs mt-1">{errors.category.message}</p>
        )}
        {state.errors?.category?.[0] && (
          <p className="text-error text-xs mt-1">{state.errors.category[0]}</p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-medium">Ingredients</label>
        {ingredientFields.map((field, index) => (
          <IngredientRow
            key={field.id}
            index={index}
            control={control}
            register={register}
            remove={removeIngredient}
            errors={errors}
            state={state}
          />
        ))}
        {errors.ingredients?.message && (
          <p className="text-error text-xs mt-1">
            {errors.ingredients.message}
          </p>
        )}
        {state.errors?.ingredients?.[0] && (
          <p className="text-error text-xs mt-1">
            {state.errors.ingredients?.[0]?.name?.[0] ||
              state.errors.ingredients?.[0]?.amount?.[0] ||
              state.errors.ingredients?.[0]?.unit?.[0]}
          </p>
        )}
        <button
          type="button"
          onClick={() => appendIngredient({ name: "", amount: "", unit: "" })}
          className="btn btn-sm btn-outline"
        >
          + Add Ingredient
        </button>
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-medium">Instructions</label>
        {instructionFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <span className="pt-2 font-semibold">{index + 1}.</span>
            <div className="flex-grow">
              <textarea
                {...register(`instructionSteps.${index}.text`)}
                placeholder={`Step details...`}
                className="textarea textarea-bordered w-full"
                rows={2}
              />
              {errors.instructionSteps?.[index]?.text && (
                <p className="text-error text-xs mt-1">
                  {errors.instructionSteps[index]?.text?.message}
                </p>
              )}
              {state.errors?.instructionSteps?.[index]?.text?.[0] && (
                <p className="text-error text-xs mt-1">
                  {state.errors.instructionSteps[index]?.text?.[0]}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="btn btn-ghost btn-circle btn-sm mt-1"
            >
              ✕
            </button>
          </div>
        ))}
        {errors.instructionSteps && (
          <p className="text-error text-xs mt-1">
            {errors.instructionSteps.message}
          </p>
        )}
        {state.errors?.instructionSteps?.[0] && (
          <p className="text-error text-xs mt-1">
            {state.errors.instructionSteps?.[0]?.text?.[0]}
          </p>
        )}
        <button
          type="button"
          onClick={() => appendInstruction({ text: "" })}
          className="btn btn-sm btn-outline"
        >
          + Add Instruction
        </button>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            {...register("isPublic")}
            className="checkbox checkbox-primary"
          />
          <span className="label-text">
            Share this recipe with the community
          </span>
        </label>
      </div>

      <FormSubmitButton isEditing={isEditing} />
    </form>
  );
}
