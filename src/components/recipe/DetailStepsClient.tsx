"use client";
"// detail steps scaffolding"

import { useEffect, useRef, useState } from "react";
import type { RecipeDetail, Step } from "@/types/recipe";

function Media({ step }: { step: Step }) {
  if (step.mediaType === "video") {
    return (
      <video
        src={step.mediaUrl}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <img
      src={step.mediaUrl}
      alt={step.title}
      loading="lazy"
      className="w-full h-full object-cover"
    />
  );
}

export default function DetailStepsClient({ data }: { data: RecipeDetail }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  // Aktiven Slide per IntersectionObserver bestimmen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll("section"));
    const obs = new IntersectionObserver(
      (ents) => {
        const vis = ents
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!vis) return;
        setActive(slides.indexOf(vis.target as HTMLElement));
      },
      { root: el, threshold: [0.6] }
    );
    slides.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [data.steps.length]);

  const next = () =>
    ref.current?.scrollBy({ left: window.innerWidth, behavior: "smooth" });
  const prev = () =>
    ref.current?.scrollBy({ left: -window.innerWidth, behavior: "smooth" });

  // Keyboard-Navigation
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="mt-4">
      <div
        ref={ref}
        className="relative w-screen h-[70vh] overflow-x-scroll snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        <div className="flex">
          {data.steps.map((s, i) => (
            <section key={s.id} className="snap-start shrink-0 w-screen h-[70vh] relative">
              <Media step={s} />
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded">
                <h3 className="font-semibold">
                  {i + 1}. {s.title}
                </h3>
                {s.text && <p className="text-sm opacity-90">{s.text}</p>}
              </div>
            </section>
          ))}
        </div>

        {/* Buttons */}
        <button
          onClick={prev}
          aria-label="Previous step"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded px-3 py-2"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Next step"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded px-3 py-2"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {data.steps.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === active ? "bg-black" : "bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}