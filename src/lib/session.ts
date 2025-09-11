import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const sessionCookieName = "session_token";

// Create Session on login
export async function createSession(userId: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const token = randomBytes(40).toString("hex");

  await prisma.session.create({
    data: { token, expiresAt, userId },
  });

  // 1. Await the cookies() function first
  const cookieStore = await cookies();

  // 2. Then use the .set() method
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// Check if valid session exists
export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return null;

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

// Destroys Session on logout
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return;

  await prisma.session
    .delete({
      where: { token },
    })
    .catch((error) => {
      console.error("Failed to delete session:", error);
    });

  cookieStore.set(sessionCookieName, "", { expires: new Date(0) });
}
