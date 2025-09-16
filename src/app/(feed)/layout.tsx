// Layout component for feed pages
// Simply renders its children without extra stuff
export default function FeedLayout({
  children, // Feed page content
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // Render children directly
}
