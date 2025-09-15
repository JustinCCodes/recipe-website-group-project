import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default async function RegisterPage() {
  // Check for active session
  const session = await getSession();

  // If user logged in redirect them
  if (session) {
    redirect("/profile");
  }

  // If no session show login form
  return <RegisterForm />;
}
