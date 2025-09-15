"use server";

import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

/**
 * Logs out the current user
 * Deletes their session
 * Redirects them back to the homepage "/"
 */
export async function logout() {
  try {
    await deleteSession();
  } catch (error) {
    console.error("Logout failed:", error);
  }

  redirect("/");
}
