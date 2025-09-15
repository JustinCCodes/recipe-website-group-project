/* export default function CreateRecipe() {
  // look at "zod" and "react-hook-form" libarys might be useful
  return <h1>Create Recipe</h1>;
}
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRecipe() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProd = process.env.NODE_ENV === 'production';
  const mock = !isProd && searchParams.get('mock') === '1';



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

  const [shareHistory, setShareHistory] = useState(false);
  const [historyText, setHistoryText] = useState('');


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
    
    if (mock) {
      try {
        const nameKey = `history:name:${name.trim().toLowerCase()}`;
        if (shareHistory) {
          localStorage.setItem(
            nameKey,
            JSON.stringify({share: true, text: historyText})
          );
        } else {
          localStorage.removeItem(nameKey);
        }
      } catch {}
        router.push('/cookbook?mock=1');
        return
    }

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

      // DEV-ONLY: store history locally so you can demo it without backend changes
      try {
        const nameKey = `history:name:${name.trim().toLowerCase()}`;
        let idKey = nameKey;

        // If the response body has the created recipe (in real, non-mock flow), prefer id-based key.
        try {
          const created = await res.clone().json();
          if (created?.id) idKey = `history:id:${created.id}`;
        } catch {
          /* ignore if mock mode or body already read elsewhere */
        }

        if (shareHistory) {
          localStorage.setItem(
            idKey,
            JSON.stringify({ share: true, text: historyText })
          );
          // Keep a name-based copy too (helps match mock items by name)
          localStorage.setItem(
            nameKey,
            JSON.stringify({ share: true, text: historyText })
          );
        } else {
          localStorage.removeItem(idKey);
          localStorage.removeItem(nameKey);
        }
      } catch {
        /* ignore localStorage errors */
      }


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

        <div className='space-y-2 border-t pt-4'>
          <label className="flex items-center gap-2">
            <input
            type="checkbox"
            checked={shareHistory}
            onChange={(e) => setShareHistory(e.target.checked)}
            />
            <span>Share history:</span>
          </label>

          <label className="block text-sm font-medium"> History (optional)</label>
          <textarea
          className="mt-1 w-full border rounded px-3 py-2"
          rows={4}
          value={historyText}
          onChange={(e) => setHistoryText(e.target.value)}
          placeholder='Where this recipe comes from, family notes, tips…'
          disabled={!shareHistory} />
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
