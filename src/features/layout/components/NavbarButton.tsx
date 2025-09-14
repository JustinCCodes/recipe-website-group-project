"use client";

import { useRouter } from "next/navigation";

interface NavbarButtonProps {
  href: string; // Destination route
  label: string; // Text label below the icon
  children: React.ReactNode; // For the SVG icon
}

/**
 * NavbarButton
 * Reusable button component for navigation inside the app
 * Displays an icon passed as children and a label underneath
 * Uses router.push() to navigate client-side without full page reload
 */
export function NavbarButton({ href, label, children }: NavbarButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="flex flex-col items-center justify-center text-xs text-gray-400 transition-colors w-16"
    >
      {/* Icon */}
      {children}

      {/* Label under icon */}
      <span>{label}</span>
    </button>
  );
}
