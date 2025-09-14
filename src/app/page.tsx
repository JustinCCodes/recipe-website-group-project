import FloatingSearchButton from "@/components/ui/SearchButton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <FloatingSearchButton />
      <div className="text-center">
        <h1 className="text-5xl font-bold">Welcome</h1>
        <p className="py-6">Discover and share recipes.</p>
      </div>
    </main>
  );
}
