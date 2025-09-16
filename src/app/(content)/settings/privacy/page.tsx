import Link from "next/link";

export default function PrivacySettingsPage() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Settings</h1>
        <p className="text-lg text-gray-400 mt-2">
          Control your data and privacy on our platform.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        {/* Manage Search History Button */}
        <Link
          href="/settings/privacy/search-history"
          className="p-4 text-left rounded-lg bg-base-200 active:bg-base-300 transition-colors w-full"
        >
          Manage Search History
        </Link>

        {/* Placeholder Buttons */}
        <button
          disabled
          className="p-4 text-left rounded-lg bg-base-200/50 cursor-not-allowed w-full text-gray-500"
        >
          Placeholder
        </button>
        <button
          disabled
          className="p-4 text-left rounded-lg bg-base-200/50 cursor-not-allowed w-full text-gray-500"
        >
          Placeholder
        </button>
        <button
          disabled
          className="p-4 text-left rounded-lg bg-base-200/50 cursor-not-allowed w-full text-gray-500"
        >
          Placeholder
        </button>
        <button
          disabled
          className="p-4 text-left rounded-lg bg-base-200/50 cursor-not-allowed w-full text-gray-500"
        >
          Placeholder
        </button>
        <button
          disabled
          className="p-4 text-left rounded-lg bg-base-200/50 cursor-not-allowed w-full text-gray-500"
        >
          Placeholder
        </button>
      </div>
    </div>
  );
}
