import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/features/layout/components/Navbar";

/**
 * Global head metadata
 */
export const metadata: Metadata = {
  title: "Recipe Website",
  description: "Recipes of all sorts",
};

/**
 * RootLayout
 * Wraps the entire app in consistent HTML structure
 * Applies global styles (fonts, background, colors)
 * Renders Navbar at the bottom of every page
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Page content goes here */}
        <main>{children}</main>

        {/* Persistent bottom navigation */}
        <Navbar />
      </body>
    </html>
  );
}
