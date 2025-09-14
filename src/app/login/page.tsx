import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LoginForm from "@/features/auth/components/LoginForm";

export default async function LoginPage() {
  // Check for active session
  const session = await getSession();

  // If user logged in redirect them
  if (session) {
    redirect("/home");
  }

  // If no session show login form
  return <LoginForm />;
}
