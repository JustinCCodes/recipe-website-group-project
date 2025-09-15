import FloatingSearchButton from "@/app/ui/SearchButton";
import Feed from "../features/feed/Feed";

export default function HomePage() {
  return (
    <main className="relative">
      <FloatingSearchButton />
      <Feed />
    </main>
  );
}
