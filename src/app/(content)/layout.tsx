// Layout component for wrapping page content
// Adds consistent bottom padding for all pages
export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="pb-20">{children}</main>; // Render children with bottom padding
}
