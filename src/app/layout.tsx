import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/features/layout/components/Navbar"; // Persistent bottom navigation

/**
 * Global head metadata
 */
export const metadata: Metadata = {
  title: "Recipe Website",
  description: "Recipes of all sorts",
};

/**
 * RootLayout
 * Wraps everything in consistent HTML structure
 * Applies global styles
 * Renders Navbar at bottom of every page
 */
export default function RootLayout({
  children, // Page content
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Page content */}
        <main>{children}</main>

        {/* Persistent bottom navigation */}
        <Navbar />
      </body>
    </html>
  );
}
