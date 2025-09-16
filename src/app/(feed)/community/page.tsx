import Feed from "@/features/feed/Feed"; // Feed component to show posts

// Community page
export default function CommunityPage() {
  return (
    <main className="relative">
      {/* Render community feed */}
      <Feed variant="community" />
    </main>
  );
}
