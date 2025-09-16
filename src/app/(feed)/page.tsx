import FloatingSearchButton from "../ui/SearchButton"; // Floating search button component
import Feed from "@/features/feed/Feed"; // Feed component to show main posts

// Home page
export default function HomePage() {
  return (
    <main className="relative">
      {/* Floating search button overlay */}
      <FloatingSearchButton />

      {/* Render main feed */}
      <Feed variant="main" />
    </main>
  );
}
