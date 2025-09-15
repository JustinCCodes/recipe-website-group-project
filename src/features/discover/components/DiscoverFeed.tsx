"use client";

import { useEffect, useRef, useState } from "react";
import FeedItem from "@/features/feed/FeedItem";
import type { RecipeCard } from "@/features/recipes/types";

interface DiscoverFeedProps {
  // Receives list of recipes as a prop
  recipes: RecipeCard[];
}

export default function DiscoverFeed({ recipes }: DiscoverFeedProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  //IntersectionObserver for active element
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const sections = Array.from(el.querySelectorAll("article"));
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = sections.indexOf(visible.target as HTMLElement);
        if (idx !== -1) setActiveIdx(idx);
      },
      { root: null, threshold: [0.5, 0.75] }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [recipes.length]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      {recipes.map((recipe, i) => (
        <FeedItem key={recipe.id} data={recipe} active={i === activeIdx} />
      ))}
    </div>
  );
}
