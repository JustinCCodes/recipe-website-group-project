"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { RecipeCard } from "@/types/recipe";

type Props = { data: RecipeCard; active: boolean };

export default function FeedItem({ data, active }: Props) {
    const videoRef = useRef<HTMLVideoElement  | null>(null);

    // autoplay, pause
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        if (active) {
            v.play().catch(() => {}); //ignore block autoplay
        } else {
            v.pause();
            v.currentTime = 0;
        }
    }, [active]);

    return (
        <article className="h-screen w-full flex items-center justify-center snap-start relative">
            <Link
                href={`/recipes/${data.id}`}
                className="absolute inset-0"
                aria-label={`Open ${data.title}`}
            />

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
                        className={"h-full w-full object-cover"}
                        loading="lazy"
                    />
                )}
            </div>

            {/* overlay infos/ buttons*/}
            <div className="absolute bottom-8 left-6 right-6 text-white drop-shadow">
                <h2 className="text-2x1 font-semibold">{data.title}</h2>
                <div className="mt-2 flex gap-3 text-sm">
                    <button className="rounded bg-black/50 px-3 py-1">❤️ {data.likes ?? 0}</button>
                    <button className="rounded bg-back/50 px-3 py-1">➕ save</button>
                </div>
            </div>
        </article>
    );
}