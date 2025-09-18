import { getSession } from "@/lib/session"; // Get current user session
import { redirect } from "next/navigation";
import UserAvatar from "../../ui/UserAvatar"; // Renders user avatar
import Link from "next/link";

// Profile page
export default async function ProfilePage() {
  // Fetch current user session
  const session = await getSession();

  // If no active session redirect user to login page
  if (!session) {
    redirect("/login");
  }

  // Extract user information from session
  const { user } = session;

  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="flex items-center space-x-4">
        {/* User avatar */}
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <UserAvatar
              name={user.username}
              profileImageUrl={user.profileImageUrl}
              size="lg"
            />
          </div>
        </div>

        {/* User information */}
        <div className="flex-grow">
          {/* Display username or fallback */}
          <h1 className="text-2xl font-bold">{user.username || "New User"}</h1>
          {/* Display email */}
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </header>

      {/* Future sections go here aka. user settings etc. */}
    </div>
  );
}
