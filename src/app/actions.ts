"use server";

import { deleteSession } from "@/lib/session"; // Deletes the current user session
import { redirect } from "next/navigation";

/**
 * Logs out the current user
 * Deletes their session
 * Redirects them to the homepage
 */
export async function logout() {
  try {
    // Delete the user session
    await deleteSession();
  } catch (error) {
    console.error("Logout failed:", error); // Log error if session deletion fails
  }

  // Redirect user to homepage
  redirect("/");
}
