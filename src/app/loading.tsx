export default function Loading() {
    return (
        <main className="grid min-h-60 place-items-center p-6">
            <div
            className="flex items-center gap-3"
            role="status"
            aria-live="polite"
            >
                <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-transparent animate-spin"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        </main>
    )
}