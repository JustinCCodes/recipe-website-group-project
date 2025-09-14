export default function SearchPageSkeleton() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-lg">
        {/* Skeleton h1 */}
        <div className="skeleton mb-6 h-12 w-3/4 mx-auto"></div>

        {/* Skeleton SearchBar */}
        <div className="flex gap-2">
          <div className="skeleton h-12 w-full"></div>
          <div className="skeleton h-12 w-24"></div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-4xl">
        {/* Skeleton Results */}
        <div className="space-y-4">
          <div className="skeleton h-16 w-full"></div>
          <div className="skeleton h-16 w-full"></div>
          <div className="skeleton h-16 w-full"></div>
        </div>
      </div>
    </main>
  );
}
