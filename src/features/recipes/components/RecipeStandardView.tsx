import type { Recipe, Ingredient, InstructionStep } from "@/generated/prisma";

interface StandardViewProps {
  recipe: Recipe & {
    ingredients: Ingredient[];
    instructionSteps: InstructionStep[];
  };
}

export default function RecipeStandardView({ recipe }: StandardViewProps) {
  return (
    <div className="bg-base-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Ingredients</h2>
        <ul className="list-disc list-inside space-y-2 mb-8">
          {recipe.ingredients.map((ing) => (
            <li key={ing.id}>
              {ing.amount} {ing.name}
            </li>
          ))}
        </ul>

        <h2 className="text-3xl font-bold mb-6">Instructions</h2>
        <ol className="list-decimal list-inside space-y-4">
          {recipe.instructionSteps.map((step) => (
            <li key={step.id}>{step.text}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
