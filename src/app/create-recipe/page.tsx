/* export default function CreateRecipe() {
  // look at "zod" and "react-hook-form" libarys might be useful
  return <h1>Create Recipe</h1>;
}
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRecipe() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState<number | ''>('');
  const [cookTime, setCookTime] = useState<number | ''>('');
  const [servings, setServings] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');   // one per line
  const [instructionsText, setInstructionsText] = useState(''); // one per line

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  function linesToArray(text: string) {
    return text
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Minimal client-side validation
    if (!name.trim()) return setError('Name is required.');
    const ingredients = linesToArray(ingredientsText);
    const instructions = linesToArray(instructionsText);
    if (ingredients.length === 0) return setError('Add at least 1 ingredient.');
    if (instructions.length === 0) return setError('Add at least 1 instruction.');

    const prep = typeof prepTime === 'number' ? prepTime : Number(prepTime);
    const cook = typeof cookTime === 'number' ? cookTime : Number(cookTime);
    const serv = typeof servings === 'number' ? servings : Number(servings);

    if (Number.isNaN(prep) || Number.isNaN(cook) || Number.isNaN(serv)) {
      return setError('Prep time, cook time, and servings must be numbers.');
    }

    setPending(true);
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description,
          prepTime: prep,
          cookTime: cook,
          servings: serv,
          category,
          imageUrl,
          ingredients,
          instructions,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create recipe');
      }

      // Created successfully
      setSuccess('Recipe created!');
      // Option: route to your cookbook page
      router.push('/cookbook');
    } catch (err: any) {
      // Prisma unique name errors currently return 500 in your API
      const msg = String(err?.message || err || 'Failed to create recipe');
      setError(msg.includes('Unique') ? 'Name already exists. Pick another.' : msg);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create a Recipe</h1>

      {error && <p className="text-red-600" role="alert">{error}</p>}
      {success && <p className="text-green-700">{success}</p>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name *</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Creamy Tomato Pasta"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full border rounded px-3 py-2"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A quick weeknight pasta with a silky tomato-cream sauce."
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium">Prep (min)</label>
            <input
              type="number"
              className="mt-1 w-full border rounded px-3 py-2"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cook (min)</label>
            <input
              type="number"
              className="mt-1 w-full border rounded px-3 py-2"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Servings</label>
            <input
              type="number"
              className="mt-1 w-full border rounded px-3 py-2"
              value={servings}
              onChange={(e) => setServings(e.target.value === '' ? '' : Number(e.target.value))}
              min={1}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="italian / dessert / vegan …"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Ingredients * (one per line)</label>
          <textarea
            className="mt-1 w-full border rounded px-3 py-2"
            rows={6}
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder={`pasta\ncrushed tomatoes\ncream\ngarlic\nolive oil\nbasil\nsalt\npepper`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Instructions * (one per line)</label>
          <textarea
            className="mt-1 w-full border rounded px-3 py-2"
            rows={6}
            value={instructionsText}
            onChange={(e) => setInstructionsText(e.target.value)}
            placeholder={`Boil pasta in salted water.\nSauté garlic in oil; add tomatoes.\nStir in cream; toss with pasta; season.`}
            required
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="border rounded px-4 py-2"
          aria-busy={pending}
        >
          {pending ? 'Creating…' : 'Create recipe'}
        </button>
      </form>
    </main>
  );
}
