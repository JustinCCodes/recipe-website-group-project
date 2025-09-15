'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Recipe = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
};

type History = {share: boolean; text: string};
type RecipeWithHistory = Recipe & {history?: History};

const MOCK_RECIPES: Recipe[] = [
  {
    id: 101,
    name: 'Mock Pasta',
    description: 'Demo only (mock data)',
    imageUrl: 'https://picsum.photos/seed/mock1/600/400',
    prepTime: 10,
    cookTime: 12,
    servings: 2,
    category: 'demo',
  },
  {
    id: 102,
    name: 'Mock Pancakes',
    description: 'Demo only (mock data)',
    imageUrl: 'https://picsum.photos/seed/mock2/600/400',
    prepTime: 5,
    cookTime: 6,
    servings: 2,
    category: 'demo',
  },
];

export default function CookbookPage() {
  const searchParams = useSearchParams();
  const isProd = process.env.NODE_ENV === 'production';
  const mock = !isProd && searchParams.get('mock') === '1';
  const suffix = mock ? '?mock=1' : '';

  const [items, setItems] = useState<RecipeWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  function readHistory(r: Recipe): History | null {
    try {
      const byId = localStorage.getItem(`history:di:${r.id}`);
      const byName = localStorage.getItem(`history:name:${r.name.trim().toLowerCase()}`);
      const raw = byId || byName;
      return raw ? (JSON.parse(raw) as History) : null;
    } catch {
      return null
    }
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        if (mock) {
          if (!mounted) return;
          setItems(
            MOCK_RECIPES.map((r) => {
              const h = readHistory(r);
              return h?.share ? {...r, history: h} : r;
            })
          );

        } else {
          const res = await fetch('/api/recipes', { cache: 'no-store' });
          if (!res.ok) {
            const t = await res.text();
            throw new Error(t || 'Failed to fetch recipes');
          }
          const data: Recipe[] = await res.json();
          if (!mounted) return;
          setItems(
            data.map((r) => {
              const h = readHistory(r);
              return h?.share ? {...r, history:h} :r;
            })
          );
        }
      } catch (e: any) {
        if (mounted) setError(String(e?.message || e));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [mock]);

  async function onDelete(id: number) {
    if (!confirm('Delete this recipe?')) return;
    if (mock) {
      setItems(prev => prev.filter(r => r.id !== id));
      return;
    }
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        const t = await res.text();
        throw new Error(t || 'Failed to delete');
      }
      setItems(prev => prev.filter(r => r.id !== id));
    } catch (e: any) {
      alert(String(e?.message || e));
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Cookbook</h1>
        <Link href={`/create-recipe${suffix}`} className="border rounded px-4 py-2">Create recipe</Link>
      </header>

      {loading && <p>Loading recipes…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        items.length === 0 ? (
          <p className="text-gray-600">No recipes yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {items.map((r) => (
              <li key={r.id} className="border rounded overflow-hidden">
                {r.imageUrl && (
                  <img src={r.imageUrl} alt={r.name} className="w-full h-40 object-cover" />
                )}
                <div className="p-3 space-y-2">
                  <h3 className="font-medium">{r.name}</h3>
                  <p className="text-sm text-gray-600">{r.description}</p>
                  <p className="text-xs text-gray-500">
                    {r.prepTime + r.cookTime} min • {r.category}
                  </p>

                  {r.history?.share && (
                    <p className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-1"> 📝 {r.history.text} </p>
                  )}

                  <div className="flex gap-3">
                    <Link href={`/edit-recipe?id=${r.id}${suffix}`} className="underline">Edit</Link>
                    <button onClick={() => onDelete(r.id)} className="underline text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </main>
  );
}
