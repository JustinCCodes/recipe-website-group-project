import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import generateSalt from "@/utils/saltHelper";
import hashPassword from "@/utils/hashPassword";
import { z, ZodError } from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  birthdate: z.string().pipe(z.coerce.date()),
  phone: z.string().optional(),
  country: z.string().min(2, "Please select a country"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(parsedData.password, salt);

    // Create new user
    await prisma.user.create({
      data: {
        ...parsedData,
        password: hashedPassword as string,
        salt: salt,
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }

    console.error("REGISTER_ERROR", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
