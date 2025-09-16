export type RecipeCard = {
  id: string;
  title: string;
  mediaUrl: string; // mp4/webm oder gif
  mediaType: "video" | "gif";
  durationSec?: number;
  likes?: number;
};
