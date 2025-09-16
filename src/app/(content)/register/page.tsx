import { getSession } from "@/lib/session"; // Get current user session
import { redirect } from "next/navigation";
import RegisterForm from "@/features/auth/components/RegisterForm"; // Registration form

// Registration page
export default async function RegisterPage() {
  // Check for active session
  const session = await getSession();

  // If user is logged in redirect to profile page
  if (session) {
    redirect("/profile");
  }

  // If no session show registration form
  return <RegisterForm />;
}
