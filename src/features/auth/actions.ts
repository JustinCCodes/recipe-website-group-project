"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import comparePassword from "@/utils/comparePassword";
import generateSalt from "@/utils/saltHelper";
import hashPassword from "@/utils/hashPassword";
import type { LoginFormState, RegisterFormState } from "./types";

/**
 * Schema for validating login form fields
 */
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

/**
 * Login server action
 * Validates form data
 * Finds user in DB
 * Verifies password with stored salt + hash
 * Creates a session if valid
 * Redirects to `/`
 */
export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // Validate fields
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password: suppliedPassword } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: "Invalid email or password." };
    }

    // Compare supplied password with stored hash
    const isPasswordCorrect = await comparePassword(
      user.password,
      user.salt,
      suppliedPassword
    );

    if (!isPasswordCorrect) {
      return { message: "Invalid email or password." };
    }

    // Create a session on successful login
    await createSession(user.id);
  } catch (error) {
    console.error(error);
    return { message: "An unexpected error occurred." };
  }

  // Redirect to home on successful login
  redirect("/");
}

/**
 * Schema for validating registration form fields
 */
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  birthdate: z.string().pipe(z.coerce.date()),
  phone: z.string().optional(),
  country: z.string().min(2, "Please select a country."),
});

/**
 * Register server action
 * Validates input with Zod
 * Checks for duplicate email
 * Hashes + salts password
 * Creates user in DB
 * Redirects to login page
 */
export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: "Please correct the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, ...rest } = validatedFields.data;

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        message: "An account with this email already exists.",
        errors: { email: ["Email already in use."] },
      };
    }

    // Generate salt + hashed password
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    // Save user in DB
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword as string,
        salt,
        ...rest,
      },
    });
  } catch (error) {
    console.error(error);
    return { message: "An unexpected server error occurred." };
  }

  // Redirect to login after successful registration
  redirect("/login");
}
