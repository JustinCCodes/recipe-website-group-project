import Link from "next/link";

// 404 Not Found page
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center dark:bg-gray-900">
      <div className="p-8">
        {/* Header */}
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 md:text-9xl">
          404
        </h1>

        {/* Page not found message */}
        <h2 className="mt-4 text-2xl font-semibold text-gray-600 dark:text-gray-400 md:text-3xl">
          Oops! Page Not Found.
        </h2>

        {/* Additional description */}
        <p className="mt-2 text-base text-gray-500 dark:text-gray-500">
          We can't seem to find the page you're looking for.
        </p>

        {/* Button to return to homepage */}
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-md transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
