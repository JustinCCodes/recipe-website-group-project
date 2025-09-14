import "server-only"; // Runs only on server
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const sessionCookieName = "session_token";

/**
 * Creates a new session for user
 * Stores session token in database and sets HttpOnly cookie
 * @param userId ID of the logged in user
 */
export async function createSession(userId: number) {
  // Session expires after 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = randomBytes(40).toString("hex");

  // Save session to database
  await prisma.session.create({
    data: { token, expiresAt, userId },
  });

  // Get cookie store on server
  const cookieStore = await cookies();

  // Set HttpOnly cookie with session token
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true, // Prevent client-side JS from reading cookie
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    expires: expiresAt, // Expire date
    sameSite: "lax", // CSRF protection (no idea what that is yet)
    path: "/", // Cookie valid for whole site
  });
}

/**
 * Gets current session based on cookie
 * Returns null if no valid session exists
 */
export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return null;

  // Look up session in database
  const session = await prisma.session.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        select: { id: true, email: true, username: true },
      },
    },
  });

  return session;
}

/**
 * Deletes the current session on logout
 * Removes the session from database and clears cookie
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return;

  // Delete session from database
  await prisma.session
    .delete({
      where: { token },
    })
    .catch((error) => {
      console.error("Failed to delete session:", error);
    });
  // Clear cookie
  cookieStore.set(sessionCookieName, "", { expires: new Date(0) });
}
