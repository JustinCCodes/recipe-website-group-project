'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Recipe = {
  id: number;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
};

function arrayToLines(arr: string[] = []) {
  return (arr || []).join('\n');
}
function linesToArray(text: string) {
  return text.split('\n').map(s => s.trim()).filter(Boolean);
}

export default function EditRecipePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // e.g. /edit-recipe?id=123
  //to remove later
  // was: const mock = searchParams.get('mock') === '1';
  const isProd = process.env.NODE_ENV === 'production';
  const mock = !isProd && searchParams.get('mock') === '1';
  const suffix = mock ? '?mock=1' : '';



  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState<number | ''>('');
  const [cookTime, setCookTime] = useState<number | ''>('');
  const [servings, setServings] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [instructionsText, setInstructionsText] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (mock) {
      // Pretend we loaded a recipe successfully
      const r: Recipe = {
        id: Number(id ?? '1'),
        name: 'Mock Lemon Herb Chicken',
        description: 'Demo recipe while backend is offline.',
        prepTime: 10,
        cookTime: 20,
        servings: 2,
        category: 'demo',
        imageUrl: 'https://picsum.photos/seed/mock/800/500',
        ingredients: ['chicken', 'lemon', 'garlic'],
        instructions: ['marinate', 'cook', 'serve'],
      };
      setName(r.name);
      setDescription(r.description);
      setPrepTime(r.prepTime);
      setCookTime(r.cookTime);
      setServings(r.servings);
      setCategory(r.category);
      setImageUrl(r.imageUrl);
      setIngredientsText(r.ingredients.join('\n'));
      setInstructionsText(r.instructions.join('\n'));
      setLoading(false);
      return; // stop here; no network call
    }

      if (!id) {
        setError('Missing recipe id. Open this page as /edit-recipe?id=123');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/recipes/${id}`, { cache: 'no-store' });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || `Failed to fetch recipe ${id}`);
        }
        const r: Recipe = await res.json();
        if (!mounted) return;

        setName(r.name ?? '');
        setDescription(r.description ?? '');
        setPrepTime(r.prepTime ?? '');
        setCookTime(r.cookTime ?? '');
        setServings(r.servings ?? '');
        setCategory(r.category ?? '');
        setImageUrl(r.imageUrl ?? '');
        setIngredientsText(arrayToLines(r.ingredients));
        setInstructionsText(arrayToLines(r.instructions));
      } catch (e: any) {
        if (mounted) setError(String(e?.message || e));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [id]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (mock) { router.push(`/cookbook${suffix}`); return; }

    if (!id) return setError('Missing recipe id.');

    const prep = typeof prepTime === 'number' ? prepTime : Number(prepTime);
    const cook = typeof cookTime === 'number' ? cookTime : Number(cookTime);
    const serv = typeof servings === 'number' ? servings : Number(servings);
    if ([prep, cook, serv].some(Number.isNaN)) {
      return setError('Prep, cook and servings must be numbers.');
    }

    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description,
          prepTime: prep,
          cookTime: cook,
          servings: serv,
          category,
          imageUrl,
          ingredients: linesToArray(ingredientsText),
          instructions: linesToArray(instructionsText),
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Failed to update');
      }
      router.push('/cookbook');
    } catch (e: any) {
      setError(String(e?.message || e));
    }
  }

  async function onDelete() {
    setError('');
    if (mock) { router.push(`/cookbook${suffix}`); return; }

    if (!id) return setError('Missing recipe id.');
    if (!confirm('Delete this recipe? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        const t = await res.text();
        throw new Error(t || 'Failed to delete');
      }
      router.push('/cookbook');
    } catch (e: any) {
      setError(String(e?.message || e));
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Recipe {id ? `#${id}` : ''}</h1>

      {loading && <p>Loading recipe…</p>}
      {error && <p className="text-red-600" role="alert">{error}</p>}

      {!loading && !error && (
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input className="mt-1 w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea className="mt-1 w-full border rounded px-3 py-2" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium">Prep (min)</label>
              <input type="number" className="mt-1 w-full border rounded px-3 py-2"
                value={prepTime} onChange={(e) => setPrepTime(e.target.value === '' ? '' : Number(e.target.value))} min={0} />
            </div>
            <div>
              <label className="block text-sm font-medium">Cook (min)</label>
              <input type="number" className="mt-1 w-full border rounded px-3 py-2"
                value={cookTime} onChange={(e) => setCookTime(e.target.value === '' ? '' : Number(e.target.value))} min={0} />
            </div>
            <div>
              <label className="block text-sm font-medium">Servings</label>
              <input type="number" className="mt-1 w-full border rounded px-3 py-2"
                value={servings} onChange={(e) => setServings(e.target.value === '' ? '' : Number(e.target.value))} min={1} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input className="mt-1 w-full border rounded px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Image URL</label>
              <input className="mt-1 w-full border rounded px-3 py-2" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Ingredients (one per line)</label>
            <textarea className="mt-1 w-full border rounded px-3 py-2" rows={6}
              value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium">Instructions (one per line)</label>
            <textarea className="mt-1 w-full border rounded px-3 py-2" rows={6}
              value={instructionsText} onChange={(e) => setInstructionsText(e.target.value)} />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="border rounded px-4 py-2">Save changes</button>
            <button type="button" onClick={onDelete} className="border rounded px-4 py-2">Delete</button>
          </div>
        </form>
      )}
    </main>
  );
}
