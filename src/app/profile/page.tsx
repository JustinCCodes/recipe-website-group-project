import { getSession } from "@/lib/session";
import { logout } from "@/app/actions";
import { redirect } from "next/navigation";
import UserAvatar from "@/app/ui/UserAvatar";

/**
 * ProfilePage Component
 * Displays user's profile information and account actions
 */
export default async function ProfilePage() {
  // Fetch the current user session
  const session = await getSession();
  // If no session exists redirect to login page
  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Section*/}
      <header className="flex items-center space-x-4 p-4">
        <div className="avatar">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <UserAvatar name={user.username} size="lg" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-grow">
          <h1 className="text-2xl font-bold">{user.username || "New User"}</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>

        {/* Settings Dropdown */}
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
          >
            {/* Settings Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Account Settings</a>
            </li>

            <li>
              <a>Privacy</a>
            </li>

            <li>
              {/* Logout action using form submit */}
              <form action={logout} className="w-full">
                <button type="submit" className="w-full text-left">
                  Logout
                </button>
              </form>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
