import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import comparePassword from "@/utils/comparePassword";
import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password: suppliedPassword } = loginSchema.parse(body);

    // Find User
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 } // Unauthorized
      );
    }

    // Compare password
    const isPasswordCorrect = await comparePassword(
      user.password,
      user.salt,
      suppliedPassword
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // If password correct create session
    await createSession(user.id);

    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
