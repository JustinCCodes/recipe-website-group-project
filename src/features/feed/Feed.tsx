"use client";

import { useEffect, useRef, useState } from "react";
import FeedItem from "./FeedItem";
import type { RecipeCard } from "@/features/recipes/types";
import { getFeedRecipesAction } from "@/features/recipes/actions";

export default function Feed() {
  const [items, setItems] = useState<RecipeCard[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  //initial load
  useEffect(() => {
    loadMore();
  }, []);

  async function loadMore() {
    const data = await getFeedRecipesAction(cursor);
    if (data.items) {
      setItems((prev) => [...prev, ...data.items]);
    }
    setCursor(data.nextCursor ?? undefined);
  }

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
  }, [items.length]);

  // infinite scroll
  useEffect(() => {
    if (activeIdx >= items.length - 2 && cursor) {
      loadMore();
    }
  }, [activeIdx, cursor]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-y-scroll sbap-y snap-mandatory scroll-smooth"
    >
      {items.map((it, i) => (
        <FeedItem key={it.id} data={it} active={i === activeIdx} />
      ))}
    </div>
  );
}
