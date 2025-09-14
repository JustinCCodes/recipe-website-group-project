import FloatingSearchButton from "@/components/ui/SearchButton";
import Feed from "../components/feed/Feed";

export default function HomePage() {
  return (
    <main className="relative">
      <FloatingSearchButton />
      <Feed />
    </main>
  );
}
