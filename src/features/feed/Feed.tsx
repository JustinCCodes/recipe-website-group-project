"use client";

import { useEffect, useRef, useState } from "react";
import FeedItem from "./FeedItem";
import type { RecipeCard } from "@/features/recipes/types";
import {
  getFeedRecipesAction,
  getCommunityRecipesAction,
} from "@/features/recipes/actions";

interface FeedProps {
  variant?: "main" | "community";
}

/**
 * Feed component
 * - Displays an infinite scrolling vertical feed of recipes
 * - Uses IntersectionObserver to track active item in viewport
 * - Supports main and community variants
 * - Preloads more recipes when near end of list
 */
export default function Feed({ variant = "main" }: FeedProps) {
  const [items, setItems] = useState<RecipeCard[]>([]); // Loaded recipe cards
  const [cursor, setCursor] = useState<number | undefined>(undefined); // Pagination cursor
  const [activeIdx, setActiveIdx] = useState(0); // Index of currently visible item
  const containerRef = useRef<HTMLDivElement | null>(null); // Feed container ref

  // Disable body scroll when feed is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Load initial recipes
  useEffect(() => {
    loadMore();
  }, []);

  // Fetch more recipes from server
  async function loadMore() {
    const action =
      variant === "community"
        ? getCommunityRecipesAction
        : getFeedRecipesAction;

    const data = await action(cursor);

    if (data.items) {
      setItems((prev) => {
        // Avoid duplicates by filtering IDs
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = data.items.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    }

    // Update pagination cursor
    setCursor(data.nextCursor ?? undefined);
  }

  // Track visible section using IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const sections = Array.from(el.querySelectorAll("article"));
    const obs = new IntersectionObserver(
      (entries) => {
        // Find most visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        // Update active index
        const idx = sections.indexOf(visible.target as HTMLElement);
        if (idx !== -1) setActiveIdx(idx);
      },
      { root: null, threshold: [0.5, 0.75] }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [items.length]);

  // Auto load more recipes when near end of list cause error in console
  useEffect(() => {
    if (activeIdx >= items.length - 2 && cursor) {
      loadMore();
    }
  }, [activeIdx, cursor]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      {items.map((it, i) => (
        <FeedItem key={it.id} data={it} active={i === activeIdx} />
      ))}
    </div>
  );
}
