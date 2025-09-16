"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { RecipeCard } from "@/features/recipes/types";
import LikeButton from "@/features/recipes/components/LikeButton";
import SaveButton from "@/features/recipes/components/SaveButton";

type Props = { data: RecipeCard; active: boolean };

/**
 * FeedItem component
 * - Renders single recipe card video or image inside the feed
 * - Auto-plays video if active and pauses + resets otherwise
 * - Allows tap to toggle play/pause
 * - Displays title, like, and save buttons
 */
export default function FeedItem({ data, active }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null); // Ref to video element
  const [showStatusIcon, setShowStatusIcon] = useState<"play" | "pause" | null>(
    null
  ); // Temporary play/pause overlay state

  // Auto-play/pause video when active changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      video.play().catch(() => {}); // Ignore autoplay errors
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active]);

  // Handle user click to toggle video play/pause
  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setShowStatusIcon("play");
    } else {
      video.pause();
      setShowStatusIcon("pause");
    }

    // Hide icon after 500ms
    setTimeout(() => setShowStatusIcon(null), 500);
  };

  return (
    <article
      onClick={handleTogglePlay}
      className="h-screen w-full flex items-center justify-center snap-start relative cursor-pointer"
    >
      {/* Play/Pause status */}
      <div
        className={`absolute z-20 transition-opacity duration-300 ${
          showStatusIcon ? "opacity-70" : "opacity-0"
        }`}
      >
        {showStatusIcon === "play" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {showStatusIcon === "pause" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>

      {/* Media */}
      <div className="w-full h-full flex items-center justify-center">
        {data.mediaType === "video" ? (
          <video
            ref={videoRef}
            src={data.mediaUrl}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={data.mediaUrl}
            alt={data.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Title link */}
      <div className="absolute bottom-20 left-6 text-white drop-shadow z-10">
        <Link
          href={`/recipes/${data.id}`}
          onClick={(e) => e.stopPropagation()} // Prevent video toggle
          className="inline-block active:scale-95 transition-transform"
        >
          <h2 className="text-2xl font-semibold">{data.title}</h2>
        </Link>
      </div>

      {/* Like + Save */}
      <div className="absolute bottom-20 right-4 flex flex-col items-center gap-4 text-white z-10">
        <LikeButton
          recipeId={Number(data.id)}
          initialLikes={data.likes}
          initialIsLiked={data.isLiked}
        />
        <SaveButton recipeId={Number(data.id)} initialIsSaved={data.isSaved} />
      </div>
    </article>
  );
}
