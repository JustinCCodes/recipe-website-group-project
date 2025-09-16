import DetailStepsClient from "@/components/recipe/DetailStepsClient";
// or: import DetailStepsClient from "../../../components/recipe/DetailStepsClient";
"// recipe detail page scaffolding"

async function getRecipe(id: string): Promise<RecipeDetail> {
  const res = await fetch(⁠`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/recipes/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Recipe not found");
  return res.json();
}

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const data = await getRecipe(params.id);
  return (
    <main className="min-h-screen">
      <h1 className="px-6 pt-6 text-3xl font-bold">{data.title}</h1>
      <p className="px-6 text-sm text-zinc-500">{data.description}</p>
      {/* Client-Komponente - horizontal scrolling */}
      <DetailStepsClient data={data} />
    </main>
  );
}

// Client-Wrapper (better in another file?)
"use client";
import { useEffect, useRef, useState } from "react";
import type { Step } from "@/types/recipe";

function Media({ step }: { step: Step }) {
  if (step.mediaType === "video")
    return <video src={step.mediaUrl} muted loop playsInline preload="metadata" className="w-full h-full object-cover" />;
  if (step.mediaType === "gif" || step.mediaType === "image")
    return <img src={step.mediaUrl} alt={step.title} className="w-full h-full object-cover" loading="lazy" />;
  return null;
}

function DetailStepsClient({ data }: { data: { steps: Step[] } }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver horizontal snap
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll("section"));
    const obs = new IntersectionObserver((ents) => {
      const vis = ents.filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!vis) return;
      setActive(slides.indexOf(vis.target as HTMLElement));
    }, { root: el, threshold: [0.6] });
    slides.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [data.steps.length]);

  const next = () => ref.current?.scrollBy({ left: window.innerWidth, behavior: "smooth" });
  const prev = () => ref.current?.scrollBy({ left: -window.innerWidth, behavior: "smooth" });

  // Keyboard: arrows ← →
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="mt-4">
      {/* slider */}
      <div
        ref={ref}
        className="relative w-screen h-[70vh] overflow-x-scroll snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        <div className="flex">
          {data.steps.map((s, i) => (
            <section key={s.id} className="snap-start shrink-0 w-screen h-[70vh] relative">
              <Media step={s} />
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded">
                <h3 className="font-semibold">{i + 1}. {s.title}</h3>
                {s.text && <p className="text-sm opacity-90">{s.text}</p>}
              </div>
            </section>
          ))}
        </div>
        {/* Nav buttons */}
        <button onClick={prev} aria-label="Previous step"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded px-3 py-2">‹</button>
        <button onClick={next} aria-label="Next step"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded px-3 py-2">›</button>
      </div>

      {/* dots */}
      <div className="flex justify-center gap-2 mt-3">
        {data.steps.map((_, i) => (
          <span key={i} className={⁠`h-2 w-2 rounded-full ${i===active ? "bg-black" : "bg-zinc-300"}`} />
        ))}
      </div>
    </div>
  );
}