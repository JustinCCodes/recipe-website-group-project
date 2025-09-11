import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Recipe Website",
  description: "Recipes of all sorts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-800 text-white">
        <main className="flex-grow container mx-auto p-4 md:p-8 pb-20">
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
