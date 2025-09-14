import { getSession } from "@/lib/session";
import NavbarClient from "./NavbarClient";

/**
 * Navbar Server Component
 * Runs on server to fetch the current user session
 * Passes session info down to NavbarClient
 * Keeps authentication logic server-side
 * while still rendering interactive UI in client
 */
export default async function Navbar() {
  // Fetch the current session (userId, roles, etc.)
  const session = await getSession();

  // Render the client side Navbar with session data as props
  return <NavbarClient session={session} />;
}
