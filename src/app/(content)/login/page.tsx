import { getSession } from "@/lib/session"; // Get current user session
import { redirect } from "next/navigation";
import LoginForm from "@/features/auth/components/LoginForm"; // Login form

// Login page
export default async function LoginPage() {
  // Check if user has an active session
  const session = await getSession();

  // If user is logged in redirect to home page
  if (session) {
    redirect("/home");
  }

  // If no active session render login form
  return <LoginForm />;
}
