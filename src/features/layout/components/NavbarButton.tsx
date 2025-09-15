"use client";

import { useRouter, usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <button
      onClick={() => router.push(href)}
      className={`flex flex-col items-center justify-center text-xs w-16 transition active:scale-95 ${
        isActive ? "text-white" : "text-gray-400"
      }`}
    >
      {/* Icon */}
      {children}

      {/* Label under icon */}
      <span>{label}</span>
    </button>
  );
}
