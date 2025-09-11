import { getSession } from "@/lib/session";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await getSession();

  return <NavbarClient session={session} />;
}
