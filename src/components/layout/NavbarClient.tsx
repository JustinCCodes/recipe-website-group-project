"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Type
type Session = {
  user: {
    username?: string | null;
    email: string;
  };
} | null;

interface NavbarClientProps {
  session: Session;
}

const NavbarClient: React.FC<NavbarClientProps> = ({ session }) => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-base-100 border-t border-base-300 flex items-center justify-around z-50">
      {/* Home Button */}
      <button
        onClick={() => router.push("/")}
        className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
      >
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
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-7-4h6"
          />
        </svg>
        <span>Home</span>
      </button>

      {/* Search Button */}
      <button
        onClick={() => router.push("/test")}
        className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
      >

        {/* Add Icon here */}

        <span>Test</span>
      </button>

      {session ? (
        <>
          {/* Create Recipe Button */}
          <button
            onClick={() => router.push("/create-recipe")}
            className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
          >
            <div className="w-12 h-8 flex items-center justify-center bg-white text-black rounded-lg text-2xl font-bold">
              +
            </div>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => router.push("/notifications")}
            className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
          >
            <div className="indicator">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
            <span>Inbox</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={() => router.push("/profile")}
            className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
          >
            <div className="avatar">
              <div className="w-7 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <span>Me</span>
          </button>
        </>
      ) : (
        // Login Button
        <button
          onClick={() => router.push("/login")}
          className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-white"
        >
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
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>Login</span>
        </button>
      )}
    </div>
  );
};

export default NavbarClient;
