import Link from "next/link";

/**
 * FloatingSearchButton
 * Renders a floating circular button that links to `/search` page
 * Positioned top right with fixed so it stays visible.
 * Contains a search icon magnifying glass
 */
export default function FloatingSearchButton() {
  return (
    <Link
      href="/search"
      className="btn btn-primary btn-circle fixed top-4 right-4 z-50 shadow-lg"
      aria-label="Search"
    >
      {/* Search Icon */}
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </Link>
  );
}
