import Link from "next/link";
import { logout } from "@/app/actions";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-lg text-gray-400 mt-2">
          Manage your account and privacy settings.
        </p>
      </header>

      {/* Settings options list */}
      <div className="flex flex-col gap-2">
        {/* Navigate to account settings page */}
        <Link
          href="/settings/account"
          className="p-4 text-left rounded-lg bg-base-200 active:bg-base-300 transition-colors w-full"
        >
          Account Settings
        </Link>

        {/* Navigate to privacy settings page */}
        <Link
          href="/settings/privacy"
          className="p-4 text-left rounded-lg bg-base-200 active:bg-base-300 transition-colors w-full"
        >
          Privacy
        </Link>

        {/* Logout button (uses a server action) */}
        <form action={logout} className="w-full">
          <button
            type="submit"
            className="w-full p-4 text-left rounded-lg bg-base-200 active:bg-error active:text-error-content transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
